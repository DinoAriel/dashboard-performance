import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full h-full bg-[#F8FAFC]">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute w-16 h-16 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
        {/* Spinning loader */}
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
      <h2 className="mt-6 text-lg font-medium text-slate-700 animate-pulse">Memuat Data Dashboard...</h2>
      <p className="mt-2 text-sm text-slate-500">Mengambil pembaruan terkini dari server</p>
    </div>
  );
}
