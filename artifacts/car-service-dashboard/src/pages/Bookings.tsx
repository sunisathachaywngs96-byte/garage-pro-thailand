import { useState } from "react";
import { Plus, Pencil, Trash2, X, CalendarDays } from "lucide-react";
import { useLang } from "@/lib/i18n";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  in_progress: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  completed: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  cancelled: "bg-red-500/15 text-red-400 border border-red-500/20",
};

const initialBookings = [
  { id: 1, customerName: "John Smith", vehicleDescription: "2022 Honda Civic", serviceName: "Oil Change", technicianName: "Mike T.", scheduledAt: "2024-06-15T09:00:00Z", status: "scheduled", totalCost: 1500, notes: "" },
  { id: 2, customerName: "Sarah Johnson", vehicleDescription: "2021 Toyota Camry", serviceName: "Brake Service", technicianName: "James R.", scheduledAt: "2024-06-15T11:00:00Z", status: "scheduled", totalCost: 3500, notes: "" },
  { id: 3, customerName: "Michael Brown", vehicleDescription: "2020 BMW X5", serviceName: "AC Service", technicianName: "David L.", scheduledAt: "2024-06-16T10:00:00Z", status: "scheduled", totalCost: 2800, notes: "Customer requests express service" },
];

const mockCustomers = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Sarah Johnson" },
  { id: 3, name: "Michael Brown" },
];

const mockVehicles = [
  { id: 1, year: 2022, make: "Honda", model: "Civic" },
  { id: 2, year: 2021, make: "Toyota", model: "Camry" },
  { id: 3, year: 2020, make: "BMW", model: "X5" },
];

const mockServices = [
  { id: 1, name: "Oil Change", price: 1500 },
  { id: 2, name: "Brake Service", price: 3500 },
  { id: 3, name: "AC Service", price: 2800 },
  { id: 4, name: "Engine Repair", price: 8000 },
];

const mockTechnicians = [
  { id: 1, name: "Mike Thompson" },
  { id: 2, name: "James Rodriguez" },
  { id: 3, name: "David Lee" },
];

export default function Bookings() {
  const { t, lang } = useLang();
  const [bookings, setBookings] = useState(initialBookings);
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [createForm, setCreateForm] = useState({ customerId: 0, vehicleId: 0, serviceId: 0, technicianId: 0, scheduledAt: "", notes: "" });
  const [updateForm, setUpdateForm] = useState({ status: "scheduled", notes: "" });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const customer = mockCustomers.find(c => c.id === createForm.customerId);
    const vehicle = mockVehicles.find(v => v.id === createForm.vehicleId);
    const service = mockServices.find(s => s.id === createForm.serviceId);
    const tech = mockTechnicians.find(t => t.id === createForm.technicianId);
    
    const newBooking = {
      id: Math.max(...bookings.map(b => b.id)) + 1,
      customerName: customer?.name || "",
      vehicleDescription: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "",
      serviceName: service?.name || "",
      technicianName: tech?.name || "",
      scheduledAt: createForm.scheduledAt,
      status: "scheduled",
      totalCost: service?.price || 0,
      notes: createForm.notes,
    };
    setBookings([...bookings, newBooking]);
    setShowCreate(false);
    setCreateForm({ customerId: 0, vehicleId: 0, serviceId: 0, technicianId: 0, scheduledAt: "", notes: "" });
  }

  function openEdit(booking: typeof bookings[0]) {
    setEditId(booking.id);
    setUpdateForm({ status: booking.status, notes: booking.notes });
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setBookings(bookings.map(b => b.id === editId ? { ...b, ...updateForm } : b));
    setEditId(null);
  }

  function handleDelete(id: number) {
    setBookings(bookings.filter(b => b.id !== id));
  }

  const inputCls = "w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1";

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("bookingsTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("bookingsSub")}</p>
        </div>
        <button
          data-testid="button-create-booking"
          onClick={() => setShowCreate(true)}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t("newBooking")}</span>
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {!bookings.length ? (
          <div className="py-14 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">{t("noBookings")}</p>
            </div>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-card border border-card-border rounded-xl p-4 shadow">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground truncate">{booking.customerName}</p>
                  <p className="text-xs text-muted-foreground truncate">{booking.vehicleDescription}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_COLORS[booking.status] ?? ""}`}>
                  {t(booking.status as any)}
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("service")}:</span>
                  <span className="text-foreground">{booking.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("technician")}:</span>
                  <span className="text-foreground">{booking.technicianName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("dateTime")}:</span>
                  <span className="text-foreground">{new Date(booking.scheduledAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US")}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-sm font-bold text-amber-400">{t("baht")}{booking.totalCost.toLocaleString()}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(booking)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(booking.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-card border border-card-border rounded-xl shadow overflow-hidden">
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
              {!bookings.length ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">{t("noBookings")}</td></tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} data-testid={`row-booking-${booking.id}`} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{booking.customerName}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{booking.vehicleDescription}</td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">{booking.serviceName}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{booking.technicianName}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(booking.scheduledAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US")}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[booking.status] ?? ""}`}>
                        {t(booking.status as any)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{t("baht")}{booking.totalCost.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button data-testid={`button-edit-booking-${booking.id}`} onClick={() => openEdit(booking)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button data-testid={`button-delete-booking-${booking.id}`} onClick={() => handleDelete(booking.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-card border border-card-border rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-sm font-semibold text-foreground">{t("newBooking")}</h2>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{t("customers")}</label>
                  <select value={createForm.customerId} onChange={(e) => setCreateForm({...createForm, customerId: Number(e.target.value)})} className={inputCls} required>
                    <option value={0}>{t("selectCustomer")}</option>
                    {mockCustomers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("vehicle")}</label>
                  <select value={createForm.vehicleId} onChange={(e) => setCreateForm({...createForm, vehicleId: Number(e.target.value)})} className={inputCls} required>
                    <option value={0}>{t("selectVehicle")}</option>
                    {mockVehicles.map((v) => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("service")}</label>
                  <select value={createForm.serviceId} onChange={(e) => setCreateForm({...createForm, serviceId: Number(e.target.value)})} className={inputCls} required>
                    <option value={0}>{t("selectService")}</option>
                    {mockServices.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("technician")}</label>
                  <select value={createForm.technicianId} onChange={(e) => setCreateForm({...createForm, technicianId: Number(e.target.value)})} className={inputCls} required>
                    <option value={0}>{t("selectTechnician")}</option>
                    {mockTechnicians.map((t2) => <option key={t2.id} value={t2.id}>{t2.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>{t("dateTime")}</label>
                <input type="datetime-local" value={createForm.scheduledAt} onChange={(e) => setCreateForm({...createForm, scheduledAt: e.target.value})} className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>{t("notes")}</label>
                <textarea value={createForm.notes} onChange={(e) => setCreateForm({...createForm, notes: e.target.value})} className={inputCls + " resize-none"} rows={2} placeholder={t("optionalNotes")} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">{t("cancel")}</button>
                <button type="submit" className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">{t("create")}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
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
                <select value={updateForm.status} onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})} className={inputCls}>
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
