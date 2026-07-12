"use client";

import { Truck, AlertTriangle, Route, Users, TrendingUp } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import BarChart from "@/components/charts/BarChart";
import DoughnutChart from "@/components/charts/DoughnutChart";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatNumber, formatPercent } from "@/lib/utils";

// Mock Data (until DB is connected)
const KPIS = {
  activeVehicles: 24,
  availableVehicles: 18,
  vehiclesInShop: 3,
  activeTrips: 12,
  pendingTrips: 5,
  driversOnDuty: 18,
  fleetUtilization: 87.5,
};

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

const doughnutData = {
  labels: ["Available", "On Trip", "In Shop", "Retired"],
  datasets: [
    {
      data: [18, 12, 3, 1],
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

const RECENT_ACTIVITY = [
  { id: 1, type: "TRIP_DISPATCHED", message: "Trip #1042 dispatched to North Zone", time: "10 mins ago", status: "info" },
  { id: 2, type: "MAINTENANCE_LOGGED", message: "Vehicle TRK-092 reported for Engine Repair", time: "1 hour ago", status: "warning" },
  { id: 3, type: "TRIP_COMPLETED", message: "Trip #1038 completed successfully", time: "2 hours ago", status: "success" },
  { id: 4, type: "DRIVER_STATUS", message: "John Doe changed status to Off Duty", time: "3 hours ago", status: "muted" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
          <p className="text-text-secondary text-sm">Real-time metrics and fleet status</p>
        </div>
        
        {/* Placeholder Filter Bar */}
        <div className="flex items-center gap-3 bg-surface-secondary p-1.5 rounded-lg border border-border-default">
          <select className="bg-transparent text-sm px-3 py-1.5 focus:outline-none border-r border-border-default">
            <option>All Regions</option>
            <option>North</option>
            <option>South</option>
            <option>East</option>
            <option>West</option>
          </select>
          <select className="bg-transparent text-sm px-3 py-1.5 focus:outline-none text-text-primary">
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
          value={formatNumber(KPIS.activeVehicles)}
          icon={Truck}
          iconBg="bg-primary/15"
          iconColor="text-primary-light"
          trend={{ value: "12%", isPositive: true }}
        />
        <StatCard
          label="Active Trips"
          value={formatNumber(KPIS.activeTrips)}
          icon={Route}
          iconBg="bg-secondary/15"
          iconColor="text-secondary"
          trend={{ value: "5%", isPositive: true }}
        />
        <StatCard
          label="Vehicles in Shop"
          value={formatNumber(KPIS.vehiclesInShop)}
          icon={AlertTriangle}
          iconBg="bg-warning/15"
          iconColor="text-warning"
          trend={{ value: "2", isPositive: false }}
        />
        <StatCard
          label="Fleet Utilization"
          value={formatPercent(KPIS.fleetUtilization)}
          icon={TrendingUp}
          iconBg="bg-success/15"
          iconColor="text-success"
          trend={{ value: "4.2%", isPositive: true }}
        />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-surface-secondary border border-border-default rounded-xl p-6">
          <BarChart data={barChartData} title="Trip Volume (Last 7 Days)" />
        </div>

        {/* Status Distribution */}
        <div className="bg-surface-secondary border border-border-default rounded-xl p-6 flex flex-col items-center justify-center">
          <h3 className="w-full text-left font-semibold mb-4">Vehicle Status</h3>
          <div className="w-full h-[250px] relative">
             <DoughnutChart data={doughnutData} />
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                <span className="text-3xl font-bold">{KPIS.activeVehicles + KPIS.vehiclesInShop + 1}</span>
                <span className="text-xs text-text-muted">Total Fleet</span>
             </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-surface-secondary border border-border-default rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Recent Activity</h3>
            <button className="text-sm text-primary-light hover:underline">View All</button>
          </div>
          
          <div className="flex flex-col gap-4">
            {RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-white/3 border border-border-default transition-colors hover:bg-white/5">
                <div className="shrink-0 mt-1">
                  <StatusBadge status={activity.status} label={activity.status === "muted" ? "SYSTEM" : "ALERT"} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <span className="text-xs text-text-muted">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
