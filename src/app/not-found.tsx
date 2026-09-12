import Link from "next/link";

export default function NotFound() {
  return (
    <div dir="rtl" className="min-h-[60vh] max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-accent font-display font-extrabold text-7xl mb-4">404</div>
      <h1 className="text-2xl font-bold text-foreground mb-3">الصفحة غير موجودة</h1>
      <p className="text-text-secondary mb-2">העמוד לא נמצא · الصفحة غير موجودة</p>
      <p className="text-text-secondary mb-8">لم نعثر على الصفحة التي تبحث عنها.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/ar"
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all duration-200"
        >
          العربية
        </Link>
        <Link
          href="/he"
          className="px-6 py-3 bg-surface border border-border text-foreground font-bold rounded-xl hover:border-primary/40 transition-all duration-200"
        >
          עברית
        </Link>
      </div>
    </div>
  );
}