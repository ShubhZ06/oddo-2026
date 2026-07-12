"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import type { Vehicle, Trip } from "@/types";

interface FuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  trips: Trip[];
  onSubmit: (data: {
    vehicleId: number;
    tripId?: number | null;
    liters: number;
    costPerLiter: number;
    odometerAtFill: number;
    date: Date;
  }) => void;
}

export default function FuelModal({
  isOpen,
  onClose,
  vehicles,
  trips,
  onSubmit,
}: FuelModalProps) {
  const [vehicleId, setVehicleId] = useState<string>("");
  const [tripId, setTripId] = useState<string>("");
  const [liters, setLiters] = useState<string>("");
  const [costPerLiter, setCostPerLiter] = useState<string>("");
  const [odometerAtFill, setOdometerAtFill] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) return;

    onSubmit({
      vehicleId: parseInt(vehicleId, 10),
      tripId: tripId ? parseInt(tripId, 10) : null,
      liters: parseFloat(liters) || 0,
      costPerLiter: parseFloat(costPerLiter) || 0,
      odometerAtFill: parseFloat(odometerAtFill) || 0,
      date: new Date(date),
    });

    // Reset form
    setVehicleId("");
    setTripId("");
    setLiters("");
    setCostPerLiter("");
    setOdometerAtFill("");
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
        form="fuel-form"
        disabled={!vehicleId}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Log Fuel
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Fuel Entry"
      footer={footer}
    >
      <form id="fuel-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              Volume (Liters)
            </label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={liters}
              onChange={(e) => setLiters(e.target.value)}
              placeholder="e.g. 50"
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">
              Cost per Liter (₹)
            </label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={costPerLiter}
              onChange={(e) => setCostPerLiter(e.target.value)}
              placeholder="e.g. 100"
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">
              Odometer Reading (km)
            </label>
            <input
              required
              type="number"
              min="0"
              step="1"
              value={odometerAtFill}
              onChange={(e) => setOdometerAtFill(e.target.value)}
              placeholder="e.g. 12500"
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            />
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
        </div>

      </form>
    </Modal>
  );
}
