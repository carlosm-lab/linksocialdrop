import { getAdminStats } from "@/actions/admin";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/i18n/navigation";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-headline text-4xl font-black tracking-tight text-white">
          Panel de Administración
        </h1>
        <p className="text-on-surface-variant mt-2 text-lg">
          Vista global de LinkSocialDrop
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="group"
          label="Usuarios Registrados"
          value={stats.totalUsers}
          color="text-[#00F5FF]"
          bgColor="bg-[#00F5FF]/10"
        />
        <StatCard
          icon="link"
          label="Links Creados"
          value={stats.totalLinks}
          color="text-violet-400"
          bgColor="bg-violet-400/10"
        />
        <StatCard
          icon="ads_click"
          label="Clics Globales"
          value={stats.totalClicks}
          color="text-emerald-400"
          bgColor="bg-emerald-400/10"
        />
        <Link href="/admin/mensajes" className="group">
          <div className="bg-surface-container-high hover:bg-surface-container-highest relative overflow-hidden rounded-xl border border-white/5 p-6 transition-all duration-300">
            <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 bg-[radial-gradient(circle,rgba(251,191,36,0.08)_0%,transparent_70%)]" />
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-400/10">
                <Icon name="mail" className="text-2xl text-amber-400" />
              </div>
              {stats.unreadMessages > 0 && (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500 px-2 text-xs font-bold text-black">
                  {stats.unreadMessages}
                </span>
              )}
            </div>
            <div className="font-headline text-3xl font-black text-white">
              {stats.totalMessages}
            </div>
            <div className="text-on-surface-variant mt-1 text-sm">
              Mensajes de Soporte
            </div>
            <div className="text-on-surface-variant mt-1 text-xs">
              {stats.unreadMessages} sin leer
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="bg-surface-container-high relative overflow-hidden rounded-xl border border-white/5 p-6">
      <div
        className={`pointer-events-none absolute top-0 right-0 h-32 w-32 bg-[radial-gradient(circle,rgba(0,245,255,0.05)_0%,transparent_70%)]`}
      />
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${bgColor}`}
      >
        <Icon name={icon} className={`text-2xl ${color}`} />
      </div>
      <div className="font-headline text-3xl font-black text-white">
        {value.toLocaleString()}
      </div>
      <div className="text-on-surface-variant mt-1 text-sm">{label}</div>
    </div>
  );
}
