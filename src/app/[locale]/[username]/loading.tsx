export default function ProfileLoading() {
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full animate-pulse flex-col items-center px-6 py-12">
      <div className="flex w-full max-w-md flex-col items-center space-y-8">
        {/* Profile Header Skeleton */}
        <div className="flex w-full flex-col items-center gap-5">
          <div className="bg-muted/50 border-muted/20 h-32 w-32 rounded-full border-4" />
          <div className="mt-2 flex w-full flex-col items-center space-y-3">
            <div className="bg-muted/50 h-8 w-1/2 rounded-md" />
            <div className="bg-muted/50 h-4 w-3/4 rounded-md" />
            <div className="bg-muted/50 h-4 w-2/3 rounded-md" />
          </div>
        </div>

        {/* Links Skeleton - Simulating SmartBentoGrid */}
        <div className="mt-8 grid w-full auto-rows-[minmax(120px,auto)] grid-cols-2 gap-4">
          <div className="bg-muted/30 col-span-2 row-span-1 h-32 rounded-3xl" />
          <div className="bg-muted/30 col-span-1 row-span-1 h-32 rounded-3xl" />
          <div className="bg-muted/30 col-span-1 row-span-1 h-32 rounded-3xl" />
          <div className="bg-muted/30 col-span-1 row-span-1 h-32 rounded-3xl" />
          <div className="bg-muted/30 col-span-1 row-span-1 h-32 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
