"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wrench, Save } from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import Select from "@/components/ui/Select";
import { logMaintenance } from "@/actions/maintenance";
import type { Vehicle, MaintenanceType } from "@/types";

export default function NewMaintenanceClient({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    vehicleId: "",
    type: "GENERAL" as MaintenanceType,
    cost: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const parsedData = {
        vehicleId: Number(formData.vehicleId),
        type: formData.type,
        cost: parseFloat(formData.cost) || 0,
        description: formData.description,
      };

      const res = await logMaintenance(parsedData);

      if (res.success) {
        showToast("success", `Maintenance logged successfully.`);
        router.push("/maintenance");
      } else {
        showToast("error", `Failed: ${res.error}`);
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Error logging maintenance");
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    formData.vehicleId &&
    formData.cost &&
    !submitting;

  return (
    <div className="flex flex-col gap-6 max-w-[800px] mx-auto animate-fade-in w-full">
      {/* Breadcrumbs */}
      <div>
        <Link
          href="/maintenance"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary-light transition-colors font-medium mb-3 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Maintenance
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wrench className="text-orange-500" size={24} />
          Log Repair
        </h1>
        <p className="text-text-secondary text-sm">
          Create a new work order to track repairs and maintenance costs.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-border-default rounded-xl p-6 md:p-8 flex flex-col gap-6 shadow-sm"
      >
        <div className="text-sm font-semibold text-text-secondary border-b border-border-default pb-2 uppercase tracking-wider">
          Vehicle Selection
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Select Vehicle
          </label>
          <Select
            required
            value={formData.vehicleId}
            onChange={(val) => setFormData({...formData, vehicleId: val})}
            options={vehicles.map((v) => ({
              label: `${v.registrationNumber} — ${v.nameModel} (${v.status})`,
              value: v.id.toString(),
            }))}
            placeholder="-- Choose a Vehicle --"
            className="w-full"
          />
          {vehicles.length === 0 && (
            <p className="text-xs text-danger font-medium mt-1">
              No vehicles available for maintenance. All vehicles are currently in the shop or retired.
            </p>
          )}
        </div>

        <div className="text-sm font-semibold text-text-secondary border-b border-border-default pb-2 uppercase tracking-wider mt-2">
          Service Details
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Maintenance Type
            </label>
            <Select
              value={formData.type}
              onChange={(val) => setFormData({...formData, type: val as any})}
              options={[
                { label: "General Maintenance", value: "GENERAL" },
                { label: "Oil Change", value: "OIL_CHANGE" },
                { label: "Tire Replacement", value: "TIRE_REPLACEMENT" },
                { label: "Engine Repair", value: "ENGINE_REPAIR" },
                { label: "Brake Service", value: "BRAKE_SERVICE" },
              ]}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Estimated Cost ($)
            </label>
            <input 
              required
              type="number"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({...formData, cost: e.target.value})}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors placeholder:text-gray-300"
              placeholder="e.g. 150.00"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Describe the maintenance work..."
            rows={4}
            className="bg-surface-primary border border-border-default rounded-lg px-3 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors resize-none placeholder:text-gray-300"
          />
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 mt-4 border-t border-border-default pt-6">
          <Link
            href="/maintenance"
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
            {submitting ? "Logging..." : "Log Maintenance"}
          </button>
        </div>
      </form>
    </div>
  );
}
