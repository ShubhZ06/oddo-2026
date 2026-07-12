import prisma from "@/lib/prisma";
import NewMaintenanceClient from "./NewMaintenanceClient";

export const dynamic = "force-dynamic";

export default async function NewMaintenancePage() {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      status: {
        notIn: ["RETIRED", "IN_SHOP"],
      },
    },
    orderBy: {
      registrationNumber: "asc",
    },
  });

  return <NewMaintenanceClient vehicles={vehicles} />;
}
