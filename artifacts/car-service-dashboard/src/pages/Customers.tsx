import { useState } from "react";
import { Plus, Pencil, Trash2, Search, X, User } from "lucide-react";
import { useLang } from "@/lib/i18n";

// Mock data
const initialCustomers = [
  { id: 1, name: "John Smith", email: "john.smith@email.com", phone: "081-234-5678", createdAt: "2024-01-15T10:00:00Z" },
  { id: 2, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "082-345-6789", createdAt: "2024-02-20T14:30:00Z" },
  { id: 3, name: "Michael Brown", email: "m.brown@email.com", phone: "083-456-7890", createdAt: "2024-03-10T09:15:00Z" },
  { id: 4, name: "Emily Davis", email: "emily.d@email.com", phone: "084-567-8901", createdAt: "2024-04-05T16:45:00Z" },
  { id: 5, name: "David Wilson", email: "d.wilson@email.com", phone: "085-678-9012", createdAt: "2024-05-22T11:00:00Z" },
];

export default function Customers() {
  const { t, lang } = useLang();
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const filtered = customers.filter((c) =>
    [c.name, c.email, c.phone].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );

  function openCreate() {
    setEditId(null);
    setFormData({ name: "", email: "", phone: "" });
    setModalMode("create");
  }

  function openEdit(c: typeof customers[0]) {
    setEditId(c.id);
    setFormData({ name: c.name, email: c.email, phone: c.phone ?? "" });
    setModalMode("edit");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (modalMode === "create") {
      const newCustomer = {
        id: Math.max(...customers.map(c => c.id)) + 1,
        ...formData,
        createdAt: new Date().toISOString()
      };
      setCustomers([...customers, newCustomer]);
    } else if (editId) {
      setCustomers(customers.map(c => c.id === editId ? { ...c, ...formData } : c));
    }
    setModalMode(null);
  }

  function handleDelete(id: number) {
    setCustomers(customers.filter(c => c.id !== id));
  }

  const inputCls = "w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1";

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("customersTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("customersSub")}</p>
        </div>
        <button
          data-testid="button-create-customer"
          onClick={openCreate}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t("addCustomer")}</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          data-testid="input-search"
          type="search"
          placeholder={t("searchCustomers")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-input rounded-lg pl-9 pr-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {!filtered.length ? (
          <div className="py-14 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">{t("noCustomers")}</p>
            </div>
          </div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="bg-card border border-card-border rounded-xl p-4 shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 font-semibold text-sm shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">{t("phone")}: </span>
                  <span className="text-foreground">{c.phone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("memberSince")}: </span>
                  <span className="text-foreground">{new Date(c.createdAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US")}</span>
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
                {[t("fullName"), t("email"), t("phone"), t("memberSince"), ""].map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!filtered.length ? (
                <tr>
                  <td colSpan={5} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">{t("noCustomers")}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} data-testid={`row-customer-${c.id}`} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 font-semibold text-xs shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{c.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US")}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button data-testid={`button-edit-customer-${c.id}`} onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button data-testid={`button-delete-customer-${c.id}`} onClick={() => handleDelete(c.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
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

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-card border border-card-border rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-sm max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-sm font-semibold text-foreground">{modalMode === "create" ? t("addCustomer") : t("editCustomer")}</h2>
              <button onClick={() => setModalMode(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className={labelCls}>{t("fullName")}</label>
                <input 
                  data-testid="input-name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={inputCls} 
                  placeholder={t("required")} 
                  required
                />
              </div>
              <div>
                <label className={labelCls}>{t("email")}</label>
                <input 
                  data-testid="input-email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={inputCls} 
                  placeholder="example@email.com" 
                  required
                />
              </div>
              <div>
                <label className={labelCls}>{t("phone")}</label>
                <input 
                  data-testid="input-phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={inputCls} 
                  placeholder="0xx-xxx-xxxx" 
                  required
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModalMode(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">{t("cancel")}</button>
                <button data-testid="button-submit-customer" type="submit" className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
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
