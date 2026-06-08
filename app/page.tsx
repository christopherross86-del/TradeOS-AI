import Link from "next/link";
import { 
  PhoneCall, 
  Calendar, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  Sparkles,
  Star,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  const employees = [
    {
      name: "Sarah",
      role: "AI Receptionist",
      description: "Answers every call 24/7, books jobs instantly, and handles customer questions automatically.",
      icon: <PhoneCall className="w-10 h-10 text-indigo-600" />,
      color: "bg-indigo-50",
      border: "border-indigo-100",
      stats: "Answers 99% of calls",
    },
    {
      name: "Mike",
      role: "AI Dispatcher",
      description: "Coordinates crews, optimizes routes, and keeps customers updated on ETAs in real time.",
      icon: <Calendar className="w-10 h-10 text-emerald-600" />,
      color: "bg-emerald-50",
      border: "border-emerald-100",
      stats: "Optimizes 100% of routes",
    },
    {
      name: "Jessica",
      role: "AI Office Manager",
      description: "Manages paperwork, sends invoices, and handles follow-ups completely automatically.",
      icon: <FileText className="w-10 h-10 text-violet-600" />,
      color: "bg-violet-50",
      border: "border-violet-100",
      stats: "Saves 25+ hrs/week",
    },
    {
      name: "Alex",
      role: "AI Business Analyst",
      description: "Analyzes your numbers to find profit leaks and growth opportunities you're missing.",
      icon: <TrendingUp className="w-10 h-10 text-orange-600" />,
      color: "bg-orange-50",
      border: "border-orange-100",
      stats: "Finds 5+ growth insights",
    },
  ];

  const plans = [
    {
      name: "Receptionist",
      subtitle: "Sarah \u2014 AI Receptionist",
      price: "$299",
      tagline: "Never miss a lead again",
      features: ["24/7 Call Answering", "Appointment Booking", "Customer FAQ handling", "SMS job confirmations"],
      cta: "Hire Sarah",
      featured: false,
    },
    {
      name: "Reception + Dispatch",
      subtitle: "Sarah + Mike",
      price: "$599",
      tagline: "Full front-office automation",
      features: ["Everything in Sarah Receptionist", "Automated Dispatching", "Route Optimization", "Live Crew Tracking", "Priority Support"],
      cta: "Hire the Duo",
      featured: true,
    },
    {
      name: "Full AI Office",
      subtitle: "The Complete Team",
      price: "$999",
      tagline: "Your entire office, automated",
      features: ["Everything in Reception + Dispatch", "Invoicing & Estimates", "Profitability Analytics", "Custom Automation Rules", "Dedicated Account Manager"],
      cta: "Hire the Team",
      featured: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {/* Sticky header with backdrop blur */}
      <header className="px-4 lg:px-8 h-16 flex items-center border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <div className="p-1.5 rounded-lg bg-indigo-50">
            <UserCheck className="h-5 w-5 text-indigo-600" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">OperatorAI</span>
          <span className="hidden sm:inline text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full ml-1">Beta</span>
        </Link>
        <nav className="ml-auto flex items-center gap-2 sm:gap-4">
          <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all" href="#features">Employees</Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all" href="#pricing">Pricing</Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all" href="/login">Sign In</Link>
          <Link className="text-sm font-semibold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md active:scale-[0.97]" href="/register">Start Free Trial</Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-white to-white" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-indigo-100/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-64 h-64 bg-purple-100/20 rounded-full blur-3xl" />

          <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 lg:py-40">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-700">AI employees are here &mdash; hire yours in under 10 minutes</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] animate-slide-up">
                Your first AI employee.<br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Hired in 10 minutes.</span>
              </h1>

              <p className="mt-6 max-w-[650px] text-lg sm:text-xl text-gray-500 leading-relaxed animate-slide-up" style={{animationDelay:"0.1s"}}>
                Stop missing calls and drowning in paperwork. Hire AI agents that answer phones, book jobs, and manage your office &mdash; so you can focus on growing your business.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-slide-up" style={{animationDelay:"0.2s"}}>
                <Link href="/register" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 active:scale-[0.97]">
                  Hire Sarah Today <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#features" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-md active:scale-[0.97]">
                  Meet the Team <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6 text-sm text-gray-400 animate-fade-in" style={{animationDelay:"0.4s"}}>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>4.9/5 from 200+ businesses</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-gray-200" />
                <div className="hidden sm:flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>98% call pickup rate</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-4">Meet Your Team</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">Specialists, not generalists</h2>
              <p className="mt-4 max-w-[700px] text-gray-500 text-lg">Each AI employee is expertly trained for their specific role &mdash; just like hiring real people, but without the payroll, benefits, or HR headaches.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {employees.map((emp, i) => (
                <div key={emp.name} className={`group flex flex-col p-6 bg-white rounded-2xl shadow-sm border ${emp.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up`} style={{animationDelay:`${i*0.1}s`}}>
                  <div className={`p-3.5 rounded-xl w-fit mb-5 ${emp.color} group-hover:scale-110 transition-transform duration-300`}>{emp.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900">{emp.name}</h3>
                  <p className="text-sm font-semibold text-indigo-600 mb-2">{emp.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{emp.description}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      {emp.stats}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="w-full py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-4">Pricing</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">Simple, Predictable Pricing</h2>
              <p className="mt-4 max-w-[600px] text-gray-500 text-lg">No hourly rates. No benefits. No drama. Just predictable monthly pricing that scales with your business.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {plans.map((plan, i) => (
                <div key={plan.name} className={`relative flex flex-col p-8 rounded-2xl border-2 transition-all duration-300 animate-slide-up ${plan.featured ? 'border-indigo-600 shadow-xl shadow-indigo-100 scale-105 bg-white' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'}`} style={{animationDelay:`${i*0.1}s`}}>
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                  )}
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{plan.name}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-0.5">{plan.subtitle}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{plan.tagline}</p>
                  </div>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-sm ml-1">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition-all active:scale-[0.97] ${plan.featured ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg' : 'bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'}`}>
                    {plan.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900" />
          <div className="absolute inset-0">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">Ready to automate your office?</h2>
              <p className="mx-auto max-w-[600px] text-indigo-100 text-lg md:text-xl mb-10 leading-relaxed">Join hundreds of service businesses that have scaled their operations without hiring more office staff.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-indigo-600 shadow-lg shadow-indigo-500/25 transition-all hover:bg-gray-100 hover:shadow-xl active:scale-[0.97]">
                  Start Your 7-Day Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#features" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-white/20 text-white px-8 text-sm font-semibold transition-all hover:bg-white/10 hover:border-white/30 active:scale-[0.97]">
                  Watch Demo
                </Link>
              </div>
              <p className="text-indigo-300 text-sm mt-6">No credit card required. Cancel anytime.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 md:px-8 border-t bg-gray-50">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-bold text-gray-900">OperatorAI</span>
            <span className="text-xs text-gray-400 ml-2">&copy; 2026 All rights reserved.</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link className="text-xs text-gray-500 hover:text-gray-700 transition-colors" href="#">Terms of Service</Link>
            <Link className="text-xs text-gray-500 hover:text-gray-700 transition-colors" href="#">Privacy Policy</Link>
            <Link className="text-xs text-gray-500 hover:text-gray-700 transition-colors" href="#">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}