import { useState } from "react";
import {
  useListServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  getListServicesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Package, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  durationMinutes: z.coerce.number().min(1),
});
type FormData = z.infer<typeof schema>;

export default function Stock() {
  const { t, lang } = useLang();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const services = useListServices();
  const createMutation = useCreateService({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListServicesQueryKey() });
        setModalMode(null);
        form.reset();
        toast({ title: lang === "th" ? "เพิ่มบริการเรียบร้อย" : "Service added" });
      },
    },
  });
  const updateMutation = useUpdateService({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListServicesQueryKey() });
        setModalMode(null);
        toast({ title: lang === "th" ? "อัปเดตเรียบร้อย" : "Updated" });
      },
    },
  });
  const deleteMutation = useDeleteService({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListServicesQueryKey() }),
    },
  });

  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  function openCreate() {
    setEditId(null);
    form.reset({ name: "", description: "", price: 0, durationMinutes: 60 });
    setModalMode("create");
  }

  function openEdit(s: NonNullable<typeof services.data>[0]) {
    setEditId(s.id);
    form.reset({ name: s.name, description: s.description ?? "", price: s.price, durationMinutes: s.durationMinutes });
    setModalMode("edit");
  }

  function handleSubmit(d: FormData) {
    if (modalMode === "create") createMutation.mutate({ data: d });
    else if (editId) updateMutation.mutate({ id: editId, data: d });
  }

  function fmtDuration(mins: number) {
    if (mins < 60) return `${mins} ${t("minutes")}`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}${t("hours")} ${m}${t("minutes")}` : `${h} ${t("hours")}`;
  }

  const inputCls = "w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1";
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("stockTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("stockSub")}</p>
        </div>
        <button
          data-testid="button-create-service"
          onClick={openCreate}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t("addService")}</span>
        </button>
      </div>

      {services.isLoading ? (
        <div className="py-12 text-center text-muted-foreground">{t("loading")}</div>
      ) : !services.data?.length ? (
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
          {services.data.map((s) => (
            <div key={s.id} data-testid={`card-service-${s.id}`} className="bg-card border border-card-border rounded-xl p-5 shadow hover:shadow-md hover:border-amber-500/30 transition-all group">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                  <Package className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button data-testid={`button-edit-service-${s.id}`} onClick={() => openEdit(s)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button data-testid={`button-delete-service-${s.id}`} onClick={() => deleteMutation.mutate({ id: s.id })} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-card border border-card-border rounded-xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">{modalMode === "create" ? t("addService") : t("editService")}</h2>
              <button onClick={() => setModalMode(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-5 space-y-4">
              <div>
                <label className={labelCls}>{t("serviceName")}</label>
                <input data-testid="input-service-name" {...form.register("name")} className={inputCls} placeholder={t("required")} />
              </div>
              <div>
                <label className={labelCls}>{t("description")}</label>
                <textarea data-testid="input-description" {...form.register("description")} className={inputCls + " resize-none"} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t("price")} ({t("baht")})</label>
                  <input data-testid="input-price" type="number" step="0.01" {...form.register("price")} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t("duration")} ({t("minutes")})</label>
                  <input data-testid="input-duration" type="number" {...form.register("durationMinutes")} className={inputCls} />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModalMode(null)} className="flex-1 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">{t("cancel")}</button>
                <button data-testid="button-submit-service" type="submit" disabled={isPending} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
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
