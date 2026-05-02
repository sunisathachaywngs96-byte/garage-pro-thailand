import { useState } from "react";
import {
  useListServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  getListServicesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Clock, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  price: z.coerce.number().min(0),
  estimatedDurationMinutes: z.coerce.number().min(1),
});

type FormData = z.infer<typeof schema>;

export default function Services() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const services = useListServices();

  const createMutation = useCreateService({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListServicesQueryKey() });
        setShowForm(false);
        form.reset();
        toast({ title: "Service created" });
      },
      onError: () => toast({ title: "Error creating service", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateService({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListServicesQueryKey() });
        setEditId(null);
        setShowForm(false);
        toast({ title: "Service updated" });
      },
      onError: () => toast({ title: "Error updating service", variant: "destructive" }),
    },
  });

  const deleteMutation = useDeleteService({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListServicesQueryKey() }),
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", price: 0, estimatedDurationMinutes: 30 },
  });

  function openCreate() {
    setEditId(null);
    form.reset({ name: "", description: "", price: 0, estimatedDurationMinutes: 30 });
    setShowForm(true);
  }

  function openEdit(s: NonNullable<typeof services.data>[0]) {
    setEditId(s.id);
    form.reset({ name: s.name, description: s.description, price: s.price, estimatedDurationMinutes: s.estimatedDurationMinutes });
    setShowForm(true);
  }

  function handleSubmit(data: FormData) {
    if (editId !== null) {
      updateMutation.mutate({ id: editId, data });
    } else {
      createMutation.mutate({ data });
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  function formatDuration(mins: number) {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Services</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Service catalog with pricing</p>
        </div>
        <button data-testid="button-create-service" onClick={openCreate} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.isLoading ? (
          <div className="col-span-full py-10 text-center text-muted-foreground">Loading...</div>
        ) : !services.data?.length ? (
          <div className="col-span-full py-10 text-center text-muted-foreground">No services defined</div>
        ) : (
          services.data.map((s) => (
            <div key={s.id} data-testid={`card-service-${s.id}`} className="bg-card border border-card-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-foreground">{s.name}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  <button data-testid={`button-edit-service-${s.id}`} onClick={() => openEdit(s)} className="p-1 rounded hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button data-testid={`button-delete-service-${s.id}`} onClick={() => deleteMutation.mutate({ id: s.id })} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{s.description}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-sm font-bold text-foreground">${s.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{formatDuration(s.estimatedDurationMinutes)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-card-border rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">{editId ? "Edit Service" : "Add Service"}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Service Name</label>
                <input data-testid="input-service-name" {...form.register("name")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background" placeholder="Oil Change" />
                {form.formState.errors.name && <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
                <textarea data-testid="input-service-description" {...form.register("description")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background resize-none" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Price ($)</label>
                  <input data-testid="input-service-price" type="number" step="0.01" {...form.register("price")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Duration (min)</label>
                  <input data-testid="input-service-duration" type="number" {...form.register("estimatedDurationMinutes")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background" />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
                <button data-testid="button-submit-service" type="submit" disabled={isPending} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
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
