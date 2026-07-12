"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import type { Vehicle, Trip, ExpenseCategory } from "@/types";

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  trips: Trip[];
  onSubmit: (data: {
    vehicleId: number;
    tripId?: number | null;
    category: ExpenseCategory;
    amount: number;
    description: string;
    date: Date;
  }) => void;
}

export default function ExpenseModal({
  isOpen,
  onClose,
  vehicles,
  trips,
  onSubmit,
}: ExpenseModalProps) {
  const [vehicleId, setVehicleId] = useState<string>("");
  const [tripId, setTripId] = useState<string>("");
  const [category, setCategory] = useState<ExpenseCategory>("MISC");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) return;

    onSubmit({
      vehicleId: parseInt(vehicleId, 10),
      tripId: tripId ? parseInt(tripId, 10) : null,
      category,
      amount: parseFloat(amount) || 0,
      description,
      date: new Date(date),
    });

    // Reset form
    setVehicleId("");
    setTripId("");
    setCategory("MISC");
    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    onClose();
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="expense-form"
        disabled={!vehicleId}
        className="px-4 py-2 rounded-xl text-sm font-semibold bg-black text-white hover:bg-gray-800 disabled:opacity-50 transition-all shadow-sm cursor-pointer"
      >
        Log Expense
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log General Expense"
      footer={footer}
    >
      <form id="expense-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">
              Select Vehicle
            </label>
            <select
              required
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-black focus:outline-none transition-colors text-gray-700 font-semibold shadow-sm"
            >
              <option value="">-- Choose a Vehicle --</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">
              Trip (Optional)
            </label>
            <select
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-black focus:outline-none transition-colors text-gray-700 font-semibold shadow-sm"
            >
              <option value="">-- None --</option>
              {trips
                .filter((t) => !vehicleId || t.vehicleId.toString() === vehicleId)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    Trip #{t.id} ({t.source} to {t.destination})
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-black focus:outline-none transition-colors text-gray-700 font-semibold shadow-sm"
            >
              <option value="MISC">Misc</option>
              <option value="TOLL">Toll</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="FUEL">Fuel</option>
              <option value="INSURANCE">Insurance</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">
              Amount (₹)
            </label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 500"
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-black focus:outline-none transition-colors text-gray-700 font-semibold shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700">
            Date
          </label>
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-black focus:outline-none transition-colors text-gray-700 font-semibold shadow-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the expense (e.g. Highway toll pass)"
            rows={2}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-black focus:outline-none transition-colors resize-none text-gray-700 font-semibold shadow-sm"
          />
        </div>
      </form>
    </Modal>
  );
}
