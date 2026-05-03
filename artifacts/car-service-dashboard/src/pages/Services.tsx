import { useState } from "react";
import { Plus, Pencil, Trash2, X, Package, Clock } from "lucide-react";
import { useLang } from "@/lib/i18n";

const initialServices = [
  { id: 1, name: "Oil Change", description: "Full synthetic oil change with filter replacement", price: 1500, durationMinutes: 45 },
  { id: 2, name: "Brake Service", description: "Brake pad inspection and replacement", price: 3500, durationMinutes: 90 },
  { id: 3, name: "AC Service", description: "Air conditioning system check and recharge", price: 2800, durationMinutes: 60 },
  { id: 4, name: "Engine Repair", description: "Engine diagnostics and repair", price: 8000, durationMinutes: 240 },
  { id: 5, name: "Tire Service", description: "Tire rotation, balancing, and alignment", price: 2200, durationMinutes: 75 },
  { id: 6, name: "Transmission Service", description: "Transmission fluid change and inspection", price: 4500, durationMinutes: 120 },
];

export default function Stock() {
  const { t, lang } = useLang();
  const [services, setServices] = useState(initialServices);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", price: 0, durationMinutes: 60 });

  function openCreate() {
    setEditId(null);
    setFormData({ name: "", description: "", price: 0, durationMinutes: 60 });
    setModalMode("create");
  }

  function openEdit(s: typeof services[0]) {
    setEditId(s.id);
    setFormData({ name: s.name, description: s.description ?? "", price: s.price, durationMinutes: s.durationMinutes });
    setModalMode("edit");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (modalMode === "create") {
      const newService = { id: Math.max(...services.map(s => s.id)) + 1, ...formData };
      setServices([...services, newService]);
    } else if (editId) {
      setServices(services.map(s => s.id === editId ? { ...s, ...formData } : s));
    }
    setModalMode(null);
  }

  function handleDelete(id: number) {
    setServices(services.filter(s => s.id !== id));
  }

  function fmtDuration(mins: number) {
    if (mins < 60) return `${mins} ${t("minutes")}`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}${t("hours")} ${m}${t("minutes")}` : `${h} ${t("hours")}`;
  }

  const inputCls = "w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1";

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("stockTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("stockSub")}</p>
        </div>
        <button
          data-testid="button-create-service"
          onClick={openCreate}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t("addService")}</span>
        </button>
      </div>

      {!services.length ? (
        <div className="py-14 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
              <Package className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t("noServices")}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} data-testid={`card-service-${s.id}`} className="bg-card border border-card-border rounded-xl p-5 shadow hover:shadow-md hover:border-amber-500/30 transition-all group">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                  <Package className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button data-testid={`button-edit-service-${s.id}`} onClick={() => openEdit(s)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button data-testid={`button-delete-service-${s.id}`} onClick={() => handleDelete(s.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{s.name}</h3>
              {s.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{s.description}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xl font-bold text-amber-400">{t("baht")}{s.price.toLocaleString()}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {fmtDuration(s.durationMinutes)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-card border border-card-border rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">{modalMode === "create" ? t("addService") : t("editService")}</h2>
              <button onClick={() => setModalMode(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className={labelCls}>{t("serviceName")}</label>
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputCls} placeholder={t("required")} required />
              </div>
              <div>
                <label className={labelCls}>{t("description")}</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className={inputCls + " resize-none"} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t("price")} ({t("baht")})</label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>{t("duration")} ({t("minutes")})</label>
                  <input type="number" value={formData.durationMinutes} onChange={(e) => setFormData({...formData, durationMinutes: Number(e.target.value)})} className={inputCls} required />
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
