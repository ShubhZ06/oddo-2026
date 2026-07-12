"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import InteractiveLandscape from "@/components/ui/InteractiveLandscape";
import {
  Truck,
  ArrowRight,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0a]">
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
      <section className="relative h-screen flex items-center justify-center overflow-hidden" id="hero">
        <InteractiveLandscape />

        <div className="relative z-10 text-center max-w-[900px] px-6 pt-32 pb-16 animate-fade-in-up pointer-events-none">
          <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary-light bg-primary/15 border border-primary/30 rounded-full mb-6 uppercase tracking-wider animate-fade-in-down pointer-events-auto">
            <Sparkles size={14} className="animate-pulse" />
            Smart Transport Operations Platform
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 text-white drop-shadow-md">
            Streamline Your
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Fleet Operations
            </span>
            <br />
            Like Never Before
          </h1>

          <p className="text-lg text-gray-300 max-w-[650px] mx-auto mb-10 leading-relaxed animate-fade-in-up [animation-delay:200ms] [animation-fill-mode:both] drop-shadow-sm">
            Digitize vehicle management, driver dispatch, maintenance workflows,
            and expense tracking — all from one powerful, real-time platform
            built for modern fleet operators.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12 flex-col sm:flex-row animate-fade-in-up [animation-delay:400ms] [animation-fill-mode:both] pointer-events-auto">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-light rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(108,92,231,0.3)]"
              id="hero-cta-primary"
            >
              Launch Dashboard
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-12 flex-col sm:flex-row animate-fade-in-up [animation-delay:600ms] [animation-fill-mode:both] text-white">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1 drop-shadow-md">99.9%</div>
              <div className="text-sm text-gray-300">Uptime SLA</div>
            </div>
            <div className="w-px h-10 bg-white/20 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold mb-1 drop-shadow-md">10x</div>
              <div className="text-sm text-gray-300">Faster Dispatch</div>
            </div>
            <div className="w-px h-10 bg-white/20 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold mb-1 drop-shadow-md">30%</div>
              <div className="text-sm text-gray-300">Cost Reduction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
