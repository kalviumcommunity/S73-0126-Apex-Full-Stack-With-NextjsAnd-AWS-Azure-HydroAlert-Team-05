import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies(); // ✅ await first
  cookieStore.delete("hydro_token");

  return NextResponse.json({ success: true });
}
