"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Select from "@/components/ui/Select";

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
    <div className="min-h-screen bg-[#f4f5f5] flex text-black">
      {/* Left side branding */}
      <div className="hidden lg:flex w-[40%] bg-white border-r border-[#e5e7eb] flex-col p-12 relative overflow-hidden">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors mb-16">
          <ArrowLeft size={16} /> Back to website
        </Link>
        
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-black flex items-center justify-center rounded">
            <div className="text-white font-black text-lg">RM</div>
          </div>
          <span className="font-bold text-3xl tracking-tight">RouteMinds</span>
        </div>

        <div className="max-w-sm mt-auto z-10">
          <h2 className="text-3xl font-bold mb-4">Streamline your logistics operations</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Manage your fleet, track orders, and analyze financial performance from one centralized dashboard.
          </p>
          
          <div className="bg-[#f4f5f5] p-6 rounded-2xl border border-[#e5e7eb]">
            <h3 className="font-semibold mb-3">Role-based Access</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-black"></span> Fleet Manager</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-black"></span> Dispatcher</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-black"></span> Safety Officer</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-black"></span> Financial Analyst</li>
            </ul>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply opacity-50 blur-3xl pointer-events-none" />
      </div>

      {/* Right side login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Mobile header (hidden on lg) */}
        <div className="lg:hidden w-full max-w-md mb-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-black flex items-center justify-center rounded">
            <div className="text-white font-black text-sm">RM</div>
          </div>
          <span className="font-bold text-xl tracking-tight">RouteMinds</span>
        </div>

        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-[#e5e7eb]">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white text-black border border-gray-300 focus:border-black focus:ring-1 focus:ring-black px-4 py-3 rounded-xl text-sm transition-all outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white text-black border border-gray-300 focus:border-black focus:ring-1 focus:ring-black px-4 py-3 rounded-xl text-sm transition-all outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Role</label>
                <Select
                  value={role}
                  onChange={(val) => setRole(val as RoleType)}
                  options={[
                    { label: "Fleet Manager", value: "FLEET_MANAGER" },
                    { label: "Dispatcher", value: "DRIVER" },
                    { label: "Safety Officer", value: "SAFETY_OFFICER" },
                    { label: "Financial Analyst", value: "FINANCIAL_ANALYST" },
                  ]}
                  className="w-full"
                />
            </div>

            <div className="flex items-center justify-between text-sm mt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
                />
                <span className="text-gray-600 font-medium">Remember for 30 days</span>
              </label>
              <a href="#" className="font-semibold text-black hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLocked}
              className={`w-full text-white font-bold py-3.5 mt-4 rounded-xl transition-all shadow-sm ${
                isLocked 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-black hover:bg-gray-900 active:scale-[0.98] cursor-pointer"
              }`}
            >
              {isLocked ? "Account Locked" : "Sign In"}
            </button>
          </form>

          {failedAttempts > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
              <div className="text-xs text-red-500 font-medium">
                Failed attempts: {failedAttempts} / 5
              </div>
              <button 
                type="button" 
                onClick={handleResetAttempts}
                className="mt-1 text-xs font-semibold text-red-700 hover:text-red-800 underline self-start"
              >
                Reset attempts
              </button>
            </div>
          )}

          <div className="mt-8 text-center text-xs text-gray-400 font-medium">
            Tip: Type password <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">wrong</code> to test errors.
          </div>
        </div>
      </div>
    </div>
  );
}
