"use client";

import { useState } from "react";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function DashboardClient({ 
  vehicles, 
  trips,
  drivers
}: {
  vehicles: any[],
  trips: any[],
  drivers: any[]
}) {
  const { user } = useAuth();
  const isDriver = user?.role === "DRIVER";
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");

  const totalVehicles = vehicles.length;
  const inShopCount = vehicles.filter((v: any) => v.status === "IN_SHOP").length;
  const availableCount = vehicles.filter((v: any) => v.status === "AVAILABLE").length;
  const activeVehiclesCount = vehicles.filter((v: any) => v.status === "ON_TRIP").length;
  const activeTripsCount = trips.filter((t: any) => t.status === "DISPATCHED").length;
  const pendingTripsCount = trips.filter((t: any) => t.status === "DRAFT").length;
  const driversOnDuty = drivers.filter((d: any) => d.status === "ON_TRIP").length;
  
  const utilization = totalVehicles > 0 
    ? Math.round(((totalVehicles - availableCount - inShopCount) / totalVehicles) * 100) 
    : 0;

  const allKpis = [
    { label: "ACTIVE VEHICLES", value: activeVehiclesCount.toString(), border: "border-blue-500" },
    { label: "AVAILABLE VEHICLES", value: availableCount.toString(), border: "border-green-500" },
    { label: "VEHICLES IN MAINTENANCE", value: inShopCount.toString(), border: "border-orange-500" },
    { label: "ACTIVE TRIPS", value: activeTripsCount.toString(), border: "border-blue-400" },
    { label: "PENDING TRIPS", value: pendingTripsCount.toString(), border: "border-gray-400" },
    { label: "DRIVERS ON DUTY", value: driversOnDuty.toString(), border: "border-purple-500", hideForDriver: true },
    { label: "FLEET UTILIZATION", value: `${utilization}%`, border: "border-green-400", hideForDriver: true },
  ];
  const kpis = isDriver ? allKpis.filter(k => !k.hideForDriver) : allKpis;

  const vehicleStatus = [
    { label: "Available", percent: totalVehicles > 0 ? (availableCount / totalVehicles) * 100 : 0, color: "bg-green-500" },
    { label: "On Trip", percent: totalVehicles > 0 ? ((totalVehicles - availableCount - inShopCount) / totalVehicles) * 100 : 0, color: "bg-blue-500" },
    { label: "In Shop", percent: totalVehicles > 0 ? (inShopCount / totalVehicles) * 100 : 0, color: "bg-orange-500" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-50 text-green-700 border-green-200";
      case "DISPATCHED": return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "DRAFT": return "bg-gray-50 text-gray-600 border-gray-200";
      case "CANCELLED": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };
  
  // Extract unique vehicles and regions for the filter dropdowns
  const uniqueVehicles = Array.from(new Set(vehicles.map(v => v.registrationNumber))).filter(Boolean);
  const uniqueRegions = Array.from(new Set(trips.flatMap(t => [t.source, t.destination]))).filter(Boolean);

  const filteredTrips = trips.filter(trip => {
    const vId = trip.vehicle?.registrationNumber || "";
    const driverName = trip.driver?.name || "";
    const cleanSearch = search.toLowerCase().trim();
    
    const matchesSearch = 
      vId.toLowerCase().includes(cleanSearch) || 
      driverName.toLowerCase().includes(cleanSearch) ||
      trip.id.toString().includes(cleanSearch.replace("#", "")) ||
      `#${trip.id}`.includes(cleanSearch) ||
      (trip.status || "").toLowerCase().includes(cleanSearch) ||
      (trip.source || "").toLowerCase().includes(cleanSearch) ||
      (trip.destination || "").toLowerCase().includes(cleanSearch) ||
      `${trip.distanceKm || 0} km`.includes(cleanSearch) ||
      `${trip.distanceKm || 0}km`.includes(cleanSearch) ||
      (trip.distanceKm?.toString() || "").includes(cleanSearch.replace(/km/i, "").trim());
      
    const matchesVehicle = vehicleFilter === "All" || vId === vehicleFilter;
    const matchesStatus = statusFilter === "All" || trip.status === statusFilter.toUpperCase();
    const matchesRegion = regionFilter === "All" || trip.source === regionFilter || trip.destination === regionFilter;
    
    return matchesSearch && matchesVehicle && matchesStatus && matchesRegion;
  }).slice(0, 5); // take latest 5 for dashboard

  return (
    <div className="flex flex-col animate-fade-in w-full max-w-[1400px] mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-black transition-colors w-full sm:w-80">
          <Search className="text-gray-400 mr-3 shrink-0" size={18} />
          <input 
            type="text" 
            placeholder="Search trips, vehicles..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-gray-700 outline-none placeholder:text-gray-400 w-full text-sm font-medium"
          />
        </div>
        {/* Create trip button removed as requested */}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="text-xs font-bold text-gray-400 tracking-wider mr-2 uppercase">Filters:</div>
        
        {/* 1) Vehicle Filter */}
        <div className="relative w-40">
          <select 
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 pl-4 pr-10 rounded-xl outline-none focus:border-black cursor-pointer shadow-sm"
          >
            <option value="All">Vehicle: All</option>
            {uniqueVehicles.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
        </div>

        {/* 2) Status Filter */}
        <div className="relative w-40">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 pl-4 pr-10 rounded-xl outline-none focus:border-black cursor-pointer shadow-sm"
          >
            <option value="All">Status: All</option>
            <option value="Draft">Draft</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
        </div>
        
        {/* 3) Region Filter */}
        <div className="relative w-40">
          <select 
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 pl-4 pr-10 rounded-xl outline-none focus:border-black cursor-pointer shadow-sm"
          >
            <option value="All">Region: All</option>
            {uniqueRegions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
        {kpis.map((kpi, i) => (
          <div key={i} className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-[120px]`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${kpi.border}`}></div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">{kpi.label}</div>
            <div className="text-3xl font-black text-black tracking-tight mt-2">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Recent Trips Table */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black tracking-tight">Recent Trips</h2>
          </div>

          <div className="grid grid-cols-5 gap-4 px-6 py-3 text-[11px] uppercase tracking-wider font-bold text-gray-400 border-b border-gray-200 mb-2">
             <div className="col-span-1">Trip ID</div>
             <div className="col-span-1">Vehicle</div>
             <div className="col-span-1">Driver</div>
             <div className="col-span-1 text-center">Status</div>
             <div className="col-span-1 text-right">Distance</div>
          </div>

          <div className="flex flex-col gap-3">
             {filteredTrips.length === 0 ? (
               <div className="text-center py-8 text-gray-500">No trips match your filters.</div>
             ) : filteredTrips.map((trip: any, i: number) => (
                <div key={trip.id} className="grid grid-cols-5 gap-4 items-center bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                   <div className="col-span-1 font-bold text-sm text-black truncate">#{trip.id}</div>
                   <div className="col-span-1 font-semibold text-sm text-gray-700 truncate">{trip.vehicle?.registrationNumber || 'Unassigned'}</div>
                   <div className="col-span-1 font-semibold text-sm text-gray-700 truncate">{trip.driver?.name || 'Unassigned'}</div>
                   <div className="col-span-1 flex justify-center">
                      <span className={`px-3 py-1 rounded-lg text-[11px] uppercase tracking-wider font-bold border ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                   </div>
                   <div className="col-span-1 text-right font-semibold text-sm text-gray-600 truncate">{trip.distanceKm || 0} km</div>
                </div>
             ))}
          </div>
        </div>

        {/* Vehicle Status (hidden for drivers) */}
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
