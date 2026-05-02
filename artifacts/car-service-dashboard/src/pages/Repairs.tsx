import { useState } from "react";
import {
  useListAppointments,
  useUpdateAppointment,
  useDeleteAppointment,
  getListAppointmentsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  in_progress: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  completed: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  cancelled: "bg-red-500/15 text-red-400 border border-red-500/20",
};

const updateSchema = z.object({
  status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]),
  notes: z.string().optional(),
});

type UpdateForm = z.infer<typeof updateSchema>;

export default function Repairs() {
  const { t, lang } = useLang();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<"" | "in_progress" | "scheduled">("");
  const [editId, setEditId] = useState<number | null>(null);

  const appointments = useListAppointments({ status: statusFilter || undefined } as any);

  const updateMutation = useUpdateAppointment({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
        setEditId(null);
        toast({ title: lang === "th" ? "อัปเดตเรียบร้อย" : "Updated" });
      },
    },
  });

  const deleteMutation = useDeleteAppointment({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListAppointmentsQueryKey() }),
    },
  });

  const form = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
    defaultValues: { status: "in_progress", notes: "" },
  });

  function openEdit(appt: NonNullable<typeof appointments.data>[0]) {
    setEditId(appt.id);
    form.reset({ status: appt.status as any, notes: appt.notes ?? "" });
  }

  const inputCls = "w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1";

  const filters: Array<{ key: string; val: "" | "in_progress" | "scheduled"; label: string }> = [
    { key: "all", val: "", label: t("all") },
    { key: "in_progress", val: "in_progress", label: t("in_progress") },
    { key: "scheduled", val: "scheduled", label: t("scheduled") },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">{t("repairsTitle")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("repairsSub")}</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            data-testid={`filter-${f.key}`}
            onClick={() => setStatusFilter(f.val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === f.val
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards view for repairs */}
      {appointments.isLoading ? (
        <div className="py-12 text-center text-muted-foreground">{t("loading")}</div>
      ) : !appointments.data?.length ? (
        <div className="py-12 text-center text-muted-foreground">{t("noRepairs")}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {appointments.data.map((appt) => (
            <div key={appt.id} data-testid={`card-repair-${appt.id}`} className="bg-card border border-card-border rounded-xl p-4 shadow hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{appt.customerName}</p>
                  <p className="text-xs text-muted-foreground truncate">{appt.vehicleDescription}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_COLORS[appt.status] ?? ""}`}>
                  {t(appt.status as any)}
                </span>
              </div>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-foreground/70 font-medium">{t("service")}:</span>
                  <span className="truncate">{appt.serviceName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-foreground/70 font-medium">{t("technician")}:</span>
                  <span className="truncate">{appt.technicianName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-foreground/70 font-medium">{t("dateTime")}:</span>
                  <span>{new Date(appt.scheduledAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US")}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm font-bold text-amber-400">{t("baht")}{appt.totalCost.toFixed(2)}</span>
                <div className="flex items-center gap-1">
                  <button data-testid={`button-edit-repair-${appt.id}`} onClick={() => openEdit(appt)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button data-testid={`button-delete-repair-${appt.id}`} onClick={() => deleteMutation.mutate({ id: appt.id })} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-card border border-card-border rounded-xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">{t("updateRepair")}</h2>
              <button onClick={() => setEditId(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={form.handleSubmit((d) => updateMutation.mutate({ id: editId, data: d }))} className="p-5 space-y-4">
              <div>
                <label className={labelCls}>{t("status")}</label>
                <select data-testid="select-status" {...form.register("status")} className={inputCls}>
                  <option value="scheduled">{t("scheduled")}</option>
                  <option value="in_progress">{t("in_progress")}</option>
                  <option value="completed">{t("completed")}</option>
                  <option value="cancelled">{t("cancelled")}</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>{t("notes")}</label>
                <textarea {...form.register("notes")} className={inputCls + " resize-none"} rows={2} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setEditId(null)} className="flex-1 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">{t("cancel")}</button>
                <button type="submit" disabled={updateMutation.isPending} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
                  {updateMutation.isPending ? t("saving") : t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
