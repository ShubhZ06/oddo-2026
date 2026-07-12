"use client";

import { useState } from "react";
import { User, Shield, Lock, Settings2, Users, Plus, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import { formatDate } from "@/lib/utils";
import { getRoleDisplayName } from "@/lib/auth";
import UserModal from "./UserModal";
import { useAuth } from "@/components/auth/AuthProvider";

// Mock User Data
const MOCK_USERS = [
  { id: 1, name: "Admin User", email: "admin@transitops.com", role: "FLEET_MANAGER", createdAt: "2026-06-01T10:00:00Z" },
  { id: 2, name: "John Doe", email: "driver@transitops.com", role: "DRIVER", createdAt: "2026-06-05T14:30:00Z" },
  { id: 3, name: "Sarah Smith", email: "safety@transitops.com", role: "SAFETY_OFFICER", createdAt: "2026-06-10T09:15:00Z" },
  { id: 4, name: "Michael Chen", email: "finance@transitops.com", role: "FINANCIAL_ANALYST", createdAt: "2026-06-15T11:45:00Z" },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const isManager = user?.role === "FLEET_MANAGER" || user?.role === "SAFETY_OFFICER";
  
  const [activeTab, setActiveTab] = useState<"profile" | "users" | "system">("profile");
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@transitops.com",
    currentPassword: "",
    newPassword: "",
  });

  // User Management State
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const filteredUsers = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setTimeout(() => setEditingUser(null), 300);
  };

  const userColumns = [
    { header: "Name", accessorKey: "name" as const, cell: (u: any) => <span className="font-medium">{u.name}</span> },
    { header: "Email", accessorKey: "email" as const },
    { header: "Role", cell: (u: any) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary-light">
        {getRoleDisplayName(u.role)}
      </span>
    )},
    { header: "Created At", cell: (u: any) => formatDate(u.createdAt) },
    { 
      header: "Actions", 
      cell: (u: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleEditUser(u)}
            className="p-1.5 text-text-primary-primary-secondary hover:text-primary-light hover:bg-white/5 rounded-md transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            className="p-1.5 text-text-primary-primary-secondary hover:text-danger hover:bg-white/5 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-text-primary-primary-secondary text-sm">Manage your profile, system users, and application preferences.</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Settings Navigation */}
        <div className="flex flex-row flex-wrap gap-2 border-b border-border-default pb-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
              activeTab === "profile" ? "bg-primary/10 text-primary-light" : "hover:bg-surface-hover text-text-primary-primary-secondary hover:text-text-primary-primary"
            }`}
          >
            <User size={18} />
            My Profile
          </button>
          {isManager && (
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                activeTab === "users" ? "bg-primary/10 text-primary-light" : "hover:bg-surface-hover text-text-primary-primary-secondary hover:text-text-primary-primary"
              }`}
            >
              <Users size={18} />
              User Management
            </button>
          )}
          {isManager && (
            <button
              onClick={() => setActiveTab("system")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                activeTab === "system" ? "bg-primary/10 text-primary-light" : "hover:bg-surface-hover text-text-primary-primary-secondary hover:text-text-primary-primary"
              }`}
            >
              <Settings2 size={18} />
              System Preferences
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="flex flex-col gap-8 animate-fade-in">
              <div className="bg-surface-secondary border border-border-default rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-default">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light">
                    <User size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                    <p className="text-sm text-text-primary-primary-secondary">Update your profile details.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary-primary-secondary">Full Name</label>
                    <input 
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="bg-surface-primary border border-border-default rounded-lg px-4 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary-primary-secondary">Email Address</label>
                    <input 
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="bg-surface-primary border border-border-default rounded-lg px-4 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button className="px-5 py-2.5 bg-surface-primary border border-border-default rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-surface-secondary border border-border-default rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-default">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Security</h2>
                    <p className="text-sm text-text-primary-primary-secondary">Update your password to keep your account secure.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-text-primary-primary-secondary">Current Password</label>
                    <input 
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                      className="bg-surface-primary border border-border-default rounded-lg px-4 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-text-primary-primary-secondary">New Password</label>
                    <input 
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                      className="bg-surface-primary border border-border-default rounded-lg px-4 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button className="px-5 py-2.5 bg-gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {isManager && activeTab === "users" && (
            <div className="animate-fade-in flex flex-col gap-6">
              <div className="bg-surface-secondary border border-border-default rounded-xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary-light shrink-0">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-1">Access Control</h2>
                  <p className="text-sm text-text-primary-primary-secondary leading-relaxed max-w-2xl">
                    Manage team members and their roles. Fleet Managers have full access. Safety Officers can manage drivers. Financial Analysts can view reports and expenses.
                  </p>
                </div>
              </div>

              <DataTable 
                data={filteredUsers}
                columns={userColumns}
                searchPlaceholder="Search users by name or email..."
                onSearch={setSearchQuery}
                actions={
                  <button 
                    onClick={() => setIsUserModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    <Plus size={18} />
                    Add User
                  </button>
                }
              />
            </div>
          )}

          {/* SYSTEM TAB */}
          {isManager && activeTab === "system" && (
            <div className="flex flex-col gap-8 animate-fade-in">
              {/* General Settings */}
              <div className="bg-surface-secondary border border-border-default rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-default">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light">
                    <Settings2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">General Options</h2>
                    <p className="text-sm text-text-primary-primary-secondary">Manage global system configurations.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary-primary-secondary">Company Name</label>
                    <input 
                      type="text"
                      defaultValue="TransitOps Logistics"
                      className="bg-surface-primary border border-border-default rounded-lg px-4 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary-primary-secondary">Default Currency</label>
                    <select className="bg-surface-primary border border-border-default rounded-lg px-4 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors">
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary-primary-secondary">Timezone</label>
                    <select className="bg-surface-primary border border-border-default rounded-lg px-4 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors">
                      <option>Asia/Kolkata (IST)</option>
                      <option>America/New_York (EST)</option>
                      <option>Europe/London (GMT)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary-primary-secondary">Date Format</label>
                    <select className="bg-surface-primary border border-border-default rounded-lg px-4 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button className="px-5 py-2.5 bg-surface-primary border border-border-default rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors">
                      Save General Settings
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-surface-secondary border border-border-default rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-default">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary-light">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Notification Preferences</h2>
                    <p className="text-sm text-text-primary-primary-secondary">Configure how alerts and reports are delivered.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 max-w-2xl">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Email Alerts for Maintenance</span>
                      <span className="text-xs text-text-primary-primary-secondary">Receive an email when a vehicle is marked for maintenance.</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border-default accent-primary-light" />
                  </label>
                  
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Weekly Financial Digest</span>
                      <span className="text-xs text-text-primary-primary-secondary">A summary of fuel and trip expenses every Monday.</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border-default accent-primary-light" />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">SMS Alerts for Drivers</span>
                      <span className="text-xs text-text-primary-primary-secondary">Send an SMS to a driver when a new trip is assigned.</span>
                    </div>
                    <input type="checkbox" className="w-4 h-4 rounded border-border-default accent-primary-light" />
                  </label>

                  <div className="flex justify-end mt-4">
                    <button className="px-5 py-2.5 bg-surface-primary border border-border-default rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors">
                      Update Notification Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <UserModal 
        isOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        user={editingUser}
      />
    </div>
  );
}
