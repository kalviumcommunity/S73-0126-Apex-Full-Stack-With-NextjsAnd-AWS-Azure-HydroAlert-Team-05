import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.user.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ message: "User deleted" });
}
