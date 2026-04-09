import { TopAppBar } from "@/components/layout/TopAppBar";
import { BottomNavBar } from "@/components/layout/BottomNavBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container relative min-h-screen">
      <TopAppBar isAuthenticated={true} />

      {/* Content for all admin routes */}
      {children}

      <BottomNavBar />
    </div>
  );
}
