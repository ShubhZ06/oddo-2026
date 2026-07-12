"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Save } from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import Select from "@/components/ui/Select";

export default function NewDriverPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    licenseCategory: "Class A CDL",
    licenseExpiry: "",
    contactNumber: "",
    safetyScore: "100",
    status: "AVAILABLE",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required.";
    if (!formData.licenseExpiry) newErrors.licenseExpiry = "License expiry date is required.";
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required.";
    
    if (formData.safetyScore !== "") {
      const score = parseFloat(formData.safetyScore);
      if (isNaN(score) || score < 0 || score > 100) {
        newErrors.safetyScore = "Safety score must be between 0 and 100.";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    
    try {
      const response = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Failed to register driver.");
      }

      showToast("success", `Driver ${formData.name} added successfully.`);
      router.push("/drivers");
    } catch (err: any) {
      console.error(err);
      showToast("error", err.message || "Error creating driver");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[800px] mx-auto animate-fade-in w-full">
      {/* Breadcrumbs */}
      <div>
        <Link
          href="/drivers"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary-light transition-colors font-medium mb-3 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Directory
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="text-primary-light" size={24} />
          Register New Driver
        </h1>
        <p className="text-text-secondary text-sm">
          Add a new driver to your directory and verify credentials.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-border-default rounded-xl p-6 md:p-8 flex flex-col gap-6 shadow-sm"
      >
        <div className="text-sm font-semibold text-text-secondary border-b border-border-default pb-2 uppercase tracking-wider">
          Personal Information
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Full Name
          </label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="bg-surface-primary border border-border-default rounded-lg px-3 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors"
            placeholder="e.g. John Doe"
          />
          {errors.name && <span className="text-xs text-danger">{errors.name}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Contact Number
            </label>
            <input 
              required
              type="text"
              value={formData.contactNumber}
              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors"
              placeholder="e.g. +1 (555) 019-2834"
            />
            {errors.contactNumber && <span className="text-xs text-danger">{errors.contactNumber}</span>}
          </div>
        </div>

        <div className="text-sm font-semibold text-text-secondary border-b border-border-default pb-2 uppercase tracking-wider mt-2">
          Licensing & Qualifications
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              License Number
            </label>
            <input 
              required
              type="text"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors uppercase"
              placeholder="e.g. DL-109283-A"
            />
            {errors.licenseNumber && <span className="text-xs text-danger">{errors.licenseNumber}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              License Category
            </label>
            <Select
              value={formData.licenseCategory}
              onChange={(val) => setFormData({...formData, licenseCategory: val})}
              options={[
                { label: "Class A CDL (Heavy Trucks)", value: "Class A CDL" },
                { label: "Class B CDL (Buses/Straight Trucks)", value: "Class B CDL" },
                { label: "Class C (Cars/Standard Vans)", value: "Class C" },
                { label: "Specialized/Hazardous", value: "Specialized" },
              ]}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              License Expiry Date
            </label>
            <input 
              required
              type="date"
              value={formData.licenseExpiry}
              onChange={(e) => setFormData({...formData, licenseExpiry: e.target.value})}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors"
            />
            {errors.licenseExpiry && <span className="text-xs text-danger">{errors.licenseExpiry}</span>}
          </div>
        </div>

        <div className="text-sm font-semibold text-text-secondary border-b border-border-default pb-2 uppercase tracking-wider mt-2">
          Duty Details
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Safety Score (0-100)
            </label>
            <input 
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.safetyScore}
              onChange={(e) => setFormData({...formData, safetyScore: e.target.value})}
              className="bg-surface-primary border border-border-default rounded-lg px-3 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors"
            />
            {errors.safetyScore && <span className="text-xs text-danger">{errors.safetyScore}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Duty Status
            </label>
            <Select
              value={formData.status}
              onChange={(val) => setFormData({...formData, status: val})}
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

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 mt-4 border-t border-border-default pt-6">
          <Link
            href="/drivers"
            className="px-5 py-2.5 text-sm font-semibold border border-border-default rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-text-secondary hover:text-black"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-black rounded-lg transition-all hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Save size={16} />
            {submitting ? "Registering..." : "Register Driver"}
          </button>
        </div>
      </form>
    </div>
  );
}
