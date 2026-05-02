import {
  useListAppointments,
} from "@workspace/api-client-react";
import { useLang } from "@/lib/i18n";
import { CheckCircle } from "lucide-react";

export default function History() {
  const { t, lang } = useLang();
  // Show only completed appointments
  const appointments = useListAppointments({ status: "completed" } as any);

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">{t("historyTitle")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("historySub")}</p>
      </div>

      <div className="bg-card border border-card-border rounded-xl shadow overflow-hidden">
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
              {appointments.isLoading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">{t("loading")}</td></tr>
              ) : !appointments.data?.length ? (
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
                appointments.data.map((appt) => (
                  <tr key={appt.id} data-testid={`row-history-${appt.id}`} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{appt.customerName}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{appt.vehicleDescription}</td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">{appt.serviceName}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{appt.technicianName}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(appt.scheduledAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-bold text-emerald-400">{t("baht")}{appt.totalCost.toFixed(2)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {(appointments.data?.length ?? 0) > 0 && (
          <div className="px-5 py-3 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {appointments.data?.length} {lang === "th" ? "รายการ" : "records"}
            </p>
            <p className="text-sm font-bold text-foreground">
              {t("totalRevenue")}: <span className="text-emerald-400">{t("baht")}{(appointments.data?.reduce((a, b) => a + b.totalCost, 0) ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
