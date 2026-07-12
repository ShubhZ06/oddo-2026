"use client";

import { useState } from "react";
import { User, Shield, Lock, Settings2, Users, Plus, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import { formatDate } from "@/lib/utils";
import { getRoleDisplayName } from "@/lib/auth";
import UserModal from "./UserModal";

// Mock User Data
const MOCK_USERS = [
  { id: 1, name: "Admin User", email: "admin@transitops.com", role: "FLEET_MANAGER", createdAt: "2026-06-01T10:00:00Z" },
  { id: 2, name: "John Doe", email: "driver@transitops.com", role: "DRIVER", createdAt: "2026-06-05T14:30:00Z" },
  { id: 3, name: "Sarah Smith", email: "safety@transitops.com", role: "SAFETY_OFFICER", createdAt: "2026-06-10T09:15:00Z" },
  { id: 4, name: "Michael Chen", email: "finance@transitops.com", role: "FINANCIAL_ANALYST", createdAt: "2026-06-15T11:45:00Z" },
];

export default function SettingsPage() {
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
            className="p-1.5 text-text-secondary hover:text-primary-light hover:bg-white/5 rounded-md transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            className="p-1.5 text-text-secondary hover:text-danger hover:bg-white/5 rounded-md transition-colors"
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
        <p className="text-text-secondary text-sm">Manage your profile, system users, and application preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
              activeTab === "profile" ? "bg-primary/10 text-primary-light" : "hover:bg-bg-card-hover text-text-secondary hover:text-text"
            }`}
          >
            <User size={18} />
            My Profile
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
              activeTab === "users" ? "bg-primary/10 text-primary-light" : "hover:bg-bg-card-hover text-text-secondary hover:text-text"
            }`}
          >
            <Users size={18} />
            User Management
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
              activeTab === "system" ? "bg-primary/10 text-primary-light" : "hover:bg-bg-card-hover text-text-secondary hover:text-text"
            }`}
          >
            <Settings2 size={18} />
            System Preferences
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="flex flex-col gap-8 animate-fade-in">
              <div className="bg-bg-secondary border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light">
                    <User size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                    <p className="text-sm text-text-secondary">Update your profile details.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">Full Name</label>
                    <input 
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="bg-bg border border-border rounded-lg px-4 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">Email Address</label>
                    <input 
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="bg-bg border border-border rounded-lg px-4 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button className="px-5 py-2.5 bg-bg border border-border rounded-lg text-sm font-medium hover:bg-bg-card-hover transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-bg-secondary border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Security</h2>
                    <p className="text-sm text-text-secondary">Update your password to keep your account secure.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-text-secondary">Current Password</label>
                    <input 
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                      className="bg-bg border border-border rounded-lg px-4 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-text-secondary">New Password</label>
                    <input 
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                      className="bg-bg border border-border rounded-lg px-4 py-2.5 text-sm focus:border-primary-light focus:outline-none transition-colors"
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
          {activeTab === "users" && (
            <div className="animate-fade-in flex flex-col gap-6">
              <div className="bg-bg-secondary border border-border rounded-xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary-light shrink-0">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-1">Access Control</h2>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
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
          {activeTab === "system" && (
            <div className="bg-bg-secondary border border-border rounded-xl p-6 animate-fade-in">
              <h2 className="text-lg font-semibold mb-6">System Preferences</h2>
              <div className="text-text-muted text-sm py-12 text-center border-2 border-dashed border-border rounded-xl">
                Global settings, notifications, and integration options will go here.
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
