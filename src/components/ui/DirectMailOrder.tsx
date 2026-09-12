"use client";

import { useState } from "react";
import { Order } from "@/store/useCartStore";

const OWNER_EMAIL = "abdallazeed3@gmail.com";

interface DirectMailOrderProps {
  order: Order;
  isAr: boolean;
  t: {
    title: string;
    text: string;
    button: string;
    copied: string;
  };
}

export default function DirectMailOrder({ order, isAr, t }: DirectMailOrderProps) {
  const [copied, setCopied] = useState(false);

  const messageText = (() => {
    const label = isAr
      ? {
          header: "تفاصيل الطلب",
          customer: "بيانات العميل",
          name: "الاسم",
          email: "البريد",
          phone: "الهاتف",
          language: "اللغة",
          langValue: "العربية",
          books: "الكتب المطلوبة",
          delivery: "طريقة الاستلام",
          pickup: "بدون توصيل (استلام يدوي)",
          deliveryChoice: "توصيل",
          address: "عنوان التوصيل",
          subtotal: "المجموع الفرعي",
          deliveryFee: "رسوم التوصيل",
          free: "مجاناً",
        }
      : {
          header: "פרטי ההזמנה",
          customer: "פרטי הלקוח",
          name: "שם מלא",
          email: "אימייל",
          phone: "טלפון",
          language: "שפה",
          langValue: "עברית",
          books: "הספרים שהוזמנו",
          delivery: "אופן קבלת ההזמנה",
          pickup: "ללא משלוח (איסוף)",
          deliveryChoice: "משלוח",
          address: "כתובת למשלוח",
          subtotal: "סכום ביניים",
          deliveryFee: "דמי משלוח",
          free: "חינם",
        };

    const itemsTable = order.items
      .map((item, i) => `${i + 1}. ${item.title} | ${item.author} | ₪${item.price}`)
      .join("\n");

    const deliveryDesc =
      order.delivery?.method === "delivery"
        ? `${label.deliveryChoice}${order.delivery.address ? ` - ${label.address}: ${order.delivery.address}` : ""}`
        : label.pickup;

    return `
========================================
${label.header} #${order.id}
========================================

${label.customer}:
----------------------------------------
${label.name}: ${order.customer.fullName}
${label.email}: ${order.customer.email}
${label.phone}: ${order.customer.phone}
${label.language}: ${label.langValue}

${label.books}:
----------------------------------------
${itemsTable}
----------------------------------------
${label.delivery}: ${deliveryDesc}
${label.subtotal}: ₪${order.subtotal ?? order.total}
${label.deliveryFee}: ${order.deliveryFee ? `₪${order.deliveryFee}` : label.free}
💰 Total / المجموع الكلي: ₪${order.total}
========================================
`.trim();
  })();

  const mailtoUrl = (() => {
    const subject = encodeURIComponent(
      isAr ? `طلب جديد #${order.id} - ${order.customer.fullName}` : `הזמנה חדשה #${order.id} - ${order.customer.fullName}`
    );
    const body = encodeURIComponent(messageText);
    return `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
  })();

  const openMail = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
    window.location.href = mailtoUrl;
  };

  return (
    <div className="max-w-2xl mx-auto mb-8 text-right" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8">
        <h3 className="font-bold text-lg text-emerald-900 mb-2">✉️ {t.title}</h3>
        <p className="text-sm text-emerald-800/80 mb-4">{copied ? t.copied : t.text}</p>
        <button
          onClick={openMail}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="text-lg">✉️</span>
          <span>{copied ? t.copied : t.button}</span>
        </button>
      </div>
    </div>
  );
}