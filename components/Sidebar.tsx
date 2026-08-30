"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Box, 
  Calendar, 
  BarChart2, 
  AlertTriangle, 
  Settings,
  UserCircle,
  LogOut,
  Plane
} from "lucide-react";

const mainNavItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Equipment Inventory", href: "/equipment", icon: Box },
  { name: "Maintenance Schedule", href: "/schedule", icon: Calendar },
  { name: "Reports", href: "/reports", icon: BarChart2 },
  { name: "Alerts & Issues", href: "/alerts", icon: AlertTriangle },
];

const bottomNavItems = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Profile", href: "/profile", icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-[#2A313C] text-white">
      {/* Top Logo Area */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6] text-white">
          <Plane size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight">SkyPort Ops</span>
          <span className="text-xs text-slate-400">Facility Management</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <nav className="flex flex-col gap-2">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-r-lg px-4 py-3 text-sm font-medium transition-all mr-2",
                  isActive
                    ? "bg-[#3B82F6] text-white border-l-4 border-[#3B82F6] font-semibold"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent"
                )}
              >
                <item.icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Area */}
      <div className="flex flex-col gap-1 p-4 mb-2">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-white bg-slate-800"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
