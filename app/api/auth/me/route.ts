import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies(); // ✅ AWAIT
  const token = cookieStore.get("hydro_token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      role: string;
    };

    return NextResponse.json({ user: decoded });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
