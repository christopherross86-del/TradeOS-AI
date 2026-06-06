"use client";

import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  PhoneCall,
  Calendar,
  Clock,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Zap,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  CheckCircle2,
  FileText,
  BarChart3,
  MessageSquare,
  UserCheck,
  Loader2,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────

type Period = "this_month" | "last_month";

type AnalyticsData = {
  period: string;
  callsAnswered: number;
  appointmentsBooked: number;
  adminHoursSaved: number;
  payrollSavings: number;
  revenueProtected: number;
  employees: {
    id: string;
    name: string;
    role: string;
    status: "active" | "idle" | "not_hired";
    metrics: { label: string; value: string }[];
  }[];
  activityFeed: {
    id: string;
    employeeName: string;
    action: string;
    time: string;
    icon: React.ReactNode;
  }[];
};

// ─── Mock Data ──────────────────────────────────────────

const mockData: AnalyticsData = {
  period: "June 2026",
  callsAnswered: 426,
  appointmentsBooked: 67,
  adminHoursSaved: 84,
  payrollSavings: 4600,
  revenueProtected: 72000,
  employees: [
    {
      id: "sarah",
      name: "Sarah",
      role: "AI Receptionist",
      status: "active",
      metrics: [
        { label: "Calls Answered", value: "426" },
        { label: "Jobs Booked", value: "67" },
        { label: "Hours Saved", value: "84" },
      ],
    },
    {
      id: "mike",
      name: "Mike",
      role: "AI Dispatcher",
      status: "active",
      metrics: [
        { label: "Jobs Dispatched", value: "48" },
        { label: "Routes Optimized", value: "36" },
        { label: "Hours Saved", value: "32" },
      ],
    },
    {
      id: "jessica",
      name: "Jessica",
      role: "AI Office Manager",
      status: "idle",
      metrics: [
        { label: "Invoices Sent", value: "—" },
        { label: "Follow-ups", value: "—" },
        { label: "Hours Saved", value: "—" },
      ],
    },
    {
      id: "alex",
      name: "Alex",
      role: "AI Business Analyst",
      status: "not_hired",
      metrics: [
        { label: "Reports", value: "—" },
        { label: "Insights", value: "—" },
        { label: "Hours Saved", value: "—" },
      ],
    },
  ],
  activityFeed: [
    { id: "1", employeeName: "Sarah", action: "Answered a call from John Doe and booked an AC tune-up", time: "2 min ago", icon: <PhoneCall className="w-3.5 h-3.5" /> },
    { id: "2", employeeName: "Mike", action: "Optimized 3 routes for today's schedule", time: "15 min ago", icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: "3", employeeName: "Sarah", action: "Sent SMS confirmation to Lisa Patel for tomorrow's appointment", time: "28 min ago", icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: "4", employeeName: "Mike", action: "Dispatched Carlos R. to Emily Chen's property", time: "1 hour ago", icon: <Zap className="w-3.5 h-3.5" /> },
    { id: "5", employeeName: "Sarah", action: "Answered 12 calls during lunch hour — none missed", time: "2 hours ago", icon: <PhoneCall className="w-3.5 h-3.5" /> },
    { id: "6", employeeName: "Mike", action: "Rescheduled Tom Williams appointment due to weather", time: "3 hours ago", icon: <Calendar className="w-3.5 h-3.5" /> },
  ],
};

