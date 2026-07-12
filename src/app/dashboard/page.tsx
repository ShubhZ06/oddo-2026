"use client";

import { Truck, AlertTriangle, Route, Users, TrendingUp } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import BarChart from "@/components/charts/BarChart";
import DoughnutChart from "@/components/charts/DoughnutChart";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatNumber, formatPercent, titleCase } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

// Mock Data (remaining static components)
const barChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Completed Trips",
      data: [12, 19, 15, 22, 28, 14, 10],
      backgroundColor: "rgba(108, 92, 231, 0.8)",
      borderRadius: 4,
    },
    {
      label: "Cancelled Trips",
      data: [1, 0, 2, 1, 0, 3, 0],
      backgroundColor: "rgba(225, 112, 85, 0.8)",
      borderRadius: 4,
    },
  ],
};

export default function DashboardPage() {
  const { vehicles, maintenanceLogs } = useApp();

  // Dynamic calculations from shared registry state
  const totalVehicles = vehicles.length;
  const inShopCount = vehicles.filter((v) => v.status === "IN_SHOP").length;
  const availableCount = vehicles.filter((v) => v.status === "AVAILABLE").length;
  const onTripCount = vehicles.filter((v) => v.status === "ON_TRIP").length;
  const retiredCount = vehicles.filter((v) => v.status === "RETIRED").length;

  const nonRetiredCount = totalVehicles - retiredCount;
  const utilizationRate = nonRetiredCount > 0 ? (onTripCount / nonRetiredCount) * 100 : 0;

  const dynamicKPIS = {
    activeVehicles: totalVehicles - retiredCount,
    availableVehicles: availableCount,
    vehiclesInShop: inShopCount,
    activeTrips: onTripCount,
    pendingTrips: 5,
    driversOnDuty: 18,
    fleetUtilization: utilizationRate,
  };

  const dynamicDoughnutData = {
    labels: ["Available", "On Trip", "In Shop", "Retired"],
    datasets: [
      {
        data: [availableCount, onTripCount, inShopCount, retiredCount],
        backgroundColor: [
          "rgba(0, 184, 148, 0.8)", // success
          "rgba(116, 185, 255, 0.8)", // info
          "rgba(253, 203, 110, 0.8)", // warning
          "rgba(225, 112, 85, 0.8)", // danger
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  // Activity feed dynamically sourced from actual logs
  const dynamicActivity = [
    ...maintenanceLogs.slice(0, 3).map((l) => {
      const v = vehicles.find((vehicle) => vehicle.id === l.vehicleId);
      return {
        id: `m-${l.id}`,
        message: `Vehicle ${v?.registrationNumber || `ID:${l.vehicleId}`} reported for ${titleCase(l.type)} - ${l.status}`,
        time: l.status === "OPEN" ? "Active Repair" : `Closed Case`,
        status: l.status === "OPEN" ? "warning" : "success",
      };
    }),
    { id: "sys-1", message: "Fleet smart systems initialized", time: "Ready", status: "muted" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
          <p className="text-text-primary-primary-primary-secondary text-sm">Real-time metrics and fleet status</p>
        </div>
        
        {/* Filter Bar */}
        <div className="flex items-center gap-3 bg-surface-secondary p-1.5 rounded-lg border border-border-default">
          <select className="bg-transparent text-sm px-3 py-1.5 focus:outline-none border-r border-border-default">
            <option>All Regions</option>
            <option>North</option>
            <option>South</option>
            <option>East</option>
            <option>West</option>
          </select>
          <select className="bg-transparent text-sm px-3 py-1.5 focus:outline-none text-text-primary-primary-primary">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Active Vehicles"
          value={formatNumber(dynamicKPIS.activeVehicles)}
          icon={Truck}
          iconBg="bg-primary/15"
          iconColor="text-primary-light"
          trend={{ value: "12%", isPositive: true }}
        />
        <StatCard
          label="Active Trips"
          value={formatNumber(dynamicKPIS.activeTrips)}
          icon={Route}
          iconBg="bg-secondary/15"
          iconColor="text-secondary"
          trend={{ value: "5%", isPositive: true }}
        />
        <StatCard
          label="Vehicles in Shop"
          value={formatNumber(dynamicKPIS.vehiclesInShop)}
          icon={AlertTriangle}
          iconBg="bg-warning/15"
          iconColor="text-warning"
          trend={{ value: "Updated", isPositive: true }}
        />
        <StatCard
          label="Fleet Utilization"
          value={formatPercent(dynamicKPIS.fleetUtilization)}
          icon={TrendingUp}
          iconBg="bg-success/15"
          iconColor="text-success"
          trend={{ value: "Dynamic", isPositive: true }}
        />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-surface-secondary border border-border-default-default-default rounded-xl p-6">
          <BarChart data={barChartData} title="Trip Volume (Last 7 Days)" />
        </div>

        {/* Status Distribution */}
        <div className="bg-surface-secondary border border-border-default-default-default rounded-xl p-6 flex flex-col items-center justify-center">
          <h3 className="w-full text-left font-semibold mb-4">Vehicle Status</h3>
          <div className="w-full h-[250px] relative">
             <DoughnutChart data={dynamicDoughnutData} />
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                <span className="text-3xl font-bold">{totalVehicles}</span>
                <span className="text-xs text-text-primary-muted">Total Fleet</span>
             </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-surface-secondary border border-border-default-default-default rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Recent Activity</h3>
            <button className="text-sm text-primary-light hover:underline">View All</button>
          </div>
          
          <div className="flex flex-col gap-4">
            {dynamicActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-white/3 border border-border-default transition-colors hover:bg-white/5">
                <div className="shrink-0 mt-1">
                  <StatusBadge status={activity.status} label={activity.status === "muted" ? "SYSTEM" : "ALERT"} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <span className="text-xs text-text-primary-primary-primary-muted">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
