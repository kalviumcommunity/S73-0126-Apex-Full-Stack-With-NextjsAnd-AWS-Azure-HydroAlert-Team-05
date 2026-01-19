import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  cookies().delete("hydro_token");
  return NextResponse.json({ success: true });
}
