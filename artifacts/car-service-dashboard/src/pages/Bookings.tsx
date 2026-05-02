import { useState } from "react";
import {
  useListAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
  useListCustomers,
  useListVehicles,
  useListServices,
  useListTechnicians,
  getListAppointmentsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X } from "lucide-react";
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

const createSchema = z.object({
  customerId: z.coerce.number().min(1),
  vehicleId: z.coerce.number().min(1),
  serviceId: z.coerce.number().min(1),
  technicianId: z.coerce.number().min(1),
  scheduledAt: z.string().min(1),
  notes: z.string().optional(),
});

const updateSchema = z.object({
  status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]),
  notes: z.string().optional(),
});

type CreateForm = z.infer<typeof createSchema>;
type UpdateForm = z.infer<typeof updateSchema>;

export default function Bookings() {
  const { t, lang } = useLang();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Show only scheduled bookings
  const appointments = useListAppointments({ status: "scheduled" } as any);
  const customers = useListCustomers();
  const vehicles = useListVehicles();
  const services = useListServices();
  const technicians = useListTechnicians();

  const createMutation = useCreateAppointment({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
        setShowCreate(false);
        createForm.reset();
        toast({ title: lang === "th" ? "สร้างการจองเรียบร้อย" : "Booking created" });
      },
    },
  });

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

  const createForm = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: { customerId: 0, vehicleId: 0, serviceId: 0, technicianId: 0, scheduledAt: "", notes: "" },
  });

  const updateForm = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
    defaultValues: { status: "scheduled", notes: "" },
  });

  function openEdit(appt: NonNullable<typeof appointments.data>[0]) {
    setEditId(appt.id);
    updateForm.reset({ status: appt.status as any, notes: appt.notes ?? "" });
  }

  const inputCls = "w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1";

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("bookingsTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("bookingsSub")}</p>
        </div>
        <button
          data-testid="button-create-booking"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t("newBooking")}</span>
        </button>
      </div>

      <div className="bg-card border border-card-border rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[t("customers"), t("vehicle"), t("service"), t("technician"), t("dateTime"), t("status"), t("cost"), ""].map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {appointments.isLoading ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">{t("loading")}</td></tr>
              ) : !appointments.data?.length ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">{t("noBookings")}</td></tr>
              ) : (
                appointments.data.map((appt) => (
                  <tr key={appt.id} data-testid={`row-booking-${appt.id}`} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{appt.customerName}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{appt.vehicleDescription}</td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">{appt.serviceName}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{appt.technicianName}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(appt.scheduledAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US")}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[appt.status] ?? ""}`}>
                        {t(appt.status as any)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{t("baht")}{appt.totalCost.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button data-testid={`button-edit-booking-${appt.id}`} onClick={() => openEdit(appt)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button data-testid={`button-delete-booking-${appt.id}`} onClick={() => deleteMutation.mutate({ id: appt.id })} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-card border border-card-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-sm font-semibold text-foreground">{t("newBooking")}</h2>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={createForm.handleSubmit((d) => createMutation.mutate({ data: d }))} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{t("customers")}</label>
                  <select data-testid="select-customer" {...createForm.register("customerId")} className={inputCls}>
                    <option value={0}>{t("selectCustomer")}</option>
                    {customers.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("vehicle")}</label>
                  <select data-testid="select-vehicle" {...createForm.register("vehicleId")} className={inputCls}>
                    <option value={0}>{t("selectVehicle")}</option>
                    {vehicles.data?.map((v) => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("service")}</label>
                  <select data-testid="select-service" {...createForm.register("serviceId")} className={inputCls}>
                    <option value={0}>{t("selectService")}</option>
                    {services.data?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("technician")}</label>
                  <select data-testid="select-technician" {...createForm.register("technicianId")} className={inputCls}>
                    <option value={0}>{t("selectTechnician")}</option>
                    {technicians.data?.map((t2) => <option key={t2.id} value={t2.id}>{t2.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>{t("dateTime")}</label>
                <input data-testid="input-scheduled-at" type="datetime-local" {...createForm.register("scheduledAt")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{t("notes")}</label>
                <textarea data-testid="input-notes" {...createForm.register("notes")} className={inputCls + " resize-none"} rows={2} placeholder={t("optionalNotes")} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">{t("cancel")}</button>
                <button data-testid="button-submit-booking" type="submit" disabled={createMutation.isPending} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
                  {createMutation.isPending ? t("creating") : t("create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-card border border-card-border rounded-xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">{t("updateRepair")}</h2>
              <button onClick={() => setEditId(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={updateForm.handleSubmit((d) => updateMutation.mutate({ id: editId, data: d }))} className="p-5 space-y-4">
              <div>
                <label className={labelCls}>{t("status")}</label>
                <select data-testid="select-status" {...updateForm.register("status")} className={inputCls}>
                  <option value="scheduled">{t("scheduled")}</option>
                  <option value="in_progress">{t("in_progress")}</option>
                  <option value="completed">{t("completed")}</option>
                  <option value="cancelled">{t("cancelled")}</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>{t("notes")}</label>
                <textarea data-testid="input-update-notes" {...updateForm.register("notes")} className={inputCls + " resize-none"} rows={2} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setEditId(null)} className="flex-1 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">{t("cancel")}</button>
                <button data-testid="button-submit-update" type="submit" disabled={updateMutation.isPending} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
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
