"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ToastContainer from "@/components/ui/Toast";
import { AppProvider } from "@/context/AppContext";

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
    <AppProvider>
      <div className="min-h-screen bg-surface-primary flex">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col h-screen">
          <Header />
          <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>
        <ToastContainer />
      </div>
    </AppProvider>
  );
}

