import { NextResponse } from "next/server";
import { getDashboardDataAsync } from "@/lib/excel-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getDashboardDataAsync();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in API /api/dashboard:", error);
    return NextResponse.json(
      { error: "Gagal memuat data dari Excel", details: error.message },
      { status: 500 }
    );
  }
}

