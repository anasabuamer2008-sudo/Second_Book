export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
      {/* Toolbar skeleton */}
      <div className="mb-8 space-y-4">
        <div className="h-12 w-full max-w-md rounded-2xl skeleton" />
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 w-24 rounded-xl skeleton" />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden">
            <div className="aspect-[3/4] skeleton" />
            <div className="p-4 space-y-2.5">
              <div className="h-3.5 w-4/5 rounded skeleton" />
              <div className="h-3 w-3/5 rounded skeleton" />
              <div className="h-8 w-full rounded-xl skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}