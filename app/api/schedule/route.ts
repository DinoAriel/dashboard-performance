import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

const SCHEDULE_FILE = path.join(process.cwd(), "data_schedule.json");

interface ScheduleEvent {
  id: string;
  date: string;
  title: string;
  type: string;
}

function readEvents(): ScheduleEvent[] {
  try {
    if (!fs.existsSync(SCHEDULE_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(SCHEDULE_FILE, "utf-8");
    return JSON.parse(raw) as ScheduleEvent[];
  } catch {
    return [];
  }
}

function writeEvents(events: ScheduleEvent[]): void {
  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(events, null, 2), "utf-8");
}

export async function GET() {
  try {
    const events = readEvents();
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal membaca jadwal", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, title, type } = body;

    if (!date || !title) {
      return NextResponse.json(
        { error: "Tanggal dan judul jadwal wajib diisi." },
        { status: 400 }
      );
    }

    const events = readEvents();
    const newEvent: ScheduleEvent = {
      id: `evt-${Date.now()}`,
      date: String(date),
      title: String(title),
      type: String(type || "routine"),
    };
    events.push(newEvent);
    writeEvents(events);

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal menyimpan jadwal", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID jadwal wajib disertakan." },
        { status: 400 }
      );
    }

    const events = readEvents();
    const filtered = events.filter((e) => e.id !== id);

    if (filtered.length === events.length) {
      return NextResponse.json(
        { error: "Jadwal tidak ditemukan." },
        { status: 404 }
      );
    }

    writeEvents(filtered);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal menghapus jadwal", details: error.message },
      { status: 500 }
    );
  }
}
