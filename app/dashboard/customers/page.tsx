"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Wrench,
  ChevronRight,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  totalJobs: number;
  totalRevenue: number;
  lastAppointment: string;
  status: "active" | "inactive" | "new";
  avatar: string;
  notes: string;
};

const customers: Customer[] = [
  {
    id: "C-1001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "(512) 555-0142",
    address: "1234 Main Street",
    city: "Austin, TX",
    totalJobs: 12,
    totalRevenue: 8450,
    lastAppointment: "2026-06-02",
    status: "active",
    avatar: "JD",
    notes: "Prefers morning appointments. Has a service contract.",
  },
  {
    id: "C-1002",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(512) 555-0187",
    address: "5678 Oak Avenue",
    city: "Austin, TX",
    totalJobs: 8,
    totalRevenue: 5200,
    lastAppointment: "2026-05-28",
    status: "active",
    avatar: "SJ",
    notes: "New customer. Referred by neighbor.",
  },
  {
    id: "C-1003",
    name: "Mike Torres",
    email: "mtorres@email.com",
    phone: "(512) 555-0093",
    address: "910 Elm Street",
    city: "Round Rock, TX",
    totalJobs: 3,
    totalRevenue: 1800,
    lastAppointment: "2026-05-15",
    status: "new",
    avatar: "MT",
    notes: "Interested in maintenance plan.",
  },
  {
    id: "C-1004",
    name: "Emily Chen",
    email: "emily.chen@email.com",
    phone: "(512) 555-0214",
    address: "2468 Cedar Lane",
    city: "Austin, TX",
    totalJobs: 25,
    totalRevenue: 18200,
    lastAppointment: "2026-06-04",
    status: "active",
    avatar: "EC",
    notes: "VIP customer. Call before scheduling.",
  },
  {
    id: "C-1005",
    name: "Robert Garcia",
    email: "rgarcia@email.com",
    phone: "(512) 555-0321",
    address: "1357 Pine Road",
    city: "Pflugerville, TX",
    totalJobs: 1,
    totalRevenue: 450,
    lastAppointment: "2026-04-20",
    status: "inactive",
    avatar: "RG",
    notes: "No response to follow-up calls.",
  },
  {
    id: "C-1006",
    name: "Lisa Patel",
    email: "lpatel@email.com",
    phone: "(512) 555-0456",
    address: "8642 Maple Drive",
    city: "Austin, TX",
    totalJobs: 16,
    totalRevenue: 11200,
    lastAppointment: "2026-06-01",
    status: "active",
    avatar: "LP",
    notes: "Has rental properties. Potential for recurring work.",
  },
  {
    id: "C-1007",
    name: "Tom Williams",
    email: "tom.w@email.com",
    phone: "(512) 555-0678",
    address: "9753 Birch Court",
    city: "Cedar Park, TX",
    totalJobs: 5,
    totalRevenue: 3100,
    lastAppointment: "2026-05-22",
    status: "active",
    avatar: "TW",
    notes: "Prefers text reminders.",
  },
  {
    id: "C-1008",
    name: "Amanda Brooks",
    email: "abrooks@email.com",
    phone: "(512) 555-0890",
    address: "3141 Walnut Street",
    city: "Austin, TX",
    totalJobs: 0,
    totalRevenue: 0,
    lastAppointment: "—",
    status: "new",
    avatar: "AB",
    notes: "Called for quote. Follow up next week.",
  },
];

function getStatusBadge(status: Customer["status"]) {
  switch (status) {
    case "active":
      return { label: "Active", class: "bg-green-100 text-green-700 border-green-200" };
    case "inactive":
      return { label: "Inactive", class: "bg-gray-100 text-gray-500 border-gray-200" };
    case "new":
      return { label: "New Lead", class: "bg-blue-100 text-blue-700 border-blue-200" };
  }
}

// ─── List View ───────────────────────────────────────────

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "recent" | "jobs">("recent");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "new">("all");

  const filtered = customers
    .filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "jobs") return b.totalJobs - a.totalJobs;
      return b.lastAppointment.localeCompare(a.lastAppointment);
    });

  const activeCount = customers.filter((c) => c.status === "active").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalRevenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your customer relationships and service history.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md active:scale-[0.98]">
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Customers</p>
              <p className="text-xl font-bold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-green-50 text-green-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Active Customers</p>
              <p className="text-xl font-bold text-gray-900">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Lifetime Revenue</p>
              <p className="text-xl font-bold text-gray-900">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="new">New Leads</option>
            </select>
          </div>
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
              <option value="jobs">Most Jobs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Customer
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Contact
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Location
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Jobs
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Revenue
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Last Visit
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500">No customers found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try adjusting your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => {
                  const badge = getStatusBadge(customer.status);
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/customers/${customer.id}`}
                          className="flex items-center gap-3 group/link"
                        >
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                            {customer.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 group-hover/link:text-indigo-600 transition-colors">
                              {customer.name}
                            </p>
                            <p className="text-xs text-gray-400">{customer.id}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Mail className="w-3 h-3 text-gray-400" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          {customer.city}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-semibold text-gray-900">
                          {customer.totalJobs}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-semibold text-gray-900">
                          ${customer.totalRevenue.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {customer.lastAppointment === "—" ? (
                            <span className="text-gray-400">No visits</span>
                          ) : (
                            customer.lastAppointment
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full border ${badge.class}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/customers/${customer.id}`}
                          className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-all"
                        >
                          View
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/30">
          <p className="text-xs text-gray-400">
            Showing {filtered.length} of {customers.length} customers
          </p>
        </div>
      </div>
    </div>
  );
}