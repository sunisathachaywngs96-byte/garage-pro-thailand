import { useState } from "react";
import {
  useListTechnicians,
  useCreateTechnician,
  useUpdateTechnician,
  useDeleteTechnician,
  getListTechniciansQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, HardHat } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(1, "Required"),
  specialty: z.string().min(1, "Required"),
  phone: z.string().min(1, "Required"),
  isAvailable: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function Technicians() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const technicians = useListTechnicians();

  const createMutation = useCreateTechnician({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListTechniciansQueryKey() });
        setShowForm(false);
        form.reset();
        toast({ title: "Technician added" });
      },
      onError: () => toast({ title: "Error adding technician", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateTechnician({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListTechniciansQueryKey() });
        setEditId(null);
        setShowForm(false);
        toast({ title: "Technician updated" });
      },
      onError: () => toast({ title: "Error updating technician", variant: "destructive" }),
    },
  });

  const deleteMutation = useDeleteTechnician({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListTechniciansQueryKey() }),
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", specialty: "", phone: "", isAvailable: true },
  });

  function openCreate() {
    setEditId(null);
    form.reset({ name: "", specialty: "", phone: "", isAvailable: true });
    setShowForm(true);
  }

  function openEdit(t: NonNullable<typeof technicians.data>[0]) {
    setEditId(t.id);
    form.reset({ name: t.name, specialty: t.specialty, phone: t.phone, isAvailable: t.isAvailable });
    setShowForm(true);
  }

  function handleSubmit(data: FormData) {
    if (editId !== null) {
      updateMutation.mutate({ id: editId, data });
    } else {
      createMutation.mutate({ data });
    }
  }

  function toggleAvailability(t: NonNullable<typeof technicians.data>[0]) {
    updateMutation.mutate({ id: t.id, data: { name: t.name, specialty: t.specialty, phone: t.phone, isAvailable: !t.isAvailable } });
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Technicians</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Shop staff roster and availability</p>
        </div>
        <button data-testid="button-create-technician" onClick={openCreate} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Add Technician
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technicians.isLoading ? (
          <div className="col-span-full py-10 text-center text-muted-foreground">Loading...</div>
        ) : !technicians.data?.length ? (
          <div className="col-span-full py-10 text-center text-muted-foreground">No technicians added</div>
        ) : (
          technicians.data.map((t) => (
            <div key={t.id} data-testid={`card-technician-${t.id}`} className="bg-card border border-card-border rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-amber-400">{initials(t.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.specialty}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button data-testid={`button-edit-technician-${t.id}`} onClick={() => openEdit(t)} className="p-1 rounded hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button data-testid={`button-delete-technician-${t.id}`} onClick={() => deleteMutation.mutate({ id: t.id })} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{t.phone}</p>
              <button
                data-testid={`button-toggle-availability-${t.id}`}
                onClick={() => toggleAvailability(t)}
                className={`w-full py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  t.isAvailable
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {t.isAvailable ? "Available" : "Unavailable"} — click to toggle
              </button>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-card-border rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">{editId ? "Edit Technician" : "Add Technician"}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name</label>
                <input data-testid="input-tech-name" {...form.register("name")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background" />
                {form.formState.errors.name && <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Specialty</label>
                <input data-testid="input-tech-specialty" {...form.register("specialty")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background" placeholder="Engine & Drivetrain" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Phone</label>
                <input data-testid="input-tech-phone" {...form.register("phone")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background" placeholder="555-000-0000" />
              </div>
              <div className="flex items-center gap-3">
                <input data-testid="checkbox-is-available" type="checkbox" id="isAvailable" {...form.register("isAvailable")} className="w-4 h-4 accent-primary" />
                <label htmlFor="isAvailable" className="text-sm text-foreground">Currently available</label>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
                <button data-testid="button-submit-technician" type="submit" disabled={isPending} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
                  {isPending ? "Saving..." : editId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
