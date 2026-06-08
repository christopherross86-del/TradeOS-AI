"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Mail,
  Printer,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  DollarSign,
  User,
  Calendar,
} from "lucide-react";

// ─── Types & Data ───────────────────────────────────────

type InvoiceStatus = "paid" | "unpaid" | "overdue" | "draft";

type LineItem = {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

type InvoiceDetail = {
  id: string;
  customerName: string;
  customerId: string;
  email: string;
  phone: string;
  address: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  paidDate?: string;
  service: string;
  notes: string;
  lineItems: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
};

const statusConfig: Record<InvoiceStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  paid: { label: "Paid", color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200", icon: <CheckCircle2 className="w-4 h-4" /> },
  unpaid: { label: "Unpaid", color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200", icon: <Clock className="w-4 h-4" /> },
  overdue: { label: "Overdue", color: "text-rose-700", bg: "bg-rose-100", border: "border-rose-200", icon: <AlertCircle className="w-4 h-4" /> },
  draft: { label: "Draft", color: "text-gray-700", bg: "bg-gray-100", border: "border-gray-200", icon: <FileText className="w-4 h-4" /> },
};

const invoices: Record<string, InvoiceDetail> = {
  "INV-001": {
    id: "INV-001", customerName: "John Doe", customerId: "C-1001", email: "john.doe@email.com", phone: "(512) 555-0142",
    address: "1234 Main Street, Austin, TX 78701", amount: 149, status: "paid", date: "2026-06-02", dueDate: "2026-06-16", paidDate: "2026-06-02",
    service: "AC Tune-Up", notes: "Annual maintenance - customer has service contract.",
    lineItems: [{ description: "AC Tune-Up (Seasonal Maintenance)", quantity: 1, rate: 149, amount: 149 }],
    subtotal: 149, tax: 0, total: 149,
  },
  "INV-002": {
    id: "INV-002", customerName: "Emily Chen", customerId: "C-1004", email: "emily.chen@email.com", phone: "(512) 555-0214",
    address: "2468 Cedar Lane, Austin, TX 78703", amount: 447, status: "paid", date: "2026-06-04", dueDate: "2026-06-18", paidDate: "2026-06-04",
    service: "AC Tune-Up (3 units)", notes: "3 units in multi-tenant property. All units serviced.",
    lineItems: [
      { description: "AC Tune-Up - Unit 1", quantity: 1, rate: 149, amount: 149 },
      { description: "AC Tune-Up - Unit 2", quantity: 1, rate: 149, amount: 149 },
      { description: "AC Tune-Up - Unit 3", quantity: 1, rate: 149, amount: 149 },
    ],
    subtotal: 447, tax: 0, total: 447,
  },
  "INV-003": {
    id: "INV-003", customerName: "Lisa Patel", customerId: "C-1006", email: "lpatel@email.com", phone: "(512) 555-0456",
    address: "8642 Maple Drive, Austin, TX 78704", amount: 780, status: "unpaid", date: "2026-06-01", dueDate: "2026-06-15",
    service: "AC Repair (Property 3)", notes: "Replaced fan motor and capacitor. Warranty: 90 days.",
    lineItems: [
      { description: "Diagnostic Fee", quantity: 1, rate: 80, amount: 80 },
      { description: "Fan Motor Replacement", quantity: 1, rate: 450, amount: 450 },
      { description: "Capacitor Replacement", quantity: 1, rate: 180, amount: 180 },
      { description: "Labor (2 hours)", quantity: 2, rate: 35, amount: 70 },
    ],
    subtotal: 780, tax: 0, total: 780,
  },
  "INV-006": {
    id: "INV-006", customerName: "Tom Williams", customerId: "C-1007", email: "tom.w@email.com", phone: "(512) 555-0678",
    address: "9753 Birch Court, Cedar Park, TX 78613", amount: 149, status: "overdue", date: "2026-05-22", dueDate: "2026-06-05",
    service: "AC Tune-Up", notes: "2nd reminder sent. Customer has been unreachable.",
    lineItems: [{ description: "AC Tune-Up (Seasonal)", quantity: 1, rate: 149, amount: 149 }],
    subtotal: 149, tax: 0, total: 149,
  },
  "INV-010": {
    id: "INV-010", customerName: "Emily Chen", customerId: "C-1004", email: "emily.chen@email.com", phone: "(512) 555-0214",
    address: "2468 Cedar Lane, Austin, TX 78703", amount: 2599, status: "draft", date: "2026-06-10", dueDate: "2026-06-24",
    service: "Full System Replacement (Quote)", notes: "Quote for full HVAC system replacement. Customer is reviewing.",
    lineItems: [
      { description: "4-Ton HVAC System (Carrier)", quantity: 1, rate: 2100, amount: 2100 },
      { description: "Thermostat (Smart)", quantity: 1, rate: 249, amount: 249 },
      { description: "Installation Labor", quantity: 1, rate: 250, amount: 250 },
    ],
    subtotal: 2599, tax: 0, total: 2599,
  },
};

// Fallback for other invoices
const fallbackInvoice = (id: string, status: InvoiceStatus = "unpaid"): InvoiceDetail => ({
  id, customerName: "Customer", customerId: "", email: "", phone: "", address: "",
  amount: 0, status, date: "2026-06-01", dueDate: "2026-06-15",
  service: "Service", notes: "",
  lineItems: [],
  subtotal: 0, tax: 0, total: 0,
});

// ─── Component ──────────────────────────────────────────

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoice = invoices[params.id as string] || fallbackInvoice(params.id as string);

  const cfg = statusConfig[invoice.status];

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/dashboard/invoices" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Invoices
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Header */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-xl font-bold text-gray-900">{invoice.id}</h1>
                  <span className={`inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    {cfg.icon}{cfg.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{invoice.service}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-700">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-700">
                  <Mail className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-700">
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">Date Issued</p>
                <p className="text-sm font-semibold text-gray-900">{invoice.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Due Date</p>
                <p className="text-sm font-semibold text-gray-900">{invoice.dueDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-sm font-bold text-gray-900">${invoice.total.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{invoice.paidDate ? "Paid On" : "Status"}</p>
                <p className={`text-sm font-semibold ${invoice.paidDate ? "text-emerald-600" : cfg.color}`}>
                  {invoice.paidDate || cfg.label}
                </p>
              </div>
            </div>

            {/* Line Items */}
            <h2 className="text-sm font-bold text-gray-900 mb-3">Line Items</h2>
            <table className="w-full mb-4">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 pb-2">Description</th>
                  <th className="text-center text-xs font-semibold text-gray-500 pb-2">Qty</th>
                  <th className="text-right text-xs font-semibold text-gray-500 pb-2">Rate</th>
                  <th className="text-right text-xs font-semibold text-gray-500 pb-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((item, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-3 text-sm text-gray-900">{item.description}</td>
                    <td className="py-3 text-sm text-gray-600 text-center">{item.quantity}</td>
                    <td className="py-3 text-sm text-gray-600 text-right">${item.rate.toLocaleString()}</td>
                    <td className="py-3 text-sm font-semibold text-gray-900 text-right">${item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>${invoice.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>${invoice.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-2">Notes</h2>
              <p className="text-sm text-gray-600">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-bold text-gray-900">Customer</h2>
            </div>
            <div className="space-y-3">
              <Link href={`/dashboard/customers/${invoice.customerId}`} className="text-lg font-bold text-indigo-600 hover:text-indigo-700 transition-colors block">
                {invoice.customerName}
              </Link>
              {invoice.email && <p className="text-sm text-gray-600">{invoice.email}</p>}
              {invoice.phone && <p className="text-sm text-gray-600">{invoice.phone}</p>}
              {invoice.address && <p className="text-sm text-gray-500">{invoice.address}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2.5 text-sm text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 text-gray-400" /> Download PDF
              </button>
              <button className="w-full flex items-center gap-2.5 text-sm text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="w-4 h-4 text-gray-400" /> Send to Customer
              </button>
              {invoice.status === "unpaid" || invoice.status === "overdue" ? (
                <button className="w-full flex items-center gap-2.5 text-sm font-semibold text-white bg-emerald-600 px-3 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                  <CheckCircle2 className="w-4 h-4" /> Mark as Paid
                </button>
              ) : null}
              {invoice.status === "draft" ? (
                <button className="w-full flex items-center gap-2.5 text-sm font-semibold text-white bg-indigo-600 px-3 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                  <Send className="w-4 h-4" /> Send Invoice
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}