"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Filter, MoreHorizontal, ArrowDownUp } from "lucide-react";
import Select from "@/components/ui/Select";
import { useAuth } from "@/components/auth/AuthProvider";

export default function DashboardPage() {
  const { user } = useAuth();
  const isDriver = user?.role === "DRIVER";
  const [vehicleType, setVehicleType] = useState("Vehicle Type: All");
  const [status, setStatus] = useState("Status: All");
  const [region, setRegion] = useState("Region: All");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const kpis = [
    { label: "ACTIVE VEHICLES", value: dashboardData?.kpis.activeVehicles?.toString().padStart(2, '0') || "00", border: "border-blue-500" },
    { label: "AVAILABLE VEHICLES", value: dashboardData?.kpis.availableVehicles?.toString().padStart(2, '0') || "00", border: "border-green-500" },
    { label: "VEHICLES IN MAINTENANCE", value: dashboardData?.kpis.maintenanceVehicles?.toString().padStart(2, '0') || "00", border: "border-orange-500" },
    { label: "ACTIVE TRIPS", value: dashboardData?.kpis.activeTrips?.toString().padStart(2, '0') || "00", border: "border-blue-400" },
    { label: "PENDING TRIPS", value: dashboardData?.kpis.pendingTrips?.toString().padStart(2, '0') || "00", border: "border-gray-400" },
    { label: "DRIVERS ON DUTY", value: dashboardData?.kpis.driversOnDuty?.toString().padStart(2, '0') || "00", border: "border-purple-500", hideForDriver: true },
    { label: "FLEET UTILIZATION", value: `${dashboardData?.kpis.fleetUtilization || 0}%`, border: "border-green-400", hideForDriver: true },
  ];

  const visibleKpis = isDriver ? kpis.filter(k => !k.hideForDriver) : kpis;

  const recentTrips: any[] = dashboardData?.recentTrips || [];
  const vehicleStatus: any[] = dashboardData?.vehicleStatus || [];

  return (
    <div className="flex flex-col animate-fade-in w-full max-w-[1400px] mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-black transition-colors w-full sm:w-80">
          <Search className="text-gray-400 mr-3 shrink-0" size={18} />
          <input 
            type="text" 
            placeholder="Search trips, vehicles..." 
            className="bg-transparent text-gray-700 outline-none placeholder:text-gray-400 w-full text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-[14px] text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm cursor-pointer">
            <Plus size={18} />
            Create Trip
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 z-10 relative">
        <div className="text-xs font-bold text-gray-400 tracking-wider mr-2 uppercase">Filters:</div>
        <div className="flex gap-3 flex-wrap">
          <Select 
            value={vehicleType}
            onChange={setVehicleType}
            options={[
              { label: "Vehicle Type: All", value: "Vehicle Type: All" },
              { label: "Vans", value: "Vans" },
              { label: "Trucks", value: "Trucks" },
            ]}
            className="w-48"
          />
          <Select 
            value={status}
            onChange={setStatus}
            options={[
              { label: "Status: All", value: "Status: All" },
              { label: "Available", value: "Available" },
              { label: "On Trip", value: "On Trip" },
              { label: "Maintenance", value: "Maintenance" },
            ]}
            className="w-40"
          />
          <Select 
            value={region}
            onChange={setRegion}
            options={[
              { label: "Region: All", value: "Region: All" },
              { label: "North", value: "North" },
              { label: "South", value: "South" },
            ]}
            className="w-40"
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
        {visibleKpis.map((kpi, i) => (
          <div key={i} className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-[120px]`}>
            {/* Left border accent reflecting the design from the image */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${kpi.border}`}></div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">{kpi.label}</div>
            <div className="text-3xl font-black text-black tracking-tight mt-2">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content: Recent Trips & Vehicle Status */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Recent Trips Table */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black tracking-tight">Recent Trips</h2>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
               <Filter size={16} className="text-gray-600" />
            </button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 px-6 py-3 text-[11px] uppercase tracking-wider font-bold text-gray-400 border-b border-gray-200 mb-2">
             <div className="col-span-1">Trip</div>
             <div className="col-span-1">Vehicle</div>
             <div className="col-span-1">Driver</div>
             <div className="col-span-1 text-center">Status</div>
             <div className="col-span-1 text-center">ETA</div>
             <div className="col-span-1"></div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col gap-3">
             {recentTrips.length === 0 ? (
               <div className="text-center py-8 text-sm text-gray-500">No recent trips found.</div>
             ) : (
               recentTrips.map((trip, i) => (
                  <div key={i} className="grid grid-cols-6 gap-4 items-center bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                     <div className="col-span-1 font-bold text-sm text-black truncate">{trip.id}</div>
                     <div className="col-span-1 font-semibold text-sm text-gray-700 truncate">{trip.vehicle}</div>
                     <div className="col-span-1 font-semibold text-sm text-gray-700 truncate">{trip.driver}</div>
                     <div className="col-span-1 flex justify-center">
                        <span className={`px-3 py-1 rounded-lg text-[11px] uppercase tracking-wider font-bold border ${trip.statusColor}`}>
                          {trip.status}
                        </span>
                     </div>
                     <div className="col-span-1 text-center font-semibold text-sm text-gray-600 truncate">{trip.eta}</div>
                     <div className="col-span-1 flex justify-end">
                        <button className="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
                           <MoreHorizontal size={16} />
                        </button>
                     </div>
                  </div>
               ))
             )}
          </div>
        </div>

        {/* Vehicle Status (Hidden for Drivers) */}
        {!isDriver && (
          <div className="lg:col-span-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black tracking-tight">Vehicle Status</h2>
            </div>
            
            <div className="bg-[#eef2ef] rounded-[32px] p-8 flex flex-col gap-6 shadow-sm border border-gray-100">
               {vehicleStatus.map((status, i) => (
                  <div key={i} className="flex flex-col gap-2">
                     <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-gray-700">{status.label}</span>
                     </div>
                     <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
                        <div className={`h-full ${status.color} rounded-full`} style={{ width: `${status.percent}%` }}></div>
                     </div>
                  </div>
               ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
