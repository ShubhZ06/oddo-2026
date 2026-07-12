import { Search, Plus, Filter, MoreHorizontal, ArrowDownUp } from "lucide-react";


export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const kpis = [
    { label: "ACTIVE VEHICLES", value: "53", border: "border-blue-500" },
    { label: "AVAILABLE VEHICLES", value: "42", border: "border-green-500" },
    { label: "VEHICLES IN MAINTENANCE", value: "05", border: "border-orange-500" },
    { label: "ACTIVE TRIPS", value: "18", border: "border-blue-400" },
    { label: "PENDING TRIPS", value: "09", border: "border-gray-400" },
    { label: "DRIVERS ON DUTY", value: "26", border: "border-purple-500" },
    { label: "FLEET UTILIZATION", value: "81%", border: "border-green-400" },
  ];

  const recentTrips = [
    { id: "TR001", vehicle: "VAN-05", driver: "Alex", status: "On Trip", statusColor: "bg-blue-50 text-blue-700 border-blue-200", eta: "45 min" },
    { id: "TR002", vehicle: "TRX-12", driver: "John", status: "Completed", statusColor: "bg-green-50 text-green-700 border-green-200", eta: "—" },
    { id: "TR003", vehicle: "MINI-08", driver: "Priya", status: "Dispatched", statusColor: "bg-indigo-50 text-indigo-700 border-indigo-200", eta: "1h 10m" },
    { id: "TR004", vehicle: "—", driver: "—", status: "Draft", statusColor: "bg-gray-50 text-gray-600 border-gray-200", eta: "Awaiting vehicle" },
  ];

  const vehicleStatus = [
    { label: "Available", percent: 70, color: "bg-green-500" },
    { label: "On Trip", percent: 25, color: "bg-blue-500" },
    { label: "In Shop", percent: 8, color: "bg-orange-500" },
    { label: "Retired", percent: 3, color: "bg-red-400" },
  ];

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

      <div className="flex items-center gap-3 mb-6">
        <div className="text-xs font-bold text-gray-400 tracking-wider mr-2 uppercase">Filters:</div>
        {["Vehicle Type: All", "Status: All", "Region: All"].map((filter, i) => (
          <div key={i} className="relative w-40">
            <select className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 pl-4 pr-10 rounded-xl outline-none focus:border-black cursor-pointer shadow-sm">
              <option>{filter}</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
        {kpis.map((kpi, i) => (
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
             {recentTrips.map((trip, i) => (
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
             ))}
          </div>
        </div>

        {/* Vehicle Status */}
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

      </div>
    </div>
  );
}
