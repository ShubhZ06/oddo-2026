"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { showToast } from "@/components/ui/Toast";
import type { Driver, DriverStatus } from "@/types";

interface DriverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  driver?: Driver | null;
}

export default function DriverFormModal({
  isOpen,
  onClose,
  onSuccess,
  driver,
}: DriverFormModalProps) {
  const isEdit = !!driver;
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    licenseCategory: "Class A CDL",
    licenseExpiry: "",
    contactNumber: "",
    safetyScore: 100,
    status: "AVAILABLE" as DriverStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (driver) {
      // Format expiry date to YYYY-MM-DD for the HTML date input
      const dateStr = driver.licenseExpiry.substring(0, 10);
      setFormData({
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        licenseCategory: driver.licenseCategory,
        licenseExpiry: dateStr,
        contactNumber: driver.contactNumber,
        safetyScore: driver.safetyScore,
        status: driver.status,
      });
    } else {
      setFormData({
        name: "",
        licenseNumber: "",
        licenseCategory: "Class A CDL",
        licenseExpiry: "",
        contactNumber: "",
        safetyScore: 100,
        status: "AVAILABLE",
      });
    }
    setErrors({});
  }, [driver, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "safetyScore" ? parseFloat(value) || 0 : value,
    }));
    
    // Clear error
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.licenseNumber.trim())
      newErrors.licenseNumber = "License number is required.";
    if (!formData.licenseCategory.trim())
      newErrors.licenseCategory = "License category is required.";
    if (!formData.licenseExpiry) {
      newErrors.licenseExpiry = "License expiry date is required.";
    }
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact number is required.";
    
    if (formData.safetyScore < 0 || formData.safetyScore > 100) {
      newErrors.safetyScore = "Safety score must be between 0 and 100.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const url = isEdit ? `/api/drivers/${driver.id}` : "/api/drivers";
      const method = isEdit ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || `Failed to ${isEdit ? "update" : "create"} driver.`);
      }

      showToast("success", `Driver ${isEdit ? "updated" : "added"} successfully.`);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      showToast("error", error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <button
        type="button"
        className="px-4 py-2 border border-border-default rounded-lg text-text-primary-primary-secondary hover:bg-white/5 transition-colors cursor-pointer text-sm font-medium"
        onClick={onClose}
        disabled={loading}
      >
        Cancel
      </button>
      <button
        type="submit"
        form="driver-form"
        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors cursor-pointer text-sm font-medium disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Saving..." : isEdit ? "Save Changes" : "Register Driver"}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Driver Details" : "Register New Driver"}
      footer={footer}
    >
      <form id="driver-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-semibold text-text-primary-primary-secondary uppercase">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full bg-surface-secondary border border-border-default focus:border-primary/50 outline-none rounded-lg px-3 py-2 text-sm text-text-primary-primary transition-colors"
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span className="text-xs text-danger">{errors.name}</span>}
        </div>

        {/* Grid for License and Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* License Number */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="licenseNumber" className="text-xs font-semibold text-text-primary-primary-secondary uppercase">
              License Number
            </label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              className="w-full bg-surface-secondary border border-border-default focus:border-primary/50 outline-none rounded-lg px-3 py-2 text-sm text-text-primary-primary transition-colors"
              placeholder="e.g. DL-109283-A"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />
            {errors.licenseNumber && <span className="text-xs text-danger">{errors.licenseNumber}</span>}
          </div>

          {/* License Category */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="licenseCategory" className="text-xs font-semibold text-text-primary-primary-secondary uppercase">
              License Class/Category
            </label>
            <Select
              value={formData.licenseCategory}
              onChange={(val) => handleChange({ target: { name: 'licenseCategory', value: val } } as any)}
              options={[
                { label: "Class A CDL (Heavy Trucks)", value: "Class A CDL" },
                { label: "Class B CDL (Buses/Straight Trucks)", value: "Class B CDL" },
                { label: "Class C (Cars/Standard Vans)", value: "Class C" },
                { label: "Specialized/Hazardous", value: "Specialized" },
              ]}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* License Expiry */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="licenseExpiry" className="text-xs font-semibold text-text-primary-primary-secondary uppercase">
              License Expiry Date
            </label>
            <input
              type="date"
              id="licenseExpiry"
              name="licenseExpiry"
              className="w-full bg-surface-secondary border border-border-default focus:border-primary/50 outline-none rounded-lg px-3 py-2 text-sm text-text-primary-primary transition-colors"
              value={formData.licenseExpiry}
              onChange={handleChange}
              required
            />
            {errors.licenseExpiry && <span className="text-xs text-danger">{errors.licenseExpiry}</span>}
          </div>

          {/* Contact Number */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contactNumber" className="text-xs font-semibold text-text-primary-primary-secondary uppercase">
              Contact Number
            </label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              className="w-full bg-surface-secondary border border-border-default focus:border-primary/50 outline-none rounded-lg px-3 py-2 text-sm text-text-primary-primary transition-colors"
              placeholder="e.g. +1 (555) 019-2834"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
            {errors.contactNumber && <span className="text-xs text-danger">{errors.contactNumber}</span>}
          </div>
        </div>

        {/* Safety Score and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Safety Score */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="safetyScore" className="text-xs font-semibold text-text-primary-primary-secondary uppercase">
              Safety Score (0 - 100)
            </label>
            <input
              type="number"
              id="safetyScore"
              name="safetyScore"
              min="0"
              max="100"
              step="0.1"
              className="w-full bg-surface-secondary border border-border-default focus:border-primary/50 outline-none rounded-lg px-3 py-2 text-sm text-text-primary-primary transition-colors"
              value={formData.safetyScore}
              onChange={handleChange}
            />
            {errors.safetyScore && <span className="text-xs text-danger">{errors.safetyScore}</span>}
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className="text-xs font-semibold text-text-primary-primary-secondary uppercase">
              Duty Status
            </label>
            <Select
              value={formData.status}
              onChange={(val) => handleChange({ target: { name: 'status', value: val } } as any)}
              options={[
                { label: "Available / On Duty", value: "AVAILABLE" },
                { label: "On Trip", value: "ON_TRIP" },
                { label: "Off Duty", value: "OFF_DUTY" },
                { label: "Suspended", value: "SUSPENDED" },
              ]}
              className="w-full"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
