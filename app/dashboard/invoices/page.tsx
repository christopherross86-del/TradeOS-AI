"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Plus,
  ChevronRight,
  Download,
  Filter,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

// ─── Types & Data ───────────────────────────────────────

type InvoiceStatus = "paid" | "unpaid" | "overdue" | "draft";

type Invoice = {
  id: string;
  customerName: string;
  customerId: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  service: string;
};

const statusConfig: Record<InvoiceStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  paid: { label: "Paid", color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  unpaid: { label: "Unpaid", color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200", icon: <Clock className="w-3.5 h-3.5" /> },
  overdue: { label: "Overdue", color: "text-rose-700", bg: "bg-rose-100", border: "border-rose-200", icon: <AlertCircle className="w-3.5 h-3.5" /> },
  draft: { label: "Draft", color: "text-gray-700", bg: "bg-gray-100", border: "border-gray-200", icon: <FileText className="w-3.5 h-3.5" /> },
};

const invoices: Invoice[] = [
  { id: "INV-001", customerName: "John Doe", customerId: "C-1001", amount: 149, status: "paid", date: "2026-06-02", dueDate: "2026-06-16", service: "AC Tune-Up" },
  { id: "INV-002", customerName: "Emily Chen", customerId: "C-1004", amount: 447, status: "paid", date: "2026-06-04", dueDate: "2026-06-18", service: "AC Tune-Up (3 units)" },
  { id: "INV-003", customerName: "Lisa Patel", customerId: "C-1006", amount: 780, status: "unpaid", date: "2026-06-01", dueDate: "2026-06-15", service: "AC Repair (Property 3)" },
  { id: "INV-004", customerName: "Sarah Johnson", customerId: "C-1002", amount: 149, status: "paid", date: "2026-05-28", dueDate: "2026-06-11", service: "Spring Tune-Up" },
  { id: "INV-005", customerName: "Mike Torres", customerId: "C-1003", amount: 380, status: "unpaid", date: "2026-05-15", dueDate: "2026-05-29", service: "AC Diagnostic & Repair" },
  { id: "INV-006", customerName: "Tom Williams", customerId: "C-1007", amount: 149, status: "overdue", date: "2026-05-22", dueDate: "2026-06-05", service: "AC Tune-Up" },
  { id: "INV-007", customerName: "John Doe", customerId: "C-1001", amount: 1200, status: "paid", date: "2026-04-15", dueDate: "2026-04-29", service: "AC Repair - Compressor" },
  { id: "INV-008", customerName: "Lisa Patel", customerId: "C-1006", amount: 447, status: "paid", date: "2026-04-08", dueDate: "2026-04-22", service: "Spring Tune-Up (All Properties)" },
  { id: "INV-009", customerName: "Robert Garcia", customerId: "C-1005", amount: 450, status: "overdue", date: "2026-04-20", dueDate: "2026-05-04", service: "AC Repair - Capacitor" },
  { id: "INV-010", customerName: "Emily Chen", customerId: "C-1004", amount: 2599, status: "draft", date: "2026-06-10", dueDate: "2026-06-24", service: "Full System Replacement (Quote)" },
];

type TabKey = "all" | InvoiceStatus;
const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "paid", label: "Paid" },
  { key: "unpaid", label: "Unpaid" },
  { key: "overdue", label: "Overdue" },
  { key: "draft", label: "Draft" },
];

// ─── Component ──────────────────────────────────────────

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesStatus = activeTab === "all" || inv.status === activeTab;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        inv.id.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        inv.service.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [activeTab, search]);

  const totals = useMemo(() => {
    const all = invoices;
    return {
      outstanding: all.filter((i) => i.status === "unpaid" || i.status === "overdue").reduce((s, i) => s + i.amount, 0),
      paidThisMonth: all.filter((i) => i.status === "paid" && i.date.startsWith("2026-06")).reduce((s, i) => s + i.amount, 0),
      overdue: all.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0),
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Manage billing, track payments, and send invoices.</p>
        </div>
        <button className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md active:scale-[0.98]">
          <Plus className="w-4 h-4" />
          New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600"><DollarSign className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-gray-500">Outstanding</p>
              <p className="text-xl font-bold text-gray-900">${totals.outstanding.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-gray-500">Paid This Month</p>
              <p className="text-xl font-bold text-gray-900">${totals.paidThisMonth.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600"><AlertCircle className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-gray-500">Overdue</p>
              <p className="text-xl font-bold text-gray-900">${totals.overdue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const cfg = tab.key !== "all" ? statusConfig[tab.key as InvoiceStatus] : null;
          const count = tab.key === "all" ? invoices.length : invoices.filter((i) => i.status === tab.key).length;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? cfg ? `${cfg.bg} ${cfg.color} ${cfg.border} border shadow-sm` : "bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm"
                  : "text-gray-500 hover:bg-gray-100 border border-transparent"
              }`}
            >
              {cfg?.icon}
              {tab.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/60" : "bg-gray-100 text-gray-500"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search invoices by number, customer, or service..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-400"
        />
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Invoice</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Customer</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Service</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Amount</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Date</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Due</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500">No invoices found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const cfg = statusConfig[inv.status];
                  return (
                    <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/invoices/${inv.id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 group-hover/link:underline">
                          {inv.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/customers/${inv.customerId}`} className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                          {inv.customerName}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{inv.service}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-gray-900">${inv.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{inv.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${inv.status === "overdue" ? "text-rose-600 font-semibold" : "text-gray-600"}`}>
                          {inv.dueDate}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/dashboard/invoices/${inv.id}`}
                          className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-all">
                          View <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/30">
          <p className="text-xs text-gray-400">Showing {filtered.length} of {invoices.length} invoices</p>
        </div>
      </div>
    </div>
  );
}