import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { userSchema } from "@/lib/schemas/userSchema";
import { ZodError } from "zod";

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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = userSchema.parse(body);

    const user = await prisma.user.create({
      data: validatedData,
    });

    return sendSuccess(user, "User created successfully", 201);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return sendError(
        "Validation Error",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }))
      );
    }

    return sendError(
      "Internal Server Error",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error instanceof Error
        ? { message: error.message }
        : { message: "Unknown error" }
    );
  }
}
