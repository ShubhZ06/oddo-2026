"use client";

import { useState, useMemo } from "react";
import { Download, Calendar, Filter, TrendingUp, TrendingDown, DollarSign, Fuel } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import Select from "@/components/ui/Select";
import BarChart from "@/components/charts/BarChart";
import DoughnutChart from "@/components/charts/DoughnutChart";
import LineChart from "@/components/charts/LineChart";
import { formatNumber } from "@/lib/utils";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("This Month");
  const [region, setRegion] = useState("All Regions");

  // Dynamic Mock Data generation based on filters
  const { KPIS, trendData, expenseBreakdownData, utilizationData } = useMemo(() => {
    let multiplier = 1;
    if (dateRange === "This Month") multiplier = 0.2;
    if (dateRange === "Last 3 Months") multiplier = 0.5;
    if (dateRange === "This Year") multiplier = 2.0;

    let rMulti = 1;
    if (region === "North Zone") rMulti = 0.6;
    if (region === "South Zone") rMulti = 0.4;
    
    const factor = multiplier * rMulti;

    const baseRev = [180000, 195000, 210000, 205000, 230000, 240000, 245000];
    const baseExp = [90000, 95000, 102000, 98000, 105000, 110000, 112000];

    const kpis = {
      totalRevenue: Math.round(245000 * factor),
      totalExpenses: Math.round(112000 * factor),
      fuelCosts: Math.round(48500 * factor),
      netMargin: (54.3 + (Math.random() * 5 - 2.5)).toFixed(1), // Slight random variation
    };

    const tData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Revenue",
          data: baseRev.map(v => Math.round(v * factor)),
          borderColor: "rgba(0, 184, 148, 1)",
          backgroundColor: "rgba(0, 184, 148, 0.1)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
        {
          label: "Expenses",
          data: baseExp.map(v => Math.round(v * factor)),
          borderColor: "rgba(225, 112, 85, 1)",
          backgroundColor: "rgba(225, 112, 85, 0.1)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        }
      ],
    };

    const exData = {
      labels: ["Fuel", "Maintenance", "Salaries", "Insurance", "Tolls"],
      datasets: [
        {
          label: "Cost (₹)",
          data: [48500, 24000, 31000, 5000, 3500].map(v => Math.round(v * factor)),
          backgroundColor: "rgba(108, 92, 231, 0.8)",
          borderRadius: 4,
        },
      ],
    };

    // Vary utilization slightly
    const active = Math.min(95, Math.max(50, Math.round(75 + (Math.random() * 20 - 10))));
    const idle = Math.round((100 - active) * 0.6);
    const maint = 100 - active - idle;
    
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

    return { KPIS: kpis, trendData: tData, expenseBreakdownData: exData, utilizationData: uData };
  }, [dateRange, region]);

  const handleExportCSV = () => {
    const headers = ["Metric", "Value"];
    const rows = [
      ["Total Revenue", KPIS.totalRevenue],
      ["Total Expenses", KPIS.totalExpenses],
      ["Fuel Costs", KPIS.fuelCosts],
      ["Net Margin (%)", KPIS.netMargin],
      ["", ""],
      ["Expense Category", "Cost (INR)"],
      ...expenseBreakdownData.labels.map((label, i) => [
        label,
        expenseBreakdownData.datasets[0].data[i],
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
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
        <div className="lg:col-span-3 bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800">Revenue vs Expenses Trend</h3>
            <p className="text-xs font-semibold text-gray-400">Financial performance over {dateRange.toLowerCase()}</p>
          </div>
          <div className="h-[350px]">
            <LineChart data={trendData} />
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800">Expense Breakdown</h3>
            <p className="text-xs font-semibold text-gray-400">Distribution of costs by category</p>
          </div>
          <div className="h-[300px]">
            <BarChart data={expenseBreakdownData} />
          </div>
        </div>

        {/* Utilization */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800">Fleet Utilization</h3>
            <p className="text-xs font-semibold text-gray-400">Overall vehicle status</p>
          </div>
          <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
             <DoughnutChart data={utilizationData} />
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                <span className="text-3xl font-black text-black">{utilizationData.datasets[0].data[0]}%</span>
                <span className="text-xs font-bold text-gray-400">Active</span>
             </div>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
