"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Wrench,
  DollarSign,
  Clock,
  MessageSquare,
  FileText,
  Edit3,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// ─── Types & Mock Data ──────────────────────────────────

type ServiceRecord = {
  id: string;
  date: string;
  service: string;
  technician: string;
  amount: number;
  status: "completed" | "scheduled" | "cancelled";
};

type Appointment = {
  id: string;
  date: string;
  time: string;
  service: string;
  technician: string;
  status: "confirmed" | "pending" | "completed";
};

type CustomerDetail = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: "active" | "inactive" | "new";
  avatar: string;
  memberSince: string;
  notes: string;
  totalJobs: number;
  totalRevenue: number;
  serviceHistory: ServiceRecord[];
  upcomingAppointments: Appointment[];
};

const customerData: Record<string, CustomerDetail> = {
  "C-1001": {
    id: "C-1001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "(512) 555-0142",
    address: "1234 Main Street",
    city: "Austin, TX 78701",
    status: "active",
    avatar: "JD",
    memberSince: "January 2024",
    notes: "Prefers morning appointments between 8-10 AM. Has an annual service contract. Referred two neighbors to us.",
    totalJobs: 12,
    totalRevenue: 8450,
    serviceHistory: [
      { id: "SVC-001", date: "2026-06-02", service: "AC Tune-Up", technician: "Carlos R.", amount: 149, status: "completed" },
      { id: "SVC-002", date: "2026-04-15", service: "AC Repair - Compressor", technician: "Maria L.", amount: 1200, status: "completed" },
      { id: "SVC-003", date: "2026-02-20", service: "Heating Inspection", technician: "Carlos R.", amount: 99, status: "completed" },
      { id: "SVC-004", date: "2025-12-10", service: "Duct Cleaning", technician: "Mike T.", amount: 450, status: "completed" },
      { id: "SVC-005", date: "2025-10-05", service: "AC Installation", technician: "Maria L.", amount: 3800, status: "completed" },
    ],
    upcomingAppointments: [
      { id: "APT-001", date: "2026-06-20", time: "9:00 AM", service: "AC Tune-Up (Seasonal)", technician: "Carlos R.", status: "confirmed" },
      { id: "APT-002", date: "2026-07-05", time: "10:30 AM", service: "Thermostat Upgrade", technician: "Maria L.", status: "pending" },
    ],
  },
  "C-1002": {
    id: "C-1002",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(512) 555-0187",
    address: "5678 Oak Avenue",
    city: "Austin, TX 78702",
    status: "active",
    avatar: "SJ",
    memberSince: "March 2026",
    notes: "New customer - referred by John Doe (C-1001). Interested in a maintenance plan. Prefers text reminders.",
    totalJobs: 8,
    totalRevenue: 5200,
    serviceHistory: [
      { id: "SVC-006", date: "2026-05-28", service: "AC Repair - Fan Motor", technician: "Carlos R.", amount: 680, status: "completed" },
      { id: "SVC-007", date: "2026-04-10", service: "Spring Tune-Up", technician: "Mike T.", amount: 149, status: "completed" },
    ],
    upcomingAppointments: [
      { id: "APT-003", date: "2026-06-18", time: "2:00 PM", service: "Duct Inspection", technician: "Mike T.", status: "confirmed" },
    ],
  },
  "C-1003": {
    id: "C-1003",
    name: "Mike Torres",
    email: "mtorres@email.com",
    phone: "(512) 555-0093",
    address: "910 Elm Street",
    city: "Round Rock, TX 78664",
    status: "new",
    avatar: "MT",
    memberSince: "May 2026",
    notes: "Called about AC not cooling. Interested in maintenance plan. Follow up in 2 weeks for summer check.",
    totalJobs: 3,
    totalRevenue: 1800,
    serviceHistory: [
      { id: "SVC-008", date: "2026-05-15", service: "AC Diagnostic & Repair", technician: "Maria L.", amount: 380, status: "completed" },
    ],
    upcomingAppointments: [],
  },
  "C-1004": {
    id: "C-1004",
    name: "Emily Chen",
    email: "emily.chen@email.com",
    phone: "(512) 555-0214",
    address: "2468 Cedar Lane",
    city: "Austin, TX 78703",
    status: "active",
    avatar: "EC",
    memberSince: "August 2023",
    notes: "VIP customer - rental property owner. Call before scheduling to confirm access. Prefers afternoon appointments.",
    totalJobs: 25,
    totalRevenue: 18200,
    serviceHistory: [
      { id: "SVC-009", date: "2026-06-04", service: "AC Tune-Up (3 units)", technician: "Carlos R.", amount: 447, status: "completed" },
      { id: "SVC-010", date: "2026-03-20", service: "Duct Cleaning (Full House)", technician: "Mike T.", amount: 599, status: "completed" },
      { id: "SVC-011", date: "2025-12-15", service: "Heating Repair", technician: "Maria L.", amount: 890, status: "completed" },
    ],
    upcomingAppointments: [
      { id: "APT-004", date: "2026-06-25", time: "1:00 PM", service: "Seasonal AC Check (Property 2)", technician: "Carlos R.", status: "confirmed" },
    ],
  },
  "C-1005": {
    id: "C-1005",
    name: "Robert Garcia",
    email: "rgarcia@email.com",
    phone: "(512) 555-0321",
    address: "1357 Pine Road",
    city: "Pflugerville, TX 78660",
    status: "inactive",
    avatar: "RG",
    memberSince: "April 2026",
    notes: "Single service call only. No response to follow-up calls or emails. May have moved.",
    totalJobs: 1,
    totalRevenue: 450,
    serviceHistory: [
      { id: "SVC-012", date: "2026-04-20", service: "AC Repair - Capacitor", technician: "Carlos R.", amount: 450, status: "completed" },
    ],
    upcomingAppointments: [],
  },
  "C-1006": {
    id: "C-1006",
    name: "Lisa Patel",
    email: "lpatel@email.com",
    phone: "(512) 555-0456",
    address: "8642 Maple Drive",
    city: "Austin, TX 78704",
    status: "active",
    avatar: "LP",
    memberSince: "October 2024",
    notes: "Owns 3 rental properties. Great potential for recurring maintenance contracts. Prefers email communication.",
    totalJobs: 16,
    totalRevenue: 11200,
    serviceHistory: [
      { id: "SVC-013", date: "2026-06-01", service: "AC Repair (Property 3)", technician: "Maria L.", amount: 780, status: "completed" },
      { id: "SVC-014", date: "2026-04-08", service: "Spring Tune-Up (All Properties)", technician: "Carlos R.", amount: 447, status: "completed" },
    ],
    upcomingAppointments: [
      { id: "APT-005", date: "2026-06-22", time: "8:00 AM", service: "AC Check (Property 1)", technician: "Carlos R.", status: "confirmed" },
      { id: "APT-006", date: "2026-06-22", time: "10:00 AM", service: "AC Check (Property 2)", technician: "Carlos R.", status: "confirmed" },
    ],
  },
  "C-1007": {
    id: "C-1007",
    name: "Tom Williams",
    email: "tom.w@email.com",
    phone: "(512) 555-0678",
    address: "9753 Birch Court",
    city: "Cedar Park, TX 78613",
    status: "active",
    avatar: "TW",
    memberSince: "February 2026",
    notes: "Prefers text message reminders. Works from home - flexible with appointment times.",
    totalJobs: 5,
    totalRevenue: 3100,
    serviceHistory: [
      { id: "SVC-015", date: "2026-05-22", service: "AC Tune-Up", technician: "Mike T.", amount: 149, status: "completed" },
      { id: "SVC-016", date: "2026-03-10", service: "Heating Repair - Igniter", technician: "Maria L.", amount: 580, status: "completed" },
    ],
    upcomingAppointments: [],
  },
  "C-1008": {
    id: "C-1008",
    name: "Amanda Brooks",
    email: "abrooks@email.com",
    phone: "(512) 555-0890",
    address: "3141 Walnut Street",
    city: "Austin, TX 78723",
    status: "new",
    avatar: "AB",
    memberSince: "June 2026",
    notes: "Called for quote on new AC installation. Waiting on estimate. Follow up next week.",
    totalJobs: 0,
    totalRevenue: 0,
    serviceHistory: [],
    upcomingAppointments: [],
  },
};

