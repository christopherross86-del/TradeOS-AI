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
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Activity,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--primary))]" />
          <p className="text-sm font-medium text-[rgb(var(--muted-foreground))]">Assembling your workspace...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { 
      name: "Total Revenue", 
      value: `$${data.revenue.toLocaleString()}`, 
      change: "+12.5%", 
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    { 
      name: "Calls Answered", 
      value: data.callsAnswered.toLocaleString(), 
      change: "+18%", 
      icon: <PhoneCall className="w-5 h-5" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    { 
      name: "Jobs Booked", 
      value: data.appointmentsBooked.toString(), 
      change: "+5.4%", 
      icon: <Calendar className="w-5 h-5" />,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      name: "Hours Saved", 
      value: data.adminHoursSaved.toString(), 
      change: "+24h", 
      icon: <Zap className="w-5 h-5" />,
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Welcome back</h2>
          <p className="text-[rgb(var(--muted-foreground))]">Here's what's happening with your business today.</p>
        </div>
        {error && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
            <Activity className="w-3 h-3" /> Using offline data
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card group">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                {stat.icon}
              </div>
              <div className={cn(
                "flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full",
                stat.change.startsWith("+") ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
              )}>
                {stat.change.startsWith("+") ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted-foreground))] opacity-70">{stat.name}</h3>
            <p className="text-2xl font-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-[rgb(var(--primary))]" />
              Recent Activity
            </h3>
            <button className="text-xs font-bold text-[rgb(var(--primary))] hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {data.activityFeed.length === 0 ? (
              <p className="text-sm text-[rgb(var(--muted-foreground))] text-center py-12">No recent activity found.</p>
            ) : (
              data.activityFeed.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[rgb(var(--muted))] transition-colors border border-transparent hover:border-[rgb(var(--border))]">
                  <div className="w-10 h-10 rounded-full bg-white border border-[rgb(var(--border))] shadow-sm flex items-center justify-center font-bold text-[rgb(var(--primary))] shrink-0">
                    {item.employeeName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[rgb(var(--foreground))]">
                      <span className="font-bold">{item.employeeName}</span> {item.action}
                    </p>
                    <p className="text-[10px] font-medium text-[rgb(var(--muted-foreground))] uppercase tracking-tight mt-1">{item.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[rgb(var(--primary))]" />
              Team Status
            </h3>
          </div>
          
          <div className="space-y-6">
            {data.employees.map((agent) => (
              <div key={agent.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[rgb(var(--muted))] flex items-center justify-center font-bold text-[rgb(var(--muted-foreground))] transition-colors group-hover:bg-[rgb(var(--primary))] group-hover:text-white">
                    {agent.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{agent.name}</p>
                    <p className="text-[10px] font-bold text-[rgb(var(--muted-foreground))] uppercase tracking-widest">{agent.type.toLowerCase()}</p>
                  </div>
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tighter",
                  agent.status === "ACTIVE" 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                    : "bg-slate-50 border-slate-100 text-slate-400"
                )}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", agent.status === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                  {agent.status === "ACTIVE" ? "Online" : "Offline"}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-[rgb(var(--border))]">
            <button className="w-full btn-secondary text-xs py-2.5">
              Hire More Agents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
