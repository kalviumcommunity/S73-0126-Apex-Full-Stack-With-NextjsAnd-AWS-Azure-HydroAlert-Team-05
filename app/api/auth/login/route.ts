import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { loginSchema } from "@/lib/schemas/loginSchema";
import { ZodError } from "zod";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

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

    // ✅ IMPORTANT PART
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    response.cookies.set("hydro_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError("Validation Error", ERROR_CODES.VALIDATION_ERROR, 400);
    }

    return sendError("Login failed", ERROR_CODES.INTERNAL_ERROR, 500);
  }
}
