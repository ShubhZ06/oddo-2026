"use client";

import { useState, useMemo } from "react";
import { Download, Calendar, Filter, TrendingUp, TrendingDown, DollarSign, Fuel } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import Select from "@/components/ui/Select";
import BarChart from "@/components/charts/BarChart";
import DoughnutChart from "@/components/charts/DoughnutChart";
import { formatNumber } from "@/lib/utils";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

type Props = {
  vehicles: any[];
  trips: any[];
  maintenanceLogs: any[];
  fuelLogs: any[];
  expenses: any[];
};

export default function ReportsClient({ vehicles, trips, maintenanceLogs, fuelLogs, expenses }: Props) {
  const [dateRange, setDateRange] = useState("This Year");
  const [region, setRegion] = useState("All Regions");

  const { KPIS, utilizationData, roiData, fuelEffData, rawData } = useMemo(() => {
    // 1. Filter limits
    const now = new Date();
    let startDate = new Date();
    if (dateRange === "This Month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (dateRange === "Last 3 Months") {
      startDate.setMonth(startDate.getMonth() - 3);
    } else if (dateRange === "Last 6 Months") {
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (dateRange === "This Year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      startDate = new Date(0); // All time
    }

    const inRange = (d: string | Date) => new Date(d) >= startDate;

    // Filter Vehicles by Region
    const filteredVehicles = region === "All Regions" 
      ? vehicles 
      : vehicles.filter(v => v.region === region);
    const vIds = new Set(filteredVehicles.map(v => v.id));

    // Filtered Logs
    const fTrips = trips.filter(t => vIds.has(t.vehicleId) && inRange(t.createdAt));
    const fMaint = maintenanceLogs.filter(m => vIds.has(m.vehicleId) && inRange(m.createdAt));
    const fFuel = fuelLogs.filter(f => vIds.has(f.vehicleId) && inRange(f.date || f.createdAt));
    const fExp = expenses.filter(e => vIds.has(e.vehicleId) && inRange(e.date || e.createdAt));

    // Total Revenue
    const totalRevenue = fTrips.reduce((acc, t) => acc + (t.revenue || 0), 0);

    // Total Fuel Costs
    const fuelCosts = fFuel.reduce((acc, f) => acc + (f.totalCost || 0), 0);

    // Maintenance Costs
    const maintCosts = fMaint.reduce((acc, m) => acc + (m.cost || 0), 0);

    // Other Expenses
    const otherExp = fExp.reduce((acc, e) => acc + (e.amount || 0), 0);

    const totalExpenses = fuelCosts + maintCosts + otherExp;

    const netMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;

    const kpis = {
      totalRevenue,
      totalExpenses,
      fuelCosts,
      netMargin: netMargin.toFixed(1),
    };

    // Fleet Utilization
    const active = filteredVehicles.filter(v => v.status === "ON_TRIP").length;
    const idle = filteredVehicles.filter(v => v.status === "AVAILABLE").length;
    const maint = filteredVehicles.filter(v => v.status === "IN_SHOP").length;
    const total = active + idle + maint;
    const activePct = total > 0 ? Math.round((active / total) * 100) : 0;

    const uData = {
      labels: ["Active Use", "Idle", "In Maintenance"],
      datasets: [
        {
          data: [active, idle, maint],
          backgroundColor: [
            "rgba(0, 184, 148, 0.8)",
            "rgba(116, 185, 255, 0.8)",
            "rgba(253, 203, 110, 0.8)",
          ],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    };

    // Vehicle specific ROI & Fuel Efficiency
    const vehicleLabels: string[] = [];
    const roiValues: number[] = [];
    const effValues: number[] = [];

    // Detailed metrics per vehicle for export
    const vehicleMetrics = filteredVehicles.map(v => {
      const vTrips = fTrips.filter(t => t.vehicleId === v.id);
      const vMaint = fMaint.filter(m => m.vehicleId === v.id);
      const vFuel = fFuel.filter(f => f.vehicleId === v.id);

      const vRev = vTrips.reduce((acc, t) => acc + (t.revenue || 0), 0);
      const vMCost = vMaint.reduce((acc, m) => acc + (m.cost || 0), 0);
      const vFCost = vFuel.reduce((acc, f) => acc + (f.totalCost || 0), 0);
      const vLiters = vFuel.reduce((acc, f) => acc + (f.liters || 0), 0);
      
      let vDist = 0;
      // if trips have distance, use it, else fallback to odometer difference if possible, but trips distance is better
      vDist = vTrips.reduce((acc, t) => acc + (t.distanceKm || 0), 0);

      const acqCost = v.acquisitionCost || 1; // avoid division by zero
      const roi = ((vRev - (vMCost + vFCost)) / acqCost) * 100;

      const efficiency = vLiters > 0 ? vDist / vLiters : 0;

      return {
        reg: v.registrationNumber,
        roi,
        efficiency,
        revenue: vRev,
        maintenance: vMCost,
        fuel: vFCost,
        distance: vDist,
        liters: vLiters
      };
    });

    vehicleMetrics.forEach(vm => {
      vehicleLabels.push(vm.reg);
      roiValues.push(Number(vm.roi.toFixed(2)));
      effValues.push(Number(vm.efficiency.toFixed(2)));
    });

    const rData = {
      labels: vehicleLabels,
      datasets: [
        {
          label: "ROI (%)",
          data: roiValues,
          backgroundColor: "rgba(0, 184, 148, 0.8)",
          borderRadius: 4,
        },
      ],
    };

    const fData = {
      labels: vehicleLabels,
      datasets: [
        {
          label: "Fuel Efficiency (km/L)",
          data: effValues,
          backgroundColor: "rgba(108, 92, 231, 0.8)",
          borderRadius: 4,
        },
      ],
    };

    return { 
      KPIS: kpis, 
      utilizationData: uData, 
      roiData: rData, 
      fuelEffData: fData,
      rawData: { activePct, vehicleMetrics }
    };
  }, [dateRange, region, vehicles, trips, maintenanceLogs, fuelLogs, expenses]);

  const handleExportCSV = () => {
    const headers = ["Metric", "Value"];
    const rows = [
      ["Total Revenue", KPIS.totalRevenue],
      ["Total Expenses", KPIS.totalExpenses],
      ["Fuel Costs", KPIS.fuelCosts],
      ["Net Margin (%)", KPIS.netMargin],
      ["", ""],
      ["Vehicle Registration", "ROI (%)", "Fuel Efficiency (km/L)", "Revenue", "Maintenance Cost", "Fuel Cost", "Distance (km)"],
      ...rawData.vehicleMetrics.map((vm) => [
        vm.reg,
        vm.roi.toFixed(2),
        vm.efficiency.toFixed(2),
        vm.revenue,
        vm.maintenance,
        vm.fuel,
        vm.distance,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `fleet_report_${dateRange.replace(/ /g, "_").toLowerCase()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ProtectedRoute allowedRoles={["FLEET_MANAGER", "FINANCIAL_ANALYST"]}>
      <div className="flex flex-col gap-6 animate-fade-in max-w-[1400px] mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold mb-1 text-black tracking-tight">Financial & Operational Reports</h1>
          <p className="text-gray-500 text-sm">Analyze your fleet's performance and expenses.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select 
            value={dateRange}
            onChange={setDateRange}
            icon={<Calendar size={16} />}
            options={[
              { label: "This Month", value: "This Month" },
              { label: "Last 3 Months", value: "Last 3 Months" },
              { label: "Last 6 Months", value: "Last 6 Months" },
              { label: "This Year", value: "This Year" },
              { label: "All Time", value: "All Time" },
            ]}
            className="w-48"
          />
          <Select 
            value={region}
            onChange={setRegion}
            icon={<Filter size={16} />}
            options={[
              { label: "All Regions", value: "All Regions" },
              { label: "North Zone", value: "North Zone" },
              { label: "South Zone", value: "South Zone" },
            ]}
            className="w-40"
          />
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer ml-2"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Revenue"
          value={`₹${formatNumber(KPIS.totalRevenue)}`}
          icon={TrendingUp}
          iconBg="bg-success/15"
          iconColor="text-success"
        />
        <StatCard
          label="Operational Cost"
          value={`₹${formatNumber(KPIS.totalExpenses)}`}
          icon={TrendingDown}
          iconBg="bg-danger/15"
          iconColor="text-danger"
        />
        <StatCard
          label="Fuel Costs"
          value={`₹${formatNumber(KPIS.fuelCosts)}`}
          icon={Fuel}
          iconBg="bg-warning/15"
          iconColor="text-warning"
        />
        <StatCard
          label="Net Margin"
          value={`${KPIS.netMargin}%`}
          icon={DollarSign}
          iconBg="bg-primary/15"
          iconColor="text-primary-light"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Vehicle ROI */}
        <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800">Vehicle ROI (%)</h3>
            <p className="text-xs font-semibold text-gray-400">Return on investment per vehicle based on acquisition cost</p>
          </div>
          <div className="h-[300px]">
            <BarChart data={roiData} />
          </div>
        </div>

        {/* Utilization */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800">Fleet Utilization</h3>
            <p className="text-xs font-semibold text-gray-400">Current active vs idle breakdown</p>
          </div>
          <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
             <DoughnutChart data={utilizationData} />
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                <span className="text-3xl font-black text-black">{rawData.activePct}%</span>
                <span className="text-xs font-bold text-gray-400">Active</span>
             </div>
          </div>
        </div>

        {/* Fuel Efficiency */}
        <div className="lg:col-span-3 bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800">Fuel Efficiency (km/L)</h3>
            <p className="text-xs font-semibold text-gray-400">Average fuel efficiency per vehicle</p>
          </div>
          <div className="h-[350px]">
            <BarChart data={fuelEffData} />
          </div>
        </div>

      </div>
      </div>
    </ProtectedRoute>
  );
}
