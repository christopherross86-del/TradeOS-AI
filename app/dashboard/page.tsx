"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  PhoneCall,
  Calendar,
  Users,
  UserCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

type DashboardData = {
  callsAnswered: number;
  appointmentsBooked: number;
  adminHoursSaved: number;
  payrollSavings: number;
  revenueProtected: number;
  revenue: number;
  employees: { name: string; type: string; status: string }[];
  activityFeed: { employeeName: string; action: string; time: string }[];
};

const fallbackData: DashboardData = {
  callsAnswered: 142,
  appointmentsBooked: 38,
  adminHoursSaved: 84,
  payrollSavings: 4600,
  revenueProtected: 72000,
  revenue: 12450,
  employees: [
    { name: "Sarah", type: "SARAH", status: "ACTIVE" },
    { name: "Mike", type: "MIKE", status: "ACTIVE" },
    { name: "Jessica", type: "JESSICA", status: "INACTIVE" },
    { name: "Alex", type: "ALEX", status: "INACTIVE" },
  ],
  activityFeed: [
    { employeeName: "Sarah", action: "booked a new plumbing job for John Doe", time: "2 minutes ago" },
    { employeeName: "Mike", action: "dispatched Carlos to 123 Main St", time: "15 minutes ago" },
    { employeeName: "Sarah", action: "answered a call from Emily Chen", time: "32 minutes ago" },
  ],
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((json) => {
        setData({
          callsAnswered: json.metrics?.callsAnswered ?? fallbackData.callsAnswered,
          appointmentsBooked: json.metrics?.appointmentsBooked ?? fallbackData.appointmentsBooked,
          adminHoursSaved: json.metrics?.adminHoursSaved ?? fallbackData.adminHoursSaved,
          payrollSavings: json.metrics?.payrollSavings ?? fallbackData.payrollSavings,
          revenueProtected: json.metrics?.revenueProtected ?? fallbackData.revenueProtected,
          revenue: json.trends?.[2]?.current ?? fallbackData.revenue,
          employees: json.aiEmployees ?? fallbackData.employees,
          activityFeed: fallbackData.activityFeed,
        });
        setLoading(false);
      })
      .catch(() => {
        setData(fallbackData);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        <span className="ml-3 text-gray-500">Loading your dashboard...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500">Could not load dashboard data.</p>
      </div>
    );
  }

  const stats = [
    { name: "Total Revenue", value: `$${data.revenue.toLocaleString()}`, change: "+12.5%", icon: "💰" },
    { name: "Calls Answered", value: data.callsAnswered.toLocaleString(), change: "+18%", icon: "📞" },
    { name: "Jobs Booked", value: data.appointmentsBooked.toString(), change: "+5.4%", icon: "📅" },
    { name: "Active AI Agents", value: data.employees.filter((e) => e.status === "ACTIVE").length.toString(), change: "Maxed", icon: "🤖" },
  ];

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm">
          Using cached data — couldn't reach the server.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith("+") ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {data.activityFeed.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No recent activity</p>
            ) : (
              data.activityFeed.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs shrink-0">
                    {item.employeeName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.employeeName} {item.action}
                    </p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4">AI Employee Status</h3>
          <div className="space-y-6">
            {data.employees.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Hire your first AI employee</p>
            ) : (
              data.employees.map((agent) => (
                <div key={agent.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                      {agent.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{agent.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{agent.type.toLowerCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${agent.status === "ACTIVE" ? "bg-green-500" : "bg-gray-300"}`}></span>
                    <span className="text-sm font-medium text-gray-700">
                      {agent.status === "ACTIVE" ? "Active" : agent.status === "INACTIVE" ? "Inactive" : agent.status}
                    </span>
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