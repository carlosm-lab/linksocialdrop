import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("common");

  return (
    <div className="bg-surface mx-auto flex min-h-screen w-full max-w-7xl animate-pulse flex-col space-y-8 px-6 pt-24 pb-32">
      {/* Header Skeleton */}
      <div className="flex max-w-md flex-col gap-4">
        <div className="bg-surface-container-highest h-10 w-48 rounded-lg border border-white/5" />
        <div className="bg-surface-container-highest h-4 w-64 rounded-lg border border-white/5 opacity-50" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="glass-panel bg-surface-container-low h-72 overflow-hidden rounded-2xl border border-white/10"
          >
            <div className="bg-surface-container-highest h-48" />
            <div className="space-y-3 p-5">
              <div className="bg-surface-container-highest h-5 w-1/2 rounded-md" />
              <div className="bg-surface-container-highest h-3 w-5/6 rounded-md opacity-50" />
              <div className="bg-surface-container-highest h-3 w-4/6 rounded-md opacity-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
