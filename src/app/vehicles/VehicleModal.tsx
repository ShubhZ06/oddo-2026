"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: any; // Will use proper type later
}

export default function VehicleModal({ isOpen, onClose, vehicle }: VehicleModalProps) {
  const [formData, setFormData] = useState({
    registrationNumber: vehicle?.registrationNumber || "",
    nameModel: vehicle?.nameModel || "",
    type: vehicle?.type || "TRUCK",
    maxLoadCapacityKg: vehicle?.maxLoadCapacityKg || "",
    odometerKm: vehicle?.odometerKm || "",
    acquisitionCost: vehicle?.acquisitionCost || "",
    region: vehicle?.region || "",
    status: vehicle?.status || "AVAILABLE",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, call API to save
    console.log("Saving vehicle:", formData);
    onClose();
  };

  const footer = (
    <>
      <button 
        type="button" 
        onClick={onClose}
        className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-bg-card-hover transition-colors"
      >
        Cancel
      </button>
      <button 
        type="submit" 
        form="vehicle-form"
        className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-primary text-white hover:opacity-90 transition-opacity"
      >
        {vehicle ? "Save Changes" : "Add Vehicle"}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicle ? "Edit Vehicle" : "Add New Vehicle"}
      footer={footer}
    >
      <form id="vehicle-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Registration Number</label>
            <input 
              required
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
              className="bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors uppercase"
              placeholder="e.g. TRK-001"
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Name / Model</label>
            <input 
              required
              type="text"
              value={formData.nameModel}
              onChange={(e) => setFormData({...formData, nameModel: e.target.value})}
              className="bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
              placeholder="e.g. Volvo FH16"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            >
              <option value="TRUCK">Truck</option>
              <option value="VAN">Van</option>
              <option value="CAR">Car</option>
              <option value="BUS">Bus</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Max Capacity (kg)</label>
            <input 
              required
              type="number"
              min="0"
              value={formData.maxLoadCapacityKg}
              onChange={(e) => setFormData({...formData, maxLoadCapacityKg: e.target.value})}
              className="bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Current Odometer (km)</label>
            <input 
              required
              type="number"
              min="0"
              value={formData.odometerKm}
              onChange={(e) => setFormData({...formData, odometerKm: e.target.value})}
              className="bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Region (Optional)</label>
            <input 
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              className="bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
              placeholder="e.g. North Zone"
            />
          </div>
          
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-text-secondary">Acquisition Cost (₹)</label>
            <input 
              required
              type="number"
              min="0"
              value={formData.acquisitionCost}
              onChange={(e) => setFormData({...formData, acquisitionCost: e.target.value})}
              className="bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
