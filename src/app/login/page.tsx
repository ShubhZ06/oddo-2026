"use client";

import { useState, useEffect } from "react";
import { Architects_Daughter } from "next/font/google";

const architectsDaughter = Architects_Daughter({
  weight: "400",
  subsets: ["latin"],
});

type RoleType = "FLEET_MANAGER" | "DRIVER" | "SAFETY_OFFICER" | "FINANCIAL_ANALYST";

const MOCK_ACCOUNTS = [
  { email: "Raven.k@transitops.in", name: "Raven K.", role: "DRIVER" },
  { email: "admin@transitops.com", name: "Admin User", role: "FLEET_MANAGER" },
  { email: "driver@transitops.com", name: "John Doe", role: "DRIVER" },
  { email: "safety@transitops.com", name: "Sarah Smith", role: "SAFETY_OFFICER" },
  { email: "finance@transitops.com", name: "Michael Chen", role: "FINANCIAL_ANALYST" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("Raven.k@transitops.in");
  const [password, setPassword] = useState("password");
  const [role, setRole] = useState<RoleType>("DRIVER");
  const [rememberMe, setRememberMe] = useState(true);

  // Error and attempts state
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  // Sync role dropdown if user types one of the other mock emails
  useEffect(() => {
    const match = MOCK_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === email.toLowerCase()
    );
    if (match) {
      setRole(match.role as RoleType);
    }
  }, [email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      setErrorMessage("Account locked/disabled");
      return;
    }

    const match = MOCK_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === email.toLowerCase()
    );

    // Any password works except 'wrong' or empty to allow testing error state
    if (match && password && password !== "wrong") {
      // Success: Save mock session details
      const session = {
        name: match.name,
        email: match.email,
        role: role, // Use selected role from dropdown to allow RBAC override testing
      };
      localStorage.setItem("transitops_session", JSON.stringify(session));
      
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      // Failure
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      setErrorMessage("Invalid credentials");
      
      if (nextAttempts >= 5) {
        setIsLocked(true);
        setErrorMessage("Account locked/disabled");
      }
    }
  };

  const handleResetAttempts = () => {
    setFailedAttempts(0);
    setIsLocked(false);
    setErrorMessage("");
    setEmail("Raven.k@transitops.in");
    setPassword("password");
    setRole("DRIVER");
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${architectsDaughter.className} bg-[#050508] select-none text-zinc-100`}>
      {/* ================= LEFT PANE ================= */}
      <div className="w-full lg:w-[40%] bg-[#0C0A14] text-zinc-100 p-8 lg:p-16 flex flex-col justify-between min-h-[350px] lg:min-h-screen border-b-4 lg:border-b-0 lg:border-r-4 border-[#7C3AED]/20 relative">
        <div className="flex flex-col gap-8">
          {/* Custom Handdrawn Grid Checkered Logo */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 shrink-0 relative flex items-center justify-center">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Slightly sketchy square */}
                <rect x="4" y="4" width="52" height="52" rx="4" fill="#8B5CF6" fillOpacity="0.1" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="3 2" />
                {/* Handdrawn style grid lines */}
                <path d="M16 4V56M28 4V56M40 4V56M4 16H56M4 28H56M4 40H56" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="4 2" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-4xl font-extrabold tracking-wide mb-1 leading-none text-white">TransitOps</h1>
              <p className="text-sm font-semibold text-[#C4B5FD]">Smart Transport Operations Platform</p>
            </div>
          </div>
        </div>

        {/* Roles list */}
        <div className="mt-12 lg:mt-0 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2">One login, four roles:</h2>
          <ul className="flex flex-col gap-3 text-lg font-semibold pl-1">
            <li className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-[#8B5CF6] shrink-0 border border-zinc-800" />
              <span>Fleet Manager</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-[#8B5CF6] shrink-0 border border-zinc-800" />
              <span>Dispatcher</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-[#8B5CF6] shrink-0 border border-zinc-800" />
              <span>Safety Officer</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-[#8B5CF6] shrink-0 border border-zinc-800" />
              <span>Financial Analyst</span>
            </li>
          </ul>
        </div>
        
        {/* Sketch footnote */}
        <div className="mt-8 lg:mt-0 text-xs text-purple-400/60 font-semibold italic">
          * Interactive sketch layout prototype v1.0
        </div>
      </div>

      {/* ================= RIGHT PANE ================= */}
      <div className="flex-1 bg-[#050508] p-8 lg:p-24 flex items-center justify-center relative min-h-[600px]">
        <div className="w-full max-w-md flex flex-col gap-8 relative">
          
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-extrabold text-white tracking-wide">Sign in to your account</h2>
            <p className="text-zinc-400 font-medium">Enter your credentials to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Raven.k@transitops.in"
                className="w-full bg-[#0C0A14]/90 text-white border-2 border-[#7C3AED]/20 focus:border-[#8B5CF6] px-4 py-3 text-lg transition-colors outline-none placeholder-zinc-700"
                style={{ borderRadius: "5px 4px 6px 3px / 4px 6px 3px 5px" }}
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full bg-[#0C0A14]/90 text-white border-2 border-[#7C3AED]/20 focus:border-[#8B5CF6] px-4 py-3 text-lg transition-colors outline-none placeholder-zinc-700"
                style={{ borderRadius: "4px 6px 3px 5px / 6px 3px 5px 4px" }}
              />
            </div>

            {/* Role dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">Role (RBAC)</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as RoleType)}
                  className="w-full bg-[#0C0A14]/90 text-white border-2 border-[#7C3AED]/20 focus:border-[#8B5CF6] px-4 py-3 text-lg transition-colors outline-none appearance-none cursor-pointer"
                  style={{ borderRadius: "5px 3px 6px 4px / 3px 6px 4px 5px" }}
                >
                  <option value="FLEET_MANAGER">Fleet Manager</option>
                  <option value="DRIVER">Dispatcher</option>
                  <option value="SAFETY_OFFICER">Safety Officer</option>
                  <option value="FINANCIAL_ANALYST">Financial Analyst</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Checkbox and Forgot Password */}
            <div className="flex items-center justify-between text-base font-semibold mt-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="w-6 h-6 border-2 border-[#7C3AED]/30 rounded flex items-center justify-center bg-[#0C0A14] hover:border-[#8B5CF6] transition-colors"
                  style={{ borderRadius: "3px 5px 4px 3px / 4px 3px 5px 4px" }}
                >
                  {rememberMe && (
                    <svg className="w-4 h-4 text-[#D946EF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className="text-zinc-300">Remember me</span>
              </label>

              <a href="#" className="text-sky-500 hover:text-sky-400 hover:underline transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLocked}
              className={`w-full text-white font-extrabold text-xl py-3.5 mt-2 transition-all cursor-pointer bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.98] shadow-md hover:shadow-lg ${
                isLocked ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ borderRadius: "6px 12px 4px 10px / 12px 4px 10px 6px" }}
            >
              {isLocked ? "Account Locked" : "Sign In"}
            </button>
          </form>

          {/* Access Control Information */}
          <div className="border-t border-[#7C3AED]/15 pt-6 mt-2">
            <p className="text-[#C4B5FD] font-bold mb-3 text-sm">Access is scoped by role after login:</p>
            <ul className="flex flex-col gap-2.5 text-sm font-semibold text-zinc-400/80 pl-1">
              <li className="flex items-start gap-1">
                <span>•</span>
                <span>Fleet Manager → Fleet, Maintenance</span>
              </li>
              <li className="flex items-start gap-1">
                <span>•</span>
                <span>Dispatcher → Dashboard, Trips</span>
              </li>
              <li className="flex items-start gap-1">
                <span>•</span>
                <span>Safety Officer → Drivers, Compliance</span>
              </li>
              <li className="flex items-start gap-1">
                <span>•</span>
                <span>Financial Analyst → Fuel & Expenses, Analytics</span>
              </li>
            </ul>
          </div>

          {/* Inline Error Container (Mobile/Tablet display) */}
          {failedAttempts > 0 && (
            <div 
              className="lg:hidden w-full border-2 border-dashed border-rose-500/80 bg-rose-500/5 p-4 flex flex-col gap-2 rounded-xl text-rose-400 font-bold"
              style={{ borderRadius: "10px 4px 12px 6px / 4px 12px 6px 10px" }}
            >
              <div className="text-lg text-rose-500 font-extrabold border-b border-rose-900/30 pb-1">Error state:</div>
              <div className="flex items-center gap-2">
                <span>❌</span>
                <span>{errorMessage}</span>
              </div>
              <div className="text-sm font-semibold text-rose-400/80">
                failed attempts count: {failedAttempts}
              </div>
              <button 
                type="button" 
                onClick={handleResetAttempts}
                className="mt-2 text-xs bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 py-1.5 px-3 border border-rose-800 rounded transition-colors self-start"
              >
                Reset attempts
              </button>
            </div>
          )}

          {/* Help tip */}
          <div className="text-xs text-purple-400/50 font-medium text-center">
            Tip: Type password <code className="bg-purple-950/30 px-1.5 py-0.5 rounded text-purple-300">wrong</code> or invalid email to test the interactive error card.
          </div>
        </div>

        {/* ================= FLOATING ERROR POST-IT (Desktop/LG screen) ================= */}
        {failedAttempts > 0 && (
          <div 
            className="hidden lg:flex absolute left-[78%] top-[25%] w-72 border-2 border-dashed border-rose-500 bg-rose-500/5 p-5 flex-col gap-3 rounded-xl text-rose-400 font-bold shadow-[0_10px_25px_rgba(139,92,246,0.15)] animate-fade-in-up"
            style={{ 
              borderRadius: "12px 6px 15px 5px / 6px 15px 5px 12px",
              transform: "rotate(2deg)"
            }}
          >
            <div className="text-xl text-rose-500 font-extrabold border-b border-rose-950/40 pb-1.5 leading-none">Error state:</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base shrink-0">❌</span>
              <span className="text-lg leading-tight">{errorMessage}</span>
            </div>
            <div className="text-base text-rose-400/80 font-semibold mt-1">
              failed attempts count: <span className="text-rose-500 text-lg font-black">{failedAttempts}</span>
            </div>
            <button 
              type="button" 
              onClick={handleResetAttempts}
              className="mt-3 text-sm bg-rose-950/80 hover:bg-rose-900/80 text-rose-200 py-1.5 px-4 border border-rose-700/60 rounded-md transition-colors self-start cursor-pointer active:scale-95"
              style={{ borderRadius: "5px 3px 5px 3px" }}
            >
              Reset attempts
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
