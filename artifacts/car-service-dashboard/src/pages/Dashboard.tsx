import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Calendar, Wrench, CheckCircle, Users, Car, TrendingUp, HardHat, Clock } from "lucide-react";
import { useLang } from "@/lib/i18n";

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f97316", "#06b6d4", "#84cc16"];

// Mock data for demonstration
const mockSummary = {
  todayAppointments: 12,
  inProgressCount: 4,
  completedToday: 6,
  monthlyRevenue: 185000,
  totalCustomers: 248,
  totalVehicles: 312,
  availableTechnicians: 5,
};

const mockRevenue = [
  { month: "2024-01", revenue: 125000 },
  { month: "2024-02", revenue: 142000 },
  { month: "2024-03", revenue: 158000 },
  { month: "2024-04", revenue: 171000 },
  { month: "2024-05", revenue: 168000 },
  { month: "2024-06", revenue: 185000 },
];

const mockBreakdown = [
  { serviceName: "Oil Change", count: 45 },
  { serviceName: "Brake Service", count: 28 },
  { serviceName: "Engine Repair", count: 15 },
  { serviceName: "Tire Service", count: 32 },
  { serviceName: "AC Service", count: 22 },
];

const mockActivity = [
  { id: 1, description: "Honda Civic - Oil change completed", timestamp: new Date().toISOString() },
  { id: 2, description: "Toyota Camry - Brake inspection started", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, description: "New customer registered: John Smith", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 4, description: "BMW X5 - Scheduled for AC service", timestamp: new Date(Date.now() - 10800000).toISOString() },
];

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
        <p className="text-xl sm:text-2xl font-bold text-foreground mt-0.5 leading-none">{value}</p>
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
  const s = mockSummary;

  const kpis = [
    { key: t("todaysJobs"), value: s.todayAppointments, icon: Calendar, accent: "bg-amber-500/20 text-amber-400" },
    { key: t("inProgress"), value: s.inProgressCount, icon: Wrench, accent: "bg-blue-500/20 text-blue-400" },
    { key: t("completedToday"), value: s.completedToday, icon: CheckCircle, accent: "bg-emerald-500/20 text-emerald-400" },
    { key: t("monthlyRevenue"), value: `${t("baht")}${s.monthlyRevenue.toLocaleString()}`, icon: TrendingUp, accent: "bg-violet-500/20 text-violet-400" },
    { key: t("totalCustomers"), value: s.totalCustomers, icon: Users, accent: "bg-amber-500/20 text-amber-400" },
    { key: t("totalVehicles"), value: s.totalVehicles, icon: Car, accent: "bg-blue-500/20 text-blue-400" },
    { key: t("availableTechs"), value: s.availableTechnicians, icon: HardHat, accent: "bg-emerald-500/20 text-emerald-400" },
    {
      key: t("scheduledToday"),
      value: Math.max(0, s.todayAppointments - s.inProgressCount - s.completedToday),
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger">
        {kpis.map((k) => (
          <KpiCard key={k.key} labelKey={k.key} value={k.value} icon={k.icon} accent={k.accent} sub={k.sub} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-card-border rounded-xl p-4 sm:p-5 shadow">
          <h2 className="text-sm font-semibold text-foreground mb-4">{t("revenueChart")}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockRevenue} margin={{ top: 0, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
              <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11, fill: "hsl(215 14% 52%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215 14% 52%)" }} tickFormatter={(v) => `${t("baht")}${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "hsl(222 25% 12%)", border: "1px solid hsl(222 20% 18%)", borderRadius: "8px", color: "hsl(215 20% 92%)" }}
                formatter={(v: number) => [`${t("baht")}${v.toLocaleString()}`, t("monthlyRevenue")]}
                labelFormatter={formatMonth}
              />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-4 sm:p-5 shadow">
          <h2 className="text-sm font-semibold text-foreground mb-4">{t("serviceBreakdown")}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={mockBreakdown}
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
                {mockBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(222 25% 12%)", border: "1px solid hsl(222 20% 18%)", borderRadius: "8px", color: "hsl(215 20% 92%)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity */}
      <div className="bg-card border border-card-border rounded-xl shadow overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-card-border">
          <h2 className="text-sm font-semibold text-foreground">{t("recentActivity")}</h2>
        </div>
        <div className="divide-y divide-border">
          {mockActivity.map((item) => (
            <div key={item.id} data-testid={`activity-item-${item.id}`} className="flex items-start gap-3 px-4 sm:px-5 py-3">
              <div className="w-7 h-7 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{new Date(item.timestamp).toLocaleString(lang === "th" ? "th-TH" : "en-US")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
