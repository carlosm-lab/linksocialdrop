import { Icon } from "@/components/ui/icon";
import { useTranslations } from "next-intl";

export default function AdminAnalyticsPage() {
  const t = useTranslations("adminAnalytics");

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
              <span className="font-label text-primary-container text-xs font-bold tracking-widest uppercase">
                +12.5%
              </span>
            </div>
            <h3 className="font-label mb-1 text-sm tracking-widest text-slate-400 uppercase">
              {t("totalVisits")}
            </h3>
            <p className="font-headline text-on-surface text-4xl font-black">
              42.8k
            </p>
          </div>
          <div className="bg-surface-container-highest mt-6 h-1 w-full overflow-hidden rounded-full">
            <div className="luminous-glow h-full w-[75%]"></div>
          </div>
        </div>

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
              {t("uniqueClicks")}
            </h3>
            <p className="font-headline text-on-surface text-4xl font-black">
              12.4k
            </p>
          </div>
          <div className="bg-surface-container-highest mt-6 h-1 w-full overflow-hidden rounded-full">
            <div className="luminous-glow h-full w-[45%]"></div>
          </div>
        </div>

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
              {t("ctrAvg")}
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
            {[
              { rank: "01", name: "Summer Lookbook", clicks: "4.2k", w: "88%" },
              {
                rank: "02",
                name: "Photography Workshop",
                clicks: "3.1k",
                w: "65%",
              },
              {
                rank: "03",
                name: "Latest Newsletter",
                clicks: "2.8k",
                w: "58%",
              },
              {
                rank: "04",
                name: "Portfolio Review",
                clicks: "1.9k",
                w: "40%",
              },
              {
                rank: "05",
                name: "Shop Essentials",
                clicks: "1.2k",
                w: "25%",
              },
            ].map((item) => (
              <div key={item.rank} className="group">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-headline text-xs font-black text-slate-700">
                      {item.rank}
                    </span>
                    <span className="text-on-surface text-sm font-bold">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-primary-container text-xs font-bold">
                    {item.clicks}
                  </span>
                </div>
                <div className="bg-surface-container-highest h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className="luminous-glow h-full transition-opacity group-hover:opacity-80"
                    style={{ width: item.w }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <button className="font-label mt-10 w-full border-t border-slate-800/50 py-4 pt-8 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase transition-colors hover:text-white">
            {t("viewDetailedAudit")}
          </button>
        </div>
      </div>
    </main>
  );
}
