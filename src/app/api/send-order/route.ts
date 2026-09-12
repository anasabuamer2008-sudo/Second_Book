import { NextResponse } from "next/server";
import { buildOrderEmailHTML } from "@/components/email/orderEmail";
import { OWNER_EMAIL } from "@/lib/config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+0-9][\d\s()\-]{5,}$/;
const LANGUAGES = new Set(["ar", "he"]);
const METHODS = new Set(["delivery", "pickup"]);

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string | null): boolean {
  if (!ip) return false;
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip");

  if (isRateLimited(ip)) {
    return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
  }

  let order;
  try {
    order = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }

  if (!order || typeof order !== "object") {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }

  const customer = order.customer;
  if (
    !customer ||
    typeof customer.fullName !== "string" ||
    customer.fullName.trim().length < 2 ||
    typeof customer.email !== "string" ||
    !EMAIL_RE.test(customer.email.trim()) ||
    typeof customer.phone !== "string" ||
    !PHONE_RE.test(customer.phone.trim()) ||
    !LANGUAGES.has(customer.language)
  ) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid customer fields" },
      { status: 400 }
    );
  }

  if (
    !Array.isArray(order.items) ||
    order.items.length === 0 ||
    order.items.some(
      (b: unknown) =>
        !b ||
        typeof (b as { id?: unknown }).id !== "string" ||
        typeof (b as { title?: unknown }).title !== "string" ||
        typeof (b as { price?: unknown }).price !== "number" ||
        Number.isNaN((b as { price: number }).price)
    )
  ) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid items" },
      { status: 400 }
    );
  }

  if (
    typeof order.id !== "string" ||
    !Number.isFinite(order.subtotal) ||
    !Number.isFinite(order.deliveryFee) ||
    !Number.isFinite(order.total) ||
    !order.delivery ||
    !METHODS.has(order.delivery.method) ||
    (order.delivery.method === "delivery" &&
      (typeof order.delivery.address !== "string" || order.delivery.address.trim().length < 5))
  ) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid order fields" },
      { status: 400 }
    );
  }

  const ownerEmail = process.env.ORDER_EMAIL || OWNER_EMAIL;
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const html = buildOrderEmailHTML(order);
  const subject = `New Order #${order.id} - ${customer.fullName}`;

  try {
    // 1) Gmail SMTP (needs an app password - optional)
    if (gmailUser && gmailPass) {
      const nodemailer = (await import("nodemailer")).default;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass },
      });
      await transporter.sendMail({
        from: gmailUser,
        to: [ownerEmail, customer.email].join(", "),
        subject,
        html,
      });
      return NextResponse.json({ success: true, provider: "gmail" });
    }

    // 2) Resend API (optional)
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const data = await resend.emails.send({
        from: "Second Book <onboarding@resend.dev>",
        to: [ownerEmail, customer.email],
        subject,
        html,
      });
      return NextResponse.json({ success: true, provider: "resend", data });
    }

    // 3) FormSubmit - works with NO credentials at all.
    //    First order triggers an activation email to the owner's inbox;
    //    after one click on it, every order is emailed instantly.
    const isAr = customer.language === "ar";
    const deliveryLabel =
      order.delivery?.method === "delivery"
        ? isAr ? "توصيل" : "משלוח"
        : isAr ? "بدون توصيل (استلام يدوي)" : "ללא משלוח (איסוף)";
    const itemsText = order.items
      .map((b: { title: string; author: string; price: number }) => `- ${b.title} (${b.author}) - ${b.price} ILS`)
      .join("\n");

    const payload = {
      "Order ID": order.id,
      Customer: customer.fullName,
      Email: customer.email,
      Phone: customer.phone,
      "Contact language": isAr ? "Arabic" : "Hebrew",
      "Delivery method": deliveryLabel,
      "Delivery address": order.delivery?.address || "—",
      Books: itemsText,
      "Subtotal (ILS)": order.subtotal ?? order.total,
      "Delivery fee (ILS)": order.deliveryFee ?? 0,
      "Total (ILS)": order.total,
      _subject: subject,
      _template: "table",
      _captcha: "false",
    };

    const res = await fetch(`https://formsubmit.co/ajax/${ownerEmail}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    let ok = res.ok;
    try {
      const json = await res.json();
      ok = json?.success === "true" || res.ok;
    } catch {
      ok = res.ok;
    }

    if (ok) {
      return NextResponse.json({ success: true, provider: "formsubmit" });
    }
    return NextResponse.json(
      { success: false, provider: "formsubmit", error: "FormSubmit rejected the request" },
      { status: 502 }
    );
  } catch (error) {
    console.error("Failed to send order email", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}