import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { userSchema } from "@/lib/schemas/userSchema";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = userSchema.parse(body);

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    return sendSuccess(
      { id: user.id, email: user.email },
      "Signup successful",
      201
    );
  } catch (error: unknown) {
    // ✅ Zod validation error
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

    // ✅ Prisma unique constraint error (email already exists)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return sendError(
        "User already exists",
        ERROR_CODES.VALIDATION_ERROR,
        409
      );
    }

    // ❌ True server error
    return sendError(
      "Signup failed",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error instanceof Error
        ? { message: error.message }
        : { message: "Unknown error" }
    );
  }
}
