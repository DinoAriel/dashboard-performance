"use client";

import React, { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  Paintbrush, 
  Save, 
  Globe, 
  Moon, 
  Sun,
  Lock,
  Key,
  Smartphone
} from "lucide-react";
import { Topbar } from "@/components/Topbar";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "preferences", label: "Preferences", icon: <Paintbrush className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* If Topbar isn't appropriate here, we can replace it with a custom header, 
          but usually the app uses a standard Topbar. Let's create a custom header for settings */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account settings and preferences</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm shadow-blue-200 active:scale-95">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-sm shadow-slate-200/50 border border-slate-100"
                      : "text-slate-600 hover:bg-white/60 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    activeTab === tab.id ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                  }`}>
                    {tab.icon}
                  </div>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                  <p className="text-sm text-slate-500">Update your photo and personal details.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md ring-4 ring-white">
                      JD
                    </div>
                    <div>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-all shadow-sm">
                          Change
                        </button>
                        <button className="px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-all">
                          Remove
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">First Name</label>
                      <input 
                        type="text" 
                        defaultValue="John"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Last Name</label>
                      <input 
                        type="text" 
                        defaultValue="Doe"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-700">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue="john.doe@skyportops.com"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-700">Role</label>
                      <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 appearance-none">
                        <option>Facility Manager</option>
                        <option>Maintenance Technician</option>
                        <option>System Administrator</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">Application Preferences</h2>
                  <p className="text-sm text-slate-500">Customize how the application looks and feels.</p>
                </div>
                <div className="p-6 space-y-8">
                  
                  {/* Theme Selection */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-900">Interface Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-blue-500 bg-blue-50/30 text-blue-700 transition-all relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-500">
                          <Sun className="w-6 h-6" />
                        </div>
                        <span className="font-medium">Light</span>
                      </button>
                      <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-slate-100 hover:border-slate-300 bg-white text-slate-600 transition-all relative overflow-hidden group">
                        <div className="absolute inset-0 bg-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-12 h-12 rounded-full bg-slate-900 shadow-sm flex items-center justify-center text-slate-300">
                          <Moon className="w-6 h-6" />
                        </div>
                        <span className="font-medium">Dark</span>
                      </button>
                      <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-slate-100 hover:border-slate-300 bg-white text-slate-600 transition-all relative overflow-hidden group">
                        <div className="absolute inset-0 bg-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-white to-slate-900 shadow-sm flex items-center justify-center border border-slate-200">
                          <Smartphone className="w-6 h-6 text-slate-500" />
                        </div>
                        <span className="font-medium">System</span>
                      </button>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Language & Region */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-900">Language & Region</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-slate-400" /> Language
                        </label>
                        <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 appearance-none">
                          <option>English (US)</option>
                          <option>Indonesian (ID)</option>
                          <option>Spanish (ES)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Timezone</label>
                        <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 appearance-none">
                          <option>(GMT-05:00) Eastern Time</option>
                          <option>(GMT+07:00) Western Indonesia Time</option>
                          <option>(GMT+00:00) UTC</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">Notification Settings</h2>
                  <p className="text-sm text-slate-500">Choose what alerts you want to receive and how.</p>
                </div>
                <div className="p-0">
                  <div className="divide-y divide-slate-100">
                    
                    {/* Alert Type */}
                    {[
                      { title: "Critical Equipment Failures", desc: "Get notified immediately when critical equipment goes offline.", defaultChecked: true },
                      { title: "Maintenance Reminders", desc: "Receive alerts for upcoming scheduled maintenance tasks.", defaultChecked: true },
                      { title: "Weekly Performance Reports", desc: "A summary of facility performance sent to your email.", defaultChecked: false },
                      { title: "Security Alerts", desc: "Notifications about unauthorized access or security breaches.", defaultChecked: true },
                    ].map((item, idx) => (
                      <div key={idx} className="p-6 flex items-start justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="pr-8">
                          <h4 className="text-sm font-medium text-slate-900">{item.title}</h4>
                          <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                          <input type="checkbox" className="sr-only peer" defaultChecked={item.defaultChecked} />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                    ))}

                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">Security & Authentication</h2>
                  <p className="text-sm text-slate-500">Manage your password and security settings.</p>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Change Password */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                      <Key className="w-4 h-4 text-slate-400" /> Password
                    </h3>
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <label className="text-sm text-slate-600">Current Password</label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-slate-600">New Password</label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900"
                        />
                      </div>
                      <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* 2FA */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-slate-400" /> Two-Factor Authentication (2FA)
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 max-w-lg">
                        Add an extra layer of security to your account by requiring a verification code when you sign in.
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-all shadow-sm whitespace-nowrap">
                      Enable 2FA
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