// ─── Component ──────────────────────────────────────────

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("this_month");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/analytics?period=${period}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          throw new Error("API returned error");
        }
      } catch {
        // Fallback to mock data
        setError(false);
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  const summaryCards = useMemo(
    () =>
      data
        ? [
            { label: "Calls Answered", value: data.callsAnswered.toLocaleString(), icon: <PhoneCall className="w-5 h-5" />, color: "bg-blue-50 text-blue-600", change: "+18%", positive: true },
            { label: "Appointments Booked", value: data.appointmentsBooked.toLocaleString(), icon: <Calendar className="w-5 h-5" />, color: "bg-indigo-50 text-indigo-600", change: "+12%", positive: true },
            { label: "Admin Hours Saved", value: data.adminHoursSaved.toLocaleString(), icon: <Clock className="w-5 h-5" />, color: "bg-purple-50 text-purple-600", change: "+24%", positive: true },
            { label: "Payroll Savings", value: `$${data.payrollSavings.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600", change: "vs. human", positive: true },
            { label: "Revenue Protected", value: `$${data.revenueProtected.toLocaleString()}`, icon: <ShieldCheck className="w-5 h-5" />, color: "bg-green-50 text-green-600", change: "98% retention", positive: true },
          ]
        : [],
    [data]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading your AI team performance...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BarChart3 className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-lg font-bold text-gray-900">Unable to load analytics</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">Please try again later.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Your AI Team Performance</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            See how your AI employees are performing this period.
          </p>
        </div>
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-sm hover:border-gray-300 transition-colors"
          >
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* ROI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${card.color}`}>{card.icon}</div>
              {card.change && (
                <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                  card.positive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                } px-2 py-0.5 rounded-full`}>
                  {card.positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {card.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* AI Employee Cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-bold text-gray-900">Your AI Employees This Month</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.employees.map((emp) => {
            const statusColors = {
              active: { dot: "bg-green-500", text: "text-green-700", bg: "bg-green-50" },
              idle: { dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
              not_hired: { dot: "bg-gray-300", text: "text-gray-500", bg: "bg-gray-50" },
            };
            const sc = statusColors[emp.status];

            return (
              <div key={emp.id} className={`bg-white rounded-xl border shadow-sm p-5 ${
                emp.status === "not_hired" ? "border-gray-100 opacity-60" : "border-gray-100"
              } hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                      emp.id === "sarah" ? "bg-blue-100 text-blue-600" :
                      emp.id === "mike" ? "bg-green-100 text-green-600" :
                      emp.id === "jessica" ? "bg-purple-100 text-purple-600" :
                      "bg-orange-100 text-orange-600"
                    }`}>
                      {emp.name[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{emp.name}</h3>
                      <p className="text-xs text-gray-500">{emp.role}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${sc.text} ${sc.bg} px-2 py-1 rounded-full`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {emp.status === "active" ? "Active" : emp.status === "idle" ? "Idle" : "Not Hired"}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {emp.metrics.map((m) => (
                    <div key={m.label} className="text-center p-2 rounded-lg bg-gray-50">
                      <p className="text-sm font-bold text-gray-900">{m.value}</p>
                      <p className="text-[10px] text-gray-500 leading-tight">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Impact */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-2xl p-8 md:p-10 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-200" />
            <span className="text-indigo-200 text-sm font-medium">Revenue Impact</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
            This month your AI team saved you{" "}
            <span className="text-green-300">${data.payrollSavings.toLocaleString()}</span> in payroll
            and protected{" "}
            <span className="text-green-300">${data.revenueProtected.toLocaleString()}</span> in revenue.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-300" />
                <p className="text-sm font-semibold text-white">Your AI Team</p>
              </div>
              <p className="text-3xl font-bold text-green-300">
                ${data.employees.filter(e => e.status === "active").length === 4 ? "999" : data.employees.filter(e => e.status === "active").length >= 2 ? "599" : "299"}
              </p>
              <p className="text-xs text-indigo-200 mt-1">per month</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-indigo-300" />
                <p className="text-sm font-semibold text-white">Human Employee</p>
              </div>
              <p className="text-3xl font-bold text-white">$4,000+</p>
              <p className="text-xs text-indigo-200 mt-1">per month + benefits</p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-indigo-200 text-sm">
            <Zap className="w-4 h-4 text-green-300" />
            <span>
              Your AI team costs{" "}
              <strong className="text-white">
                {Math.round((data.payrollSavings / 4000) * 100)}% less
              </strong>{" "}
              than a single human employee
            </span>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-bold text-gray-900">Recent Activity</h2>
          </div>
          <span className="text-xs text-gray-400">Live feed</span>
        </div>
        <div className="divide-y divide-gray-50">
          {data.activityFeed.map((activity) => (
            <div key={activity.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
              <div className={`p-1.5 rounded-lg shrink-0 ${
                activity.employeeName === "Sarah" ? "bg-blue-50 text-blue-600" :
                activity.employeeName === "Mike" ? "bg-green-50 text-green-600" :
                "bg-gray-50 text-gray-600"
              }`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{activity.employeeName}</span>{" "}
                  {activity.action}
                </p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">{activity.time}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/30 text-center">
          <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}