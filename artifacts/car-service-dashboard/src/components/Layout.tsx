import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  TrendingUp,
  Package,
  History,
  CalendarCheck,
  HardHat,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang, type TranslationKey } from "@/lib/i18n";

function LangToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex items-center gap-1 bg-sidebar-accent rounded-lg p-1 ${compact ? "scale-90" : ""}`}>
      <button
        data-testid="lang-th"
        onClick={() => setLang("th")}
        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
          lang === "th"
            ? "bg-primary text-primary-foreground shadow"
            : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
        }`}
      >
        <span className={compact ? "hidden" : ""}>TH</span>
        {!compact && <span>ไทย</span>}
        {compact && "TH"}
      </button>
      <button
        data-testid="lang-en"
        onClick={() => setLang("en")}
        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
          lang === "en"
            ? "bg-primary text-primary-foreground shadow"
            : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
}

const navItems: { href: string; icon: React.ElementType; key: TranslationKey; bottomNav?: boolean }[] = [
  { href: "/", icon: LayoutDashboard, key: "dashboard", bottomNav: true },
  { href: "/bookings", icon: CalendarCheck, key: "bookings", bottomNav: true },
  { href: "/repairs", icon: Wrench, key: "repairs", bottomNav: true },
  { href: "/customers", icon: Users, key: "customers", bottomNav: true },
  { href: "/vehicles", icon: Car, key: "vehicles", bottomNav: false },
  { href: "/income", icon: TrendingUp, key: "income", bottomNav: true },
  { href: "/stock", icon: Package, key: "stock", bottomNav: false },
  { href: "/history", icon: History, key: "history", bottomNav: false },
  { href: "/technicians", icon: HardHat, key: "technicians", bottomNav: false },
];

// Show first 5 items in bottom nav on mobile
const bottomNavItems = navItems.filter((n) => n.bottomNav).slice(0, 5);

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useLang();

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [location]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  function isActive(href: string) {
    return location === href || (href !== "/" && location.startsWith(href));
  }

  // Find current page title
  const currentPage = navItems.find(n => isActive(n.href));

  return (
    <div className="flex min-h-svh min-h-screen bg-background">

      {/* SIDEBAR (lg+) */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 fixed inset-y-0 left-0 bg-sidebar border-r border-sidebar-border z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500 shrink-0">
            <Wrench className="w-4 h-4 text-slate-900" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-sidebar-foreground leading-tight">{t("appName")}</p>
            <p className="text-[10px] text-sidebar-foreground/40 leading-tight">{t("appSub")}</p>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <ul className="space-y-0.5">
            {navItems.map(({ href, icon: Icon, key }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active
                        ? "bg-amber-500 text-slate-900 shadow"
                        : "text-sidebar-foreground/65 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{t(key)}</span>
                    {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="px-3 pb-4 space-y-3 border-t border-sidebar-border pt-3">
          <LangToggle />
          <p className="text-[10px] text-sidebar-foreground/30 px-1">AutoPro v1.0</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-56">

        {/* Mobile/Tablet top header */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center gap-2 px-3 py-2.5 bg-sidebar/95 backdrop-blur-md border-b border-sidebar-border safe-top">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
              <Wrench className="w-3.5 h-3.5 text-slate-900" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-bold text-foreground truncate block">
                {currentPage ? t(currentPage.key) : t("appName")}
              </span>
            </div>
          </div>
          <LangToggle compact />
          {/* More menu button */}
          <button
            data-testid="mobile-more-btn"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/80 transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* BOTTOM NAV (mobile + tablet) */}
      <nav 
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-sidebar/98 backdrop-blur-lg border-t border-sidebar-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch h-14">
          {bottomNavItems.map(({ href, icon: Icon, key }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                data-testid={`bottom-nav-${key}`}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors active:bg-sidebar-accent/50"
              >
                {active && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute top-0 inset-x-3 h-[3px] rounded-b-full bg-amber-500"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <motion.div
                  animate={{ scale: active ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${active ? "text-amber-500" : "text-sidebar-foreground/50"}`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </motion.div>
                <span className={`text-[10px] font-medium transition-colors leading-none ${active ? "text-amber-500" : "text-sidebar-foreground/50"}`}>
                  {t(key)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* SLIDE-UP DRAWER (more pages on mobile) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 38 }}
              className="fixed bottom-0 inset-x-0 z-50 bg-sidebar rounded-t-2xl border-t border-sidebar-border shadow-2xl lg:hidden overflow-hidden"
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-sidebar-foreground/20" />
              </div>
              
              <div className="px-4 pb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t("stock")}</p>
                
                {/* Navigation grid */}
                <div className="grid grid-cols-4 gap-2">
                  {navItems.map(({ href, icon: Icon, key }) => {
                    const active = isActive(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all active:scale-95 ${
                          active
                            ? "bg-amber-500/15 border border-amber-500/30"
                            : "bg-sidebar-accent hover:bg-sidebar-accent/80"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${active ? "text-amber-400" : "text-sidebar-foreground/70"}`} />
                        <span className={`text-[10px] font-medium text-center leading-tight ${active ? "text-amber-400" : "text-sidebar-foreground/70"}`}>{t(key)}</span>
                      </Link>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-3 border-t border-sidebar-border flex items-center justify-between">
                  <LangToggle />
                  <p className="text-[10px] text-muted-foreground">AutoPro v1.0</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
