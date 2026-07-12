"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { showToast } from "@/components/ui/Toast";
import { addVehicle, updateVehicle } from "@/actions/vehicle";

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: any;
}

export default function VehicleModal({ isOpen, onClose, vehicle }: VehicleModalProps) {

  const [formData, setFormData] = useState({
    registrationNumber: "",
    nameModel: "",
    type: "TRUCK" as const,
    maxLoadCapacityKg: "",
    odometerKm: "",
    acquisitionCost: "",
    region: "",
    status: "AVAILABLE" as const,
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        registrationNumber: vehicle.registrationNumber || "",
        nameModel: vehicle.nameModel || "",
        type: vehicle.type || "TRUCK",
        maxLoadCapacityKg: String(vehicle.maxLoadCapacityKg) || "",
        odometerKm: String(vehicle.odometerKm) || "",
        acquisitionCost: String(vehicle.acquisitionCost) || "",
        region: vehicle.region || "",
        status: vehicle.status || "AVAILABLE",
      });
    } else {
      setFormData({
        registrationNumber: "",
        nameModel: "",
        type: "TRUCK",
        maxLoadCapacityKg: "",
        odometerKm: "",
        acquisitionCost: "",
        region: "",
        status: "AVAILABLE",
      });
    }
  }, [vehicle, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedData = {
      registrationNumber: formData.registrationNumber,
      nameModel: formData.nameModel,
      type: formData.type,
      maxLoadCapacityKg: Number(formData.maxLoadCapacityKg),
      odometerKm: Number(formData.odometerKm),
      acquisitionCost: Number(formData.acquisitionCost),
      region: formData.region,
      status: formData.status,
    };

    let res;
    if (vehicle) {
      res = await updateVehicle(vehicle.id, parsedData);
    } else {
      res = await addVehicle(parsedData);
    }

    if (res.success) {
      showToast("success", `Vehicle ${formData.registrationNumber.toUpperCase()} ${vehicle ? "updated successfully" : "added to registry"}.`);
      onClose();
    } else {
      showToast("error", `Failed: ${res.error}`);
    }
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
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors uppercase"
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
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
              placeholder="e.g. Volvo FH16"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Type</label>
            <Select
              value={formData.type}
              onChange={(val) => setFormData({...formData, type: val as any})}
              options={[
                { label: "Truck", value: "TRUCK" },
                { label: "Van", value: "VAN" },
                { label: "Car", value: "CAR" },
                { label: "Bus", value: "BUS" },
              ]}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Max Capacity (kg)</label>
            <input 
              required
              type="number"
              min="0"
              value={formData.maxLoadCapacityKg}
              onChange={(e) => setFormData({...formData, maxLoadCapacityKg: e.target.value})}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
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
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Region (Optional)</label>
            <input 
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
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
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
