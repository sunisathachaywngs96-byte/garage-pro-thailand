import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { TrendingUp, DollarSign, CheckCircle, Calculator } from "lucide-react";
import { useLang } from "@/lib/i18n";

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f97316", "#06b6d4"];

// Mock data
const mockRevenue = [
  { month: "2024-01", revenue: 125000 },
  { month: "2024-02", revenue: 142000 },
  { month: "2024-03", revenue: 158000 },
  { month: "2024-04", revenue: 171000 },
  { month: "2024-05", revenue: 168000 },
  { month: "2024-06", revenue: 185000 },
];

const mockBreakdown = [
  { serviceName: "Oil Change", count: 45, revenue: 67500 },
  { serviceName: "Brake Service", count: 28, revenue: 98000 },
  { serviceName: "Engine Repair", count: 15, revenue: 120000 },
  { serviceName: "AC Service", count: 32, revenue: 89600 },
  { serviceName: "Tire Service", count: 22, revenue: 48400 },
  { serviceName: "Transmission", count: 12, revenue: 54000 },
];

function formatMonth(m: string) {
  const [year, month] = m.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("default", { month: "short" });
}

export default function Income() {
  const { t } = useLang();
  
  const totalRevAllTime = mockBreakdown.reduce((acc, b) => acc + b.revenue, 0);
  const totalJobs = mockBreakdown.reduce((acc, b) => acc + b.count, 0);
  const avgJobValue = totalJobs > 0 ? totalRevAllTime / totalJobs : 0;
  const monthlyRevenue = mockRevenue[mockRevenue.length - 1]?.revenue ?? 0;

  const kpis = [
    { label: t("totalRevenue"), value: `${t("baht")}${totalRevAllTime.toLocaleString()}`, icon: TrendingUp, accent: "bg-amber-500/20 text-amber-400" },
    { label: t("monthRevenue"), value: `${t("baht")}${monthlyRevenue.toLocaleString()}`, icon: DollarSign, accent: "bg-emerald-500/20 text-emerald-400" },
    { label: t("completedJobs"), value: totalJobs, icon: CheckCircle, accent: "bg-blue-500/20 text-blue-400" },
    { label: t("avgJobValue"), value: `${t("baht")}${avgJobValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: Calculator, accent: "bg-violet-500/20 text-violet-400" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">{t("incomeTitle")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("incomeSub")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} data-testid={`kpi-income-${k.label}`} className="bg-card border border-card-border rounded-xl p-4 flex items-start gap-3 shadow">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${k.accent}`}>
              <k.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider leading-tight">{k.label}</p>
              <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5 leading-tight">{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Area Chart */}
        <div className="bg-card border border-card-border rounded-xl p-4 sm:p-5 shadow">
          <h2 className="text-sm font-semibold text-foreground mb-4">{t("revenueByMonth")}</h2>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={mockRevenue} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
              <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11, fill: "hsl(215 14% 52%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215 14% 52%)" }} tickFormatter={(v) => `${t("baht")}${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "hsl(222 25% 12%)", border: "1px solid hsl(222 20% 18%)", borderRadius: "8px", color: "hsl(215 20% 92%)" }}
                formatter={(v: number) => [`${t("baht")}${v.toLocaleString()}`, t("monthlyRevenue")]}
                labelFormatter={formatMonth}
              />
              <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Service Bar */}
        <div className="bg-card border border-card-border rounded-xl p-4 sm:p-5 shadow">
          <h2 className="text-sm font-semibold text-foreground mb-4">{t("revenueByService")}</h2>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={mockBreakdown} layout="vertical" margin={{ top: 0, right: 16, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(215 14% 52%)" }} tickFormatter={(v) => `${t("baht")}${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="serviceName" tick={{ fontSize: 10, fill: "hsl(215 14% 52%)" }} width={60}
                tickFormatter={(v) => v.split(" ")[0]}
              />
              <Tooltip
                contentStyle={{ background: "hsl(222 25% 12%)", border: "1px solid hsl(222 20% 18%)", borderRadius: "8px", color: "hsl(215 20% 92%)" }}
                formatter={(v: number) => [`${t("baht")}${v.toLocaleString()}`, t("income")]}
              />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]} fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>

          {/* Service table */}
          <div className="mt-4 space-y-2">
            {mockBreakdown.map((row, i) => (
              <div key={row.serviceName} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-muted-foreground truncate max-w-[140px]">{row.serviceName}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-muted-foreground">{row.count} {t("jobs")}</span>
                  <span className="text-foreground font-medium">{t("baht")}{row.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
