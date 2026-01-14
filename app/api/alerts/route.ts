// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const limit = Number(searchParams.get("limit")) || 5;

//   const alerts = await prisma.alert.findMany({
//     take: limit,
//     orderBy: { sentAt: "desc" },
//     select: { id: true, message: true, sentAt: true },
//   });

//   return NextResponse.json(alerts);
// }

import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

export async function GET() {
  try {
    const alerts = await prisma.alert.findMany({
      take: 5,
      orderBy: { sentAt: "desc" },
      select: { id: true, message: true, sentAt: true },
    });

    return sendSuccess(alerts, "Recent alerts fetched");
  } catch (error) {
    return sendError(
      "Unable to fetch alerts",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error
    );
  }
}
