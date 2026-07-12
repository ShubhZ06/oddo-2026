"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import InteractiveLandscape from "@/components/ui/InteractiveLandscape";

export default function LandingPage() {
  return (
    <div className="h-screen overflow-hidden bg-[#000000]">
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden" id="hero">
        <InteractiveLandscape />

        <div className="relative z-10 text-center max-w-[900px] px-6 flex flex-col items-center pointer-events-none">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-extrabold leading-tight tracking-tighter mb-6 text-white drop-shadow-2xl">
            LoadLogic
          </h1>

          <div className="pointer-events-auto mt-8">
            <Link
              href="/login"
              className="inline-flex items-center gap-3 px-10 py-4 text-lg font-bold text-black bg-white rounded-2xl transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)]"
            >
              Login
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
