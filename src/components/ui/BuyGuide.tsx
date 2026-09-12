"use client";
import { useInView } from "@/hooks/useInView";

const AR = {
  title: "شروط الحجز وطرق الدفع",
  subtitle: "كل ما تحتاج لمعرفته قبل الحجز — اقرأ قبل إتمام الطلب",
  cards: [
    {
      icon: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z",
      icon2: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2",
      title: "نسخة واحدة لكل كتاب",
      text: "كل كتاب متوفر منه نسخة واحدة فقط، والأولوية للأسبق.",
    },
    {
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      title: "طريقة الحجز",
      text: "ابعت صورة الكتاب أو البوست على الخاص.",
    },
    {
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      title: "طرق الدفع",
      text: "بيت (Bit) أو تحويل بنكي — لا يتوفر دفع نقدي.",
    },
    {
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "تأكيد الحجز",
      text: "يتم الحجز فور تأكيد الدفع.",
    },
  ],
  deliveryTitle: "خيارات التوصيل والاستلام",
  delivery: [
    {
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
      icon2: "M15 11a3 3 0 11-6 0 3 3 0 016 0z",
      title: "استلام شخصي",
      text: "من قرية عارة — مجاناً.",
    },
    {
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      title: "توصيل بريد",
      text: "لجميع المناطق برسوم 25 ₪. أرسل الاسم والعنوان ورقم الهاتف في الرسالة لتسريع العملية.",
    },
  ],
};

const HE = {
  title: "תנאי הזמנה ודרכי תשלום",
  subtitle: "כל מה שצריך לדעת לפני ההזמנה — קראו לפני השלמת ההזמנה",
  cards: [
    {
      icon: AR.cards[0].icon,
      icon2: AR.cards[0].icon2,
      title: "עותק אחד לכל ספר",
      text: "כל ספר זמין בעותק אחד בלבד, והבכורה לקודם.",
    },
    {
      icon: AR.cards[1].icon,
      title: "דרך ההזמנה",
      text: "שלחו תמונה של הספר או פוסט בהודעה הפרטית.",
    },
    {
      icon: AR.cards[2].icon,
      title: "דרכי תשלום",
      text: "ביט (Bit) או העברה בנקאית — לא ניתן בתשלום מזומן.",
    },
    {
      icon: AR.cards[3].icon,
      title: "אישור ההזמנה",
      text: "ההזמנה מאושרת מיד עם אישור התשלום.",
    },
  ],
  deliveryTitle: "אפשרויות משלוח ואיסוף",
  delivery: [
    {
      icon: AR.delivery[0].icon,
      icon2: AR.delivery[0].icon2,
      title: "איסוף עצמי",
      text: "מהכפר עארה — ללא תשלום.",
    },
    {
      icon: AR.delivery[1].icon,
      title: "משלוח",
      text: "לכל האזורים בתשלום 25 ₪. שלחו שם, כתובת ומספר טלפון בהודעה כדי לזרז את התהליך.",
    },
  ],
};

export default function BuyGuide({ lang }: { lang: "ar" | "he" }) {
  const t = lang === "he" ? HE : AR;
  const { ref, inView } = useInView<HTMLDivElement>(0.08);

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className={`reveal ${inView ? "in-view" : ""}`}>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-dark rounded-full px-4 py-1.5 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-bold">{lang === "he" ? "מדריך רכישה" : "دليل الحجز"}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t.title}</h2>
          <p className="text-text-secondary text-sm max-w-lg mx-auto">{t.subtitle}</p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {t.cards.map((c, i) => (
            <div
              key={i}
              className="reveal group bg-surface border border-border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${i * 80 + 100}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} />
                </svg>
              </div>
              <h3 className="font-bold text-foreground text-sm mb-1.5">{c.title}</h3>
              <p className="text-text-secondary text-xs leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>

        {/* Delivery options */}
        <div className="bg-surface-alt border border-border rounded-2xl p-6 md:p-8">
          <h3 className="font-bold text-foreground text-lg mb-5 text-center">{t.deliveryTitle}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t.delivery.map((d, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-surface rounded-xl p-4 border border-border/50"
              >
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d.icon} />
                    {d.icon2 && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d.icon2} />
                    )}
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">{d.title}</h4>
                  <p className="text-text-secondary text-xs mt-0.5 leading-relaxed">{d.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}