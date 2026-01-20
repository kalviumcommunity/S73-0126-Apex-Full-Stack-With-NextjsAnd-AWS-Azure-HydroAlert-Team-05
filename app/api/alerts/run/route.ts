import { NextResponse } from "next/server";
import { runAlertEngine } from "@/lib/alerts/alertEngine";

export async function POST() {
  try {
    await runAlertEngine();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ALERT ENGINE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to run alert engine" },
      { status: 500 }
    );
  }
}
