"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Wrench,
  Clock,
  MessageSquare,
  FileText,
  Edit3,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

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

export default function CustomerDetailPage() {
  const params = useParams();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/customers/${params.id}`);
        if (res.ok) {
          const json = await res.json();
          setCustomer(json);
        } else {
          throw new Error("API error");
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchCustomer();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-lg font-bold text-gray-900">Customer not found</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          The customer you&apos;re looking for doesn&apos;t exist or failed to load.
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

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{customer.totalJobs}</p>
            <p className="text-xs text-gray-500 mt-1">Total Jobs</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-2xl font-bold text-gray-900">${customer.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Lifetime Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{customer.upcomingAppointments.length}</p>
            <p className="text-xs text-gray-500 mt-1">Upcoming</p>
          </div>
        </div>
      </div>

      {/* Main content removed for brevity - same as before */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
                      <div className={`p-1.5 rounded-lg mt-0.5 ${svc.status === "completed" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"}`}>
                        {svc.status === "completed" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{svc.service}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{svc.date} &middot; {svc.technician} &middot; {svc.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">${svc.amount.toLocaleString()}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${svc.status === "completed" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                        {svc.status.charAt(0).toUpperCase() + svc.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
              <p className="text-sm text-gray-600 leading-relaxed">{customer.notes}</p>
            </div>
          </div>
        </div>

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
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${apt.status === "confirmed" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
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

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2.5 text-sm text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <Phone className="w-4 h-4 text-gray-400" /> Call Customer
              </button>
              <button className="w-full flex items-center gap-2.5 text-sm text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="w-4 h-4 text-gray-400" /> Send Email
              </button>
              <button className="w-full flex items-center gap-2.5 text-sm text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="w-4 h-4 text-gray-400" /> Create Invoice
              </button>
              <button className="w-full flex items-center gap-2.5 text-sm text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4 text-gray-400" /> Schedule Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}