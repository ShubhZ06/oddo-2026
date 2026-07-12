import Sidebar from "./Sidebar";
import Header from "./Header";
import ToastContainer from "@/components/ui/Toast";
import { AppProvider } from "@/context/AppContext";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
