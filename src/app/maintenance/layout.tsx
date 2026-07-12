import AppLayout from "@/components/layout/AppLayout";

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
