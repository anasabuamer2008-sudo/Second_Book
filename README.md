# Second Book | الكتاب الثاني | הספר השני

**بيع الكتب المستعملة التي قرأتها واقتنيتها — مكتبة شخصية للكتب العربية والعبرية.**

A lightweight, frontend-first bookstore for selling the old books the owner has personally read and reviewed — Arabic and Hebrew (RTL) bilingual.

---

## 👥 الملكية والحقوق | בעלות וזכויות | Ownership & Rights

جميع الحقوق محفوظة لـ:
- **أنس أبو عامر | אנס אבו עאמר** (صاحب المشروع ومالك الكتب)
- **عبدالله زيد | עבדאללה זייד**

كل הזכויות שמורות לאנס אבו עאמר ועבדאללה זייד.

All rights are reserved to **Anas Abo Amer** and **Abdalla Zaid**.

> الموقع هو متجر للشراء فقط — البيع يتم حصرياً من مالك الكتب (لا يوجد بيع كتاب من مستخدمين آخرين).

> The site is **buy-only**. Books are sold exclusively by the owner.

## 👨‍💻 المطور | Developer

بناؤه وتطويره: **@AbdullahZaid-ggg**
Built & developed by **@AbdullahZaid-ggg**

---

## ✨ المزايا | Features

- 🏠 **صفحتان منفصلتان:** الرئيسية (ترحيب + نقاط ثقة + تنبيه الطلبات) و **صفحة التسوق** `/books` (العروض + الكتب + بحث وفلاتر فورية)
- 🧭 **ترتيب الصفحات:** الرئيسية → تسوّق (الكتب) → من نحن → طلباتي السابقة، في الهيدر والتنقل السفلي
- 🛒 **سلة مشتريات + طلبات محفوظة** محلياً (`localStorage` عبر Zustand persist)
- 🚚 **خيار التوصيل:** اختيار "بدون توصيل" (استلام يدوي مجاناً) أو "توصيل" برسوم ثابتة (15 ₪) مع كتابة عنوان التوصيل — يُختار من قسم **معلومات العميل** في صفحة إتمام الطلب ويُحفظ بين الصفحات
- 🎁 **باقات مخفضة (מבצעים):** عروض باقات كتب بأسعار أقل من مجموعها، مع شارة وفّر (₪)
- 💱 **العملة:** شيكل إسرائيلي جديد (₪ / ILS) في كل مكان
- 📤 **إيميل الطلب فوراً:** يتم جمع كل بيانات الطلب وإرسالها لمالك المشروع تلقائياً من المتصفح ودون فتح أي تطبيق بريد (FormSubmit بلا إعدادات — أو Gmail/Resend اختيارياً)
- 🧾 **إدارة الطلبات السابقة:** إعادة الطلب بضغطة واحدة، حذف طلب واحد، أو مسح الكل
- 🔒 **خصوصية كاملة:** صفحة سياسة الخصوصية + لافتة موافقة عند أول دخول (تُحفظ مرة واحدة)
- 🌐 **لغتان كاملتان (RTL):** العربية والعبرية مع مبدّل لغة في الهيدر فقط (وليس الفوتر)
- 🌟 **العلامة:** "Second Book" دائماً هو العنوان الرئيسي مع الترجمة تحته (الكتاب الثاني / הספר الثاني) في الهيدر والفوتر والترحيب
- 📚 **كتب مصممة بـ CSS 3D** خفيفة — بدون صور مسبقة التحميل الثقيلة
- 🎨 لوحة ألوان "مكتبة" دافئة (بنّي جلدي / ذهبي / كريمي)
- 🔤 خطوط خاصة بالكتب:
  - العناوين الرئيسية `h1`: **Amiri** (عربي) / **Frank Ruhl Libre** (عبري) — خطوط الكتب
  - العناوين الفرعية `h2/h3` والجسم: **Cairo** (عربي) / **Heebo** (عبري)
- 📱 متجاوب بالكامل + تنقل سفلي على الموبايل
- 🌱 جاهز للتوسع نحو قاعدة بيانات (Supabase / Firebase) دون إعادة بناء الواجهة

---

## 🧰 التقنيات | Tech Stack

