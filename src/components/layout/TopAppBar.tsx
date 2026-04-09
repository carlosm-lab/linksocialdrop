import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

interface TopAppBarProps {
  isAuthenticated?: boolean;
}

export function TopAppBar({ isAuthenticated = false }: TopAppBarProps) {
  return (
    <header className="fixed top-0 z-50 w-full bg-[#111316]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Icon name="grid_view" className="text-2xl text-[#00F5FF]" />
          <Link
            href="/"
            className="font-headline text-xl font-black tracking-tighter text-[#00F5FF]"
          >
            LinkDrop
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link
              href="/admin/links"
              className="text-slate-400 transition-colors hover:text-[#63f7ff]"
            >
              Links
            </Link>
            <Link
              href="/admin/appearance"
              className="text-slate-400 transition-colors hover:text-[#63f7ff]"
            >
              Appearance
            </Link>
            <Link
              href="/admin/analytics"
              className="text-slate-400 transition-colors hover:text-[#63f7ff]"
            >
              Analytics
            </Link>
            {isAuthenticated ? (
              <div className="border-primary-container/20 ml-4 h-10 w-10 overflow-hidden rounded-full border-2">
                <img
                  alt="User Profile"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXTrkXxHOMR9oktgfJCRqftjcZ2tM9yfnwkCIxcoH-dnjnQ1mbtFrYodXBKP1VYa1Vt3PX9cktgaJXlITnzxcGrlqqwfVgTwoogJIqkre3PhY_L2-85VrVL55hM-2NxfnQMzlr9PolM2HvpGHfU6QZ15Q_F6rU9aI8y4rrYSEQY0pP4YCIiKOERUtdxqQtAFpQijrx0kTeDhZ6AWPGkh8Ud6JPrjxUjGuy5BUw3yeuWFv1yaKw5nm5TNdBaA3dD_0iwNMCBBAoIqI"
                />
              </div>
            ) : (
              <Button
                variant="luminous"
                className="ml-4 rounded-full px-6 py-2.5 transition-transform hover:scale-[0.98]"
              >
                Get Started
              </Button>
            )}
          </nav>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <Icon name="menu" className="text-on-surface" />
          </div>
        </div>
      </div>
    </header>
  );
}
