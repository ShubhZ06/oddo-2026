"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import type { Vehicle, MaintenanceType } from "@/types";

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onSubmit: (data: {
    vehicleId: number;
    type: MaintenanceType;
    cost: number;
    description: string;
  }) => void;
}

export default function MaintenanceModal({
  isOpen,
  onClose,
  vehicles,
  onSubmit,
}: MaintenanceModalProps) {
  const [vehicleId, setVehicleId] = useState<string>("");
  const [type, setType] = useState<MaintenanceType>("GENERAL");
  const [cost, setCost] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) return;

    onSubmit({
      vehicleId: parseInt(vehicleId, 10),
      type,
      cost: parseFloat(cost) || 0,
      description,
    });

    // Reset form
    setVehicleId("");
    setType("GENERAL");
    setCost("");
    setDescription("");
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
        form="maintenance-form"
        disabled={!vehicleId}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Log Maintenance
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Vehicle Maintenance"
      footer={footer}
    >
      <form id="maintenance-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary-secondary">
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
                {v.registrationNumber} — {v.nameModel} ({v.status})
              </option>
            ))}
          </select>
          {vehicles.length === 0 && (
            <p className="text-xs text-danger font-medium mt-1">
              No vehicles available for maintenance. All vehicles are currently in the shop, retired, or on active trips.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary-secondary">
              Maintenance Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MaintenanceType)}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            >
              <option value="GENERAL">General Maintenance</option>
              <option value="OIL_CHANGE">Oil Change</option>
              <option value="TIRE_REPLACEMENT">Tire Replacement</option>
              <option value="ENGINE_REPAIR">Engine Repair</option>
              <option value="BRAKE_SERVICE">Brake Service</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary-secondary">
              Estimated Cost (₹)
            </label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="e.g. 5000"
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary-secondary">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the maintenance work (e.g. regular 10k km service, replacement of front disc brakes)"
            rows={4}
            className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors resize-none"
          />
        </div>
      </form>
    </Modal>
  );
}
