import { prisma } from "@/lib/prisma";

export async function testPrismaConnection() {
  const users = await prisma.user.findMany();
  console.log("Users from database:", users);
}
