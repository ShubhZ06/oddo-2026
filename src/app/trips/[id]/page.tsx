"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Route,
  Truck,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Scale,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Fuel,
  Info,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import { formatCurrency, formatDate, formatDateTime, formatNumber } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";
import type { Trip } from "@/types";

interface TripDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TripDetailPage({ params }: TripDetailPageProps) {
  const resolvedParams = use(params);
  const tripId = Number(resolvedParams.id);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Complete Trip Modal State
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completionData, setCompletionData] = useState({
    finalOdometer: "",
    fuelConsumedLiters: "",
  });
  const [odometerError, setOdometerError] = useState("");

  useEffect(() => {
    if (!isNaN(tripId)) {
      fetchTripDetails();
    }
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/trips/${tripId}`);
      const data = await res.json();
      if (data.success) {
        setTrip(data.data);
      } else {
        showToast("error", data.error || "Failed to load trip details");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error loading trip page");
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = async () => {
    if (!confirm("Are you sure you want to dispatch this trip? Driver and vehicle status will set to ON_TRIP.")) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(`/api/trips/${tripId}/dispatch`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Trip has been dispatched!");
        setTrip(data.data);
      } else {
        showToast("error", data.error || "Failed to dispatch trip");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error dispatching trip");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this trip? Locked driver and vehicle resources will be released.")) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(`/api/trips/${tripId}/cancel`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Trip has been cancelled.");
        setTrip(data.data);
      } else {
        showToast("error", data.error || "Failed to cancel trip");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error cancelling trip");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trip) return;

    const odo = Number(completionData.finalOdometer);
    const fuel = Number(completionData.fuelConsumedLiters);

    if (isNaN(odo) || odo < trip.vehicle!.odometerKm) {
      showToast("error", "Final odometer reading must be greater than or equal to the starting reading");
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(`/api/trips/${tripId}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          finalOdometer: odo,
          fuelConsumedLiters: fuel,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("success", "Trip completed successfully!");
        setTrip(data.data);
        setIsCompleteModalOpen(false);
      } else {
        showToast("error", data.error || "Failed to complete trip");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error completing trip");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOdometerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCompletionData((prev) => ({ ...prev, finalOdometer: val }));

    if (!val || !trip?.vehicle) {
      setOdometerError("");
      return;
    }

    const odo = Number(val);
    if (isNaN(odo)) {
      setOdometerError("Please enter a valid number");
    } else if (odo < trip.vehicle.odometerKm) {
      setOdometerError(
        `Final odometer cannot be less than the starting odometer (${trip.vehicle.odometerKm} km).`
      );
    } else {
      setOdometerError("");
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-text-secondary gap-3 animate-fade-in">
        <Clock className="animate-spin text-primary-light" size={32} />
        <span className="text-sm">Fetching manifest details...</span>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-text-secondary gap-3 max-w-[600px] mx-auto text-center">
        <AlertTriangle size={48} className="text-danger animate-pulse" />
        <h2 className="text-xl font-bold">Trip Manifest Not Found</h2>
        <p className="text-sm text-text-muted">
          The requested trip ID does not exist in the system, or you do not have permission to view it.
        </p>
        <Link
          href="/trips"
          className="mt-4 px-5 py-2.5 bg-primary text-white font-semibold rounded-lg text-sm transition-transform hover:-translate-y-0.5"
        >
          Return to Trips
        </Link>
      </div>
    );
  }

  const isDraft = trip.status === "DRAFT";
  const isDispatched = trip.status === "DISPATCHED";
  const isFinalized = trip.status === "COMPLETED" || trip.status === "CANCELLED";

  return (
    <div className="flex flex-col gap-6 max-w-[1100px] mx-auto animate-fade-in">
      {/* Breadcrumbs & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/trips"
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary-light transition-colors font-medium mb-3 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Trips
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Route className="text-primary-light" size={24} />
            Trip Manifest #{trip.id}
          </h1>
          <p className="text-text-secondary text-sm">
            Route: {trip.source} to {trip.destination}
          </p>
        </div>

        {/* Action Controls */}
        {!isFinalized && (
          <div className="flex items-center gap-3 self-start md:self-auto">
            {isDraft && (
              <button
                onClick={handleDispatch}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-success hover:bg-success-dark rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,184,148,0.3)] cursor-pointer disabled:opacity-50"
              >
                <Play size={16} />
                Dispatch
              </button>
            )}

            {isDispatched && (
              <button
                onClick={() => {
                  setCompletionData({
                    finalOdometer: trip.vehicle?.odometerKm.toString() || "",
                    fuelConsumedLiters: "",
                  });
                  setOdometerError("");
                  setIsCompleteModalOpen(true);
                }}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(108,92,231,0.3)] cursor-pointer disabled:opacity-50"
              >
                <CheckCircle size={16} />
                Complete Trip
              </button>
            )}

            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border border-danger/30 hover:border-danger bg-danger/10 hover:bg-danger/20 text-danger rounded-lg transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              <XCircle size={16} />
              Cancel Trip
            </button>
          </div>
        )}
      </div>

      {/* Main Info Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Manifest Card */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface-secondary border border-border-default rounded-xl p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-border-default pb-4">
              <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                Manifest Route Info
              </span>
              <StatusBadge status={trip.status} label={trip.status} />
            </div>

            {/* Geographical details */}
            <div className="flex flex-col md:flex-row gap-6 justify-between bg-white/2 border border-border-default/60 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary-light mt-1 shrink-0" size={20} />
                <div>
                  <span className="text-xs text-text-muted font-medium uppercase tracking-wider block mb-1">
                    Origin / Source
                  </span>
                  <span className="font-semibold text-text-primary">{trip.source}</span>
                </div>
              </div>

              <div className="hidden md:flex items-center text-text-muted shrink-0 px-4">
                ................ <Route size={20} className="mx-2 text-primary/40 animate-pulse" /> ................
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-accent mt-1 shrink-0" size={20} />
                <div>
                  <span className="text-xs text-text-muted font-medium uppercase tracking-wider block mb-1">
                    Destination
                  </span>
                  <span className="font-semibold text-text-primary">{trip.destination}</span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
              <div>
                <span className="text-xs text-text-muted font-medium uppercase tracking-wider block mb-1">
                  Revenue
                </span>
                <span className="text-lg font-bold text-success">
                  {formatCurrency(trip.revenue)}
                </span>
              </div>

              <div>
                <span className="text-xs text-text-muted font-medium uppercase tracking-wider block mb-1">
                  Est. Distance
                </span>
                <span className="text-lg font-bold text-text-primary">
                  {trip.distanceKm} km
                </span>
              </div>

              <div>
                <span className="text-xs text-text-muted font-medium uppercase tracking-wider block mb-1">
                  Cargo Weight
                </span>
                <span className="text-lg font-bold text-text-primary">
                  {formatNumber(trip.cargoWeightKg)} kg
                </span>
              </div>

              <div>
                <span className="text-xs text-text-muted font-medium uppercase tracking-wider block mb-1">
                  Max Load Allowed
                </span>
                <span className="text-lg font-semibold text-text-secondary">
                  {trip.vehicle ? `${formatNumber(trip.vehicle.maxLoadCapacityKg)} kg` : "N/A"}
                </span>
              </div>
            </div>

            {/* Post-Completion Readings */}
            {trip.status === "COMPLETED" && (
              <div className="border-t border-border-default/80 pt-6 mt-2">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-3">
                  Completion Readings
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-primary/5 border border-primary/15 rounded-xl p-4">
                  <div>
                    <span className="text-xs text-text-muted block mb-1">Final Odometer</span>
                    <span className="text-base font-bold text-text-primary">
                      {formatNumber(trip.finalOdometer || 0)} km
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block mb-1">Fuel Consumed</span>
                    <span className="text-base font-bold text-text-primary">
                      {trip.fuelConsumedLiters} Liters
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block mb-1">Avg. Consumption</span>
                    <span className="text-base font-bold text-primary-light">
                      {trip.finalOdometer && trip.fuelConsumedLiters && trip.fuelConsumedLiters > 0
                        ? `${((trip.finalOdometer - trip.vehicle!.odometerKm) / trip.fuelConsumedLiters).toFixed(2)} km/L`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Audit Dates timeline */}
            <div className="border-t border-border-default/80 pt-6 flex flex-wrap gap-x-8 gap-y-3 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                Created: {formatDateTime(trip.createdAt)}
              </span>
              {trip.dispatchedAt && (
                <span className="flex items-center gap-1.5">
                  <Play size={12} className="text-success" />
                  Dispatched: {formatDateTime(trip.dispatchedAt)}
                </span>
              )}
              {trip.completedAt && (
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={12} className="text-primary-light" />
                  Completed: {formatDateTime(trip.completedAt)}
                </span>
              )}
            </div>
          </div>

          {/* Linked Invoices/Tolls details */}
          <div className="bg-surface-secondary border border-border-default rounded-xl p-6">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
              Trip Operational Expenses
            </h3>
            {(!trip.expenses || trip.expenses.length === 0) ? (
              <div className="p-8 border border-dashed border-border-default rounded-xl text-center text-text-secondary text-xs flex flex-col items-center gap-2 bg-white/1">
                <FileText size={24} className="text-text-muted" />
                <span>No expense reports logged during this trip.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {trip.expenses.map((expense: any) => (
                  <div key={expense.id} className="flex justify-between items-center p-3 rounded-lg bg-white/2 border border-border-default/50 text-xs">
                    <div>
                      <span className="font-semibold block">{expense.category}</span>
                      <span className="text-text-muted">{expense.description || "No description"}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-danger block">{formatCurrency(expense.amount)}</span>
                      <span className="text-text-muted">{formatDate(expense.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Assignments Summary */}
        <div className="flex flex-col gap-6">
          {/* Vehicle Assignment Card */}
          <div className="bg-surface-secondary border border-border-default rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Truck size={14} className="text-primary-light" />
                Vehicle Asset
              </span>
              {trip.vehicle && (
                <StatusBadge status={trip.vehicle.status} label={trip.vehicle.status} />
              )}
            </div>

            {trip.vehicle ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={`/fleet/${trip.vehicle.id}`}
                  className="font-bold text-sm text-text-primary hover:text-primary-light transition-colors"
                >
                  {trip.vehicle.registrationNumber}
                </Link>
                <span className="text-xs text-text-secondary">
                  Model: {trip.vehicle.nameModel}
                </span>
                <span className="text-xs text-text-secondary">
                  Current Odometer: {formatNumber(trip.vehicle.odometerKm)} km
                </span>
                <span className="text-xs text-text-secondary">
                  Acquisition cost: {formatCurrency(trip.vehicle.acquisitionCost)}
                </span>
              </div>
            ) : (
              <span className="text-xs text-text-muted">Loading asset details...</span>
            )}
          </div>

          {/* Driver Assignment Card */}
          <div className="bg-surface-secondary border border-border-default rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <User size={14} className="text-secondary" />
                Assigned Personnel
              </span>
              {trip.driver && (
                <StatusBadge status={trip.driver.status} label={trip.driver.status} />
              )}
            </div>

            {trip.driver ? (
              <div className="flex flex-col gap-2">
                <span className="font-bold text-sm text-text-primary">
                  {trip.driver.name}
                </span>
                <span className="text-xs text-text-secondary">
                  License: {trip.driver.licenseNumber} ({trip.driver.licenseCategory})
                </span>
                <span className="text-xs text-text-secondary">
                  Expiry: {formatDate(trip.driver.licenseExpiry)}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-text-secondary">Safety Rating:</span>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      trip.driver.safetyScore >= 90
                        ? "bg-success/15 text-success"
                        : trip.driver.safetyScore >= 75
                        ? "bg-warning/15 text-warning"
                        : "bg-danger/15 text-danger"
                    }`}
                  >
                    {trip.driver.safetyScore}/100
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-xs text-text-muted">Loading personnel details...</span>
            )}
          </div>
        </div>
      </div>

      {/* Completion Dialog */}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        title="Complete Trip manifest"
        footer={
          <>
            <button
              onClick={() => setIsCompleteModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold border border-border-default rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-text-secondary hover:text-text-primary"
            >
              Back
            </button>
            <button
              onClick={handleCompleteSubmit}
              disabled={actionLoading || !!odometerError || !completionData.fuelConsumedLiters}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg transition-all hover:bg-primary-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit & Finalize
            </button>
          </>
        }
      >
        <form onSubmit={handleCompleteSubmit} className="flex flex-col gap-4">
          <div className="bg-white/2 border border-border-default p-4 rounded-xl flex items-center gap-3 text-xs text-text-secondary">
            <Info size={16} className="text-primary-light shrink-0" />
            <div>
              Starting Odometer: <span className="font-semibold text-text-primary">{trip.vehicle?.odometerKm} km</span>.
              Enter the new odometer reading below to log the distance travelled.
            </div>
          </div>

          {/* Odometer Field */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Final Odometer Reading (km)
            </label>
            <input
              type="number"
              placeholder={trip.vehicle?.odometerKm.toString()}
              value={completionData.finalOdometer}
              onChange={handleOdometerChange}
              required
              className={`w-full bg-surface-primary border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-all text-text-primary ${
                odometerError
                  ? "border-danger focus:border-danger focus:ring-danger"
                  : "border-border-default focus:border-primary-light focus:ring-primary-light"
              }`}
            />
            {odometerError && (
              <span className="text-xs text-danger font-medium flex items-center gap-1">
                <AlertTriangle size={12} />
                {odometerError}
              </span>
            )}
          </div>

          {/* Fuel Consumed Field */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Fuel Consumed (Liters)
            </label>
            <input
              type="number"
              placeholder="e.g. 150"
              value={completionData.fuelConsumedLiters}
              onChange={(e) =>
                setCompletionData((prev) => ({ ...prev, fuelConsumedLiters: e.target.value }))
              }
              required
              min="0.1"
              step="any"
              className="w-full bg-surface-primary border border-border-default rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition-all text-text-primary"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
