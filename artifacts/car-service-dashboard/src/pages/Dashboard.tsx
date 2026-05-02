import {
  useGetDashboardSummary,
  useGetRecentActivity,
  useGetServiceBreakdown,
  useGetRevenueByMonth,
} from "@workspace/api-client-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Calendar,
  Wrench,
  CheckCircle,
  Users,
  Car,
  DollarSign,
  HardHat,
  Clock,
} from "lucide-react";

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f97316"];

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div
      data-testid={`kpi-${label.toLowerCase().replace(/\s+/g, "-")}`}
      className="bg-card border border-card-border rounded-xl p-5 flex items-start gap-4 shadow-sm"
    >
      <div className={`flex items-center justify-center w-11 h-11 rounded-lg shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
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
  const summary = useGetDashboardSummary();
  const activity = useGetRecentActivity();
  const breakdown = useGetServiceBreakdown();
  const revenue = useGetRevenueByMonth();

  const s = summary.data;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Live overview of shop operations</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Today's Jobs"
          value={summary.isLoading ? "—" : (s?.todayAppointments ?? 0)}
          icon={Calendar}
          color="bg-amber-100 text-amber-700"
        />
        <KpiCard
          label="In Progress"
          value={summary.isLoading ? "—" : (s?.inProgressCount ?? 0)}
          icon={Wrench}
          color="bg-blue-100 text-blue-700"
        />
        <KpiCard
          label="Completed Today"
          value={summary.isLoading ? "—" : (s?.completedToday ?? 0)}
          icon={CheckCircle}
          color="bg-emerald-100 text-emerald-700"
        />
        <KpiCard
          label="Monthly Revenue"
          value={summary.isLoading ? "—" : `$${(s?.monthlyRevenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
          color="bg-violet-100 text-violet-700"
        />
        <KpiCard
          label="Customers"
          value={summary.isLoading ? "—" : (s?.totalCustomers ?? 0)}
          icon={Users}
          color="bg-amber-100 text-amber-700"
        />
        <KpiCard
          label="Vehicles"
          value={summary.isLoading ? "—" : (s?.totalVehicles ?? 0)}
          icon={Car}
          color="bg-blue-100 text-blue-700"
        />
        <KpiCard
          label="Available Techs"
          value={summary.isLoading ? "—" : (s?.availableTechnicians ?? 0)}
          icon={HardHat}
          color="bg-emerald-100 text-emerald-700"
        />
        <KpiCard
          label="Scheduled Today"
          value={summary.isLoading ? "—" : ((s?.todayAppointments ?? 0) - (s?.inProgressCount ?? 0) - (s?.completedToday ?? 0))}
          icon={Clock}
          color="bg-orange-100 text-orange-700"
          sub="pending start"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue chart */}
        <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">Revenue — Last 6 Months</h2>
          {revenue.isLoading ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading...</div>
          ) : !revenue.data?.length ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No revenue data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenue.data} margin={{ top: 0, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 88%)" />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonth}
                  tick={{ fontSize: 11, fill: "hsl(220 12% 48%)" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "hsl(220 12% 48%)" }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                  labelFormatter={formatMonth}
                />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Service breakdown */}
        <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">Service Breakdown</h2>
          {breakdown.isLoading ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading...</div>
          ) : !breakdown.data?.length ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No service data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={breakdown.data}
                  dataKey="count"
                  nameKey="serviceName"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ serviceName, percent }) =>
                    `${serviceName.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {breakdown.data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, name) => [v, name]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Activity feed */}
      <div className="bg-card border border-card-border rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b border-card-border">
          <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
        </div>
        <div className="divide-y divide-border">
          {activity.isLoading ? (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">Loading...</div>
          ) : !activity.data?.length ? (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">No recent activity</div>
          ) : (
            activity.data.map((item) => (
              <div
                key={item.id}
                data-testid={`activity-item-${item.id}`}
                className="flex items-start gap-3 px-5 py-3"
              >
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
