import { useState } from "react";
import {
  useListTechnicians,
  useCreateTechnician,
  useUpdateTechnician,
  useDeleteTechnician,
  getListTechniciansQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, HardHat } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";

const schema = z.object({
  name: z.string().min(1),
  specialty: z.string().optional(),
  phone: z.string().optional(),
  isAvailable: z.boolean().default(true),
});
type FormData = z.infer<typeof schema>;

export default function Technicians() {
  const { t, lang } = useLang();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const technicians = useListTechnicians();
  const createMutation = useCreateTechnician({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListTechniciansQueryKey() });
        setModalMode(null);
        form.reset();
        toast({ title: lang === "th" ? "เพิ่มช่างเรียบร้อย" : "Technician added" });
      },
    },
  });
  const updateMutation = useUpdateTechnician({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListTechniciansQueryKey() });
        setModalMode(null);
        toast({ title: lang === "th" ? "อัปเดตเรียบร้อย" : "Updated" });
      },
    },
  });
  const deleteMutation = useDeleteTechnician({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListTechniciansQueryKey() }),
    },
  });

  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { isAvailable: true } });

  function openCreate() {
    setEditId(null);
    form.reset({ name: "", specialty: "", phone: "", isAvailable: true });
    setModalMode("create");
  }

  function openEdit(tech: NonNullable<typeof technicians.data>[0]) {
    setEditId(tech.id);
    form.reset({ name: tech.name, specialty: tech.specialty ?? "", phone: tech.phone ?? "", isAvailable: tech.isAvailable });
    setModalMode("edit");
  }

  function handleSubmit(d: FormData) {
    if (modalMode === "create") createMutation.mutate({ data: d });
    else if (editId) updateMutation.mutate({ id: editId, data: d });
  }

  function toggleAvailability(tech: NonNullable<typeof technicians.data>[0]) {
    updateMutation.mutate({ id: tech.id, data: { isAvailable: !tech.isAvailable } });
  }

  const inputCls = "w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1";
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("techniciansTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("techniciansSub")}</p>
        </div>
        <button
          data-testid="button-create-technician"
          onClick={openCreate}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t("addTechnician")}</span>
        </button>
      </div>

      {technicians.isLoading ? (
        <div className="py-12 text-center text-muted-foreground">{t("loading")}</div>
      ) : !technicians.data?.length ? (
        <div className="py-14 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
              <HardHat className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t("noTechnicians")}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {technicians.data.map((tech) => (
            <div key={tech.id} data-testid={`card-technician-${tech.id}`} className="bg-card border border-card-border rounded-xl p-5 shadow hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${tech.isAvailable ? "bg-emerald-500/15 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                    {tech.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{tech.name}</p>
                    {tech.specialty && <p className="text-xs text-muted-foreground">{tech.specialty}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button data-testid={`button-edit-technician-${tech.id}`} onClick={() => openEdit(tech)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button data-testid={`button-delete-technician-${tech.id}`} onClick={() => deleteMutation.mutate({ id: tech.id })} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {tech.phone && <p className="text-xs text-muted-foreground mb-3">{tech.phone}</p>}

              <button
                data-testid={`button-toggle-availability-${tech.id}`}
                onClick={() => toggleAvailability(tech)}
                title={t("toggleAvailability")}
                className={`w-full py-2 rounded-lg text-xs font-semibold border transition-all ${
                  tech.isAvailable
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20"
                    : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${tech.isAvailable ? "bg-emerald-400" : "bg-muted-foreground"}`} />
                {tech.isAvailable ? t("available") : t("unavailable")}
              </button>
            </div>
          ))}
        </div>
      )}

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-card border border-card-border rounded-xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">{modalMode === "create" ? t("addTechnician") : t("editTechnician")}</h2>
              <button onClick={() => setModalMode(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-5 space-y-4">
              <div>
                <label className={labelCls}>{t("fullName")}</label>
                <input data-testid="input-tech-name" {...form.register("name")} className={inputCls} placeholder={t("required")} />
              </div>
              <div>
                <label className={labelCls}>{t("specialty")}</label>
                <input data-testid="input-specialty" {...form.register("specialty")} className={inputCls} placeholder={lang === "th" ? "เช่น เครื่องยนต์, ไฟฟ้า" : "e.g. Engine, Electrical"} />
              </div>
              <div>
                <label className={labelCls}>{t("phone")}</label>
                <input data-testid="input-tech-phone" {...form.register("phone")} className={inputCls} placeholder="0xx-xxx-xxxx" />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input data-testid="input-available" type="checkbox" {...form.register("isAvailable")} className="sr-only peer" />
                  <div className="w-9 h-5 rounded-full bg-muted peer-checked:bg-emerald-500 transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-all peer-checked:translate-x-4" />
                </div>
                <span className="text-sm text-foreground">{t("available")}</span>
              </label>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModalMode(null)} className="flex-1 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">{t("cancel")}</button>
                <button data-testid="button-submit-technician" type="submit" disabled={isPending} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
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
