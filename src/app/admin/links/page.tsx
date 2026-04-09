import { Icon } from "@/components/ui/icon";
import { LivePreview } from "@/components/shared/LivePreview";

export default function AdminLinksEditorPage() {
  return (
    <>
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pt-24 pb-32 lg:grid-cols-12">
        {/* Preview Section (Top for Mobile, Side for Web) */}
        <section className="order-1 flex flex-col items-center lg:order-2 lg:col-span-5">
          <LivePreview />
        </section>

        {/* Editor Section */}
        <section className="order-2 lg:order-1 lg:col-span-7">
          <div className="mb-10">
            <h2 className="font-headline mb-2 text-5xl font-black tracking-tighter text-white italic">
              Your Links
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-slate-400">
              Curate your digital identity. Drag to reorder, toggle visibility,
              and keep your gallery fresh.
            </p>
          </div>

          {/* Editor List (Hardcoded State to be Mocked Later) */}
          <div className="space-y-6">
            {/* Link Item 1 */}
            <div className="group bg-surface-container-low hover:bg-surface-container flex items-center gap-6 rounded-xl p-6 transition-all hover:translate-x-1">
              <div className="group-hover:text-primary-container cursor-grab text-slate-600 transition-colors">
                <Icon name="drag_indicator" />
              </div>
              <div className="flex-grow">
                <div className="mb-1 flex items-center gap-3">
                  <Icon
                    name="videocam"
                    className="text-primary-container text-lg"
                  />
                  <h4 className="font-headline text-lg font-bold text-white">
                    Portfolio Reel
                  </h4>
                </div>
                <p className="text-sm font-medium text-slate-500">
                  youtube.com/watch?v=curator-2024
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-white">
                  Edit
                </button>
                {/* Toggle (On) */}
                <div className="bg-primary-container relative flex h-6 w-12 cursor-pointer items-center rounded-full px-1">
                  <div className="bg-on-primary-container ml-auto h-4 w-4 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Link Item 2 (Active context) */}
            <div className="group bg-surface-container-high border-primary-container flex items-center gap-6 rounded-xl border-l-4 p-6 shadow-[0_12px_32px_-4px_rgba(12,14,17,0.4)]">
              <div className="text-primary-container cursor-grab">
                <Icon name="drag_indicator" />
              </div>
              <div className="flex-grow">
                <div className="mb-1 flex items-center gap-3">
                  <Icon
                    name="auto_stories"
                    className="text-primary-container text-lg"
                  />
                  <h4 className="font-headline text-lg font-bold text-white">
                    Read the Manifesto
                  </h4>
                </div>
                <p className="text-sm font-medium text-slate-500">
                  curator.studio/manifesto
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-xs font-bold tracking-widest text-white uppercase transition-colors">
                  Edit
                </button>
                {/* Toggle (On) */}
                <div className="bg-primary-container relative flex h-6 w-12 cursor-pointer items-center rounded-full px-1">
                  <div className="bg-on-primary-container ml-auto h-4 w-4 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Link Item 3 */}
            <div className="group bg-surface-container-low hover:bg-surface-container flex items-center gap-6 rounded-xl p-6 transition-all">
              <div className="group-hover:text-primary-container cursor-grab text-slate-600 transition-colors">
                <Icon name="drag_indicator" />
              </div>
              <div className="flex-grow">
                <div className="mb-1 flex items-center gap-3">
                  <Icon
                    name="calendar_today"
                    className="text-primary-container text-lg"
                  />
                  <h4 className="font-headline text-lg font-bold text-white">
                    Book a Consultation
                  </h4>
                </div>
                <p className="text-sm font-medium text-slate-500">
                  calendly.com/digital-curator
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-white">
                  Edit
                </button>
                {/* Toggle (On) */}
                <div className="bg-primary-container relative flex h-6 w-12 cursor-pointer items-center rounded-full px-1">
                  <div className="bg-on-primary-container ml-auto h-4 w-4 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Link Item 4 (Hidden) */}
            <div className="group bg-surface-container-lowest flex items-center gap-6 rounded-xl p-6 opacity-50">
              <div className="cursor-grab text-slate-700">
                <Icon name="drag_indicator" />
              </div>
              <div className="flex-grow">
                <div className="mb-1 flex items-center gap-3">
                  <Icon name="mail" className="text-lg text-slate-500" />
                  <h4 className="font-headline text-lg font-bold text-slate-300">
                    Newsletter Signup
                  </h4>
                </div>
                <p className="text-sm font-medium text-slate-600 italic">
                  Hidden from profile
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-white">
                  Edit
                </button>
                {/* Toggle (Off) */}
                <div className="bg-surface-container-highest relative flex h-6 w-12 cursor-pointer items-center rounded-full px-1">
                  <div className="h-4 w-4 rounded-full bg-slate-600"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State / Suggestion */}
          <div className="border-outline-variant/30 mt-12 flex flex-col items-center rounded-xl border border-dashed p-8 text-center">
            <Icon name="add_link" className="mb-4 text-4xl text-slate-700" />
            <p className="max-w-xs text-slate-500">
              Have more to show? Add unlimited links to your profile with our
              Premium plan.
            </p>
          </div>
        </section>
      </main>

      {/* Primary FAB for Add Links - Scoped specifically to the Link Editor context */}
      <div className="fixed right-8 bottom-32 z-40 md:right-12 md:bottom-12">
        <button className="luminous-glow text-on-primary-fixed group flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95">
          <Icon
            name="add"
            className="text-3xl font-bold transition-transform duration-300 group-hover:rotate-90"
          />
        </button>
      </div>
    </>
  );
}
