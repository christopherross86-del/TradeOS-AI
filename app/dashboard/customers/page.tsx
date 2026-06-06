"use client";

import { useState, useEffect } from "react";
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
  Filter,
  ArrowUpDown,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────

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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "recent" | "jobs">("recent");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "new">("all");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/customers");
        if (res.ok) {
          const json = await res.json();
          setCustomers(json);
        } else {
          throw new Error("API error");
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-lg font-bold text-gray-900">Failed to load customers</h2>
        <p className="text-sm text-gray-500 mt-1">Please try again later.</p>
      </div>
    );
  }

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