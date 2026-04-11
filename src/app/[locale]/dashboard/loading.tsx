export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full animate-pulse flex-col gap-6 p-6 lg:p-10">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-lg bg-white/5" />
        <div className="h-4 w-64 rounded-lg bg-white/5" />
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex flex-col gap-8 xl:flex-row">
        {/* Left Side (Forms, Lists) */}
        <div className="flex-1 space-y-6">
          <div className="h-12 w-full rounded-xl bg-white/5" />

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex h-24 w-full flex-col justify-center rounded-2xl border border-white/5 bg-white/5 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded-md bg-white/5" />
                    <div className="h-3 w-1/4 rounded-md bg-white/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side (Phone Preview) */}
        <div className="hidden w-[400px] justify-center xl:flex">
          <div className="relative h-[750px] w-[350px] overflow-hidden rounded-[3rem] border-[8px] border-white/5 bg-white/5 shadow-2xl">
            <div className="absolute inset-x-0 top-0 flex h-6 justify-center rounded-t-[2.5rem] bg-black/20">
              <div className="h-full w-1/3 rounded-b-xl bg-black/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
