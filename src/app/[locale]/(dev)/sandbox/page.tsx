import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { LivePreview } from "@/components/shared/LivePreview";

export default function SandboxPage() {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-32">
      <TopAppBar isAuthenticated={true} />

      <main className="relative z-10 mx-auto max-w-7xl space-y-16 px-6 pt-32">
        <div>
          <h1 className="font-headline mb-2 text-4xl font-black text-white">
            Sandbox UI Componentes
          </h1>
          <p className="text-slate-400">
            Verificando que los tokens HSL y Componentes en Next.js App Router
            sean Pixel-Perfect. Redimensiona en dev tools para simular Mobile y
            ver el BottomNav.
          </p>
        </div>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            1. Icons (Material Symbols)
          </h2>
          <div className="bg-surface-container flex flex-wrap gap-4 rounded-xl p-8">
            <Icon name="home" />
            <Icon name="settings" className="text-primary-container" />
            <Icon name="palette" className="text-on-secondary-container" />
            <Icon name="leaderboard" className="text-error" />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            2. Buttons &amp; Variants
          </h2>
          <div className="bg-surface-container flex flex-wrap gap-4 rounded-xl p-8">
            <Button>Default Shadcn</Button>
            <Button variant="luminous" size="pill">
              Luminous Pill Prototype
            </Button>
            <Button variant="surface">Surface Variant</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            3. Phone Live Preview
          </h2>
          <div className="bg-surface-container flex flex-col gap-8 overflow-hidden rounded-xl p-8 lg:flex-row">
            <LivePreview />
            <div className="hidden flex-1 space-y-4 pt-16 lg:block">
              <h3 className="text-xl font-bold text-slate-300">
                Aquí estaría el área de trabajo en Admin
              </h3>
              <div className="border-outline-variant/30 mt-8 flex flex-col items-center rounded-xl border border-dashed p-8 text-center">
                <Icon
                  name="add_link"
                  className="mb-4 text-4xl text-slate-700"
                />
                <p className="max-w-xs text-slate-500">
                  Have more to show? Add unlimited links to your profile with
                  our Premium plan.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNavBar />

      {/* Sandbox FAB test */}
      <div className="fixed right-8 bottom-32 z-50 md:right-12 md:bottom-12">
        <button className="luminous-glow text-on-primary-fixed group flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95">
          <Icon
            name="add"
            className="text-3xl font-bold transition-transform duration-300 group-hover:rotate-90"
          />
        </button>
      </div>
    </div>
  );
}
