import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

interface SendPasswordResetParams {
  to: string;
  name: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: SendPasswordResetParams) {
  await transporter.sendMail({
    from: `"AUTOGENIUS" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your AUTOGENIUS password",
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8" /></head>
        <body style="font-family: sans-serif; background: #f9fafb; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px;">
            <h1 style="color: #ea580c; font-size: 22px;">AUTOGENIUS</h1>
            <h2 style="color: #111827;">Reset your password</h2>
            <p style="color: #4b5563;">Hi ${name}, click the button below to set a new password.</p>
            <a href="${resetUrl}" style="display: block; background: #ea580c; color: #fff; text-align: center; padding: 14px; border-radius: 10px; text-decoration: none; font-weight: bold; margin: 24px 0;">
              Reset Password
            </a>
            <p style="color: #9ca3af; font-size: 12px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
          </div>
        </body>
      </html>
    `,
  });
}