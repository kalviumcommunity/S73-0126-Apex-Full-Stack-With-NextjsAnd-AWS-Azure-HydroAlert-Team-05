import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.alert.findMany({
    select: {
      id: true,
      message: true,
      sentAt: true,
    },
    take: 10,
    orderBy: {
      sentAt: "desc",
    },
  });

  console.log("Users from database:", users);

  return NextResponse.json({
    success: true,
    users,
  });
}
