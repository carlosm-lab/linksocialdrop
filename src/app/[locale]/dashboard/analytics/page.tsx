import { Icon } from "@/components/ui/icon";
import { getTranslations } from "next-intl/server";
import { getAnalyticsDashboard } from "@/actions/analytics";
import { redirect } from "next/navigation";

export default async function AdminAnalyticsPage() {
  const t = await getTranslations("adminAnalytics");

  let stats;
  try {
    stats = await getAnalyticsDashboard();
  } catch (error) {
    redirect("/login");
  }

  const { views, clicks, leaderboard } = stats;

  const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : "0.0";

  return (
    <main className="mx-auto max-w-7xl px-6 pt-24 pb-32">
      <section className="mb-12">
        <h2 className="font-headline text-on-surface mb-2 text-6xl font-black tracking-tighter">
          {t("title")}
        </h2>
        <p className="max-w-lg leading-relaxed text-slate-400">
          {t("description")}
        </p>
      </section>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="bg-surface-container-low group hover:bg-surface-container-high flex flex-col justify-between rounded-xl p-8 transition-all duration-300">
          <div>
            <div className="mb-6 flex items-start justify-between">
              <span className="bg-primary-container/10 text-primary-container rounded-xl p-3">
                <Icon name="visibility" />
              </span>
            </div>
            <h3 className="font-label mb-1 text-sm tracking-widest text-slate-400 uppercase">
              {t("totalVisits")}
            </h3>
            <p className="font-headline text-on-surface text-4xl font-black">
              {views}
            </p>
          </div>
          <div className="bg-surface-container-highest mt-6 h-1 w-full overflow-hidden rounded-full">
            <div className="luminous-glow h-full w-[100%]"></div>
          </div>
        </div>

        <div className="bg-surface-container-low group hover:bg-surface-container-high flex flex-col justify-between rounded-xl p-8 transition-all duration-300">
          <div>
            <div className="mb-6 flex items-start justify-between">
              <span className="bg-primary-container/10 text-primary-container rounded-xl p-3">
                <Icon name="ads_click" />
              </span>
            </div>
            <h3 className="font-label mb-1 text-sm tracking-widest text-slate-400 uppercase">
              {t("uniqueClicks")}
            </h3>
            <p className="font-headline text-on-surface text-4xl font-black">
              {clicks}
            </p>
          </div>
          <div className="bg-surface-container-highest mt-6 h-1 w-full overflow-hidden rounded-full">
            <div className="luminous-glow h-full w-[100%]"></div>
          </div>
        </div>

        <div className="bg-surface-container-low group hover:bg-surface-container-high flex flex-col justify-between rounded-xl p-8 transition-all duration-300">
          <div>
            <div className="mb-6 flex items-start justify-between">
              <span className="bg-primary-container/10 text-primary-container rounded-xl p-3">
                <Icon name="analytics" />
              </span>
            </div>
            <h3 className="font-label mb-1 text-sm tracking-widest text-slate-400 uppercase">
              {t("ctrAvg")}
            </h3>
            <p className="font-headline text-on-surface text-4xl font-black">
              {ctr}%
            </p>
          </div>
          <div className="bg-surface-container-highest mt-6 h-1 w-full overflow-hidden rounded-full">
            <div
              className="luminous-glow h-full min-w-[5%]"
              style={{ width: `${ctr}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="bg-surface-container-low relative overflow-hidden rounded-xl p-8 lg:col-span-2">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h4 className="font-headline text-on-surface text-2xl font-bold">
                {t("trafficVelocity")}
              </h4>
              <p className="text-sm text-slate-500">{t("last30Days")}</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-surface-container-highest text-primary-container font-label hover:bg-surface-container-highest/80 rounded-full px-4 py-2 text-xs font-bold tracking-widest uppercase transition-colors">
                {t("export")}
              </button>
            </div>
          </div>

          <div className="group relative flex h-64 w-full items-end justify-between gap-1">
            <div className="chart-gradient pointer-events-none absolute inset-0 rounded-xl"></div>
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

        <div className="bg-surface-container-low rounded-xl p-8">
          <h4 className="font-headline text-on-surface mb-8 text-lg font-bold">
            {t("performanceLeaderboard")}
          </h4>
          <div className="space-y-8">
            {leaderboard.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No activity yet</p>
            ) : (
              leaderboard
                .slice(0, 5)
                .map(
                  (
                    item: { id: string; title: string; clicks: number },
                    index: number
                  ) => {
                    const rank = String(index + 1).padStart(2, "0");
                    const maxClicks = leaderboard[0].clicks || 1;
                    const widthPercent = Math.max(
                      (item.clicks / maxClicks) * 100,
                      5
                    );

                    return (
                      <div key={item.id} className="group">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-headline text-xs font-black text-slate-700">
                              {rank}
                            </span>
                            <span className="text-on-surface block max-w-40 truncate text-sm font-bold">
                              {item.title}
                            </span>
                          </div>
                          <span className="text-primary-container text-xs font-bold">
                            {item.clicks}
                          </span>
                        </div>
                        <div className="bg-surface-container-highest h-1.5 w-full overflow-hidden rounded-full">
                          <div
                            className="luminous-glow h-full transition-opacity group-hover:opacity-80"
                            style={{ width: `${widthPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }
                )
            )}
          </div>

          <button className="font-label mt-10 w-full border-t border-slate-800/50 py-4 pt-8 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase transition-colors hover:text-white">
            {t("viewDetailedAudit")}
          </button>
        </div>
      </div>
    </main>
  );
}
