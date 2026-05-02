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

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600",
};

const createSchema = z.object({
  customerId: z.coerce.number().min(1, "Required"),
  vehicleId: z.coerce.number().min(1, "Required"),
  serviceId: z.coerce.number().min(1, "Required"),
  technicianId: z.coerce.number().min(1, "Required"),
  scheduledAt: z.string().min(1, "Required"),
  notes: z.string().optional(),
});

const updateSchema = z.object({
  status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]),
  notes: z.string().optional(),
});

type CreateForm = z.infer<typeof createSchema>;
type UpdateForm = z.infer<typeof updateSchema>;

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[status] ?? "bg-muted text-muted-foreground"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function Appointments() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const appointments = useListAppointments({ status: statusFilter || undefined } as any);
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
        toast({ title: "Appointment created" });
      },
      onError: () => toast({ title: "Error creating appointment", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateAppointment({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
        setEditId(null);
        toast({ title: "Appointment updated" });
      },
      onError: () => toast({ title: "Error updating appointment", variant: "destructive" }),
    },
  });

  const deleteMutation = useDeleteAppointment({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
        toast({ title: "Appointment cancelled" });
      },
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

  function handleCreate(data: CreateForm) {
    createMutation.mutate({ data });
  }

  function handleUpdate(data: UpdateForm) {
    if (!editId) return;
    updateMutation.mutate({ id: editId, data });
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage service bookings</p>
        </div>
        <button
          data-testid="button-create-appointment"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {["", "scheduled", "in_progress", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            data-testid={`filter-${s || "all"}`}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              statusFilter === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {s ? s.replace("_", " ") : "All"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Vehicle</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Service</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Technician</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Cost</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {appointments.isLoading ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">Loading...</td></tr>
              ) : !appointments.data?.length ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No appointments found</td></tr>
              ) : (
                appointments.data.map((appt) => (
                  <tr key={appt.id} data-testid={`row-appointment-${appt.id}`} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{appt.customerName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{appt.vehicleDescription}</td>
                    <td className="px-4 py-3 text-foreground">{appt.serviceName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{appt.technicianName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(appt.scheduledAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={appt.status} /></td>
                    <td className="px-4 py-3 font-medium text-foreground">${appt.totalCost.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          data-testid={`button-edit-appointment-${appt.id}`}
                          onClick={() => openEdit(appt)}
                          className="p-1.5 rounded hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          data-testid={`button-delete-appointment-${appt.id}`}
                          onClick={() => deleteMutation.mutate({ id: appt.id })}
                          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-card-border rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">New Appointment</h2>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={createForm.handleSubmit(handleCreate)} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Customer</label>
                  <select data-testid="select-customer" {...createForm.register("customerId")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background">
                    <option value={0}>Select...</option>
                    {customers.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {createForm.formState.errors.customerId && <p className="text-xs text-destructive mt-1">{createForm.formState.errors.customerId.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Vehicle</label>
                  <select data-testid="select-vehicle" {...createForm.register("vehicleId")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background">
                    <option value={0}>Select...</option>
                    {vehicles.data?.map((v) => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Service</label>
                  <select data-testid="select-service" {...createForm.register("serviceId")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background">
                    <option value={0}>Select...</option>
                    {services.data?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Technician</label>
                  <select data-testid="select-technician" {...createForm.register("technicianId")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background">
                    <option value={0}>Select...</option>
                    {technicians.data?.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Date & Time</label>
                <input data-testid="input-scheduled-at" type="datetime-local" {...createForm.register("scheduledAt")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Notes</label>
                <textarea data-testid="input-notes" {...createForm.register("notes")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background resize-none" rows={2} placeholder="Optional notes..." />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
                <button data-testid="button-submit-appointment" type="submit" disabled={createMutation.isPending} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
                  {createMutation.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-card-border rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Update Appointment</h2>
              <button onClick={() => setEditId(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={updateForm.handleSubmit(handleUpdate)} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
                <select data-testid="select-status" {...updateForm.register("status")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background">
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Notes</label>
                <textarea data-testid="input-update-notes" {...updateForm.register("notes")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background resize-none" rows={2} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEditId(null)} className="flex-1 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
                <button data-testid="button-submit-update" type="submit" disabled={updateMutation.isPending} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
                  {updateMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
