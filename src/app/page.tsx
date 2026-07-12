"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Shield,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  Zap,
  Target,
  DollarSign,
  UserCheck,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Vehicle Registry",
    description:
      "Complete fleet inventory with real-time status tracking, automated lifecycle management, and instant availability checks.",
    iconBg: "bg-primary/15",
    iconColor: "text-primary-light",
  },
  {
    icon: Users,
    title: "Driver Management",
    description:
      "Maintain driver profiles with license tracking, safety scores, compliance monitoring, and automatic eligibility validation.",
    iconBg: "bg-secondary/15",
    iconColor: "text-secondary",
  },
  {
    icon: Route,
    title: "Trip Management",
    description:
      "End-to-end trip lifecycle from draft to completion — with cargo validation, auto-dispatching, and status transitions.",
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    icon: Wrench,
    title: "Maintenance Workflows",
    description:
      "Schedule and track maintenance with automatic vehicle status changes. Vehicles in shop are instantly removed from dispatch.",
    iconBg: "bg-accent-light/15",
    iconColor: "text-accent-light",
  },
  {
    icon: Fuel,
    title: "Fuel & Expense Tracking",
    description:
      "Record fuel consumption, tolls, and operational costs per vehicle and trip. Auto-compute total operational expenses.",
    iconBg: "bg-success/15",
    iconColor: "text-success",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description:
      "Fuel efficiency, fleet utilization, operational costs, and ROI — with interactive charts, CSV export, and PDF reports.",
    iconBg: "bg-info/15",
    iconColor: "text-info",
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Register Assets",
    description:
      "Add vehicles with capacity limits and drivers with license details. The system enforces unique registrations and tracks expiry dates.",
    numBg: "bg-primary/15",
    numBorder: "border-primary",
    numText: "text-primary-light",
  },
  {
    number: "02",
    title: "Create & Dispatch Trips",
    description:
      "Select available vehicles and qualified drivers. Cargo weight is validated against capacity. Dispatch auto-updates all statuses.",
    numBg: "bg-secondary/15",
    numBorder: "border-secondary",
    numText: "text-secondary",
  },
  {
    number: "03",
    title: "Track & Complete",
    description:
      "Monitor active trips, record fuel consumption, and log expenses. Completing a trip auto-restores vehicle and driver availability.",
    numBg: "bg-accent/15",
    numBorder: "border-accent",
    numText: "text-accent",
  },
  {
    number: "04",
    title: "Analyze & Optimize",
    description:
      "Review KPI dashboards, fuel efficiency reports, and vehicle ROI to make data-driven decisions about your fleet operations.",
    numBg: "bg-success/15",
    numBorder: "border-success",
    numText: "text-success",
  },
];

