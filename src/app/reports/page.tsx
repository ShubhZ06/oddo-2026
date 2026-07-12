"use client";

import { useState } from "react";
import { Download, Calendar, Filter, TrendingUp, TrendingDown, DollarSign, Fuel } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import BarChart from "@/components/charts/BarChart";
import DoughnutChart from "@/components/charts/DoughnutChart";
import LineChart from "@/components/charts/LineChart";
import { formatNumber } from "@/lib/utils";

// Mock Data
const KPIS = {
  totalRevenue: 245000,
  totalExpenses: 112000,
  fuelCosts: 48500,
  netMargin: 54.3,
};

const trendData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Revenue",
      data: [180000, 195000, 210000, 205000, 230000, 240000, 245000],
      borderColor: "rgba(0, 184, 148, 1)",
      backgroundColor: "rgba(0, 184, 148, 0.1)",
      borderWidth: 2,
      tension: 0.4,
      fill: true,
    },
    {
      label: "Expenses",
      data: [90000, 95000, 102000, 98000, 105000, 110000, 112000],
      borderColor: "rgba(225, 112, 85, 1)",
      backgroundColor: "rgba(225, 112, 85, 0.1)",
      borderWidth: 2,
      tension: 0.4,
      fill: true,
    }
  ],
};

const expenseBreakdownData = {
  labels: ["Fuel", "Maintenance", "Salaries", "Insurance", "Tolls"],
  datasets: [
    {
      label: "Cost (₹)",
      data: [48500, 24000, 31000, 5000, 3500],
      backgroundColor: "rgba(108, 92, 231, 0.8)",
      borderRadius: 4,
    },
  ],
};

const utilizationData = {
  labels: ["Active Use", "Idle", "In Maintenance"],
  datasets: [
    {
      data: [75, 15, 10],
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

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const [region, setRegion] = useState("All Regions");

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-[1400px] mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Financial & Operational Reports</h1>
          <p className="text-text-primary-primary-secondary text-sm">Analyze your fleet's performance and expenses.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-secondary p-1.5 rounded-lg border border-border-default-default">
            <Calendar size={16} className="text-text-primary-primary-muted ml-2" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-sm px-2 py-1.5 focus:outline-none border-r border-border-default-default cursor-pointer text-text-primary-primary"
            >
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
            <Filter size={16} className="text-text-primary-primary-muted ml-2" />
            <select 
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="bg-transparent text-sm px-2 py-1.5 focus:outline-none cursor-pointer text-text-primary-primary"
            >
              <option>All Regions</option>
              <option>North Zone</option>
              <option>South Zone</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-secondary border border-border-default-default rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors">
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
          trend={{ value: "8.4%", isPositive: true }}
        />
        <StatCard
          label="Total Expenses"
          value={`₹${formatNumber(KPIS.totalExpenses)}`}
          icon={TrendingDown}
          iconBg="bg-danger/15"
          iconColor="text-danger"
          trend={{ value: "2.1%", isPositive: false }}
        />
        <StatCard
          label="Fuel Costs"
          value={`₹${formatNumber(KPIS.fuelCosts)}`}
          icon={Fuel}
          iconBg="bg-warning/15"
          iconColor="text-warning"
          trend={{ value: "5.2%", isPositive: false }}
        />
        <StatCard
          label="Net Margin"
          value={`${KPIS.netMargin}%`}
          icon={DollarSign}
          iconBg="bg-primary/15"
          iconColor="text-primary-light"
          trend={{ value: "1.2%", isPositive: true }}
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-3 bg-surface-secondary border border-border-default-default rounded-xl p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Revenue vs Expenses Trend</h3>
            <p className="text-xs text-text-primary-primary-muted">Financial performance over {dateRange.toLowerCase()}</p>
          </div>
          <div className="h-[350px]">
            <LineChart data={trendData} />
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="lg:col-span-2 bg-surface-secondary border border-border-default-default rounded-xl p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Expense Breakdown</h3>
            <p className="text-xs text-text-primary-primary-muted">Distribution of costs by category</p>
          </div>
          <div className="h-[300px]">
            <BarChart data={expenseBreakdownData} />
          </div>
        </div>

        {/* Utilization */}
        <div className="bg-surface-secondary border border-border-default-default rounded-xl p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="font-semibold">Fleet Utilization</h3>
            <p className="text-xs text-text-primary-primary-muted">Overall vehicle status</p>
          </div>
          <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
             <DoughnutChart data={utilizationData} />
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                <span className="text-3xl font-bold">75%</span>
                <span className="text-xs text-text-primary-primary-muted">Active</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
