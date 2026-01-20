import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();

  const { to, subject, message } = body;

  if (!to || !subject || !message) {
    return NextResponse.json(
      { error: "Missing email fields" },
      { status: 400 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"HydroAlert" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Email sending failed" },
      { status: 500 }
    );
  }
}