| مجال | التقنية |
|------|---------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand + persist middleware |
| Emails | FormSubmit (افتراضي بلا إعداد) / Gmail SMTP / Resend |
| Fonts | next/font (Amiri, Frank Ruhl Libre, Cairo, Heebo) |
| Icons | SVG مضمّنة (بدون مكتبات) |

المشروع خفيف الوزن: لا يوجد أي صورة فوتوغرافية ثقيلة سوى الشعار/الأيقونة.

---

## 📁 هيكلة المشروع | Project Structure

```
src/
├── app/
│   ├── [lang]/                  # i18n dynamic route (ar / he)
│   │   ├── layout.tsx           # خطوط + Navbar + Footer + PrivacyBanner + metadata i18n
│   │   ├── page.tsx             # الرئيسية: بطل + ترجمة العنوان + ثقة + تنبيه الطلبات
│   │   ├── books/page.tsx       # التسوق: عروض ومبادرات + بحث + فلاتر + شبكة كتب
│   │   ├── about/page.tsx       # من نحن + المالك + قسم تواصل
│   │   ├── cart/page.tsx        # السلة + ملخص التوصيل
│   │   ├── checkout/page.tsx    # إتمام الطلب (معلومات العميل والتوصيل)
│   │   ├── orders/page.tsx      # الطلبات السابقة (إعادة / حذف / مسح)
│   │   ├── privacy/page.tsx     # سياسة الخصوصية
│   │   └── not-found.tsx        # صفحة 404
│   ├── api/send-order/route.ts  # إرسال إيميل الطلب (FormSubmit/Gmail/Resend)
│   ├── globals.css
│   └── sitemap.ts
├── components/
│   ├── layout/                  # Navbar, Footer, LanguageSwitcher, CartIcon, PrivacyBanner
│   ├── ui/                      # BookCard, Book3D, BundleCard, Toast, NotFoundClient
│   └── email/orderEmail.ts      # قالب إيميل HTML منسق (RTL)
├── store/useCartStore.ts        # سلة + طلبات + خيار التوصيل (Types جاهزة للـ DB)
├── dictionaries/                # ar.json + he.json
└── lib/                         # utils, books (بيانات الكتب + الباقات + رسوم التوصيل)
```

---

## 🚀 التشغيل | Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
```

### الإنتاج | Production

```bash
npm run build
npm start
```

### 📧 الإيميلات | Emails

الموقع يرسل كل طلب إلى بريد المالك **تلقائياً ودون أي إعداد** عبر FormSubmit:

1. **أول مرة فقط:** عند أول طلب يصل إيميل تفعيل إلى `abdallazeed3@gmail.com` — افتحه واضغط تأكيد.
2. بعدها تصلك كل الطلبات فوراً (المعرف + بيانات العميل + طريقة الاستلام + كل الكتب + المجاميع).

اختيارياً يمكن استخدام بريدك مباشرة عبر `src/.env.local`:

```
GMAIL_USER=abdallazeed3@gmail.com
GMAIL_APP_PASSWORD=xxxx   # من https://myaccount.google.com/apppasswords
ORDER_EMAIL=abdallazeed3@gmail.com
```

--- 

## 📄 ترتيب الطلب | Order Flow

1. العميل يختار الكتب أو باقة من صفحة التسوق → السلة
2. إتمام الطلب: معلومات العميل والتوصيل (بدون توصيل / توصيل + العنوان)
3. رقم طلب فريد بصيغة `BK-YYYYMMDD-XXXX`
4. حفظ الطلب محلياً في "الطلبات السابقة"
5. إرسال الإيميل فورياً للمالك (FormSubmit / Gmail / Resend)
6. صفحة نجاح للعميل

---

## 🔗 التواصل | Contact

- Instagram: https://www.instagram.com/second_book07/
- البريد: abdallazeed3@gmail.com

---

## 🔮 التوسع نحو Backend | Scaling to Backend

نوعيات `Book` و `Order` و `CartStore` معرّفة في `src/store/useCartStore.ts`. لربط Supabase:

1. استبدل دوال `addOrder` / كلير المناسب باستدعاءات `supabase.from('orders').insert(...)`
2. استرجع الطلبات في `orders/page.tsx` عبر `useEffect` بدل `localStorage`
3. بقية الواجهة لا تتغير