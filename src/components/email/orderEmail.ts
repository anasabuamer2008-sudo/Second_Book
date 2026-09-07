import { Order } from "@/store/useCartStore";

export function buildOrderEmailHTML(order: Order): string {
  const ar = order.customer.language === "ar";
  const currency = "₪";
  const isDelivery = order.delivery?.method === "delivery";

  const t = {
    title: ar ? "طلب جديد عبر موقع الكتاب الثاني" : "הזמנה חדשה מ״הספר השני״",
    orderId: ar ? "رقم الطلب" : "מספר הזמנה",
    customer: ar ? "تفاصيل العميل" : "פרטי הלקוח",
    name: ar ? "الاسم" : "שם מלא",
    email: ar ? "البريد الإلكتروني" : "אימייל",
    phone: ar ? "الهاتف" : "טלפון",
    lang: ar ? "لغة التواصل" : "שפת תקשורת",
    langValue: ar ? "العربية" : "עברית",
    delivery: ar ? "طريقة الاستلام" : "אופן קבלת ההזמנה",
    deliveryValue: isDelivery
      ? ar ? "توصيل (مطلوب عنوان)" : "משלוח (נדרשת כתובת)"
      : ar ? "استلام يدوي" : "איסוף ידני",
    address: ar ? "عنوان التوصيل" : "כתובת למשלוח",
    books: ar ? "الكتب المطلوبة" : "הספרים שהוזמנו",
    bookCol: ar ? "الكتاب" : "ספר",
    authorCol: ar ? "المؤلف" : "מחבר",
    priceCol: ar ? "السعر" : "מחיר",
    subtotal: ar ? "المجموع الفرعي" : "סכום ביניים",
    deliveryFee: ar ? "رسوم التوصيل" : "דמי משלוח",
    free: ar ? "مجاناً" : "חינם",
    total: ar ? "المجموع الكلي" : "סה״כ לתשלום",
  };

  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="border:1px solid #ddd;padding:8px;font-size:15px;">${item.title}</td>
          <td style="border:1px solid #ddd;padding:8px;font-size:15px;">${item.author}</td>
          <td style="border:1px solid #ddd;padding:8px;font-size:15px;text-align:center;">${currency}${item.price}</td>
        </tr>`
    )
    .join("");

  const addressRow = isDelivery && order.delivery?.address
    ? `
      <tr>
        <td style="border:1px solid #ddd;padding:8px;background:#f7f2e7;"><strong>${t.address}</strong></td>
        <td style="border:1px solid #ddd;padding:8px;">${order.delivery.address}</td>
      </tr>`
    : "";

  return `
    <div dir="rtl" style="font-family:'Segoe UI',Tahoma,Arial,sans-serif;background:#f6f0e4;padding:24px;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2d7bf;">
        <div style="background:#6b4226;padding:24px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;">${t.title}</h1>
        </div>
        <div style="padding:24px;">
          <p style="margin:0 0 16px;font-size:15px;color:#555;">
            <strong>${t.orderId}:</strong> ${order.id}
          </p>

          <h2 style="margin:16px 0 8px;font-size:17px;color:#6b4226;">${t.customer}</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
            <tr>
              <td style="border:1px solid #ddd;padding:8px;background:#f7f2e7;"><strong>${t.name}</strong></td>
              <td style="border:1px solid #ddd;padding:8px;">${order.customer.fullName}</td>
            </tr>
            <tr>
              <td style="border:1px solid #ddd;padding:8px;background:#f7f2e7;"><strong>${t.email}</strong></td>
              <td style="border:1px solid #ddd;padding:8px;">${order.customer.email}</td>
            </tr>
            <tr>
              <td style="border:1px solid #ddd;padding:8px;background:#f7f2e7;"><strong>${t.phone}</strong></td>
              <td style="border:1px solid #ddd;padding:8px;">${order.customer.phone}</td>
            </tr>
            <tr>
              <td style="border:1px solid #ddd;padding:8px;background:#f7f2e7;"><strong>${t.lang}</strong></td>
              <td style="border:1px solid #ddd;padding:8px;">${t.langValue}</td>
            </tr>
            <tr>
              <td style="border:1px solid #ddd;padding:8px;background:#f7f2e7;"><strong>${t.delivery}</strong></td>
              <td style="border:1px solid #ddd;padding:8px;">${t.deliveryValue}</td>
            </tr>
            ${addressRow}
          </table>

          <h2 style="margin:16px 0 8px;font-size:17px;color:#6b4226;">${t.books}</h2>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#6b4226;color:#ffffff;">
                <th style="border:1px solid #6b4226;padding:8px;text-align:right;">${t.bookCol}</th>
                <th style="border:1px solid #6b4226;padding:8px;text-align:right;">${t.authorCol}</th>
                <th style="border:1px solid #6b4226;padding:8px;text-align:center;">${t.priceCol}</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <table style="width:100%;border-collapse:collapse;margin-top:16px;">
            <tr>
              <td style="padding:4px 8px;font-size:15px;">${t.subtotal}</td>
              <td style="padding:4px 8px;font-size:15px;text-align:left;">${currency}${order.subtotal ?? order.total}</td>
            </tr>
            <tr>
              <td style="padding:4px 8px;font-size:15px;">${t.deliveryFee}</td>
              <td style="padding:4px 8px;font-size:15px;text-align:left;">
                ${order.deliveryFee ? currency + order.deliveryFee : t.free}
              </td>
            </tr>
          </table>
          <h3 style="margin:12px 8px 0;text-align:left;font-size:18px;color:#6b4226;">
            ${t.total}: ${currency}${order.total}
          </h3>
        </div>
      </div>
    </div>`;
}