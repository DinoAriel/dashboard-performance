"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { monthlyHealthData as mockMonthlyHealthData, statusDistributionData as mockStatusDistributionData } from "@/lib/mock-data";

interface DashboardChartsProps {
  monthlyHealth?: { name: string; value: number }[];
  distribution?: { name: string; value: number; fill: string }[];
  totalEquipment?: number;
}

export function DashboardCharts({ 
  monthlyHealth, 
  distribution,
  totalEquipment = 26 
}: DashboardChartsProps) {
  const lineData = monthlyHealth || mockMonthlyHealthData;
  const pieData = distribution || mockStatusDistributionData;

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Line Chart */}
      <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-bold text-[#0F172A]">
          Tren Kesehatan Bulanan (Jan-Agt)
        </h2>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineData}
              margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                domain={[80, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0284C7"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0284C7", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-bold text-[#0F172A]">
          Distribusi Status (Agustus)
        </h2>
        <div className="relative h-[200px] w-full flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {/* Inner Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-[#0F172A]">{totalEquipment}</span>
            <span className="text-xs font-medium text-slate-500">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-col gap-2">
          {pieData.map((item: any) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-slate-600">{item.name}</span>
              </div>
              <span className="font-semibold text-slate-700">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

