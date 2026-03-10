import nodemailer from "nodemailer";

type SummaryEmailInput = {
  to: string;
  title: string;
  summary: string;
};

const REQUIRED_ENV_KEYS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "EMAIL_FROM",
] as const;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function getMissingEmailEnvKeys() {
  return REQUIRED_ENV_KEYS.filter((key) => !process.env[key]);
}

function createTransporter() {
  const smtpPort = Number(process.env.SMTP_PORT);
  const secure =
    process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendSummaryEmail({
  to,
  title,
  summary,
}: SummaryEmailInput) {
  const transporter = createTransporter();
  const safeTitle = escapeHtml(title);
  const safeSummary = escapeHtml(summary).replaceAll("\n", "<br />");

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    replyTo: process.env.EMAIL_REPLY_TO || undefined,
    subject: `AI Summary: ${title}`,
    text: `Гарчиг: ${title}\n\nХураангуй:\n${summary}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 640px; margin: 0 auto; padding: 24px;">
        <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #2563eb;">AI Summary</p>
        <h1 style="margin: 0 0 20px; font-size: 24px; line-height: 1.3;">${safeTitle}</h1>
        <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 16px; padding: 20px;">
          <p style="margin: 0; font-size: 15px; color: #1f2937;">${safeSummary}</p>
        </div>
      </div>
    `,
  });
}
