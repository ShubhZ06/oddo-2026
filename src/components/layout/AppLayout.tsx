"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ToastContainer from "@/components/ui/Toast";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("transitops_session");
    if (!session) {
      window.location.href = "/login";
    } else {
      setAuthorized(true);
    }
  }, []);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f5] flex">
      <Sidebar />
      <div className="flex-1 pl-[332px] flex flex-col h-screen">
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
}

