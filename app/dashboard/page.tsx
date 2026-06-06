"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  PhoneCall,
  Calendar,
  Users,
  UserCheck,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle,
  Zap,
} from "lucide-react";

type AnalyticsData = {
  callsAnswered: number;
  appointmentsBooked: number;
  adminHoursSaved: number;
  payrollSavings: number;
  revenueProtected: number;
  employees: { name: string; role: string; status: string; metrics: { label: string; value: string }[] }[];
  activityFeed: { employeeName: string; action: string; time: string }[];
};

const fallbackData: AnalyticsData = {
  callsAnswered: 142,
  appointmentsBooked: 38,
  adminHoursSaved: 52,
  payrollSavings: 4600,
  revenueProtected: 72000,
  employees: [
    { name: "Sarah", role: "Receptionist", status: "Active", metrics: [{ label: "Calls", value: "142" }] },
    { name: "Mike", role: "Dispatcher", status: "Active", metrics: [{ label: "Jobs", value: "38" }] },
    { name: "Jessica", role: "Office Manager", status: "Idle", metrics: [{ label: "Tasks", value: "0" }] },
    { name: "Alex", role: "Analyst", status: "Active", metrics: [{ label: "Reports", value: "2" }] },
  ],
  activityFeed: [
    { employeeName: "Sarah", action: "booked a new job for John Doe", time: "2 minutes ago" },
    { employeeName: "Mike", action: "dispatched a crew to Maple St", time: "15 minutes ago" },
    { employeeName: "Sarah", action: "answered 12 calls this hour", time: "1 hour ago" },
  ],
};

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          throw new Error("API error");
        }
      } catch {
        setData(fallbackData);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-lg font-bold text-gray-900">Failed to load data</h2>
        <p className="text-sm text-gray-500 mt-1">Please try refreshing the page.</p>
      </div>
    );
  }

  const stats = [
    { name: "Total Revenue", value: `$${data.payrollSavings.toLocaleString()}`, change: "+12.5%", icon: <TrendingUp className="w-5 h-5" />, color: "bg-green-50 text-green-600" },
    { name: "Calls Answered", value: data.callsAnswered.toLocaleString(), change: "+18%", icon: <PhoneCall className="w-5 h-5" />, color: "bg-blue-50 text-blue-600" },
    { name: "Jobs Booked", value: data.appointmentsBooked.toLocaleString(), change: "+5.4%", icon: <Calendar className="w-5 h-5" />, color: "bg-indigo-50 text-indigo-600" },
    { name: "Active AI Agents", value: `${data.employees.filter((e) => e.status === "Active").length}`, change: "Maxed", icon: <Users className="w-5 h-5" />, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-3 rounded-xl border border-amber-200 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Using cached data. The live API was unavailable.
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${stat.color}`}>{stat.icon}</div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith("+") ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
              }`}>
                <ArrowUp className="w-3 h-3 inline mr-0.5" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity & AI Employee Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-gray-500" />
            <h3 className="font-bold text-lg">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {data.activityFeed.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No recent activity.</p>
            ) : (
              data.activityFeed.map((activity, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs shrink-0 font-bold">
                    {activity.employeeName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-semibold">{activity.employeeName}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="w-4 h-4 text-gray-500" />
            <h3 className="font-bold text-lg">AI Employee Status</h3>
          </div>
          <div className="space-y-6">
            {data.employees.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No employees hired yet.</p>
            ) : (
              data.employees.map((agent) => (
                <div key={agent.name} className="flex items-center justify-between">
                  <Link href="/dashboard/employees" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {agent.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{agent.name}</p>
                      <p className="text-xs text-gray-500">{agent.role}</p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${agent.status === "Active" ? "bg-green-500" : "bg-gray-300"}`} />
                    <span className="text-sm font-medium text-gray-700">{agent.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}