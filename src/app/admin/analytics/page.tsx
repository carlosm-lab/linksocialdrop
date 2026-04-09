import { Icon } from "@/components/ui/icon";

export default function AdminAnalyticsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pt-24 pb-32">
      {/* Editorial Header Section */}
      <section className="mb-12">
        <h2 className="font-headline text-on-surface mb-2 text-6xl font-black tracking-tighter">
          Insight Engine
        </h2>
        <p className="max-w-lg leading-relaxed text-slate-400">
          Precision metrics for your digital portfolio. Monitor the pulse of
          your audience across every touchpoint.
        </p>
      </section>

      {/* Metric Cards: Asymmetric Grid */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Visits */}
        <div className="bg-surface-container-low group hover:bg-surface-container-high flex flex-col justify-between rounded-xl p-8 transition-all duration-300">
          <div>
            <div className="mb-6 flex items-start justify-between">
              <span className="bg-primary-container/10 text-primary-container rounded-xl p-3">
                <Icon name="visibility" />
              </span>
              <span className="font-label text-primary-container text-xs font-bold tracking-widest uppercase">
                +12.5%
              </span>
            </div>
            <h3 className="font-label mb-1 text-sm tracking-widest text-slate-400 uppercase">
              Total Visits
            </h3>
            <p className="font-headline text-on-surface text-4xl font-black">
              42.8k
            </p>
          </div>
          <div className="bg-surface-container-highest mt-6 h-1 w-full overflow-hidden rounded-full">
            <div className="luminous-glow h-full w-[75%]"></div>
          </div>
        </div>

        {/* Clicks */}
        <div className="bg-surface-container-low group hover:bg-surface-container-high flex flex-col justify-between rounded-xl p-8 transition-all duration-300">
          <div>
            <div className="mb-6 flex items-start justify-between">
              <span className="bg-primary-container/10 text-primary-container rounded-xl p-3">
                <Icon name="ads_click" />
              </span>
              <span className="font-label text-primary-container text-xs font-bold tracking-widest uppercase">
                +8.2%
              </span>
            </div>
            <h3 className="font-label mb-1 text-sm tracking-widest text-slate-400 uppercase">
              Unique Clicks
            </h3>
            <p className="font-headline text-on-surface text-4xl font-black">
              12.4k
            </p>
          </div>
          <div className="bg-surface-container-highest mt-6 h-1 w-full overflow-hidden rounded-full">
            <div className="luminous-glow h-full w-[45%]"></div>
          </div>
        </div>

        {/* CTR */}
        <div className="bg-surface-container-low group hover:bg-surface-container-high flex flex-col justify-between rounded-xl p-8 transition-all duration-300">
          <div>
            <div className="mb-6 flex items-start justify-between">
              <span className="bg-primary-container/10 text-primary-container rounded-xl p-3">
                <Icon name="analytics" />
              </span>
              <span className="font-label text-primary-container text-xs font-bold tracking-widest uppercase">
                +2.1%
              </span>
            </div>
            <h3 className="font-label mb-1 text-sm tracking-widest text-slate-400 uppercase">
              CTR Avg.
            </h3>
            <p className="font-headline text-on-surface text-4xl font-black">
              28.9%
            </p>
          </div>
          <div className="bg-surface-container-highest mt-6 h-1 w-full overflow-hidden rounded-full">
            <div className="luminous-glow h-full w-[28.9%]"></div>
          </div>
        </div>
      </div>

      {/* Main Analytics Canvas */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Chart Area */}
        <div className="bg-surface-container-low relative overflow-hidden rounded-xl p-8 lg:col-span-2">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h4 className="font-headline text-on-surface text-2xl font-bold">
                Traffic Velocity
              </h4>
              <p className="text-sm text-slate-500">Last 30 Days Engagement</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-surface-container-highest text-primary-container font-label hover:bg-surface-container-highest/80 rounded-full px-4 py-2 text-xs font-bold tracking-widest uppercase transition-colors">
                Export
              </button>
            </div>
          </div>

          {/* Mock Line Chart Representation */}
          <div className="group relative flex h-64 w-full items-end justify-between gap-1">
            {/* Ambient Glow for Chart */}
            <div className="chart-gradient pointer-events-none absolute inset-0 rounded-xl"></div>

            {/* Mock bars representing a line trend */}
            {[
              40, 55, 45, 70, 85, 60, 75, 90, 65, 80, 50, 70, 95, 80, 60, 75,
              85, 100, 90, 80,
            ].map((height, i) => (
              <div
                key={i}
                className="bg-primary-container/20 hover:bg-primary-container w-2 rounded-t-full transition-all"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>

          <div className="mt-6 flex justify-between px-1">
            <span className="font-label text-[10px] font-bold tracking-widest text-slate-600 uppercase">
              Day 01
            </span>
            <span className="font-label text-[10px] font-bold tracking-widest text-slate-600 uppercase">
              Day 15
            </span>
            <span className="font-label text-[10px] font-bold tracking-widest text-slate-600 uppercase">
              Day 30
            </span>
          </div>
        </div>

        {/* Top Links Sidebar */}
        <div className="bg-surface-container-low rounded-xl p-8">
          <h4 className="font-headline text-on-surface mb-8 text-lg font-bold">
            Performance Leaderboard
          </h4>
          <div className="space-y-8">
            {/* Ranked Item */}
            <div className="group">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-headline text-xs font-black text-slate-700">
                    01
                  </span>
                  <span className="text-on-surface text-sm font-bold">
                    Summer Lookbook
                  </span>
                </div>
                <span className="text-primary-container text-xs font-bold">
                  4.2k
                </span>
              </div>
              <div className="bg-surface-container-highest h-1.5 w-full overflow-hidden rounded-full">
                <div className="luminous-glow h-full w-[88%] transition-opacity group-hover:opacity-80"></div>
              </div>
            </div>

            {/* Ranked Item */}
            <div className="group">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-headline text-xs font-black text-slate-700">
                    02
                  </span>
                  <span className="text-on-surface text-sm font-bold">
                    Photography Workshop
                  </span>
                </div>
                <span className="text-primary-container text-xs font-bold">
                  3.1k
                </span>
              </div>
              <div className="bg-surface-container-highest h-1.5 w-full overflow-hidden rounded-full">
                <div className="luminous-glow h-full w-[65%] transition-opacity group-hover:opacity-80"></div>
              </div>
            </div>

            {/* Ranked Item */}
            <div className="group">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-headline text-xs font-black text-slate-700">
                    03
                  </span>
                  <span className="text-on-surface text-sm font-bold">
                    Latest Newsletter
                  </span>
                </div>
                <span className="text-primary-container text-xs font-bold">
                  2.8k
                </span>
              </div>
              <div className="bg-surface-container-highest h-1.5 w-full overflow-hidden rounded-full">
                <div className="luminous-glow h-full w-[58%] transition-opacity group-hover:opacity-80"></div>
              </div>
            </div>

            {/* Ranked Item */}
            <div className="group">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-headline text-xs font-black text-slate-700">
                    04
                  </span>
                  <span className="text-on-surface text-sm font-bold">
                    Portfolio Review
                  </span>
                </div>
                <span className="text-primary-container text-xs font-bold">
                  1.9k
                </span>
              </div>
              <div className="bg-surface-container-highest h-1.5 w-full overflow-hidden rounded-full">
                <div className="luminous-glow h-full w-[40%] transition-opacity group-hover:opacity-80"></div>
              </div>
            </div>

            {/* Ranked Item */}
            <div className="group">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-headline text-xs font-black text-slate-700">
                    05
                  </span>
                  <span className="text-on-surface text-sm font-bold">
                    Shop Essentials
                  </span>
                </div>
                <span className="text-primary-container text-xs font-bold">
                  1.2k
                </span>
              </div>
              <div className="bg-surface-container-highest h-1.5 w-full overflow-hidden rounded-full">
                <div className="luminous-glow h-full w-[25%] transition-opacity group-hover:opacity-80"></div>
              </div>
            </div>
          </div>

          <button className="font-label mt-10 w-full border-t border-slate-800/50 py-4 pt-8 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase transition-colors hover:text-white">
            View Detailed Audit
          </button>
        </div>
      </div>
    </main>
  );
}
