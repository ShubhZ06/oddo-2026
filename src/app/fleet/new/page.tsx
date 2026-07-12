"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Truck, Save } from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import Select from "@/components/ui/Select";
import { addVehicle } from "@/actions/vehicle";

export default function NewVehiclePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
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

      const res = await addVehicle(parsedData);

      if (res.success) {
        showToast("success", `Vehicle ${formData.registrationNumber.toUpperCase()} added to registry.`);
        router.push("/fleet");
      } else {
        showToast("error", `Failed: ${res.error}`);
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Error creating vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    formData.registrationNumber &&
    formData.nameModel &&
    formData.maxLoadCapacityKg &&
    formData.odometerKm &&
    formData.acquisitionCost &&
    !submitting;

  return (
    <div className="flex flex-col gap-6 max-w-[800px] mx-auto animate-fade-in w-full">
      {/* Breadcrumbs */}
      <div>
        <Link
          href="/fleet"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary-light transition-colors font-medium mb-3 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Registry
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="text-primary-light" size={24} />
          Add New Vehicle
        </h1>
        <p className="text-text-secondary text-sm">
          Register a new asset to your fleet and set its parameters.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-border-default rounded-xl p-6 md:p-8 flex flex-col gap-6 shadow-sm"
      >
        <div className="text-sm font-semibold text-text-secondary border-b border-border-default pb-2 uppercase tracking-wider">
          Identity & Specifications
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Registration Number
            </label>
            <input 
              required
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors uppercase placeholder:normal-case placeholder:text-gray-300"
              placeholder="e.g. TRK-001"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Name / Model
            </label>
            <input 
              required
              type="text"
              value={formData.nameModel}
              onChange={(e) => setFormData({...formData, nameModel: e.target.value})}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors placeholder:text-gray-300"
              placeholder="e.g. Volvo FH16"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Vehicle Type
            </label>
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

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Max Capacity (kg)
            </label>
            <input 
              required
              type="number"
              min="0"
              value={formData.maxLoadCapacityKg}
              onChange={(e) => setFormData({...formData, maxLoadCapacityKg: e.target.value})}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors placeholder:text-gray-300"
              placeholder="0"
            />
          </div>
        </div>

        <div className="text-sm font-semibold text-text-secondary border-b border-border-default pb-2 uppercase tracking-wider mt-2">
          Operations & Finance
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Current Odometer (km)
            </label>
            <input 
              required
              type="number"
              min="0"
              value={formData.odometerKm}
              onChange={(e) => setFormData({...formData, odometerKm: e.target.value})}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors placeholder:text-gray-300"
              placeholder="0"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Region (Optional)
            </label>
            <input 
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors placeholder:text-gray-300"
              placeholder="e.g. North Zone"
            />
          </div>
          
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Acquisition Cost ($)
            </label>
            <input 
              required
              type="number"
              min="0"
              value={formData.acquisitionCost}
              onChange={(e) => setFormData({...formData, acquisitionCost: e.target.value})}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors placeholder:text-gray-300"
              placeholder="0"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 mt-4 border-t border-border-default pt-6">
          <Link
            href="/fleet"
            className="px-5 py-2.5 text-sm font-semibold border border-border-default rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-text-secondary hover:text-black"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!isFormValid}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-black rounded-lg transition-all hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Save size={16} />
            {submitting ? "Adding..." : "Add Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
}