// ─── Detail View ─────────────────────────────────────────

export default function CustomerDetailPage() {
  const params = useParams();
  const customer = customerData[params.id as string];

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-lg font-bold text-gray-900">Customer not found</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          The customer you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/dashboard/customers"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/dashboard/customers"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Customers
      </Link>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl font-bold shrink-0">
            {customer.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-gray-900">{customer.name}</h1>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      customer.status === "active"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : customer.status === "inactive"
                        ? "bg-gray-100 text-gray-500 border-gray-200"
                        : "bg-blue-100 text-blue-700 border-blue-200"
                    }`}
                  >
                    {customer.status === "active" ? "Active" : customer.status === "inactive" ? "Inactive" : "New Lead"}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-0.5">
                  Customer since {customer.memberSince} &middot; {customer.id}
                </p>
              </div>
              <button className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <div className="p-1.5 rounded-lg bg-green-50 text-green-600">
                  <Phone className="w-4 h-4" />
                </div>
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="truncate">{customer.address}, {customer.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{customer.totalJobs}</p>
            <p className="text-xs text-gray-500 mt-1">Total Jobs</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-2xl font-bold text-gray-900">
              ${customer.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Lifetime Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {customer.upcomingAppointments.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Upcoming</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Service History & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service History */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-bold text-gray-900">Service History</h2>
              </div>
              <button className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                <Plus className="w-3.5 h-3.5" />
                Add Service
              </button>
            </div>
            {customer.serviceHistory.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-gray-500">No service history yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {customer.serviceHistory.map((svc) => (
                  <div key={svc.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg mt-0.5 ${
                        svc.status === "completed" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"
                      }`}>
                        {svc.status === "completed" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{svc.service}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {svc.date} &middot; {svc.technician} &middot; {svc.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">${svc.amount.toLocaleString()}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        svc.status === "completed" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                      }`}>
                        {svc.status.charAt(0).toUpperCase() + svc.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-bold text-gray-900">Notes</h2>
              </div>
              <button className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                {customer.notes}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Upcoming Appointments */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-bold text-gray-900">Upcoming</h2>
              </div>
              <button className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                <Plus className="w-3.5 h-3.5" />
                Schedule
              </button>
            </div>
            {customer.upcomingAppointments.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-500">No upcoming appointments</p>
                <p className="text-xs text-gray-400 mt-1">Schedule a new visit above.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {customer.upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">{apt.date}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        apt.status === "confirmed"
                          ? "bg-green-50 text-green-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{apt.time} &middot; {apt.service}</p>
                    <p className="text-xs text-gray-400 mt-1">{apt.technician}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2.5 text-sm text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <Phone className="w-4 h-4 text-gray-400" />
                Call Customer
              </button>
              <button className="w-full flex items-center gap-2.5 text-sm text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="w-4 h-4 text-gray-400" />
                Send Email
              </button>
              <button className="w-full flex items-center gap-2.5 text-sm text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="w-4 h-4 text-gray-400" />
                Create Invoice
              </button>
              <button className="w-full flex items-center gap-2.5 text-sm text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4 text-gray-400" />
                Schedule Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}