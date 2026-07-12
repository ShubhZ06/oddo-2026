"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import type { Role } from "@/types";
import { getRoleDisplayName } from "@/lib/auth";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

export default function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: (user?.role as Role) || "DRIVER",
    password: "",
  });

  const ROLES: Role[] = ["FLEET_MANAGER", "SAFETY_OFFICER", "FINANCIAL_ANALYST", "DRIVER"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving user:", formData);
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
        form="user-form"
        className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-primary text-white hover:opacity-90 transition-opacity"
      >
        {user ? "Save Changes" : "Create User"}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "Edit User" : "Add New User"}
      footer={footer}
    >
      <form id="user-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">Full Name</label>
          <input 
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            placeholder="e.g. Jane Doe"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">Email Address</label>
          <input 
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            placeholder="e.g. jane@transitops.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">System Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
            className="bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
          >
            {ROLES.map(r => (
              <option key={r} value={r}>{getRoleDisplayName(r)}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">
            {user ? "New Password (leave blank to keep current)" : "Password"}
          </label>
          <input 
            required={!user}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-primary-light focus:outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>
      </form>
    </Modal>
  );
}
