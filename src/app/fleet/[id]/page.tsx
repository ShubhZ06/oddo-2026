import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, Truck, Wrench, ShieldAlert } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicleId = parseInt(id, 10);
  if (isNaN(vehicleId)) return notFound();

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      trips: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { driver: true }
      },
      maintenanceLogs: {
        take: 5,
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!vehicle) return notFound();

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/fleet"
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 transition-colors shadow-sm"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-3 tracking-tight">
            {vehicle.registrationNumber}
            <StatusBadge status={vehicle.status} />
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{vehicle.nameModel} • {vehicle.type}</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Odometer</div>
          <div className="text-2xl font-black text-black tracking-tight">{formatNumber(vehicle.odometerKm)} <span className="text-sm text-gray-400 font-bold">km</span></div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Capacity</div>
          <div className="text-2xl font-black text-black tracking-tight">{formatNumber(vehicle.maxLoadCapacityKg)} <span className="text-sm text-gray-400 font-bold">kg</span></div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Acquisition Cost</div>
          <div className="text-2xl font-black text-black tracking-tight">{formatCurrency(vehicle.acquisitionCost)}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Region</div>
          <div className="text-2xl font-black text-black tracking-tight truncate">{vehicle.region || "Unassigned"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trips */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-2">
            <Truck className="text-blue-500" size={18} />
            <h2 className="font-bold text-gray-800">Recent Trips</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {vehicle.trips.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">No trips recorded for this vehicle.</div>
            ) : (
              vehicle.trips.map((trip: any) => (
                <div key={trip.id} className="p-4 px-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-black">Trip #{trip.id}</span>
                    <StatusBadge status={trip.status} />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <div>{trip.origin} → {trip.destination}</div>
                    <div className="font-mono">{formatDate(trip.createdAt)}</div>
                  </div>
                  {trip.driver && (
                    <div className="mt-2 text-xs text-gray-400">Driver: <span className="font-semibold text-gray-600">{trip.driver.name}</span></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Maintenance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-2">
            <Wrench className="text-orange-500" size={18} />
            <h2 className="font-bold text-gray-800">Maintenance History</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {vehicle.maintenanceLogs.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">No maintenance records found.</div>
            ) : (
              vehicle.maintenanceLogs.map((log: any) => (
                <div key={log.id} className="p-4 px-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-black">{log.type}</span>
                    <span className="font-mono text-sm font-bold text-gray-700">{formatCurrency(log.cost)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{log.description || "No description provided."}</div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-xs text-gray-400">{formatDate(log.createdAt)}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-gray-100 text-gray-500">
                      {log.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
