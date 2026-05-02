import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { promptInstall, isStandalone } from "@/lib/pwa";
import { useLang } from "@/lib/i18n";

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const { lang } = useLang();

  useEffect(() => {
    if (isStandalone()) return;
    const dismissed = sessionStorage.getItem("pwa-prompt-dismissed");
    if (dismissed) return;

    const show = () => setVisible(true);
    document.addEventListener("pwa-installable", show);
    return () => document.removeEventListener("pwa-installable", show);
  }, []);

  async function handleInstall() {
    const result = await promptInstall();
    if (result === "accepted" || result === "dismissed") setVisible(false);
  }

  function dismiss() {
    sessionStorage.setItem("pwa-prompt-dismissed", "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          className="fixed bottom-24 lg:bottom-6 inset-x-4 lg:left-auto lg:right-6 lg:w-80 z-50"
        >
          <div className="bg-card border border-amber-500/30 rounded-2xl shadow-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-slate-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {lang === "th" ? "ติดตั้งแอป" : "Install App"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                {lang === "th" ? "เพิ่มไปยังหน้าจอหลักเพื่อใช้งานออฟไลน์" : "Add to home screen for offline use"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={handleInstall}
                className="px-3 py-1.5 bg-amber-500 text-slate-900 rounded-lg text-xs font-bold hover:bg-amber-400 transition-colors"
              >
                {lang === "th" ? "ติดตั้ง" : "Install"}
              </button>
              <button onClick={dismiss} className="p-1 text-muted-foreground hover:text-foreground transition-colors mx-auto">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
