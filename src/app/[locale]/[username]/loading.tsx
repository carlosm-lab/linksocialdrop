export default function ProfileLoading() {
  return (
    <div className="bg-noise flex min-h-screen w-full animate-pulse flex-col items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-[680px] space-y-8">
        {/* Profile Header Skeleton */}
        <div className="flex flex-col items-center gap-5">
          <div className="h-28 w-28 rounded-full bg-white/10" />
          <div className="mt-2 flex w-full flex-col items-center space-y-3">
            <div className="h-6 w-1/3 rounded-md bg-white/10" />
            <div className="h-4 w-2/3 rounded-md bg-white/10" />
            <div className="h-4 w-1/2 rounded-md bg-white/10" />
          </div>
        </div>

        {/* Links Skeleton */}
        <div className="space-y-4 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 w-full rounded-2xl bg-white/10 backdrop-blur-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
