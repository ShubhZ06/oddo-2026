"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
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
        className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="fuel-form"
        disabled={!vehicleId}
        className="px-4 py-2 rounded-xl text-sm font-semibold bg-black text-white hover:bg-gray-800 disabled:opacity-50 transition-all shadow-sm cursor-pointer"
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
            <label className="text-sm font-bold text-gray-700">
              Select Vehicle
            </label>
            <Select
              required
              value={vehicleId}
              onChange={setVehicleId}
              options={vehicles.map((v) => ({
                label: v.registrationNumber,
                value: v.id.toString(),
              }))}
              placeholder="-- Choose a Vehicle --"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">
              Trip (Optional)
            </label>
            <Select
              value={tripId}
              onChange={setTripId}
              options={trips
                .filter((t) => !vehicleId || t.vehicleId.toString() === vehicleId)
                .map((t) => ({
                  label: `Trip #${t.id} (${t.source} to ${t.destination})`,
                  value: t.id.toString(),
                }))}
              placeholder="-- None --"
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">
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
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-black focus:outline-none transition-colors text-gray-700 font-semibold shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">
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
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-black focus:outline-none transition-colors text-gray-700 font-semibold shadow-sm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">
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
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-black focus:outline-none transition-colors text-gray-700 font-semibold shadow-sm"
            />
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
        </div>

      </form>
    </Modal>
  );
}
