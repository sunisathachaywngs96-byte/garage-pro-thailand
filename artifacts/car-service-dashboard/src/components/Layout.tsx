import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Car,
  Wrench,
  HardHat,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/appointments", icon: Calendar, label: "Appointments" },
  { href: "/customers", icon: Users, label: "Customers" },
  { href: "/vehicles", icon: Car, label: "Vehicles" },
  { href: "/services", icon: Wrench, label: "Services" },
  { href: "/technicians", icon: HardHat, label: "Technicians" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-60 bg-sidebar border-r border-sidebar-border transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500">
            <Wrench className="w-4 h-4 text-slate-900" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-sidebar-foreground leading-tight">AutoPro</p>
            <p className="text-xs text-sidebar-foreground/50 leading-tight">Service Center</p>
          </div>
          <button
            className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-0.5">
            {navItems.map(({ href, icon: Icon, label }) => {
              const active = location === href || (href !== "/" && location.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    data-testid={`nav-${label.toLowerCase()}`}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? "bg-amber-500 text-slate-900"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-5 py-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/40">AutoPro v1.0</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setMobileOpen(true)}
            className="text-foreground/70 hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center">
              <Wrench className="w-3 h-3 text-slate-900" />
            </div>
            <span className="text-sm font-bold">AutoPro Service Center</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
