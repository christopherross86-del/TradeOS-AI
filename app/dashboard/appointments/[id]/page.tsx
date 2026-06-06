"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Wrench,
  User,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";

// ─── Status Config ──────────────────────────────────────

type AppointmentStatus =
  | "new_request"
  | "scheduled"
  | "on_the_way"
  | "working"
  | "completed"
  | "paid";

const statusFlow: AppointmentStatus[] = [
  "new_request",
  "scheduled",
  "on_the_way",
  "working",
  "completed",
  "paid",
];

const statusConfig: Record<
  AppointmentStatus,
  { label: string; color: string; bg: string; border: string; textColor: string; icon: React.ReactNode }
> = {
  new_request: {
    label: "New Request",
    color: "text-gray-700",
    bg: "bg-gray-100",
    border: "border-gray-200",
    textColor: "text-gray-600",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  scheduled: {
    label: "Scheduled",
    color: "text-blue-700",
    bg: "bg-blue-100",
    border: "border-blue-200",
    textColor: "text-blue-600",
    icon: <Calendar className="w-4 h-4" />,
  },
  on_the_way: {
    label: "On The Way",
    color: "text-orange-700",
    bg: "bg-orange-100",
    border: "border-orange-200",
    textColor: "text-orange-600",
    icon: <MapPin className="w-4 h-4" />,
  },
  working: {
    label: "Working",
    color: "text-purple-700",
    bg: "bg-purple-100",
    border: "border-purple-200",
    textColor: "text-purple-600",
    icon: <Wrench className="w-4 h-4" />,
  },
  completed: {
    label: "Completed",
    color: "text-green-700",
    bg: "bg-green-100",
    border: "border-green-200",
    textColor: "text-green-600",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  paid: {
    label: "Paid",
    color: "text-emerald-700",
    bg: "bg-emerald-100",
    border: "border-emerald-200",
    textColor: "text-emerald-600",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
};

// ─── Mock Data ──────────────────────────────────────────

type AppointmentDetail = {
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
  notes: string;
  customerNotes: string;
};

const appointmentData: Record<string, AppointmentDetail> = {
  "APT-001": {
    id: "APT-001",
    customerName: "John Doe",
    customerId: "C-1001",
    phone: "(512) 555-0142",
    address: "1234 Main Street, Austin, TX 78701",
    service: "AC Tune-Up",
    technician: "Carlos Rodriguez",
    date: "2026-06-07",
    time: "8:00 AM",
    duration: "1.5 hours",
    status: "scheduled",
    notes: "Annual maintenance check. Customer prefers morning appointments between 8-10 AM.",
    customerNotes: "Has a service contract. Referred two neighbors. VIP customer.",
  },
  "APT-002": {
    id: "APT-002",
    customerName: "Lisa Patel",
    customerId: "C-1006",
    phone: "(512) 555-0456",
    address: "8642 Maple Drive, Austin, TX 78704",
    service: "AC Check (Property 1)",
    technician: "Carlos Rodriguez",
    date: "2026-06-07",
    time: "10:00 AM",
    duration: "1 hour",
    status: "scheduled",
    notes: "Rental property. Call Lisa 30 min before arrival for access.",
    customerNotes: "Owns 3 rental properties. Prefers email communication.",
  },
  "APT-003": {
    id: "APT-003",
    customerName: "Sarah Johnson",
    customerId: "C-1002",
    phone: "(512) 555-0187",
    address: "5678 Oak Avenue, Austin, TX 78702",
    service: "Duct Inspection",
    technician: "Mike Thompson",
    date: "2026-06-07",
    time: "2:00 PM",
    duration: "2 hours",
    status: "new_request",
    notes: "New customer - referred by John Doe. Interested in a maintenance plan.",
    customerNotes: "Prefers text reminders.",
  },
  "APT-004": {
    id: "APT-004",
    customerName: "Emily Chen",
    customerId: "C-1004",
    phone: "(512) 555-0214",
    address: "2468 Cedar Lane, Austin, TX 78703",
    service: "Seasonal AC Check (Property 2)",
    technician: "Carlos Rodriguez",
    date: "2026-06-08",
    time: "1:00 PM",
    duration: "1.5 hours",
    status: "on_the_way",
    notes: "VIP customer. Call 15 min before arrival. Property 2 - back house unit.",
    customerNotes: "Rental property owner - call before scheduling to confirm access.",
  },
  "APT-005": {
    id: "APT-005",
    customerName: "John Doe",
    customerId: "C-1001",
    phone: "(512) 555-0142",
    address: "1234 Main Street, Austin, TX 78701",
    service: "Thermostat Upgrade",
    technician: "Maria Lopez",
    date: "2026-06-09",
    time: "10:30 AM",
    duration: "2 hours",
    status: "working",
    notes: "Upgrading to Ecobee smart thermostat. Customer wants to learn the app.",
    customerNotes: "Has a service contract. Referred two neighbors.",
  },
  "APT-006": {
    id: "APT-006",
    customerName: "Lisa Patel",
    customerId: "C-1006",
    phone: "(512) 555-0456",
    address: "8642 Maple Drive, Austin, TX 78704",
    service: "AC Check (Property 2)",
    technician: "Carlos Rodriguez",
    date: "2026-06-09",
    time: "10:00 AM",
    duration: "1 hour",
    status: "completed",
    notes: "All units running well. No issues found.",
    customerNotes: "Owns 3 rental properties.",
  },
  "APT-007": {
    id: "APT-007",
    customerName: "Tom Williams",
    customerId: "C-1007",
    phone: "(512) 555-0678",
    address: "9753 Birch Court, Cedar Park, TX 78613",
    service: "AC Tune-Up",
    technician: "Mike Thompson",
    date: "2026-06-10",
    time: "9:00 AM",
    duration: "1.5 hours",
    status: "paid",
    notes: "Works from home. Flexible with time. Prefers text reminders.",
    customerNotes: "Customer since Feb 2026. 5 total jobs.",
  },
};

// ─── Component ──────────────────────────────────────────

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appointment = appointmentData[params.id as string];
  const [isUpdating, setIsUpdating] = useState(false);

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-lg font-bold text-gray-900">Appointment not found</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          The appointment you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/dashboard/appointments"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Appointments
        </Link>
      </div>
    );
  }

  const cfg = statusConfig[appointment.status];
  const currentIdx = statusFlow.indexOf(appointment.status);
  const canAdvance = currentIdx < statusFlow.length - 1;
  const canGoBack = currentIdx > 0;

  const handleAdvance = () => {
    setIsUpdating(true);
    // In production, this would be an API call
    // Then update local state
    setTimeout(() => setIsUpdating(false), 600);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/dashboard/appointments"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Appointments
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{appointment.service}</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {appointment.id} &middot; {appointment.technician}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}
              >
                {cfg.icon}
                {cfg.label}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm font-semibold text-gray-900">{appointment.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {appointment.time} &middot; {appointment.duration}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Service</p>
                    <p className="text-sm font-semibold text-gray-900">{appointment.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Technician</p>
                    <p className="text-sm font-semibold text-gray-900">{appointment.technician}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Workflow */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Status</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-1">
              {statusFlow.map((s, i) => {
                const sc = statusConfig[s];
                const isCurrent = s === appointment.status;
                const isPast = i < currentIdx;
                return (
                  <div key={s} className="flex items-center gap-1 w-full sm:w-auto">
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all w-full sm:w-auto ${
                        isCurrent
                          ? `${sc.bg} ${sc.color} ${sc.border} ring-2 ring-offset-1 ${sc.border.replace("border-", "ring-")}`
                          : isPast
                          ? "bg-gray-100 text-gray-500 border-gray-200"
                          : "bg-white text-gray-400 border-gray-200"
                      }`}
                    >
                      {sc.icon}
                      {sc.label}
                    </div>
                    {i < statusFlow.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 shrink-0 hidden sm:block" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
              {canGoBack && (
                <button
                  onClick={handleAdvance}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to {statusConfig[statusFlow[currentIdx - 1]].label}
                </button>
              )}
              {canAdvance && (
                <button
                  onClick={handleAdvance}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      Mark as {statusConfig[statusFlow[currentIdx + 1]].label}
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              )}
              {!canAdvance && !canGoBack && (
                <p className="text-xs text-gray-500 italic">
                  Appointment is {currentIdx === 0 ? "a new request" : "fully completed"}.
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-bold text-gray-900">Job Notes</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{appointment.notes}</p>
            <div className="mt-4">
              <textarea
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none placeholder:text-gray-400"
                rows={3}
                placeholder="Add a note or update..."
                defaultValue=""
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-bold text-gray-900">Customer</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Link
                  href={`/dashboard/customers/${appointment.customerId}`}
                  className="text-lg font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  {appointment.customerName}
                </Link>
                <p className="text-xs text-gray-400">{appointment.customerId}</p>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <div className="p-1.5 rounded-lg bg-green-50 text-green-600">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <a href={`tel:${appointment.phone}`} className="hover:text-indigo-600 transition-colors">
                  {appointment.phone}
                </a>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-gray-600">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>{appointment.address}</span>
              </div>
            </div>
          </div>

          {/* Customer Notes */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-bold text-gray-900">Customer Notes</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{appointment.customerNotes}</p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Actions</h3>
            <div className="space-y-2">
              <a
                href={`tel:${appointment.phone}`}
                className="w-full flex items-center gap-2.5 text-sm text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-4 h-4 text-gray-400" />
                Call Customer
              </a>
              <button className="w-full flex items-center gap-2.5 text-sm text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <MapPin className="w-4 h-4 text-gray-400" />
                Get Directions
              </button>
              <button className="w-full flex items-center gap-2.5 text-sm text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4 text-gray-400" />
                Reschedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}