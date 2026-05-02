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
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLang, type Lang } from "@/lib/i18n";

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-1 bg-sidebar-accent rounded-lg p-1">
      <button
        data-testid="lang-th"
        onClick={() => setLang("th")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
          lang === "th"
            ? "bg-primary text-primary-foreground shadow"
            : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
        }`}
      >
        🇹🇭 ไทย
      </button>
      <button
        data-testid="lang-en"
        onClick={() => setLang("en")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
          lang === "en"
            ? "bg-primary text-primary-foreground shadow"
            : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLang();

  const navItems = [
    { href: "/", icon: LayoutDashboard, key: "dashboard" as const },
    { href: "/bookings", icon: CalendarCheck, key: "bookings" as const },
    { href: "/repairs", icon: Wrench, key: "repairs" as const },
    { href: "/customers", icon: Users, key: "customers" as const },
    { href: "/vehicles", icon: Car, key: "vehicles" as const },
    { href: "/income", icon: TrendingUp, key: "income" as const },
    { href: "/stock", icon: Package, key: "stock" as const },
    { href: "/history", icon: History, key: "history" as const },
    { href: "/technicians", icon: HardHat, key: "technicians" as const },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-56 bg-sidebar border-r border-sidebar-border transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500 shrink-0 glow-amber">
            <Wrench className="w-4 h-4 text-slate-900" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-sidebar-foreground leading-tight">{t("appName")}</p>
            <p className="text-[10px] text-sidebar-foreground/40 leading-tight truncate">{t("appSub")}</p>
          </div>
          <button
            className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <ul className="space-y-0.5">
            {navItems.map(({ href, icon: Icon, key }) => {
              const active = location === href || (href !== "/" && location.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    data-testid={`nav-${key}`}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active
                        ? "bg-amber-500 text-slate-900 shadow glow-amber"
                        : "text-sidebar-foreground/65 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{t(key)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-3 pb-4 space-y-3">
          <LangToggle />
          <p className="text-[10px] text-sidebar-foreground/30 px-1">AutoPro v1.0</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card sticky top-0 z-30">
          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setMobileOpen(true)}
            className="text-foreground/70 hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center shrink-0">
              <Wrench className="w-3 h-3 text-slate-900" />
            </div>
            <span className="text-sm font-bold truncate">{t("shopName")}</span>
          </div>
          <LangToggle />
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
