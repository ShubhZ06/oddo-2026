import AppLayout from "@/components/layout/AppLayout";

export default function FuelExpensesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
