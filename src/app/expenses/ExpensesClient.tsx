"use client";

import { useState } from "react";
import { DollarSign, Droplets, TrendingUp, Plus, Receipt } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import StatCard from "@/components/ui/StatCard";
import { formatCurrency, formatDate, titleCase } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";
import type { Expense, FuelLog, Vehicle, Trip } from "@/types";
import ExpenseModal from "./ExpenseModal";
import FuelModal from "./FuelModal";
import { createExpense, createFuelLog } from "@/actions/expenses";

export default function ExpensesClient({
  initialExpenses,
  initialFuelLogs,
  vehicles,
  trips,
}: {
  initialExpenses: any[];
  initialFuelLogs: any[];
  vehicles: any[];
  trips: any[];
}) {
  const [activeTab, setActiveTab] = useState<"expenses" | "fuel">("expenses");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);

  const handleCreateExpense = async (data: any) => {
    const res = await createExpense(data);
    if (res.success) {
      showToast("success", "Expense logged successfully.");
    } else {
      showToast("error", res.error || "Failed to log expense.");
    }
  };

  const handleCreateFuelLog = async (data: any) => {
    const res = await createFuelLog(data);
    if (res.success) {
      showToast("success", "Fuel log added successfully.");
    } else {
      showToast("error", res.error || "Failed to add fuel log.");
    }
  };

  // KPIs
  const totalExpenseSpend = initialExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalFuelSpend = initialFuelLogs.reduce((sum, f) => sum + f.totalCost, 0);
  
  let totalLiters = 0;
  let totalFuelCost = 0;
  initialFuelLogs.forEach((f) => {
    totalLiters += f.liters;
    totalFuelCost += f.totalCost;
  });
  const avgFuelCostPerLiter = totalLiters > 0 ? totalFuelCost / totalLiters : 0;

  // Filtering
  const searchString = searchQuery.toLowerCase();

  const filteredExpenses = initialExpenses.filter((e) => {
    const v = vehicles.find((v) => v.id === e.vehicleId);
    return (
      e.category.toLowerCase().includes(searchString) ||
      e.description?.toLowerCase().includes(searchString) ||
      v?.registrationNumber.toLowerCase().includes(searchString)
    );
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredFuelLogs = initialFuelLogs
    .filter((f) => {
      const v = vehicles.find((v) => v.id === f.vehicleId);
      return v?.registrationNumber.toLowerCase().includes(searchString);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const expenseColumns = [
    {
      header: "Vehicle",
      cell: (e: Expense) => {
        const v = vehicles.find((v) => v.id === e.vehicleId);
        return <span className="font-semibold text-gray-800">{v?.registrationNumber}</span>;
      },
    },
    {
      header: "Category",
      cell: (e: Expense) => <span className="text-gray-600 font-semibold">{titleCase(e.category)}</span>,
    },
    {
      header: "Amount",
      cell: (e: Expense) => (
        <span className="font-bold text-black">{formatCurrency(e.amount)}</span>
      ),
    },
    {
      header: "Date",
      cell: (e: Expense) => <span className="text-gray-500 font-medium">{formatDate(e.date)}</span>,
    },
    {
      header: "Description",
      cell: (e: Expense) => (
        <div className="max-w-xs truncate text-gray-500">
          {e.description || <span className="italic text-gray-400">No description</span>}
        </div>
      ),
    },
  ];

  const fuelColumns = [
    {
      header: "Vehicle",
      cell: (f: FuelLog) => {
        const v = vehicles.find((v) => v.id === f.vehicleId);
        return <span className="font-semibold text-gray-800">{v?.registrationNumber}</span>;
      },
    },
    {
      header: "Liters",
      cell: (f: FuelLog) => <span className="font-mono text-gray-500 font-semibold">{f.liters} L</span>,
    },
    {
      header: "Cost / L",
      cell: (f: FuelLog) => <span className="font-mono text-gray-500 font-semibold">{formatCurrency(f.costPerLiter)}</span>,
    },
    {
      header: "Total Cost",
      cell: (f: FuelLog) => (
        <span className="font-bold text-black">{formatCurrency(f.totalCost)}</span>
      ),
    },
    {
      header: "Odometer",
      cell: (f: FuelLog) => <span className="font-mono text-gray-500 font-semibold">{f.odometerAtFill.toLocaleString()} km</span>,
    },
    {
      header: "Date",
      cell: (f: FuelLog) => <span className="text-gray-500 font-medium">{formatDate(f.date)}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold mb-1 text-black tracking-tight">Fuel & Expenses</h1>
          <p className="text-gray-500 text-sm">
            Track operational costs, fuel consumption, and general expenditures.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Expense Spend"
          value={formatCurrency(totalExpenseSpend)}
          icon={Receipt}
          iconBg="bg-primary/15"
          iconColor="text-primary-light"
        />
        <StatCard
          label="Total Fuel Spend"
          value={formatCurrency(totalFuelSpend)}
          icon={Droplets}
          iconBg="bg-warning/15"
          iconColor="text-warning"
        />
        <StatCard
          label="Avg. Cost per Liter"
          value={formatCurrency(avgFuelCostPerLiter)}
          icon={TrendingUp}
          iconBg="bg-success/15"
          iconColor="text-success"
        />
      </div>

      {/* Tabs & Table */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("expenses")}
              className={`text-lg font-bold px-2 py-1 transition-colors border-b-2 cursor-pointer ${
                activeTab === "expenses"
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-black"
              }`}
            >
              General Expenses
            </button>
            <button
              onClick={() => setActiveTab("fuel")}
              className={`text-lg font-bold px-2 py-1 transition-colors border-b-2 cursor-pointer ${
                activeTab === "fuel"
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-black"
              }`}
            >
              Fuel Logs
            </button>
          </div>
        </div>

        {activeTab === "expenses" ? (
          <DataTable
            data={filteredExpenses}
            columns={expenseColumns}
            searchPlaceholder="Search category, description, vehicle..."
            onSearch={setSearchQuery}
            actions={
              <button
                onClick={() => setIsExpenseModalOpen(true)}
                className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-[14px] text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
              >
                <Plus size={18} />
                Add Expense
              </button>
            }
          />
        ) : (
          <DataTable
            data={filteredFuelLogs}
            columns={fuelColumns}
            searchPlaceholder="Search by vehicle..."
            onSearch={setSearchQuery}
            actions={
              <button
                onClick={() => setIsFuelModalOpen(true)}
                className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-[14px] text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
              >
                <Plus size={18} />
                Log Fuel
              </button>
            }
          />
        )}
      </div>

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        vehicles={vehicles}
        trips={trips}
        onSubmit={handleCreateExpense}
      />

      <FuelModal
        isOpen={isFuelModalOpen}
        onClose={() => setIsFuelModalOpen(false)}
        vehicles={vehicles}
        trips={trips}
        onSubmit={handleCreateFuelLog}
      />
    </div>
  );
}