const roles = [
  {
    icon: Target,
    name: "Fleet Manager",
    description:
      "Oversees fleet assets, maintenance schedules, vehicle lifecycle, and overall operational efficiency.",
    avatarBg: "bg-primary/15",
    avatarColor: "text-primary-light",
  },
  {
    icon: Truck,
    name: "Driver",
    description:
      "Creates trips, assigns vehicles, monitors active deliveries, and records trip completion data.",
    avatarBg: "bg-secondary/15",
    avatarColor: "text-secondary",
  },
  {
    icon: Shield,
    name: "Safety Officer",
    description:
      "Ensures driver compliance, tracks license validity, monitors safety scores, and manages suspensions.",
    avatarBg: "bg-accent/15",
    avatarColor: "text-accent",
  },
  {
    icon: DollarSign,
    name: "Financial Analyst",
    description:
      "Reviews operational expenses, fuel consumption, maintenance costs, and fleet profitability reports.",
    avatarBg: "bg-accent-light/15",
    avatarColor: "text-accent-light",
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ===== Navbar ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
          scrolled
            ? "bg-surface-primary/85 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.08)]"
            : "bg-transparent"
        }`}
        id="navbar"
      >
        <div className="flex items-center justify-between max-w-[1200px] mx-auto px-6">
          <Link href="/" className="flex items-center gap-3 text-xl font-bold">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-[0_0_20px_rgba(108,92,231,0.2)]">
              <Truck size={22} color="white" />
            </div>
            <div>
              Transit
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Ops
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-primary-light after:rounded-full after:transition-all hover:after:w-full">
              Features
            </a>
            <a href="#workflow" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-primary-light after:rounded-full after:transition-all hover:after:w-full">
              How It Works
            </a>
            <a href="#roles" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-primary-light after:rounded-full after:transition-all hover:after:w-full">
              Roles
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-semibold border border-border-default rounded-lg hover:border-primary-light hover:bg-primary/10 transition-all hover:-translate-y-0.5"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-light rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(108,92,231,0.3)]"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>

          <button
            className="md:hidden text-text-primary p-2 cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            id="mobile-menu-open"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* ===== Mobile Menu ===== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-surface-primary/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 animate-fade-in">
          <button
            className="absolute top-6 right-6 text-text-primary p-2 cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold hover:text-primary-light transition-colors">
            Features
          </a>
          <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold hover:text-primary-light transition-colors">
            How It Works
          </a>
          <a href="#roles" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold hover:text-primary-light transition-colors">
            Roles
          </a>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-light rounded-xl transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      )}

      {/* ===== Hero ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-surface-primary via-surface-secondary to-surface-tertiary" id="hero">
        {/* Glow effects */}
        <div className="absolute w-[600px] h-[600px] -top-[200px] -right-[100px] rounded-full bg-primary/15 blur-[120px] animate-float pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] -bottom-[100px] -left-[50px] rounded-full bg-secondary/10 blur-[120px] animate-float [animation-direction:reverse] pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] top-[40%] left-[50%] rounded-full bg-accent/8 blur-[120px] animate-float [animation-delay:2s] pointer-events-none" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

        <div className="relative z-10 text-center max-w-[900px] px-6 pt-32 pb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary-light bg-primary/15 border border-primary/30 rounded-full mb-6 uppercase tracking-wider animate-fade-in-down">
            <Sparkles size={14} className="animate-pulse" />
            Smart Transport Operations Platform
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Streamline Your
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Fleet Operations
            </span>
            <br />
            Like Never Before
          </h1>

          <p className="text-lg text-text-secondary max-w-[650px] mx-auto mb-10 leading-relaxed animate-fade-in-up [animation-delay:200ms] [animation-fill-mode:both]">
            Digitize vehicle management, driver dispatch, maintenance workflows,
            and expense tracking — all from one powerful, real-time platform
            built for modern fleet operators.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12 flex-col sm:flex-row animate-fade-in-up [animation-delay:400ms] [animation-fill-mode:both]">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-light rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(108,92,231,0.3)]"
              id="hero-cta-primary"
            >
              Launch Dashboard
              <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold border border-border-default rounded-xl transition-all hover:border-primary-light hover:bg-primary/10 hover:-translate-y-0.5"
              id="hero-cta-secondary"
            >
              Explore Features
              <ChevronRight size={18} />
            </a>
          </div>

          <div className="flex items-center justify-center gap-12 flex-col sm:flex-row animate-fade-in-up [animation-delay:600ms] [animation-fill-mode:both]">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">99.9%</div>
              <div className="text-sm text-text-muted">Uptime SLA</div>
            </div>
            <div className="w-px h-10 bg-border-default hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">10x</div>
              <div className="text-sm text-text-muted">Faster Dispatch</div>
            </div>
            <div className="w-px h-10 bg-border-default hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">30%</div>
              <div className="text-sm text-text-muted">Cost Reduction</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-32 relative" id="features">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-light mb-4 uppercase tracking-wider">
              <Zap size={16} />
              Core Modules
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight mb-4">
              Everything You Need to
              <br />
              Run Your Fleet
            </h2>
            <p className="text-lg text-text-secondary max-w-[600px] mx-auto">
              Six tightly integrated modules that cover every aspect of
              transport operations — from asset registration to profitability
              analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative p-8 bg-gradient-to-br from-white/5 to-white/2 border border-border-default rounded-xl transition-all hover:border-border-hover hover:bg-surface-hover hover:-translate-y-1 hover:shadow-xl group overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-primary before:to-primary-light before:opacity-0 before:transition-opacity hover:before:opacity-100"
              >
                <div
                  className={`w-[52px] h-[52px] rounded-lg flex items-center justify-center mb-5 transition-transform group-hover:scale-110 ${feature.iconBg} ${feature.iconColor}`}
                >
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Workflow ===== */}
      <section className="py-32 bg-surface-secondary relative overflow-hidden" id="workflow">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(108,92,231,0.15)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-6 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-light mb-4 uppercase tracking-wider">
              <Route size={16} />
              How It Works
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight mb-4">
              From Registration
              <br />
              to Insight in 4 Steps
            </h2>
            <p className="text-lg text-text-secondary max-w-[600px] mx-auto">
              A streamlined workflow that automates status transitions and
              enforces business rules at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual card */}
            <div className="bg-gradient-to-br from-white/5 to-white/2 border border-border-default rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-danger" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-sm text-text-muted font-medium">
                  Live Fleet Dashboard
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/3 rounded-lg border border-border-default">
                  <div className="text-2xl font-bold text-primary-light mb-1">24</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">Active Vehicles</div>
                </div>
                <div className="p-4 bg-white/3 rounded-lg border border-border-default">
                  <div className="text-2xl font-bold text-secondary mb-1">18</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">Drivers On Duty</div>
                </div>
                <div className="p-4 bg-white/3 rounded-lg border border-border-default">
                  <div className="text-2xl font-bold text-accent mb-1">12</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">Active Trips</div>
                </div>
                <div className="p-4 bg-white/3 rounded-lg border border-border-default">
                  <div className="text-2xl font-bold text-success mb-1">87%</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">Fleet Utilization</div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-6">
              {workflowSteps.map((step) => (
                <div key={step.number} className="flex gap-5">
                  <div
                    className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step.numBg} ${step.numBorder} ${step.numText}`}
                  >
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Roles ===== */}
      <section className="py-32 relative" id="roles">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-light mb-4 uppercase tracking-wider">
              <UserCheck size={16} />
              Role-Based Access
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight mb-4">
              Built for Every
              <br />
              Team Member
            </h2>
            <p className="text-lg text-text-secondary max-w-[600px] mx-auto">
              Four distinct roles with tailored dashboards, permissions, and
              workflows — ensuring everyone sees exactly what they need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => (
              <div
                key={role.name}
                className="text-center p-8 bg-gradient-to-br from-white/5 to-white/2 border border-border-default rounded-xl transition-all hover:-translate-y-1.5 hover:border-border-hover hover:shadow-xl group"
              >
                <div
                  className={`w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-5 transition-transform group-hover:scale-110 ${role.avatarBg} ${role.avatarColor}`}
                >
                  <role.icon size={32} />
                </div>
                <h3 className="text-lg font-semibold mb-3">{role.name}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="relative text-center py-16 px-8 bg-gradient-to-br from-white/5 to-white/2 border border-border-default rounded-2xl overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(108,92,231,0.08)_0%,transparent_60%)] pointer-events-none" />

            <h2 className="text-4xl font-bold mb-4 relative">
              Ready to Transform Your Fleet Operations?
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-[500px] mx-auto relative">
              Start managing your vehicles, drivers, and trips with intelligent
              automation and real-time insights.
            </p>
            <div className="flex items-center justify-center gap-4 relative flex-col sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-light rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(108,92,231,0.3)]"
                id="cta-primary"
              >
                Get Started Now
                <ArrowRight size={18} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold border border-border-default rounded-xl transition-all hover:border-primary-light hover:bg-primary/10 hover:-translate-y-0.5"
                id="cta-secondary"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="py-12 border-t border-border-default" id="footer">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto px-6 flex-col md:flex-row gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <Truck size={16} color="white" />
            </div>
            <span className="font-semibold">TransitOps</span>
            <span className="text-sm text-text-muted">
              © {new Date().getFullYear()} All rights reserved.
            </span>
          </div>
          <div className="flex gap-6">
            <a href="#features" className="text-sm text-text-secondary hover:text-primary-light transition-colors">Features</a>
            <a href="#workflow" className="text-sm text-text-secondary hover:text-primary-light transition-colors">Workflow</a>
            <a href="#roles" className="text-sm text-text-secondary hover:text-primary-light transition-colors">Roles</a>
            <Link href="/login" className="text-sm text-text-secondary hover:text-primary-light transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
