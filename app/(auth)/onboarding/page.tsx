"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserCheck,
  Building2,
  MapPin,
  HelpCircle,
  Users,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CalendarClock,
  FileText,
  TrendingUp,
  Zap,
  ChevronRight,
  Loader2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────
type OnboardingData = {
  // Step 1
  businessName: string;
  industry: string;
  servicesOffered: string;
  // Step 2
  serviceArea: string;
  hoursOfOperation: string;
  employeeCount: string;
  // Step 3
  commonQuestions: string;
  paymentTerms: string;
  // Step 4
  hiredEmployees: string[];
};

type Employee = {
  id: string;
  name: string;
  role: string;
  tagline: string;
  color: string;
  bgColor: string;
  lightBg: string;
  textColor: string;
  borderColor: string;
  icon: React.ReactNode;
  benefits: string[];
  price: string;
};

// ─── Data ────────────────────────────────────────────────
const industries = [
  "HVAC",
  "Plumbing",
  "Electrical",
  "Roofing",
  "Landscaping",
  "Cleaning",
  "Home Services",
  "Construction",
  "Other",
];

const hoursOptions = ["Weekdays 8-5", "Weekdays 7-7", "Weekends only", "24/7", "Custom hours"];

const employees: Employee[] = [
  {
    id: "sarah",
    name: "Sarah",
    role: "AI Receptionist",
    tagline: "Never miss another customer",
    color: "blue",
    bgColor: "bg-blue-500",
    lightBg: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    icon: <PhoneCall className="w-5 h-5" />,
    benefits: [
      "Answers calls 24/7",
      "Books jobs automatically",
      "Sends SMS confirmations",
    ],
    price: "$299/mo",
  },
  {
    id: "mike",
    name: "Mike",
    role: "AI Dispatcher",
    tagline: "Keep crews organized",
    color: "green",
    bgColor: "bg-green-500",
    lightBg: "bg-green-50",
    textColor: "text-green-600",
    borderColor: "border-green-200",
    icon: <CalendarClock className="w-5 h-5" />,
    benefits: [
      "Optimizes routes",
      "Sends live ETAs",
      "Handles rescheduling",
    ],
    price: "+$300/mo",
  },
  {
    id: "jessica",
    name: "Jessica",
    role: "AI Office Manager",
    tagline: "Handle paperwork automatically",
    color: "purple",
    bgColor: "bg-purple-500",
    lightBg: "bg-purple-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    icon: <FileText className="w-5 h-5" />,
    benefits: [
      "Generates invoices",
      "Sends follow-ups",
      "Tracks payments",
    ],
    price: "Add-on",
  },
  {
    id: "alex",
    name: "Alex",
    role: "AI Business Analyst",
    tagline: "Help you grow",
    color: "orange",
    bgColor: "bg-orange-500",
    lightBg: "bg-orange-50",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    icon: <TrendingUp className="w-5 h-5" />,
    benefits: [
      "Revenue analytics",
      "Profit leak detection",
      "Growth reports",
    ],
    price: "Included",
  },
];

const initialData: OnboardingData = {
  businessName: "",
  industry: "",
  servicesOffered: "",
  serviceArea: "",
  hoursOfOperation: "",
  employeeCount: "",
  commonQuestions: "",
  paymentTerms: "",
  hiredEmployees: ["sarah"],
};

// ─── Step Components ─────────────────────────────────────

