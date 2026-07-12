"use client";

import Modal from "@/components/ui/Modal";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate, isExpired, isExpiringSoon } from "@/lib/utils";
import {
  User,
  Calendar,
  Phone,
  Shield,
  Award,
  AlertTriangle,
  Flame,
  Truck,
  RotateCcw,
} from "lucide-react";
import type { Driver } from "@/types";

interface DriverDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: Driver | null;
}

export default function DriverDetailModal({
  isOpen,
  onClose,
  driver,
}: DriverDetailModalProps) {
  if (!driver) return null;

  const expired = isExpired(driver.licenseExpiry);
  const expiringSoon = isExpiringSoon(driver.licenseExpiry, 30);
  
  // Custom styling based on safety score
  const getSafetyScoreConfig = (score: number) => {
    if (score >= 90) {
      return {
        color: "text-success",
        bgColor: "bg-success/10",
        label: "Excellent Safety Record",
        barColor: "bg-success",
      };
    } else if (score >= 70) {
      return {
        color: "text-warning",
        bgColor: "bg-warning/10",
        label: "Standard Safety Record",
        barColor: "bg-warning",
      };
    } else {
      return {
        color: "text-danger",
        bgColor: "bg-danger/10",
        label: "Critical Risk Rating",
        barColor: "bg-danger",
      };
    }
  };

  const scoreConfig = getSafetyScoreConfig(driver.safetyScore);

  const footer = (
    <button
      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-text-primary-primary-secondary hover:text-text-primary-primary border border-border-default rounded-lg transition-colors cursor-pointer text-sm font-medium"
      onClick={onClose}
    >
      Close Details
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Driver Profile & Analytics"
      footer={footer}
    >
      <div className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Header Profile Summary */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-border-default">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary-light/10 border border-primary/20 flex items-center justify-center text-primary-light">
            <User size={32} />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-lg font-bold leading-none">{driver.name}</h3>
              <StatusBadge status={driver.status} />
            </div>
            <p className="text-sm text-text-primary-primary-secondary flex items-center gap-1.5">
              <Phone size={14} className="text-text-primary-primary-muted" /> {driver.contactNumber}
            </p>
          </div>
        </div>

        {/* Expiry Alert Badges */}
        {expired && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-danger/20 bg-danger/5 text-danger text-sm">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">License Expired!</p>
              <p className="text-xs text-text-primary-primary-secondary mt-0.5">
                This driver's license expired on {formatDate(driver.licenseExpiry)}. They must be suspended immediately.
              </p>
            </div>
          </div>
        )}
        {!expired && expiringSoon && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-warning/20 bg-warning/5 text-warning text-sm">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">License Expiring Soon</p>
              <p className="text-xs text-text-primary-primary-secondary mt-0.5">
                This driver's license expires in less than 30 days ({formatDate(driver.licenseExpiry)}). Plan renewal soon.
              </p>
            </div>
          </div>
        )}

        {/* Detailed Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* License Details */}
          <div className="p-4 rounded-xl border border-border-default bg-white/2 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-text-primary-primary-muted uppercase tracking-wider flex items-center gap-1.5">
              <Award size={14} className="text-primary-light" /> Credentials & License
            </h4>
            
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-border-default/40">
                <span className="text-text-primary-primary-secondary">License Number:</span>
                <span className="font-semibold font-mono">{driver.licenseNumber}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border-default/40">
                <span className="text-text-primary-primary-secondary">Category:</span>
                <span className="font-semibold px-2 py-0.5 bg-primary/10 text-primary-light rounded text-xs">
                  {driver.licenseCategory}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-text-primary-primary-secondary">Expiration Date:</span>
                <span className={`font-semibold flex items-center gap-1.5 ${expired ? "text-danger" : expiringSoon ? "text-warning" : "text-text-primary-primary"}`}>
                  <Calendar size={14} />
                  {formatDate(driver.licenseExpiry)}
                </span>
              </div>
            </div>
          </div>

          {/* Safety Performance */}
          <div className={`p-4 rounded-xl border border-border-default bg-white/2 flex flex-col gap-3`}>
            <h4 className="text-xs font-bold text-text-primary-primary-muted uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={14} className="text-primary-light" /> Safety Scorecard
            </h4>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-end justify-between">
                <span className="text-sm text-text-primary-primary-secondary">Current Score:</span>
                <span className={`text-2xl font-black ${scoreConfig.color}`}>
                  {driver.safetyScore.toFixed(1)}<span className="text-xs font-normal text-text-primary-primary-muted">/100</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${scoreConfig.barColor}`}
                  style={{ width: `${driver.safetyScore}%` }}
                ></div>
              </div>

              <div className={`text-xs px-2.5 py-1 rounded-md text-center font-medium ${scoreConfig.color} ${scoreConfig.bgColor}`}>
                {scoreConfig.label}
              </div>
            </div>
          </div>
        </div>

        {/* Operational Statistics (Simulated Performance Analytics) */}
        <div className="p-4 rounded-xl border border-border-default bg-white/2 flex flex-col gap-4">
          <h4 className="text-xs font-bold text-text-primary-primary-muted uppercase tracking-wider flex items-center gap-1.5">
            <Truck size={14} className="text-primary-light" /> Operational Performance (YTD)
          </h4>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-white/2 rounded-lg border border-border-default/40">
              <div className="text-2xl font-bold text-primary-light">
                {driver.id * 3 + 14}
              </div>
              <div className="text-[10px] text-text-primary-primary-secondary uppercase tracking-wider mt-1">
                Trips Done
              </div>
            </div>
            <div className="p-3 bg-white/2 rounded-lg border border-border-default/40">
              <div className="text-2xl font-bold text-secondary">
                {((driver.id * 280) + 2400).toLocaleString()} <span className="text-xs font-normal">km</span>
              </div>
              <div className="text-[10px] text-text-primary-primary-secondary uppercase tracking-wider mt-1">
                Distance
              </div>
            </div>
            <div className="p-3 bg-white/2 rounded-lg border border-border-default/40">
              <div className="text-2xl font-bold text-success">
                {(6.8 - (driver.id * 0.2)).toFixed(1)} <span className="text-xs font-normal">km/L</span>
              </div>
              <div className="text-[10px] text-text-primary-primary-secondary uppercase tracking-wider mt-1">
                Fuel Avg
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-xs text-text-primary-primary-secondary bg-white/3 p-3 rounded-lg border border-border-default/30">
            <div className="flex justify-between items-center">
              <span>Average Incident Rate:</span>
              <span className="font-semibold text-text-primary-primary">0.02 / 1,000 km</span>
            </div>
            <div className="flex justify-between items-center">
              <span>On-Time Delivery Rate:</span>
              <span className="font-semibold text-success">98.4%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Last Active Dispatch:</span>
              <span className="font-semibold text-text-primary-primary">
                {driver.status === "ON_TRIP" ? "Trip #1042 - North Zone" : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
