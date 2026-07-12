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
        className="px-4 py-2 rounded-lg text-sm font-medium border border-border-default hover:bg-surface-primary-card-hover transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="expense-form"
        disabled={!vehicleId}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
            <label className="text-sm font-medium text-text-secondary">
              Select Vehicle
            </label>
            <select
              required
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
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
            <label className="text-sm font-medium text-text-secondary">
              Trip (Optional)
            </label>
            <select
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
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
            <label className="text-sm font-medium text-text-secondary">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            >
              <option value="MISC">Misc</option>
              <option value="TOLL">Toll</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="FUEL">Fuel</option>
              <option value="INSURANCE">Insurance</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">
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
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">
            Date
          </label>
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the expense (e.g. Highway toll pass)"
            rows={2}
            className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors resize-none"
          />
        </div>
      </form>
    </Modal>
  );
}
