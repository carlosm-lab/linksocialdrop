import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LandingContent />;
}

function LandingContent() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container/30">
      <TopAppBar isAuthenticated={false} />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 pt-32 pb-20 md:pt-48 md:pb-32">
          <div className="bg-primary-container/10 absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full blur-[120px]"></div>
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-16 md:flex-row">
            <div className="w-full space-y-8 md:w-1/2">
              <div className="bg-surface-container-high border-outline-variant/15 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
                <span className="bg-primary-container h-2 w-2 rounded-full"></span>
                <span className="font-label text-primary-container text-xs tracking-widest uppercase">
                  {t("badge")}
                </span>
              </div>
              <h1 className="font-headline text-on-surface text-6xl leading-[0.9] font-black tracking-tight md:text-8xl">
                {t("heroTitle1")} <br />
                <span className="luminous-gradient bg-clip-text text-transparent">
                  {t("heroTitle2")}
                </span>
              </h1>
              <p className="text-on-surface-variant max-w-lg text-lg leading-relaxed md:text-xl">
                {t("heroDescription")}
              </p>
              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Link href="/login">
                  <Button
                    variant="luminous"
                    size="pill"
                    className="text-on-primary-fixed w-full shadow-[0_12px_32px_rgba(0,245,255,0.2)] sm:w-auto"
                  >
                    {tc("startForFree")}
                  </Button>
                </Link>
                <Button
                  variant="surface"
                  size="pill"
                  className="text-primary w-full sm:w-auto"
                >
                  {t("viewShowcase")}
                </Button>
              </div>
            </div>

            {/* Floating Mockup */}
            <div className="relative flex w-full items-center justify-center md:w-1/2">
              <div className="bg-surface-container-lowest border-surface-container-highest relative h-[580px] w-72 rotate-[-2deg] overflow-hidden rounded-[3rem] border-[8px] shadow-2xl transition-transform duration-500 hover:rotate-0">
                <div className="from-primary-container/20 absolute top-0 h-40 w-full bg-gradient-to-b to-transparent"></div>
                <div className="flex flex-col items-center px-6 pt-12">
                  <div className="bg-surface-container-high border-primary-container mb-4 h-20 w-20 rounded-full border-2 p-1">
                    <img
                      alt="Avatar"
                      className="h-full w-full rounded-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDMOLQiO_TAF5LTsMXCcT7uLBn0XehLjwgWs_-YJHZQkmXIO48FhxJh0veE0yoN8zM41T99e2fppB9t6vnUpleEjTSsImQ_5AgqJUO5Gs-CWmu0d6-cP_AbvQ4up7-HXTQoG8ZnxgLWMCJyOZGak3Pht1W-Yh39S6fH_9i6ooxQTvjNzpOV5YD_M0zrxrNeMLZVvlVugdWbMbRWZ4rXlcVC67BedZ5TULE-kRdr5xtfY7MjtMWqAdVwnkgTamFjtlhM65SH1GPmPM"
                      fetchPriority="high"
                    />
                  </div>
                  <h2 className="font-headline text-lg font-bold">
                    @alexa_curates
                  </h2>
                  <p className="text-primary-container mb-6 text-[10px] tracking-widest uppercase">
                    Digital Strategist
                  </p>

                  <div className="w-full space-y-3">
                    <div className="bg-surface-container-high border-outline-variant/10 flex h-12 w-full items-center gap-3 rounded-xl border px-4">
                      <Icon name="brush" className="text-primary-container" />
                      <div className="bg-on-surface-variant/20 h-2 w-24 rounded"></div>
                    </div>
                    <div className="bg-surface-container-high border-outline-variant/10 flex h-12 w-full items-center gap-3 rounded-xl border px-4">
                      <Icon name="camera" className="text-primary-container" />
                      <div className="bg-on-surface-variant/20 h-2 w-32 rounded"></div>
                    </div>
                    <div className="bg-surface-container-high border-outline-variant/10 flex h-12 w-full items-center gap-3 rounded-xl border px-4">
                      <Icon
                        name="shopping_bag"
                        className="text-primary-container"
                      />
                      <div className="bg-on-surface-variant/20 h-2 w-20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-primary-container/5 absolute top-1/2 left-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-surface-container-low px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 space-y-4 md:mb-24">
              <h2 className="font-headline text-4xl font-black tracking-tight text-white md:text-6xl">
                {t("featuresTitle")}
              </h2>
              <p className="text-on-surface-variant max-w-xl text-lg">
                {t("featuresSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <FeatureCard
                icon="bolt"
                title={t("featureFastTitle")}
                desc={t("featureFastDesc")}
                learnMore={tc("learnMore")}
              />
              <FeatureCard
                icon="lock"
                title={t("featurePrivateTitle")}
                desc={t("featurePrivateDesc")}
                learnMore={tc("learnMore")}
              />
              <FeatureCard
                icon="palette"
                title={t("featureCustomTitle")}
                desc={t("featureCustomDesc")}
                learnMore={tc("learnMore")}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24">
          <div className="bg-surface-container-highest relative mx-auto flex max-w-5xl flex-col items-center overflow-hidden rounded-3xl p-12 text-center md:p-24">
            <div className="bg-primary-container/10 absolute top-0 right-0 h-64 w-64 rounded-full blur-[80px]"></div>
            <h2 className="font-headline mb-8 text-4xl leading-tight font-black text-white md:text-7xl">
              {t("ctaTitle")}
            </h2>
            <Link href="/login">
              <Button
                variant="luminous"
                size="pill"
                className="text-on-primary-fixed px-12 py-5 text-xl font-black shadow-[0_20px_40px_rgba(0,245,255,0.15)] hover:scale-[1.02]"
              >
                {tc("startForFree")}
              </Button>
            </Link>
            <p className="text-on-surface-variant mt-8">{t("ctaSubtitle")}</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/50 bg-[#111316] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
          <div className="font-body text-sm text-slate-300">
            {tc("copyright")}
          </div>
          <div className="font-body flex gap-8 text-sm">
            <Link
              href="#"
              className="text-slate-300 transition-colors hover:text-white"
            >
              {tc("privacy")}
            </Link>
            <Link
              href="#"
              className="text-slate-300 transition-colors hover:text-white"
            >
              {tc("terms")}
            </Link>
            <Link
              href="#"
              className="text-slate-300 transition-colors hover:text-white"
            >
              {tc("support")}
            </Link>
          </div>
          <div className="flex gap-4">
            <div className="bg-surface-container-high text-primary-container flex h-8 w-8 items-center justify-center rounded-lg">
              <Icon name="language" className="text-sm" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  learnMore,
}: {
  icon: string;
  title: string;
  desc: string;
  learnMore: string;
}) {
  return (
    <div className="bg-surface-container-high group hover:bg-surface-container-highest relative space-y-6 overflow-hidden rounded-xl p-8 transition-colors duration-300">
      <div className="pointer-events-none absolute top-0 right-0 h-[150px] w-[150px] bg-[radial-gradient(circle,rgba(0,245,255,0.05)_0%,transparent_70%)]"></div>

      <div className="bg-primary-container/10 text-primary-container flex h-12 w-12 items-center justify-center rounded-lg">
        <Icon name={icon} />
      </div>
      <h3 className="font-headline text-2xl font-bold text-white">{title}</h3>
      <p className="text-on-surface-variant leading-relaxed">{desc}</p>
      <div className="pt-4">
        <span className="text-primary-container flex cursor-pointer items-center gap-2 text-sm font-bold transition-all group-hover:gap-4">
          {learnMore} <Icon name="arrow_forward" className="text-sm" />
        </span>
      </div>
    </div>
  );
}
