import {
  useGetDashboardSummary,
  useGetRecentActivity,
  useGetServiceBreakdown,
  useGetRevenueByMonth,
} from "@workspace/api-client-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Calendar, Wrench, CheckCircle, Users, Car, TrendingUp, HardHat, Clock } from "lucide-react";
import { useLang } from "@/lib/i18n";

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f97316", "#06b6d4", "#84cc16"];

function KpiCard({
  labelKey,
  value,
  icon: Icon,
  accent,
  sub,
}: {
  labelKey: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
  sub?: string;
}) {
  return (
    <div
      data-testid={`kpi-${labelKey}`}
      className="bg-card border border-card-border rounded-xl p-4 flex items-start gap-3 shadow"
    >
      <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider leading-tight">{labelKey}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5 leading-none">{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function formatMonth(m: string) {
  const [year, month] = m.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("default", { month: "short" });
}

export default function Dashboard() {
  const { t, lang } = useLang();
  const summary = useGetDashboardSummary();
  const activity = useGetRecentActivity();
  const breakdown = useGetServiceBreakdown();
  const revenue = useGetRevenueByMonth();
  const s = summary.data;

  const kpis = [
    { key: t("todaysJobs"), value: summary.isLoading ? "—" : (s?.todayAppointments ?? 0), icon: Calendar, accent: "bg-amber-500/20 text-amber-400" },
    { key: t("inProgress"), value: summary.isLoading ? "—" : (s?.inProgressCount ?? 0), icon: Wrench, accent: "bg-blue-500/20 text-blue-400" },
    { key: t("completedToday"), value: summary.isLoading ? "—" : (s?.completedToday ?? 0), icon: CheckCircle, accent: "bg-emerald-500/20 text-emerald-400" },
    { key: t("monthlyRevenue"), value: summary.isLoading ? "—" : `${t("baht")}${(s?.monthlyRevenue ?? 0).toLocaleString()}`, icon: TrendingUp, accent: "bg-violet-500/20 text-violet-400" },
    { key: t("totalCustomers"), value: summary.isLoading ? "—" : (s?.totalCustomers ?? 0), icon: Users, accent: "bg-amber-500/20 text-amber-400" },
    { key: t("totalVehicles"), value: summary.isLoading ? "—" : (s?.totalVehicles ?? 0), icon: Car, accent: "bg-blue-500/20 text-blue-400" },
    { key: t("availableTechs"), value: summary.isLoading ? "—" : (s?.availableTechnicians ?? 0), icon: HardHat, accent: "bg-emerald-500/20 text-emerald-400" },
    {
      key: t("scheduledToday"),
      value: summary.isLoading ? "—" : Math.max(0, (s?.todayAppointments ?? 0) - (s?.inProgressCount ?? 0) - (s?.completedToday ?? 0)),
      icon: Clock,
      accent: "bg-orange-500/20 text-orange-400",
      sub: t("pendingStart"),
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">{t("dashboardTitle")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("dashboardSub")}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <KpiCard key={k.key} labelKey={k.key} value={k.value} icon={k.icon} accent={k.accent} sub={k.sub} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-card-border rounded-xl p-5 shadow">
          <h2 className="text-sm font-semibold text-foreground mb-4">{t("revenueChart")}</h2>
          {revenue.isLoading ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">{t("loading")}</div>
          ) : !revenue.data?.length ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">{t("noData")}</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenue.data} margin={{ top: 0, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
                <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11, fill: "hsl(215 14% 52%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(215 14% 52%)" }} tickFormatter={(v) => `${t("baht")}${v}`} />
                <Tooltip
                  contentStyle={{ background: "hsl(222 25% 12%)", border: "1px solid hsl(222 20% 18%)", borderRadius: "8px", color: "hsl(215 20% 92%)" }}
                  formatter={(v: number) => [`${t("baht")}${v.toLocaleString()}`, t("monthlyRevenue")]}
                  labelFormatter={formatMonth}
                />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-card border border-card-border rounded-xl p-5 shadow">
          <h2 className="text-sm font-semibold text-foreground mb-4">{t("serviceBreakdown")}</h2>
          {breakdown.isLoading ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">{t("loading")}</div>
          ) : !breakdown.data?.length ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">{t("noData")}</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={breakdown.data}
                  dataKey="count"
                  nameKey="serviceName"
                  cx="50%"
                  cy="50%"
                  outerRadius={72}
                  label={({ serviceName, percent }) =>
                    `${serviceName.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {breakdown.data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(222 25% 12%)", border: "1px solid hsl(222 20% 18%)", borderRadius: "8px", color: "hsl(215 20% 92%)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Activity */}
      <div className="bg-card border border-card-border rounded-xl shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-card-border">
          <h2 className="text-sm font-semibold text-foreground">{t("recentActivity")}</h2>
        </div>
        <div className="divide-y divide-border">
          {activity.isLoading ? (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">{t("loading")}</div>
          ) : !activity.data?.length ? (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">{t("noActivity")}</div>
          ) : (
            activity.data.map((item) => (
              <div key={item.id} data-testid={`activity-item-${item.id}`} className="flex items-start gap-3 px-5 py-3">
                <div className="w-7 h-7 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(item.timestamp).toLocaleString(lang === "th" ? "th-TH" : "en-US")}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
