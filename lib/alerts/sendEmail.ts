import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL_USER,
    pass: process.env.ALERT_EMAIL_PASS,
  },
});

export async function sendAlertEmail(
  to: string,
  subject: string,
  message: string
) {
  await transporter.sendMail({
    from: `"HydroAlert" <${process.env.ALERT_EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>🚨 Flood Alert</h2>
        <p>${message}</p>
        <p><strong>Stay safe,<br/>HydroAlert Team</strong></p>
      </div>
    `,
  });
}
