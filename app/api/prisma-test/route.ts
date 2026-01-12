import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany();

  console.log("Users from database:", users);

  return NextResponse.json({
    success: true,
    users,
  });
}
