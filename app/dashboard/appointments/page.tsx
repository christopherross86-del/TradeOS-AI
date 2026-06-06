"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronRight,
  Search,
  Plus,
  AlertCircle,
  MapPin,
  Wrench,
  CheckCircle2,
  Loader2,
} from "lucide-react";

// ─── Types & Status Config ──────────────────────────────

type AppointmentStatus =
  | "new_request"
  | "scheduled"
  | "on_the_way"
  | "working"
  | "completed"
  | "paid";

type Appointment = {
  id: string;
  customerName: string;
  customerId: string;
  phone: string;
  address: string;
  service: string;
  technician: string;
  date: string;
  time: string;
  duration: string;
  status: AppointmentStatus;
};

const statusConfig: Record<
  AppointmentStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  new_request: {
    label: "New Request",
    color: "text-gray-700",
    bg: "bg-gray-100",
    border: "border-gray-200",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  scheduled: {
    label: "Scheduled",
    color: "text-blue-700",
    bg: "bg-blue-100",
    border: "border-blue-200",
    icon: <Calendar className="w-3.5 h-3.5" />,
  },
  on_the_way: {
    label: "On The Way",
    color: "text-orange-700",
    bg: "bg-orange-100",
    border: "border-orange-200",
    icon: <MapPin className="w-3.5 h-3.5" />,
  },
  working: {
    label: "Working",
    color: "text-purple-700",
    bg: "bg-purple-100",
    border: "border-purple-200",
    icon: <Wrench className="w-3.5 h-3.5" />,
  },
  completed: {
    label: "Completed",
    color: "text-green-700",
    bg: "bg-green-100",
    border: "border-green-200",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  paid: {
    label: "Paid",
    color: "text-emerald-700",
    bg: "bg-emerald-100",
    border: "border-emerald-200",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
};

const statusFlow: { key: AppointmentStatus; label: string }[] = [
  { key: "new_request", label: "New Request" },
  { key: "scheduled", label: "Scheduled" },
  { key: "on_the_way", label: "On The Way" },
  { key: "working", label: "Working" },
  { key: "completed", label: "Completed" },
  { key: "paid", label: "Paid" },
];

type TabKey = "all" | AppointmentStatus;

const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  ...statusFlow,
];

// ─── Component ──────────────────────────────────────────

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/appointments");
        if (res.ok) {
          const json = await res.json();
          setAppointments(json);
        } else {
          throw new Error("API error");
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-lg font-bold text-gray-900">Failed to load appointments</h2>
        <p className="text-sm text-gray-500 mt-1">Please try again later.</p>
      </div>
    );
  }

  const filtered = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesStatus = activeTab === "all" || apt.status === activeTab;
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        apt.customerName.toLowerCase().includes(query) ||
        apt.id.toLowerCase().includes(query) ||
        apt.technician.toLowerCase().includes(query) ||
        apt.service.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [activeTab, search]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: appointments.length };
    statusFlow.forEach(({ key }) => {
      map[key] = appointments.filter((a) => a.status === key).length;
    });
    return map;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Schedule, dispatch crews, and track every job from request to payment.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md active:scale-[0.98]">
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const config = tab.key !== "all" ? statusConfig[tab.key as AppointmentStatus] : null;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? config
                    ? `${config.bg} ${config.color} ${config.border} border shadow-sm`
                    : "bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm"
                  : "text-gray-500 hover:bg-gray-100 border border-transparent"
              }`}
            >
              {config?.icon}
              {tab.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                isActive ? "bg-white/60" : "bg-gray-100 text-gray-500"
              }`}>
                {counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, appointment ID, or service..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-400"
        />
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No appointments found</p>
            <p className="text-xs text-gray-400 mt-1">
              {search ? "Try a different search term." : "No appointments with this status yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((apt) => {
              const cfg = statusConfig[apt.status];
              return (
                <Link
                  key={apt.id}
                  href={`/dashboard/appointments/${apt.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors group"
                >
                  {/* Time column */}
                  <div className="w-16 shrink-0 text-center">
                    <p className="text-xs font-bold text-gray-900">{apt.time}</p>
                    <p className="text-[10px] text-gray-400">{apt.duration}</p>
                  </div>

                  {/* Customer & Service */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {apt.customerName}
                      </p>
                      <span className="text-xs text-gray-400">{apt.id}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">
                      {apt.service} &middot; {apt.technician}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{apt.date}</p>
                  </div>

                  {/* Status badge */}
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    {cfg.icon}
                    {cfg.label}
                  </span>

                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/30">
          <p className="text-xs text-gray-400">
            Showing {filtered.length} of {appointments.length} appointments
          </p>
        </div>
      </div>
    </div>
  );
}