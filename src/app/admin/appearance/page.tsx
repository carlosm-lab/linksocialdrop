import { Icon } from "@/components/ui/icon";
import { LivePreview } from "@/components/shared/LivePreview";
import { Button } from "@/components/ui/button";

export default function AdminAppearancePage() {
  return (
    <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pt-24 pb-32 lg:grid-cols-12">
      {/* Left Column: Controls */}
      <div className="space-y-8 lg:col-span-7">
        <header>
          <h2 className="font-headline mb-2 text-4xl font-black tracking-tighter">
            Appearance
          </h2>
          <p className="text-on-surface-variant font-light">
            Curate your digital gallery&apos;s visual signature.
          </p>
        </header>

        {/* Profile Customization */}
        <section className="bg-surface-container-low space-y-6 rounded-xl p-8">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-headline mb-1 text-lg font-bold">
                Profile Identity
              </h3>
              <p className="text-on-surface-variant text-sm">
                Update your avatar and bio display.
              </p>
            </div>
            <button className="border-outline-variant/30 hover:bg-surface-container-highest rounded-full border px-6 py-2 text-sm font-medium transition-all">
              Pick Image
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="group relative">
              <div className="bg-surface-container-highest border-primary-container/20 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2">
                <img
                  alt="Preview Avatar"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD7D98IMkWrM2jo7tJY0s2W275Qu2GdFV_1_DuFJgULt2y2FQ59Li9_3iGmTH8mqmydceRzI7MStTKmZb7cFmbkbpsGLUr_OxU0rIUq5rdy-5H4dC62zyEl_CDprsyWGTBviVR_4pWimSc1LN3Tgk_Ox7R_d4-mx6IMOSVf8dhQkM21iakrw0Xk9CiuSxQUlB6jnFmutkCxlWUtl1sh-Ds8C8JLEirUCZYYzRR0vKKVioAXlbslK7QEyDYfTzRGAp8G08cKdjjr3E"
                />
              </div>
              <div className="bg-surface/60 absolute inset-0 flex cursor-pointer items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100">
                <Icon name="upload" className="text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="bg-surface-container-highest/30 border-primary/10 rounded-lg border-b px-4 py-3">
                <label
                  htmlFor="profile-title"
                  className="text-primary-container mb-1 block text-[10px] font-bold tracking-widest uppercase"
                >
                  Profile Title
                </label>
                <input
                  id="profile-title"
                  className="font-headline w-full border-none bg-transparent p-0 text-lg font-bold text-white outline-none focus:ring-0"
                  type="text"
                  defaultValue="Digital Curator"
                />
              </div>
              <div className="bg-surface-container-highest/30 border-primary/10 rounded-lg border-b px-4 py-3">
                <label
                  htmlFor="bio-desc"
                  className="text-primary-container mb-1 block text-[10px] font-bold tracking-widest uppercase"
                >
                  Bio Description
                </label>
                <textarea
                  id="bio-desc"
                  className="text-on-surface-variant w-full resize-none border-none bg-transparent p-0 text-sm outline-none focus:ring-0"
                  rows={2}
                  defaultValue="Synthesizing modern aesthetics with functional digital architecture."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Themes & Colors */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Color Swatches */}
          <section className="bg-surface-container-low space-y-6 rounded-xl p-8">
            <h3 className="font-headline text-lg font-bold">Accent Color</h3>
            <div className="grid grid-cols-4 gap-3">
              <button className="ring-offset-surface-container-low aspect-square w-full rounded-full bg-[#00F5FF] ring-2 ring-[#00F5FF] ring-offset-4 transition-transform active:scale-95"></button>
              <button className="aspect-square w-full rounded-full bg-[#FFD700] transition-transform hover:scale-105"></button>
              <button className="aspect-square w-full rounded-full bg-[#FF6B6B] transition-transform hover:scale-105"></button>
              <button className="aspect-square w-full rounded-full bg-[#A061FF] transition-transform hover:scale-105"></button>
              <button className="aspect-square w-full rounded-full bg-[#4ECDC4] transition-transform hover:scale-105"></button>
              <button className="aspect-square w-full rounded-full bg-[#FF8C42] transition-transform hover:scale-105"></button>
              <button className="aspect-square w-full rounded-full bg-[#FFFFFF] transition-transform hover:scale-105"></button>
              <button className="bg-surface-container-highest border-outline-variant flex aspect-square w-full items-center justify-center rounded-full border">
                <Icon name="add" className="text-xs" />
              </button>
            </div>
          </section>

          {/* Font Selector */}
          <section className="bg-surface-container-low space-y-6 rounded-xl p-8">
            <h3 className="font-headline text-lg font-bold">Typography</h3>
            <div className="space-y-3">
              <button className="bg-surface-container-highest border-primary-container/30 flex w-full items-center justify-between rounded-xl border px-4 py-3">
                <span className="font-headline font-bold">Epilogue</span>
                <Icon
                  name="check_circle"
                  className="text-primary-container text-sm"
                />
              </button>
              <button className="bg-surface-container-highest/40 hover:bg-surface-container-highest flex w-full items-center justify-between rounded-xl px-4 py-3 transition-colors">
                <span className="font-body font-medium">Inter</span>
              </button>
              <button className="bg-surface-container-highest/40 hover:bg-surface-container-highest flex w-full items-center justify-between rounded-xl px-4 py-3 transition-colors">
                <span className="font-sans font-medium">Roboto</span>
              </button>
            </div>
          </section>
        </div>

        {/* Button Styles */}
        <section className="bg-surface-container-low space-y-6 rounded-xl p-8">
          <h3 className="font-headline text-lg font-bold">
            Button Architecture
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <button className="bg-surface-container-highest border-primary-container flex flex-col items-center gap-3 rounded-xl border-2 p-4">
              <div className="bg-primary-container/20 border-primary-container h-8 w-full rounded-full border"></div>
              <span className="text-primary-container text-[10px] font-bold tracking-widest uppercase">
                Pill
              </span>
            </button>
            <button className="bg-surface-container-highest/40 hover:bg-surface-container-highest flex flex-col items-center gap-3 rounded-xl border-2 border-transparent p-4 transition-all">
              <div className="bg-on-surface-variant/20 border-on-surface-variant/30 h-8 w-full rounded-lg border"></div>
              <span className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase">
                Rounded
              </span>
            </button>
            <button className="bg-surface-container-highest/40 hover:bg-surface-container-highest flex flex-col items-center gap-3 rounded-xl border-2 border-transparent p-4 transition-all">
              <div className="bg-on-surface-variant/20 border-on-surface-variant/30 h-8 w-full rounded-none border"></div>
              <span className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase">
                Square
              </span>
            </button>
          </div>
        </section>
      </div>

      {/* Right Column: Live Preview Sticky */}
      <aside className="relative lg:col-span-5">
        <div className="space-y-6 lg:sticky lg:top-24">
          <LivePreview />

          {/* Action Bar */}
          <div className="mt-8 flex gap-4">
            <button className="bg-surface-container-low border-outline-variant/30 hover:bg-surface-container-highest flex-1 rounded-xl border py-4 text-sm font-bold transition-all">
              Reset Changes
            </button>
            <Button
              variant="luminous"
              className="text-on-primary-fixed font-headline h-auto flex-1 rounded-xl py-4 text-sm font-black tracking-tighter shadow-none hover:shadow-[0_0_30px_rgba(0,245,255,0.4)]"
            >
              Publish Live
            </Button>
          </div>
        </div>
      </aside>
    </main>
  );
}
