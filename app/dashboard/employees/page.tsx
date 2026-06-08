"use client";

import { useState, useEffect } from "react";
import {
  PhoneCall,
  CalendarClock,
  FileText,
  TrendingUp,
  CheckCircle2,
  Zap,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";

type Employee = {
  id: string;
  name: string;
  role: string;
  tagline: string;
  description: string;
  color: {
    bg: string;
    light: string;
    border: string;
    text: string;
    button: string;
    buttonHover: string;
    dot: string;
    initials: string;
    initialsBg: string;
    gradient: string;
  };
  icon: React.ReactNode;
  benefits: string[];
  price: number;
  priceLabel: string;
  requires?: string;
  stats: { label: string; value: string }[];
};

const employees: Employee[] = [
  {
    id: "sarah",
    name: "Sarah",
    role: "AI Receptionist",
    tagline: "Never miss another customer",
    description:
      "Answers every call 24/7, books appointments instantly, handles customer questions, and sends SMS confirmations — so you never lose a lead.",
    color: {
      bg: "bg-blue-50",
      light: "bg-blue-50/80",
      border: "border-blue-200",
      text: "text-blue-600",
      button: "bg-blue-600",
      buttonHover: "hover:bg-blue-700",
      dot: "bg-blue-500",
      initials: "text-blue-600",
      initialsBg: "bg-blue-100",
      gradient: "from-blue-500 to-blue-600",
    },
    icon: <PhoneCall className="w-6 h-6" />,
    benefits: [
      "Answers calls 24/7 — never miss a lead",
      "Books jobs directly into your calendar",
      "Handles FAQs & basic customer questions",
      "Sends SMS confirmations & reminders",
    ],
    price: 299,
    priceLabel: "$299/mo",
    stats: [
      { label: "Call pickup rate", value: "99%" },
      { label: "Jobs booked/week", value: "47" },
      { label: "Hours saved/week", value: "40+" },
    ],
  },
  {
    id: "mike",
    name: "Mike",
    role: "AI Dispatcher",
    tagline: "Keep crews organized",
    description:
      "Coordinates your field crews, optimizes routes, sends real-time ETAs to customers, and handles rescheduling when things change.",
    color: {
      bg: "bg-green-50",
      light: "bg-green-50/80",
      border: "border-green-200",
      text: "text-green-600",
      button: "bg-green-600",
      buttonHover: "hover:bg-green-700",
      dot: "bg-green-500",
      initials: "text-green-600",
      initialsBg: "bg-green-100",
      gradient: "from-green-500 to-green-600",
    },
    icon: <CalendarClock className="w-6 h-6" />,
    benefits: [
      "Optimizes crew routes automatically",
      "Sends live ETAs to customers",
      "Handles rescheduling & emergencies",
      "Tracks crew productivity",
    ],
    price: 300,
    priceLabel: "+$300/mo",
    requires: "sarah",
    stats: [
      { label: "Route efficiency", value: "94%" },
      { label: "Crews dispatched/day", value: "12" },
      { label: "Hours saved/week", value: "30+" },
    ],
  },
  {
    id: "jessica",
    name: "Jessica",
    role: "AI Office Manager",
    tagline: "Handle paperwork automatically",
    description:
      "Creates and sends invoices, manages estimates, handles follow-up emails, and keeps your paperwork organized without lifting a finger.",
    color: {
      bg: "bg-purple-50",
      light: "bg-purple-50/80",
      border: "border-purple-200",
      text: "text-purple-600",
      button: "bg-purple-600",
      buttonHover: "hover:bg-purple-700",
      dot: "bg-purple-500",
      initials: "text-purple-600",
      initialsBg: "bg-purple-100",
      gradient: "from-purple-500 to-purple-600",
    },
    icon: <FileText className="w-6 h-6" />,
    benefits: [
      "Generates invoices & estimates",
      "Sends automated follow-ups",
      "Manages customer records",
      "Tracks outstanding payments",
    ],
    price: 400,
    priceLabel: "Bundle add-on",
    requires: "sarah",
    stats: [
      { label: "Invoices sent/week", value: "85" },
      { label: "Payment follow-ups", value: "Auto" },
      { label: "Hours saved/week", value: "25+" },
    ],
  },
  {
    id: "alex",
    name: "Alex",
    role: "AI Business Analyst",
    tagline: "Help you grow",
    description:
      "Analyzes your revenue, profit margins, customer trends, and operational data to find hidden growth opportunities and leaks.",
    color: {
      bg: "bg-orange-50",
      light: "bg-orange-50/80",
      border: "border-orange-200",
      text: "text-orange-600",
      button: "bg-orange-600",
      buttonHover: "hover:bg-orange-700",
      dot: "bg-orange-500",
      initials: "text-orange-600",
      initialsBg: "bg-orange-100",
      gradient: "from-orange-500 to-orange-600",
    },
    icon: <TrendingUp className="w-6 h-6" />,
    benefits: [
      "Revenue & profit analytics",
      "Customer trend insights",
      "Identifies profit leaks",
      "Monthly growth reports",
    ],
    price: 0,
    priceLabel: "Included in Full Office",
    requires: "sarah",
    stats: [
      { label: "Revenue analyzed", value: "100%" },
      { label: "Reports generated", value: "Weekly" },
      { label: "Growth suggestions", value: "5+" },
    ],
  },
];

function calculateTotal(hired: Set<string>): { total: number; label: string; description: string } {
  const isSarahHired = hired.has("sarah");
  const isMikeHired = hired.has("mike");
  const isJessicaHired = hired.has("jessica");
  const isAlexHired = hired.has("alex");
  const allFour = isSarahHired && isMikeHired && isJessicaHired && isAlexHired;
  const sarahPlusMike = isSarahHired && isMikeHired && !isJessicaHired && !isAlexHired;

  if (allFour) {
    return { total: 999, label: "Full AI Office", description: "Complete AI-powered team" };
  }
  if (sarahPlusMike) {
    return { total: 599, label: "Sarah + Mike", description: "Reception + Dispatch" };
  }
  if (isSarahHired && !isMikeHired) {
    return { total: 299, label: "Sarah (Receptionist)", description: "AI call answering & booking" };
  }
  // Edge cases: any other combination
  let total = 0;
  if (isSarahHired) total += 299;
  if (isMikeHired) total += 300;
  if (isJessicaHired) total += 400;
  if (isAlexHired) total += 400;
  
  if (total === 0) {
    return { total: 0, label: "No employees hired", description: "Hire your first AI employee above" };
  }
  return { total, label: "Custom team", description: "Your selected AI employees" };
}

export default function EmployeesPage() {
  const [hired, setHired] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employees");
        if (res.ok) {
          const json = await res.json();
          const activeIds = new Set(
            json.filter((e: { status: string }) => e.status === "ACTIVE").map((e: { id: string }) => e.id)
          );
          setHired(activeIds);
        }
      } catch {
        // Fallback to defaults
        setHired(new Set(["sarah"]));
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const toggleHire = async (id: string) => {
    const isCurrentlyHired = hired.has(id);
    const newStatus = isCurrentlyHired ? "INACTIVE" : "ACTIVE";

    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setHired((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          return next;
        });
      }
    } catch {
      // Silently fail - UI stays in current state
    }
  };

  const isHired = (id: string) => hired.has(id);
  const billing = calculateTotal(hired);
  const hiredCount = hired.size;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-8 md:p-12">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex -space-x-2">
              {["S", "M", "J", "A"].map((letter, i) => (
                <div
                  key={letter}
                  className={`w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-xs font-bold text-white ${
                    i === 0 ? "bg-blue-500" : i === 1 ? "bg-green-500" : i === 2 ? "bg-purple-500" : "bg-orange-500"
                  }`}
                >
                  {letter}
                </div>
              ))}
            </div>
            <span className="text-indigo-200 text-sm font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Meet your AI team
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Hire Your AI Team
          </h1>
          <p className="text-indigo-100 md:text-lg max-w-2xl">
            Build your perfect office. Start with Sarah to answer calls, then add
            team members as you grow. No hiring headaches, no payroll, no drama.
          </p>
          {hiredCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white">
              <CheckCircle2 className="w-4 h-4 text-green-300" />
              <span>
                <strong>{hiredCount}</strong> AI employee{hiredCount !== 1 ? "s" : ""} on your team
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employees.map((emp, i) => {
          const hired = isHired(emp.id);
          const allRequiredHired = !emp.requires || isHired(emp.requires);

          return (
            <div
              key={emp.id}
              style={{animationDelay: `${i * 0.1}s`}}
              className={`relative group rounded-2xl border-2 transition-all duration-300 animate-slide-up ${
                hired
                  ? `${emp.color.border} shadow-lg scale-[1.01]`
                  : "border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300"
              } bg-white overflow-hidden`}
            >
              {/* Hired indicator stripe */}
              {hired && (
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${emp.color.gradient}`} />
              )}

              <div className="p-6">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                      className={`w-14 h-14 rounded-xl ${emp.color.initialsBg} flex items-center justify-center ${emp.color.initials} transition-all duration-300 ${
                        hired ? "ring-2 ring-offset-2 ring-gray-300" : ""
                      }`}
                    >
                      <span className="text-xl font-bold">{emp.name[0]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{emp.name}</h3>
                        {hired && (
                          <span className={`text-xs font-semibold ${emp.color.text} ${emp.color.light} px-2 py-0.5 rounded-full flex items-center gap-1`}>
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                      <p className={`text-sm font-semibold ${emp.color.text}`}>{emp.role}</p>
                      <p className="text-xs text-gray-400">{emp.priceLabel}</p>
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`p-2.5 rounded-lg transition-colors ${
                      hired ? emp.color.bg : "bg-gray-50"
                    } ${emp.color.text}`}
                  >
                    {emp.icon}
                  </div>
                </div>

                {/* Tagline & Description */}
                <p className="text-sm font-medium text-gray-700 mb-1">{emp.tagline}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  {emp.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-2 mb-4">
                  {emp.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${emp.color.text}`} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {emp.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className={`text-center p-2 rounded-lg ${emp.color.light} border ${emp.color.border}/50`}
                    >
                      <p className={`text-sm font-bold ${emp.color.text}`}>{stat.value}</p>
                      <p className="text-[10px] text-gray-500 leading-tight">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Hire Button */}
                <button
                  onClick={() => toggleHire(emp.id)}
                  disabled={!allRequiredHired && !hired}
                  className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    hired
                      ? `bg-gray-100 text-gray-700 border border-gray-200 ${emp.color.buttonHover} hover:bg-gray-200`
                      : allRequiredHired
                      ? `${emp.color.button} text-white hover:shadow-lg active:scale-[0.98]`
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                >
                  {hired ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Hired
                    </>
                  ) : allRequiredHired ? (
                    <>
                      <Zap className="w-4 h-4" />
                      Hire {emp.name}
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      Requires Sarah first
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing Summary */}
      <div
        className={`rounded-2xl border-2 p-6 md:p-8 transition-all duration-300 ${
          hired.size > 0
            ? "border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-white shadow-lg"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl ${
                hired.size > 0 ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"
              }`}
            >
              {hired.size > 0 ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <PhoneCall className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {hired.size > 0 ? "Your AI Team" : "No employees hired yet"}
              </h3>
              <p className="text-sm text-gray-500">
                {hired.size > 0
                  ? `You've selected ${hired.size} AI employee${hired.size !== 1 ? "s" : ""}`
                  : "Select your first AI employee above to get started"}
              </p>
              {hired.size > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {employees
                    .filter((e) => isHired(e.id))
                    .map((emp) => (
                      <span
                        key={emp.id}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${emp.color.light} ${emp.color.text} border ${emp.color.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${emp.color.dot}`} />
                        {emp.name} &middot; {emp.role.replace("AI ", "")}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-2">
              {hired.size > 0 && (
                <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-full">
                  {billing.label}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900">
                ${billing.total.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">/mo</span>
            </div>
            {hired.size > 0 && (
              <p className="text-xs text-gray-400 mt-1">{billing.description}</p>
            )}
            {hired.size > 0 && (
              <button className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-indigo-600 px-5 py-2 rounded-xl hover:bg-indigo-700 transition-colors hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]">
                Confirm Team
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Pricing breakdown */}
        {hired.size > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                className={`p-3 rounded-xl border text-center transition-all ${
                  billing.total === 299
                    ? "border-blue-200 bg-blue-50/80 ring-1 ring-blue-200"
                    : "border-gray-200 bg-gray-50/50"
                }`}
              >
                <p className="text-xs font-medium text-gray-500">Receptionist</p>
                <p className="text-lg font-bold text-gray-900">$299</p>
                <p className="text-xs text-gray-400">Sarah only</p>
              </div>
              <div
                className={`p-3 rounded-xl border text-center transition-all ${
                  billing.total === 599
                    ? "border-green-200 bg-green-50/80 ring-1 ring-green-200"
                    : "border-gray-200 bg-gray-50/50"
                }`}
              >
                <p className="text-xs font-medium text-gray-500">Reception + Dispatch</p>
                <p className="text-lg font-bold text-gray-900">$599</p>
                <p className="text-xs text-gray-400">Sarah + Mike</p>
              </div>
              <div
                className={`p-3 rounded-xl border text-center transition-all ${
                  billing.total === 999
                    ? "border-purple-200 bg-purple-50/80 ring-1 ring-purple-200"
                    : "border-gray-200 bg-gray-50/50"
                }`}
              >
                <p className="text-xs font-medium text-gray-500">Full AI Office</p>
                <p className="text-lg font-bold text-gray-900">$999</p>
                <p className="text-xs text-gray-400">All 4 employees</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}