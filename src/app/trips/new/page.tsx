"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Truck,
  User,
  Route,
  Navigation,
  DollarSign,
  Scale,
  AlertTriangle,
  Save,
  CheckCircle2,
} from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import Select from "@/components/ui/Select";
import type { Vehicle, Driver } from "@/types";

export default function NewTripPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    source: "",
    destination: "",
    cargoWeightKg: "",
    distanceKm: "",
    revenue: "",
  });

  // Selected asset details for real-time validation
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [cargoError, setCargoError] = useState("");

  useEffect(() => {
    fetchAvailableAssets();
  }, []);

  const fetchAvailableAssets = async () => {
    try {
      setLoadingAssets(true);
      const [vehiclesRes, driversRes] = await Promise.all([
        fetch("/api/vehicles/available"),
        fetch("/api/drivers/available"),
      ]);

      const vehiclesData = await vehiclesRes.json();
      const driversData = await driversRes.json();

      if (vehiclesData.success && driversData.success) {
        setVehicles(vehiclesData.data);
        setDrivers(driversData.data);
      } else {
        showToast("error", "Failed to fetch eligible vehicles or drivers");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error loading available assets");
    } finally {
      setLoadingAssets(false);
    }
  };

  // Asset selection handles
  const handleVehicleChange = (id: string) => {
    setFormData((prev) => ({ ...prev, vehicleId: id }));
    const vehicle = vehicles.find((v) => v.id === Number(id)) || null;
    setSelectedVehicle(vehicle);
    validateCargo(formData.cargoWeightKg, vehicle);
  };

  const handleDriverChange = (id: string) => {
    setFormData((prev) => ({ ...prev, driverId: id }));
    const driver = drivers.find((d) => d.id === Number(id)) || null;
    setSelectedDriver(driver);
  };

  const handleCargoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, cargoWeightKg: val }));
    validateCargo(val, selectedVehicle);
  };

  const validateCargo = (weightStr: string, vehicle: Vehicle | null) => {
    if (!weightStr || !vehicle) {
      setCargoError("");
      return;
    }
    const weight = Number(weightStr);
    if (isNaN(weight) || weight <= 0) {
      setCargoError("Please enter a valid cargo weight");
    } else if (weight > vehicle.maxLoadCapacityKg) {
      setCargoError(
        `Overweight! Selected vehicle's capacity is ${vehicle.maxLoadCapacityKg} kg. Your load is ${weight} kg.`
      );
    } else {
      setCargoError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cargoError) {
      showToast("error", "Please fix cargo load errors before submitting");
      return;
    }

    if (
      !formData.vehicleId ||
      !formData.driverId ||
      !formData.source ||
      !formData.destination ||
      !formData.cargoWeightKg ||
      !formData.distanceKm ||
      !formData.revenue
    ) {
      showToast("error", "All fields are required");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: Number(formData.vehicleId),
          driverId: Number(formData.driverId),
          source: formData.source,
          destination: formData.destination,
          cargoWeightKg: Number(formData.cargoWeightKg),
          distanceKm: Number(formData.distanceKm),
          revenue: Number(formData.revenue),
        }),
      });

      const data = await res.json();
      if (res.ok || data.success) {
        showToast("success", "Trip Draft created successfully!");
        router.push("/trips");
      } else {
        showToast("error", data.error || "Failed to create trip");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error creating trip request");
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    formData.vehicleId &&
    formData.driverId &&
    formData.source &&
    formData.destination &&
    formData.cargoWeightKg &&
    formData.distanceKm &&
    formData.revenue &&
    !cargoError &&
    !submitting;

  return (
    <div className="flex flex-col gap-6 max-w-[800px] mx-auto animate-fade-in">
      {/* Breadcrumbs */}
      <div>
        <Link
          href="/trips"
          className="inline-flex items-center gap-1.5 text-xs text-text-primary-primary-secondary hover:text-primary-light transition-colors font-medium mb-3 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Trips
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Route className="text-primary-light" size={24} />
          Dispatch New Trip
        </h1>
        <p className="text-text-primary-primary-secondary text-sm">
          Plan routes, verify capacities, and assign qualified personnel.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-surface-secondary border border-border-default rounded-xl p-6 md:p-8 flex flex-col gap-6"
      >
        <div className="text-sm font-semibold text-text-primary-primary-secondary border-b border-border-default pb-2 uppercase tracking-wider">
          Asset Assignments
        </div>

        {/* Assets selection row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vehicle Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-primary-primary-secondary uppercase tracking-wider">
              Select Available Vehicle
            </label>
            <Select
              value={formData.vehicleId}
              onChange={handleVehicleChange}
              icon={<Truck size={18} />}
              options={vehicles.map((v) => ({
                label: `${v.registrationNumber} - ${v.nameModel} (Max: ${v.maxLoadCapacityKg} kg)`,
                value: v.id.toString(),
              }))}
              placeholder="-- Choose a Vehicle --"
              className="w-full"
            />
            {selectedVehicle && (
              <div className="text-xs text-success flex items-center gap-1 mt-1 bg-success/5 px-2 py-1 rounded border border-success/15 w-fit">
                <CheckCircle2 size={12} />
                Max Load Capacity: {selectedVehicle.maxLoadCapacityKg} kg
              </div>
            )}
          </div>

          {/* Driver Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-primary-primary-secondary uppercase tracking-wider">
              Select Available Driver
            </label>
            <Select
              value={formData.driverId}
              onChange={handleDriverChange}
              icon={<User size={18} />}
              options={drivers.map((d) => ({
                label: `${d.name} (Safety Score: ${d.safetyScore}/100)`,
                value: d.id.toString(),
              }))}
              placeholder="-- Choose a Driver --"
              className="w-full"
            />
            {selectedDriver && (
              <div className="text-xs text-secondary flex items-center gap-1 mt-1 bg-secondary/5 px-2 py-1 rounded border border-secondary/15 w-fit">
                <CheckCircle2 size={12} />
                Driver safety rating: {selectedDriver.safetyScore}%
              </div>
            )}
          </div>
        </div>

        <div className="text-sm font-semibold text-text-primary-primary-secondary border-b border-border-default pb-2 uppercase tracking-wider mt-2">
          Route & Manifest Details
        </div>

        {/* Route Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-primary-primary-secondary uppercase tracking-wider">
              Source Location
            </label>
            <div className="relative">
              <Navigation
                className="absolute left-3 top-3 text-text-primary-primary-muted rotate-45"
                size={18}
              />
              <input
                type="text"
                placeholder="e.g. Mumbai Hub"
                value={formData.source}
                onChange={(e) => setFormData((prev) => ({ ...prev, source: e.target.value }))}
                required
                className="w-full bg-surface-primary border border-border-default rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition-all text-text-primary-primary placeholder:text-text-primary-primary-muted"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-primary-primary-secondary uppercase tracking-wider">
              Destination Location
            </label>
            <div className="relative">
              <Navigation className="absolute left-3 top-3 text-text-primary-primary-muted" size={18} />
              <input
                type="text"
                placeholder="e.g. Delhi Yard"
                value={formData.destination}
                onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
                required
                className="w-full bg-surface-primary border border-border-default rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition-all text-text-primary-primary placeholder:text-text-primary-primary-muted"
              />
            </div>
          </div>
        </div>

        {/* Measurements & Financials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cargo weight */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-primary-primary-secondary uppercase tracking-wider">
              Cargo Weight (kg)
            </label>
            <div className="relative">
              <Scale className="absolute left-3 top-3 text-text-primary-primary-muted" size={18} />
              <input
                type="number"
                placeholder="0"
                value={formData.cargoWeightKg}
                onChange={handleCargoChange}
                required
                min="1"
                className={`w-full bg-surface-primary border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-all text-text-primary-primary placeholder:text-text-primary-primary-muted ${
                  cargoError
                    ? "border-danger focus:border-danger focus:ring-danger"
                    : "border-border-default focus:border-primary-light focus:ring-primary-light"
                }`}
              />
            </div>
            {cargoError && (
              <div className="text-xs text-danger flex items-center gap-1 mt-1 font-medium">
                <AlertTriangle size={12} className="shrink-0" />
                {cargoError}
              </div>
            )}
          </div>

          {/* Distance */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-primary-primary-secondary uppercase tracking-wider">
              Est. Distance (km)
            </label>
            <div className="relative">
              <Route className="absolute left-3 top-3 text-text-primary-primary-muted" size={18} />
              <input
                type="number"
                placeholder="0"
                value={formData.distanceKm}
                onChange={(e) => setFormData((prev) => ({ ...prev, distanceKm: e.target.value }))}
                required
                min="1"
                className="w-full bg-surface-primary border border-border-default rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition-all text-text-primary-primary placeholder:text-text-primary-primary-muted"
              />
            </div>
          </div>

          {/* Revenue */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-primary-primary-secondary uppercase tracking-wider">
              Trip Revenue (₹)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-text-primary-primary-muted" size={18} />
              <input
                type="number"
                placeholder="0"
                value={formData.revenue}
                onChange={(e) => setFormData((prev) => ({ ...prev, revenue: e.target.value }))}
                required
                min="0"
                className="w-full bg-surface-primary border border-border-default rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition-all text-text-primary-primary placeholder:text-text-primary-primary-muted"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 mt-4 border-t border-border-default pt-6">
          <Link
            href="/trips"
            className="px-5 py-2.5 text-sm font-semibold border border-border-default rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-text-primary-primary-secondary hover:text-text-primary-primary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!isFormValid}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-light rounded-lg transition-all hover:shadow-[0_0_20px_rgba(108,92,231,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Save size={16} />
            {submitting ? "Saving Draft..." : "Save Draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
