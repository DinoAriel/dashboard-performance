import { NextRequest, NextResponse } from "next/server";
import { getEquipmentMonthlyDetail } from "@/lib/excel-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const equipmentId = searchParams.get("equipmentId");
  const month = searchParams.get("month") || undefined;
  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo = searchParams.get("dateTo") || undefined;

  if (!equipmentId) {
    return NextResponse.json(
      { error: "Parameter equipmentId wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const detail = await getEquipmentMonthlyDetail(equipmentId, month, dateFrom, dateTo);
    if (!detail) {
      return NextResponse.json(
        { error: "Peralatan tidak ditemukan atau tidak ada data" },
        { status: 404 }
      );
    }
    return NextResponse.json(detail);
  } catch (err: any) {
    console.error("Error fetching monthly detail:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
