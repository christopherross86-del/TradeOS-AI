import Link from "next/link";
import { 
  PhoneCall, 
  Calendar, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  UserCheck
} from "lucide-react";

export default function LandingPage() {
  const employees = [
    {
      name: "Sarah",
      role: "AI Receptionist",
      description: "Answers every call, books jobs, and answers customer questions 24/7.",
      icon: <PhoneCall className="w-10 h-10 text-indigo-600" />,
      color: "bg-indigo-50",
    },
    {
      name: "Mike",
      role: "AI Dispatcher",
      description: "Coordinates crews, optimizes routes, and keeps customers updated on ETAs.",
      icon: <Calendar className="w-10 h-10 text-green-600" />,
      color: "bg-green-50",
    },
    {
      name: "Jessica",
      role: "AI Office Manager",
      description: "Manages paperwork, sends invoices, and handles follow-ups automatically.",
      icon: <FileText className="w-10 h-10 text-purple-600" />,
      color: "bg-purple-50",
    },
    {
      name: "Alex",
      role: "AI Business Analyst",
      description: "Analyzes your numbers to find profit leaks and growth opportunities.",
      icon: <TrendingUp className="w-10 h-10 text-orange-600" />,
      color: "bg-orange-50",
    },
  ];

  const plans = [
    {
      name: "Sarah (AI Receptionist)",
      price: "$299",
      features: [
        "24/7 Call Answering",
        "Appointment Booking",
        "Customer FAQ handling",
        "SMS job confirmations",
      ],
    },
    {
      name: "Sarah + Mike",
      price: "$599",
      features: [
        "Everything in Sarah",
        "Automated Dispatching",
        "Route Optimization",
        "Live Crew Tracking",
      ],
      featured: true,
    },
    {
      name: "Full AI Office",
      price: "$999",
      features: [
        "Everything in Sarah + Mike",
        "Invoicing & Estimates",
        "Profitability Analytics",
        "Custom Automation Rules",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <UserCheck className="h-6 w-6 text-indigo-600" />
          <span className="ml-2 text-xl font-bold tracking-tight">OperatorAI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Employees
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700" href="/login">
            Login
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Your first AI employee. <br className="hidden sm:inline" />
                  Hired in 10 minutes.
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Stop missing calls and drowning in paperwork. Hire AI agents that answer phones, 
                  book jobs, and manage your office so you can focus on growth.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register" className="inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 px-8 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-700">
                  Hire Sarah Today
                </Link>
                <Link href="#demo" className="inline-flex h-11 items-center justify-center rounded-md border border-gray-200 bg-white px-8 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950">
                  Watch Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* AI Employees Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Meet the Team</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl">
                Our AI employees are specialized in different parts of your business.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {employees.map((emp) => (
                <div key={emp.name} className="flex flex-col p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className={`p-3 rounded-lg w-fit mb-4 ${emp.color}`}>
                    {emp.icon}
                  </div>
                  <h3 className="text-xl font-bold">{emp.name}</h3>
                  <p className="text-sm text-indigo-600 font-semibold mb-2">{emp.role}</p>
                  <p className="text-gray-500 text-sm flex-1">{emp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Predictable Pricing</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                No hourly rates. No benefits. No drama. Just results.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div 
                  key={plan.name} 
                  className={`flex flex-col p-8 rounded-2xl border ${plan.featured ? 'border-indigo-600 shadow-lg scale-105' : 'border-gray-200'}`}
                >
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">/mo</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href="/register" 
                    className={`inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      plan.featured 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-white border hover:bg-gray-50'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-indigo-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Ready to automate your office?
            </h2>
            <p className="mx-auto max-w-[600px] text-indigo-100 md:text-xl mb-8">
              Join hundreds of service businesses that have scaled without hiring more office staff.
            </p>
            <Link 
              href="/register" 
              className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-indigo-600 shadow transition-colors hover:bg-gray-100"
            >
              Start Your 7-Day Free Trial <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 OperatorAI Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
