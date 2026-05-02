import { useState } from "react";
import {
  useListVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useListCustomers,
  getListVehiclesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  customerId: z.coerce.number().min(1, "Required"),
  make: z.string().min(1, "Required"),
  model: z.string().min(1, "Required"),
  year: z.coerce.number().min(1900).max(2030),
  licensePlate: z.string().min(1, "Required"),
  color: z.string().min(1, "Required"),
  mileage: z.coerce.number().min(0),
});

type FormData = z.infer<typeof schema>;

const COLOR_DOTS: Record<string, string> = {
  Silver: "bg-gray-400",
  Blue: "bg-blue-500",
  Black: "bg-gray-900",
  White: "bg-gray-100 border border-gray-300",
  Red: "bg-red-500",
  Gray: "bg-gray-500",
  Green: "bg-green-600",
};

export default function Vehicles() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const vehicles = useListVehicles();
  const customers = useListCustomers();

  const createMutation = useCreateVehicle({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
        setShowForm(false);
        form.reset();
        toast({ title: "Vehicle added" });
      },
      onError: () => toast({ title: "Error adding vehicle", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateVehicle({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
        setEditId(null);
        setShowForm(false);
        toast({ title: "Vehicle updated" });
      },
      onError: () => toast({ title: "Error updating vehicle", variant: "destructive" }),
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { customerId: 0, make: "", model: "", year: new Date().getFullYear(), licensePlate: "", color: "", mileage: 0 },
  });

  function openCreate() {
    setEditId(null);
    form.reset({ customerId: 0, make: "", model: "", year: new Date().getFullYear(), licensePlate: "", color: "", mileage: 0 });
    setShowForm(true);
  }

  function openEdit(v: NonNullable<typeof vehicles.data>[0]) {
    setEditId(v.id);
    form.reset({ customerId: v.customerId, make: v.make, model: v.model, year: v.year, licensePlate: v.licensePlate, color: v.color, mileage: v.mileage });
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

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Vehicles</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Vehicle registry with customer links</p>
        </div>
        <button data-testid="button-create-vehicle" onClick={openCreate} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Vehicle</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Plate</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Color</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Mileage</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Customer</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vehicles.isLoading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Loading...</td></tr>
              ) : !vehicles.data?.length ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No vehicles registered</td></tr>
              ) : (
                vehicles.data.map((v) => (
                  <tr key={v.id} data-testid={`row-vehicle-${v.id}`} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{v.year} {v.make} {v.model}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-muted rounded text-xs font-mono text-foreground">{v.licensePlate}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${COLOR_DOTS[v.color] ?? "bg-muted-foreground"}`} />
                        <span className="text-muted-foreground">{v.color}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{v.mileage.toLocaleString()} mi</td>
                    <td className="px-4 py-3 text-foreground">{v.customerName}</td>
                    <td className="px-4 py-3">
                      <button data-testid={`button-edit-vehicle-${v.id}`} onClick={() => openEdit(v)} className="p-1.5 rounded hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-card-border rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">{editId ? "Edit Vehicle" : "Add Vehicle"}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Customer</label>
                <select data-testid="select-customer" {...form.register("customerId")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background">
                  <option value={0}>Select customer...</option>
                  {customers.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Make</label>
                  <input data-testid="input-make" {...form.register("make")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background" placeholder="Toyota" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Model</label>
                  <input data-testid="input-model" {...form.register("model")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background" placeholder="Camry" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Year</label>
                  <input data-testid="input-year" type="number" {...form.register("year")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">License Plate</label>
                  <input data-testid="input-license-plate" {...form.register("licensePlate")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background font-mono" placeholder="ABC-1234" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Color</label>
                  <input data-testid="input-color" {...form.register("color")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background" placeholder="Silver" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Mileage</label>
                  <input data-testid="input-mileage" type="number" {...form.register("mileage")} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background" />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
                <button data-testid="button-submit-vehicle" type="submit" disabled={isPending} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
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
