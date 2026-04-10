import { redirect } from "next/navigation";

/**
 * /dashboard → redirects to /dashboard/links
 * This ensures users always land on the links page when navigating to /dashboard.
 */
export default function DashboardPage() {
  redirect("/dashboard/links");
}
