import { useState } from "react";
import { Pencil, Trash2, X, Wrench } from "lucide-react";
import { useLang } from "@/lib/i18n";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  in_progress: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  completed: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  cancelled: "bg-red-500/15 text-red-400 border border-red-500/20",
};

const initialRepairs = [
  { id: 1, customerName: "Emily Davis", vehicleDescription: "2023 Mercedes C300", serviceName: "Engine Repair", technicianName: "Mike T.", scheduledAt: "2024-06-10T08:00:00Z", status: "in_progress", totalCost: 12500, notes: "Major engine overhaul" },
  { id: 2, customerName: "David Wilson", vehicleDescription: "2019 Ford F-150", serviceName: "Transmission Service", technicianName: "James R.", scheduledAt: "2024-06-12T10:00:00Z", status: "in_progress", totalCost: 8500, notes: "" },
  { id: 3, customerName: "John Smith", vehicleDescription: "2022 Honda Civic", serviceName: "Brake Service", technicianName: "David L.", scheduledAt: "2024-06-14T09:00:00Z", status: "scheduled", totalCost: 3500, notes: "" },
  { id: 4, customerName: "Sarah Johnson", vehicleDescription: "2021 Toyota Camry", serviceName: "Oil Change", technicianName: "Mike T.", scheduledAt: "2024-06-09T14:00:00Z", status: "completed", totalCost: 1500, notes: "Full synthetic oil" },
];

export default function Repairs() {
  const { t, lang } = useLang();
  const [repairs, setRepairs] = useState(initialRepairs);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [updateForm, setUpdateForm] = useState({ status: "in_progress", notes: "" });

  const filteredRepairs = statusFilter 
    ? repairs.filter(r => r.status === statusFilter)
    : repairs;

  function openEdit(repair: typeof repairs[0]) {
    setEditId(repair.id);
    setUpdateForm({ status: repair.status, notes: repair.notes });
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setRepairs(repairs.map(r => r.id === editId ? { ...r, ...updateForm } : r));
    setEditId(null);
  }

  function handleDelete(id: number) {
    setRepairs(repairs.filter(r => r.id !== id));
  }

  const inputCls = "w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1";

  const filters: Array<{ key: string; val: string; label: string }> = [
    { key: "all", val: "", label: t("all") },
    { key: "in_progress", val: "in_progress", label: t("in_progress") },
    { key: "scheduled", val: "scheduled", label: t("scheduled") },
    { key: "completed", val: "completed", label: t("completed") },
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
      {!filteredRepairs.length ? (
        <div className="py-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t("noRepairs")}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRepairs.map((repair) => (
            <div key={repair.id} data-testid={`card-repair-${repair.id}`} className="bg-card border border-card-border rounded-xl p-4 shadow hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{repair.customerName}</p>
                  <p className="text-xs text-muted-foreground truncate">{repair.vehicleDescription}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_COLORS[repair.status] ?? ""}`}>
                  {t(repair.status as any)}
                </span>
              </div>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-foreground/70 font-medium">{t("service")}:</span>
                  <span className="truncate">{repair.serviceName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-foreground/70 font-medium">{t("technician")}:</span>
                  <span className="truncate">{repair.technicianName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-foreground/70 font-medium">{t("dateTime")}:</span>
                  <span>{new Date(repair.scheduledAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US")}</span>
                </div>
                {repair.notes && (
                  <div className="text-xs text-muted-foreground italic mt-2">
                    {repair.notes}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm font-bold text-amber-400">{t("baht")}{repair.totalCost.toLocaleString()}</span>
                <div className="flex items-center gap-1">
                  <button data-testid={`button-edit-repair-${repair.id}`} onClick={() => openEdit(repair)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button data-testid={`button-delete-repair-${repair.id}`} onClick={() => handleDelete(repair.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editId !== null && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-card border border-card-border rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">{t("updateRepair")}</h2>
              <button onClick={() => setEditId(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <div>
                <label className={labelCls}>{t("status")}</label>
                <select data-testid="select-status" value={updateForm.status} onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})} className={inputCls}>
                  <option value="scheduled">{t("scheduled")}</option>
                  <option value="in_progress">{t("in_progress")}</option>
                  <option value="completed">{t("completed")}</option>
                  <option value="cancelled">{t("cancelled")}</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>{t("notes")}</label>
                <textarea value={updateForm.notes} onChange={(e) => setUpdateForm({...updateForm, notes: e.target.value})} className={inputCls + " resize-none"} rows={2} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setEditId(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">{t("cancel")}</button>
                <button type="submit" className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">{t("save")}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
