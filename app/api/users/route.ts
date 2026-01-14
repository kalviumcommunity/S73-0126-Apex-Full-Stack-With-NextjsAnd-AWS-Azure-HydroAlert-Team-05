// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const page = Number(searchParams.get("page")) || 1;
//   const limit = Number(searchParams.get("limit")) || 10;

//   const users = await prisma.user.findMany({
//     skip: (page - 1) * limit,
//     take: limit,
//     select: { id: true, name: true, email: true },
//   });

//   return NextResponse.json({ page, limit, users });
// }

// export async function POST(req: Request) {
//   const body = await req.json();

//   if (!body.email || !body.name) {
//     return NextResponse.json(
//       { error: "Name and email are required" },
//       { status: 400 }
//     );
//   }

//   const user = await prisma.user.create({ data: body });
//   return NextResponse.json(user, { status: 201 });
// }

import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });

    return sendSuccess(users, "Users fetched successfully");
  } catch (error) {
    return sendError(
      "Failed to fetch users",
      ERROR_CODES.DATABASE_FAILURE,
      500,
      error
    );
  }
}
