import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { loginSchema } from "@/lib/schemas/loginSchema";
import { ZodError } from "zod";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError("Invalid credentials", ERROR_CODES.AUTH_FAILED, 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return sendError("Invalid credentials", ERROR_CODES.AUTH_FAILED, 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return sendSuccess({ token }, "Login successful");
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
      "Login failed",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error instanceof Error
        ? { message: error.message }
        : { message: "Unknown error" }
    );
  }
}
