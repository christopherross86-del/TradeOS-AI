"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  MessageSquare,
  LayoutDashboard, 
  Users, 
  Phone, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  UserCheck,
  ChevronRight,
  Bell,
  Search,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "AI Employees", href: "/dashboard/employees", icon: <UserCheck className="w-4 h-4" /> },
    { name: "Customers", href: "/dashboard/customers", icon: <Users className="w-4 h-4" /> },
    { name: "Appointments", href: "/dashboard/appointments", icon: <Calendar className="w-4 h-4" /> },
    { name: "Invoices", href: "/dashboard/invoices", icon: <FileText className="w-4 h-4" /> },
    { name: "Command Center", href: "/dashboard/chat", icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const activeItem = navItems.find(item => item.href === pathname || (item.href !== "/dashboard" && pathname.startsWith(item.href)));

  return (
    <div className="flex h-screen bg-[rgb(var(--accent))]">
      {/* Sidebar */}
      <aside className="w-64 bg-[rgb(var(--background))] border-r border-[rgb(var(--border))] hidden md:flex flex-col z-30 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-[rgb(var(--border))]">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[rgb(var(--primary))] flex items-center justify-center text-white shadow-lg shadow-indigo-200 transition-transform group-hover:scale-105">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-[rgb(var(--foreground))]">OperatorAI</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-between py-6 px-3">
          <nav className="space-y-1">
            <div className="px-3 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted-foreground))] opacity-60">Main Menu</p>
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between group px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                      : "text-[rgb(var(--muted-foreground))] hover:bg-indigo-50/50 hover:text-indigo-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.name}
                  </div>
                  {isActive && <ChevronRight className="w-3 h-3 opacity-70" />}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-1">
            <div className="px-3 mb-2 mt-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted-foreground))] opacity-60">Configuration</p>
            </div>
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-200",
                pathname === "/dashboard/settings"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "text-[rgb(var(--muted-foreground))] hover:bg-indigo-50/50 hover:text-indigo-600"
              )}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>
        
        <div className="p-4 border-t border-[rgb(var(--border))]">
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-[rgb(var(--muted))] border border-[rgb(var(--border))] transition-colors hover:bg-zinc-200/50">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs border border-indigo-400 shadow-sm shrink-0">
              JD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-[rgb(var(--foreground))] truncate">John Doe</p>
              <p className="text-[10px] text-[rgb(var(--muted-foreground))] font-medium truncate">Professional Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 glass sticky top-0 z-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[rgb(var(--muted-foreground))]">
              <span className="hover:text-indigo-600 cursor-pointer">Dashboard</span>
              <ChevronRight className="w-3 h-3 opacity-30" />
              <span className="text-[rgb(var(--foreground))] capitalize">{activeItem?.name || "Overview"}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center relative group">
              <Search className="w-4 h-4 absolute left-3 text-[rgb(var(--muted-foreground))] group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search commands..." 
                className="pl-10 pr-4 py-1.5 bg-[rgb(var(--muted))] border-transparent focus:border-indigo-200 focus:bg-white focus:ring-4 focus:ring-indigo-50 rounded-full text-xs w-64 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-[rgb(var(--muted-foreground))] hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-all relative group">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[rgb(var(--error))] rounded-full border border-white group-hover:scale-125 transition-transform"></span>
              </button>
              
              <div className="h-6 w-px bg-[rgb(var(--border))] mx-1"></div>
              
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-indigo-200">
                    JD
                  </div>
                  <ChevronDown className={cn("w-3 h-3 text-[rgb(var(--muted-foreground))] transition-transform", isUserMenuOpen && "rotate-180")} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-[rgb(var(--border))] shadow-xl shadow-indigo-900/5 py-2 z-50 animate-fade-in origin-top-right">
                    <div className="px-4 py-2 border-b border-[rgb(var(--border))] mb-1">
                      <p className="text-xs font-bold text-gray-900">John Doe</p>
                      <p className="text-[10px] text-gray-500">john@example.com</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2">
                      <Settings className="w-3 h-3" /> Profile Settings
                    </button>
                    <button 
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[rgb(var(--error))] hover:bg-rose-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3 h-3" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
