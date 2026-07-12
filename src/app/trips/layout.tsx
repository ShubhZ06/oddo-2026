import AppLayout from "@/components/layout/AppLayout";

export default function TripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
