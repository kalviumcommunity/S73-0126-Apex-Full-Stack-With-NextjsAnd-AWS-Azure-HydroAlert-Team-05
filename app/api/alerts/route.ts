import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 5;

  const alerts = await prisma.alert.findMany({
    take: limit,
    orderBy: { sentAt: "desc" },
    select: { id: true, message: true, sentAt: true },
  });

  return NextResponse.json(alerts);
}
