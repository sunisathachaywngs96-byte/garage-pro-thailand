import { useState } from "react";
import {
  useListCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  getListCustomersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, X, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
});
type FormData = z.infer<typeof schema>;

export default function Customers() {
  const { t, lang } = useLang();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const customers = useListCustomers();
  const createMutation = useCreateCustomer({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListCustomersQueryKey() });
        setModalMode(null);
        form.reset();
        toast({ title: lang === "th" ? "เพิ่มลูกค้าเรียบร้อย" : "Customer added" });
      },
    },
  });
  const updateMutation = useUpdateCustomer({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListCustomersQueryKey() });
        setModalMode(null);
        toast({ title: lang === "th" ? "อัปเดตเรียบร้อย" : "Updated" });
      },
    },
  });
  const deleteMutation = useDeleteCustomer({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListCustomersQueryKey() }),
    },
  });

  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  const filtered = (customers.data ?? []).filter((c) =>
    [c.name, c.email, c.phone].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );

  function openCreate() {
    setEditId(null);
    form.reset({ name: "", email: "", phone: "" });
    setModalMode("create");
  }

  function openEdit(c: NonNullable<typeof customers.data>[0]) {
    setEditId(c.id);
    form.reset({ name: c.name, email: c.email, phone: c.phone ?? "" });
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
          <h1 className="text-xl font-bold text-foreground">{t("customersTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("customersSub")}</p>
        </div>
        <button
          data-testid="button-create-customer"
          onClick={openCreate}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t("addCustomer")}</span>
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

      <div className="bg-card border border-card-border rounded-xl shadow overflow-hidden">
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
              {customers.isLoading ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">{t("loading")}</td></tr>
              ) : !filtered.length ? (
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
                        <button data-testid={`button-delete-customer-${c.id}`} onClick={() => deleteMutation.mutate({ id: c.id })} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-card border border-card-border rounded-xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">{modalMode === "create" ? t("addCustomer") : t("editCustomer")}</h2>
              <button onClick={() => setModalMode(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-5 space-y-4">
              <div>
                <label className={labelCls}>{t("fullName")}</label>
                <input data-testid="input-name" {...form.register("name")} className={inputCls} placeholder={t("required")} />
              </div>
              <div>
                <label className={labelCls}>{t("email")}</label>
                <input data-testid="input-email" type="email" {...form.register("email")} className={inputCls} placeholder="example@email.com" />
              </div>
              <div>
                <label className={labelCls}>{t("phone")}</label>
                <input data-testid="input-phone" {...form.register("phone")} className={inputCls} placeholder="0xx-xxx-xxxx" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModalMode(null)} className="flex-1 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">{t("cancel")}</button>
                <button data-testid="button-submit-customer" type="submit" disabled={isPending} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
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
