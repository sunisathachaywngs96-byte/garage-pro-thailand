import { useState } from "react";
import { Plus, Pencil, X, Car } from "lucide-react";
import { useLang } from "@/lib/i18n";

const COLOR_SWATCHES: Record<string, string> = {
  Black: "#1a1a1a", White: "#f5f5f5", Silver: "#a0a0a0", Gray: "#6b7280",
  Red: "#ef4444", Blue: "#3b82f6", Green: "#22c55e", Yellow: "#eab308",
  Orange: "#f97316", Brown: "#92400e", Beige: "#d4c5a9",
};

const mockCustomers = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Sarah Johnson" },
  { id: 3, name: "Michael Brown" },
  { id: 4, name: "Emily Davis" },
  { id: 5, name: "David Wilson" },
];

const initialVehicles = [
  { id: 1, customerId: 1, make: "Honda", model: "Civic", year: 2022, licensePlate: "กข 1234", color: "White", mileage: 25000 },
  { id: 2, customerId: 2, make: "Toyota", model: "Camry", year: 2021, licensePlate: "กค 5678", color: "Black", mileage: 42000 },
  { id: 3, customerId: 3, make: "BMW", model: "X5", year: 2020, licensePlate: "กง 9012", color: "Blue", mileage: 55000 },
  { id: 4, customerId: 4, make: "Mercedes", model: "C300", year: 2023, licensePlate: "กจ 3456", color: "Silver", mileage: 12000 },
  { id: 5, customerId: 5, make: "Ford", model: "F-150", year: 2019, licensePlate: "กฉ 7890", color: "Red", mileage: 68000 },
];

export default function Vehicles() {
  const { t, lang } = useLang();
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    customerId: 0, make: "", model: "", year: new Date().getFullYear(), 
    licensePlate: "", color: "", mileage: 0 
  });

  function openCreate() {
    setEditId(null);
    setFormData({ customerId: 0, make: "", model: "", year: new Date().getFullYear(), licensePlate: "", color: "", mileage: 0 });
    setModalMode("create");
  }

  function openEdit(v: typeof vehicles[0]) {
    setEditId(v.id);
    setFormData({ customerId: v.customerId, make: v.make, model: v.model, year: v.year, licensePlate: v.licensePlate, color: v.color ?? "", mileage: v.mileage ?? 0 });
    setModalMode("edit");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (modalMode === "create") {
      const newVehicle = { id: Math.max(...vehicles.map(v => v.id)) + 1, ...formData };
      setVehicles([...vehicles, newVehicle]);
    } else if (editId) {
      setVehicles(vehicles.map(v => v.id === editId ? { ...v, ...formData } : v));
    }
    setModalMode(null);
  }

  const inputCls = "w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1";

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("vehiclesTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("vehiclesSub")}</p>
        </div>
        <button
          data-testid="button-create-vehicle"
          onClick={openCreate}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t("addVehicle")}</span>
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {!vehicles.length ? (
          <div className="py-14 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                <Car className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">{t("noVehicles")}</p>
            </div>
          </div>
        ) : (
          vehicles.map((v) => {
            const owner = mockCustomers.find(c => c.id === v.customerId);
            const swatch = COLOR_SWATCHES[v.color ?? ""] ?? "#6b7280";
            return (
              <div key={v.id} className="bg-card border border-card-border rounded-xl p-4 shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Car className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{v.year} {v.make} {v.model}</p>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs">{v.licensePlate}</span>
                    </div>
                  </div>
                  <button onClick={() => openEdit(v)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{ background: swatch }} />
                    <span className="text-muted-foreground">{v.color || "—"}</span>
                  </div>
                  <div className="text-muted-foreground">{v.mileage?.toLocaleString()} {t("miles")}</div>
                  <div className="text-muted-foreground truncate">{owner?.name || "—"}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-card border border-card-border rounded-xl shadow overflow-hidden">
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
              {!vehicles.length ? (
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
                vehicles.map((v) => {
                  const owner = mockCustomers.find(c => c.id === v.customerId);
                  const swatch = COLOR_SWATCHES[v.color ?? ""] ?? "#6b7280";
                  return (
                    <tr key={v.id} data-testid={`row-vehicle-${v.id}`} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                            <Car className="w-4 h-4 text-blue-400" />
                          </div>
                          <p className="font-medium text-foreground">{v.year} {v.make} {v.model}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 font-mono text-xs text-amber-400">{v.licensePlate}</span>
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-card border border-card-border rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-sm font-semibold text-foreground">{modalMode === "create" ? t("addVehicle") : t("editVehicle")}</h2>
              <button onClick={() => setModalMode(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className={labelCls}>{t("customer")}</label>
                <select value={formData.customerId} onChange={(e) => setFormData({...formData, customerId: Number(e.target.value)})} className={inputCls} required>
                  <option value={0}>{t("selectCustomer")}</option>
                  {mockCustomers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t("make")}</label>
                  <input value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} className={inputCls} placeholder="Toyota" required />
                </div>
                <div>
                  <label className={labelCls}>{t("model")}</label>
                  <input value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} className={inputCls} placeholder="Camry" required />
                </div>
                <div>
                  <label className={labelCls}>{t("year")}</label>
                  <input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: Number(e.target.value)})} className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>{t("plate")}</label>
                  <input value={formData.licensePlate} onChange={(e) => setFormData({...formData, licensePlate: e.target.value})} className={inputCls} placeholder="กข 1234" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t("color")}</label>
                  <select value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className={inputCls}>
                    <option value="">—</option>
                    {Object.keys(COLOR_SWATCHES).map((col) => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("mileage")}</label>
                  <input type="number" value={formData.mileage} onChange={(e) => setFormData({...formData, mileage: Number(e.target.value)})} className={inputCls} placeholder="0" />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModalMode(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">{t("cancel")}</button>
                <button type="submit" className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                  {modalMode === "create" ? t("add") : t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
