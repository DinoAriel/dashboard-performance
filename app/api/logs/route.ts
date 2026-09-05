import { NextRequest, NextResponse } from "next/server";
import { writeDailyReportAsync, getDashboardDataAsync } from "@/lib/excel-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, equipmentId, score, description, region, location, letterCode, target } = body;

    if (!date || !equipmentId || score === undefined || score === null) {
      return NextResponse.json(
        { error: "Mohon isi semua data yang diperlukan: tanggal, alat, dan skor." },
        { status: 400 }
      );
    }

    const numericScore = Number(score);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      return NextResponse.json(
        { error: "Skor harus berupa angka antara 0 dan 100." },
        { status: 400 }
      );
    }

    const numericTarget = target !== undefined && target !== null ? Number(target) : undefined;

    // Tulis ke Excel
    const result = await writeDailyReportAsync(
      date, 
      equipmentId, 
      numericScore, 
      description || "",
      region,
      location,
      letterCode,
      numericTarget
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Data berhasil disimpan ke Excel!",
        data: result
      });
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in POST /api/logs:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data ke Excel", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await getDashboardDataAsync();
    return NextResponse.json({
      success: true,
      alertLogs: data.alertLogs,
      equipmentList: data.equipmentList,
      maintenanceLogs: data.maintenanceLogs
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal mengambil riwayat log", details: error.message },
      { status: 500 }
    );
  }
}

