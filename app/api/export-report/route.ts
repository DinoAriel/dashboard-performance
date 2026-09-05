import { NextRequest, NextResponse } from "next/server";
import { getDashboardDataAsync } from "@/lib/excel-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categories = searchParams.get("categories")?.split(",") || ["Elektrikal", "Mekanikal", "Elektronika"];
    const fromDate = searchParams.get("from"); // format YYYY-MM-DD
    const toDate = searchParams.get("to");     // format YYYY-MM-DD

    const data = await getDashboardDataAsync();
    const logs = data.maintenanceLogs || [];

    // Filter berdasarkan kategori yang dipilih
    let filtered = logs.filter(log => 
      categories.some(cat => cat.toLowerCase() === log.category.toLowerCase())
    );

    // Filter berdasarkan rentang tanggal (jika diisi)
    if (fromDate || toDate) {
      filtered = filtered.filter(log => {
        // Parse tanggal Indonesia (contoh: "15 Mei 2026") ke Date object
        const monthMap: Record<string, number> = {
          "januari": 0, "februari": 1, "maret": 2, "april": 3, "mei": 4, "juni": 5,
          "juli": 6, "agustus": 7, "september": 8, "oktober": 9, "november": 10, "desember": 11
        };
        const parts = log.date.split(" ");
        if (parts.length < 3) return true; // skip jika format tidak dikenali
        const day = parseInt(parts[0]);
        const month = monthMap[parts[1].toLowerCase()];
        const year = parseInt(parts[2]);
        if (isNaN(day) || month === undefined || isNaN(year)) return true;
        
        const logDate = new Date(year, month, day);
        
        if (fromDate) {
          const from = new Date(fromDate + "T00:00:00");
          if (logDate < from) return false;
        }
        if (toDate) {
          const to = new Date(toDate + "T23:59:59");
          if (logDate > to) return false;
        }
        return true;
      });
    }

    // Susun CSV
    const BOM = "\uFEFF"; // Agar karakter Indonesia terbaca di Excel
    const header = ["No", "Tanggal", "Fasilitas", "Kategori", "Rincian Laporan Kendala"];
    const rows = filtered.map((log, idx) => [
      idx + 1,
      `"${log.date}"`,
      `"${log.facility}"`,
      `"${log.category}"`,
      `"${log.note.replace(/"/g, '""')}"` // Escape kutip ganda
    ]);

    const csvContent = BOM + [header.join(","), ...rows.map(r => r.join(","))].join("\r\n");

    // Buat nama file dengan timestamp
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const filename = `Laporan_Pemeliharaan_${dateStr}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("Error exporting report:", error);
    return NextResponse.json(
      { error: "Gagal mengekspor laporan", details: error.message },
      { status: 500 }
    );
  }
}
