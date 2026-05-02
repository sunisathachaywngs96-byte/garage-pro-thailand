import { useState } from "react";
import {
  useListVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useListCustomers,
  getListVehiclesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, X, Car } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";

const schema = z.object({
  customerId: z.coerce.number().min(1),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.coerce.number().min(1900).max(2100),
  licensePlate: z.string().min(1),
  color: z.string().optional(),
  mileage: z.coerce.number().optional(),
});
type FormData = z.infer<typeof schema>;

const COLOR_SWATCHES: Record<string, string> = {
  Black: "#1a1a1a", White: "#f5f5f5", Silver: "#a0a0a0", Gray: "#6b7280",
  Red: "#ef4444", Blue: "#3b82f6", Green: "#22c55e", Yellow: "#eab308",
  Orange: "#f97316", Brown: "#92400e", Beige: "#d4c5a9",
};

export default function Vehicles() {
  const { t, lang } = useLang();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const vehicles = useListVehicles();
  const customers = useListCustomers();

  const createMutation = useCreateVehicle({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
        setModalMode(null);
        form.reset();
        toast({ title: lang === "th" ? "เพิ่มยานพาหนะเรียบร้อย" : "Vehicle added" });
      },
    },
  });
  const updateMutation = useUpdateVehicle({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
        setModalMode(null);
        toast({ title: lang === "th" ? "อัปเดตเรียบร้อย" : "Updated" });
      },
    },
  });
  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  function openCreate() {
    setEditId(null);
    form.reset({ customerId: 0, make: "", model: "", year: new Date().getFullYear(), licensePlate: "", color: "", mileage: 0 });
    setModalMode("create");
  }

  function openEdit(v: NonNullable<typeof vehicles.data>[0]) {
    setEditId(v.id);
    form.reset({ customerId: v.customerId, make: v.make, model: v.model, year: v.year, licensePlate: v.licensePlate, color: v.color ?? "", mileage: v.mileage ?? 0 });
    setModalMode("edit");
  }

  function handleSubmit(d: FormData) {
    if (modalMode === "create") createMutation.mutate({ data: d });
    else if (editId) updateMutation.mutate({ id: editId, data: d });
  }

  const inputCls = "w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1";
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("vehiclesTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("vehiclesSub")}</p>
        </div>
        <button
          data-testid="button-create-vehicle"
          onClick={openCreate}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t("addVehicle")}</span>
        </button>
      </div>

      <div className="bg-card border border-card-border rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[t("vehicle"), t("plate"), t("color"), t("mileage"), t("owner"), ""].map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vehicles.isLoading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">{t("loading")}</td></tr>
              ) : !vehicles.data?.length ? (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                        <Car className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">{t("noVehicles")}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                vehicles.data.map((v) => {
                  const owner = customers.data?.find((c) => c.id === v.customerId);
                  const swatch = COLOR_SWATCHES[v.color ?? ""] ?? "#6b7280";
                  return (
                    <tr key={v.id} data-testid={`row-vehicle-${v.id}`} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                            <Car className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{v.year} {v.make} {v.model}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-amber-400 bg-amber-500/5 rounded">
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">{v.licensePlate}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full border border-white/20" style={{ background: swatch }} />
                          <span className="text-muted-foreground text-xs">{v.color ?? "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{v.mileage ? `${v.mileage.toLocaleString()} ${t("miles")}` : "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{owner?.name ?? "—"}</td>
                      <td className="px-4 py-3">
                        <button data-testid={`button-edit-vehicle-${v.id}`} onClick={() => openEdit(v)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-card border border-card-border rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-sm font-semibold text-foreground">{modalMode === "create" ? t("addVehicle") : t("editVehicle")}</h2>
              <button onClick={() => setModalMode(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-5 space-y-4">
              <div>
                <label className={labelCls}>{t("customer")}</label>
                <select data-testid="select-customer" {...form.register("customerId")} className={inputCls}>
                  <option value={0}>{t("selectCustomer")}</option>
                  {customers.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t("make")}</label>
                  <input data-testid="input-make" {...form.register("make")} className={inputCls} placeholder="Toyota" />
                </div>
                <div>
                  <label className={labelCls}>{t("model")}</label>
                  <input data-testid="input-model" {...form.register("model")} className={inputCls} placeholder="Camry" />
                </div>
                <div>
                  <label className={labelCls}>{t("year")}</label>
                  <input data-testid="input-year" type="number" {...form.register("year")} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t("plate")}</label>
                  <input data-testid="input-plate" {...form.register("licensePlate")} className={inputCls} placeholder="กข 1234" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t("color")}</label>
                  <select data-testid="select-color" {...form.register("color")} className={inputCls}>
                    <option value="">—</option>
                    {Object.keys(COLOR_SWATCHES).map((col) => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("mileage")}</label>
                  <input data-testid="input-mileage" type="number" {...form.register("mileage")} className={inputCls} placeholder="0" />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModalMode(null)} className="flex-1 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">{t("cancel")}</button>
                <button data-testid="button-submit-vehicle" type="submit" disabled={isPending} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
                  {isPending ? t("saving") : modalMode === "create" ? t("add") : t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
