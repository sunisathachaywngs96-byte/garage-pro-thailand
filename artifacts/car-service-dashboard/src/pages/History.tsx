import { useLang } from "@/lib/i18n";
import { CheckCircle } from "lucide-react";

const completedRepairs = [
  { id: 1, customerName: "John Smith", vehicleDescription: "2022 Honda Civic", serviceName: "Oil Change", technicianName: "Mike T.", scheduledAt: "2024-05-28T09:00:00Z", totalCost: 1500 },
  { id: 2, customerName: "Sarah Johnson", vehicleDescription: "2021 Toyota Camry", serviceName: "Brake Service", technicianName: "James R.", scheduledAt: "2024-05-27T14:00:00Z", totalCost: 3500 },
  { id: 3, customerName: "Michael Brown", vehicleDescription: "2020 BMW X5", serviceName: "AC Service", technicianName: "David L.", scheduledAt: "2024-05-26T10:00:00Z", totalCost: 2800 },
  { id: 4, customerName: "Emily Davis", vehicleDescription: "2023 Mercedes C300", serviceName: "Tire Rotation", technicianName: "Mike T.", scheduledAt: "2024-05-25T11:30:00Z", totalCost: 800 },
  { id: 5, customerName: "David Wilson", vehicleDescription: "2019 Ford F-150", serviceName: "Engine Diagnostics", technicianName: "James R.", scheduledAt: "2024-05-24T09:00:00Z", totalCost: 1200 },
  { id: 6, customerName: "Lisa Anderson", vehicleDescription: "2022 Mazda CX-5", serviceName: "Oil Change", technicianName: "David L.", scheduledAt: "2024-05-23T15:00:00Z", totalCost: 1500 },
];

export default function History() {
  const { t, lang } = useLang();
  const totalRevenue = completedRepairs.reduce((a, b) => a + b.totalCost, 0);

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">{t("historyTitle")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("historySub")}</p>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {!completedRepairs.length ? (
          <div className="py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-muted-foreground">{t("noHistory")}</p>
            </div>
          </div>
        ) : (
          completedRepairs.map((appt) => (
            <div key={appt.id} className="bg-card border border-card-border rounded-xl p-4 shadow">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{appt.customerName}</p>
                  <p className="text-xs text-muted-foreground truncate">{appt.vehicleDescription}</p>
                </div>
                <span className="text-sm font-bold text-emerald-400 shrink-0">{t("baht")}{appt.totalCost.toLocaleString()}</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("service")}:</span>
                  <span className="text-foreground">{appt.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("technician")}:</span>
                  <span className="text-foreground">{appt.technicianName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("dateTime")}:</span>
                  <span className="text-foreground">{new Date(appt.scheduledAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US")}</span>
                </div>
              </div>
            </div>
          ))
        )}
        {completedRepairs.length > 0 && (
          <div className="bg-card border border-card-border rounded-xl p-4 shadow flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{completedRepairs.length} {lang === "th" ? "รายการ" : "records"}</p>
            <p className="text-sm font-bold text-foreground">
              {t("totalRevenue")}: <span className="text-emerald-400">{t("baht")}{totalRevenue.toLocaleString()}</span>
            </p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-card border border-card-border rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[t("customers"), t("vehicle"), t("service"), t("technician"), t("dateTime"), t("cost")].map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!completedRepairs.length ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      </div>
                      <p className="text-muted-foreground">{t("noHistory")}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                completedRepairs.map((appt) => (
                  <tr key={appt.id} data-testid={`row-history-${appt.id}`} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{appt.customerName}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{appt.vehicleDescription}</td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">{appt.serviceName}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{appt.technicianName}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(appt.scheduledAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-bold text-emerald-400">{t("baht")}{appt.totalCost.toLocaleString()}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {completedRepairs.length > 0 && (
          <div className="px-5 py-3 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {completedRepairs.length} {lang === "th" ? "รายการ" : "records"}
            </p>
            <p className="text-sm font-bold text-foreground">
              {t("totalRevenue")}: <span className="text-emerald-400">{t("baht")}{totalRevenue.toLocaleString()}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
