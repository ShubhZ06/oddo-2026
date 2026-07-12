import AppLayout from "@/components/layout/AppLayout";

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