function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all duration-300 ${
                i < currentStep
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : i === currentStep
                  ? "bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md shadow-indigo-200"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i < currentStep ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                i < currentStep ? "bg-indigo-400" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between px-1">
        {["Business", "Area", "FAQs", "Team"].map((label, i) => (
          <span
            key={label}
            className={`text-xs font-medium transition-colors ${
              i <= currentStep ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function StepBusinessInfo({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Tell us about your business</h2>
        <p className="text-sm text-gray-500 mt-1">
          We'll tailor your AI team to your industry.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1.5">
            Business name
          </label>
          <input
            id="businessName"
            type="text"
            required
            value={data.businessName}
            onChange={(e) => onChange({ businessName: e.target.value })}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm placeholder:text-gray-400"
            placeholder="e.g. Reliable HVAC Services"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1.5">
            Industry
          </label>
          <select
            id="industry"
            required
            value={data.industry}
            onChange={(e) => onChange({ industry: e.target.value })}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm bg-white"
          >
            <option value="">Select your industry</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="servicesOffered" className="block text-sm font-medium text-gray-700 mb-1.5">
            Services you offer
          </label>
          <input
            id="servicesOffered"
            type="text"
            value={data.servicesOffered}
            onChange={(e) => onChange({ servicesOffered: e.target.value })}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm placeholder:text-gray-400"
            placeholder="e.g. AC repair, heating installation, maintenance"
          />
        </div>
      </div>
    </div>
  );
}

function StepServiceArea({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Where do you operate?</h2>
        <p className="text-sm text-gray-500 mt-1">
          Help us understand your coverage area and schedule.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="serviceArea" className="block text-sm font-medium text-gray-700 mb-1.5">
            City / Service area
          </label>
          <input
            id="serviceArea"
            type="text"
            required
            value={data.serviceArea}
            onChange={(e) => onChange({ serviceArea: e.target.value })}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm placeholder:text-gray-400"
            placeholder="e.g. Austin, TX metro area"
          />
        </div>

        <div>
          <label htmlFor="hoursOfOperation" className="block text-sm font-medium text-gray-700 mb-1.5">
            Hours of operation
          </label>
          <select
            id="hoursOfOperation"
            required
            value={data.hoursOfOperation}
            onChange={(e) => onChange({ hoursOfOperation: e.target.value })}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm bg-white"
          >
            <option value="">Select hours</option>
            {hoursOptions.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700 mb-1.5">
            Number of field employees
          </label>
          <input
            id="employeeCount"
            type="number"
            min="1"
            max="500"
            required
            value={data.employeeCount}
            onChange={(e) => onChange({ employeeCount: e.target.value })}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm placeholder:text-gray-400"
            placeholder="e.g. 5"
          />
        </div>
      </div>
    </div>
  );
}

function StepFAQs({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Knowledge is power</h2>
        <p className="text-sm text-gray-500 mt-1">
          Teach Sarah what your customers commonly ask — she'll handle them automatically.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="commonQuestions" className="block text-sm font-medium text-gray-700 mb-1.5">
            Common customer questions
          </label>
          <textarea
            id="commonQuestions"
            rows={4}
            value={data.commonQuestions}
            onChange={(e) => onChange({ commonQuestions: e.target.value })}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm placeholder:text-gray-400 resize-none"
            placeholder={`e.g.\n- How much do you charge for a service call?\n- Do you offer emergency service?\n- What areas do you cover?`}
          />
          <p className="text-xs text-gray-400 mt-1.5">
            List as many as you like. Sarah will learn from this and answer calls naturally.
          </p>
        </div>

        <div>
          <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-1.5">
            Payment terms
          </label>
          <input
            id="paymentTerms"
            type="text"
            value={data.paymentTerms}
            onChange={(e) => onChange({ paymentTerms: e.target.value })}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm placeholder:text-gray-400"
            placeholder="e.g. Payment due upon completion, credit cards accepted"
          />
        </div>
      </div>
    </div>
  );
}

function StepTeamSelection({
  data,
  onToggleEmployee,
}: {
  data: OnboardingData;
  onToggleEmployee: (id: string) => void;
}) {
  const isHired = (id: string) => data.hiredEmployees.includes(id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Build your AI team</h2>
        <p className="text-sm text-gray-500 mt-1">
          We recommend starting with Sarah. You can always add more team members later.
        </p>
      </div>

      {/* Recommendation banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-indigo-900">Recommended for new businesses</p>
          <p className="text-xs text-indigo-600 mt-0.5">
            Sarah (AI Receptionist) handles 90% of incoming calls and books jobs automatically. 
            Most businesses start here and grow from there.
          </p>
        </div>
      </div>

      {/* Employee cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {employees.map((emp) => {
          const hired = isHired(emp.id);
          return (
            <div
              key={emp.id}
              className={`relative rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                hired
                  ? `${emp.borderColor} bg-white shadow-md`
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
              onClick={() => onToggleEmployee(emp.id)}
            >
              {hired && (
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${emp.color === "blue" ? "from-blue-400 to-blue-600" : emp.color === "green" ? "from-green-400 to-green-600" : emp.color === "purple" ? "from-purple-400 to-purple-600" : "from-orange-400 to-orange-600"}`} />
              )}
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 transition-all ${
                      hired ? `${emp.bgColor} ring-2 ring-offset-2 ${emp.borderColor}` : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {emp.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">{emp.name}</h3>
                      {hired && (
                        <span className={`text-[10px] font-semibold ${emp.textColor} ${emp.lightBg} px-1.5 py-0.5 rounded-full`}>
                          Hired
                        </span>
                      )}
                    </div>
                    <p className={`text-xs font-semibold ${emp.textColor}`}>{emp.role}</p>
                    <p className="text-[10px] text-gray-400">{emp.price}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${hired ? emp.lightBg : "bg-gray-50"} ${emp.textColor}`}>
                    {emp.icon}
                  </div>
                </div>

                <p className="text-xs font-medium text-gray-700 mb-2">{emp.tagline}</p>
                <ul className="space-y-1">
                  {emp.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <CheckCircle2 className={`w-3 h-3 shrink-0 ${emp.textColor}`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Wizard ─────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const totalSteps = 4;

  const updateField = (updates: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const toggleEmployee = (id: string) => {
    setFormData((prev) => {
      const employees = [...prev.hiredEmployees];
      if (employees.includes(id)) {
        // Don't let them remove Sarah (she's the foundation)
        if (id === "sarah") return prev;
        return { ...prev, hiredEmployees: employees.filter((e) => e !== id) };
      }
      // If adding Mike/Jessica/Alex, ensure Sarah is hired
      if (!employees.includes("sarah")) {
        return { ...prev, hiredEmployees: [...employees, id, "sarah"] };
      }
      return { ...prev, hiredEmployees: [...employees, id] };
    });
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return formData.businessName.trim() && formData.industry.trim();
      case 1:
        return formData.serviceArea.trim() && formData.hoursOfOperation.trim() && formData.employeeCount.trim();
      case 2:
        return true; // FAQs are optional
      case 3:
        return formData.hiredEmployees.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const handleLaunch = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.message || "Something went wrong launching your team.");
      }
    } catch {
      setError("Unable to connect. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepTitle = [
    "Business Information",
    "Service Area",
    "FAQs & Policies",
    "Choose Your AI Team",
  ][step];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Simple header */}
      <header className="px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <UserCheck className="h-6 w-6 text-indigo-600" />
          <span className="text-lg font-bold tracking-tight text-gray-900">OperatorAI</span>
        </Link>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl">
          {/* Progress */}
          <div className="mb-10">
            <ProgressBar currentStep={step} totalSteps={totalSteps} />
            <p className="text-xs text-gray-400 text-center mt-3">
              Step {step + 1} of {totalSteps}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 transition-all duration-300">
            {/* Step title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                {step === 0 && <Building2 className="w-5 h-5" />}
                {step === 1 && <MapPin className="w-5 h-5" />}
                {step === 2 && <HelpCircle className="w-5 h-5" />}
                {step === 3 && <Users className="w-5 h-5" />}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{stepTitle}</h1>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}

            {/* Step content */}
            <div className="min-h-[280px] animate-fade-in" key={step}>
              {step === 0 && <StepBusinessInfo data={formData} onChange={updateField} />}
              {step === 1 && <StepServiceArea data={formData} onChange={updateField} />}
              {step === 2 && <StepFAQs data={formData} onChange={updateField} />}
              {step === 3 && <StepTeamSelection data={formData} onToggleEmployee={toggleEmployee} />}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <div>
                {step > 0 ? (
                  <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}
              </div>

              {step < totalSteps - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-indigo-600 px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleLaunch}
                  disabled={loading || !canProceed()}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-2.5 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Launching...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Launch My AI Team
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Friendly footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            You can change everything later in Settings. Your AI team starts working immediately.
          </p>
        </div>
      </div>
    </div>
  );
}