import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getMissingEmailEnvKeys,
  sendSummaryEmail,
} from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { email, summary, title } = await req.json();

    if (!email || !summary || !title) {
      return NextResponse.json(
        { error: "email, summary, title is required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const missingKeys = getMissingEmailEnvKeys();

    if (missingKeys.length > 0) {
      return NextResponse.json(
        {
          error: "Email is not configured",
          missingKeys,
        },
        { status: 503 }
      );
    }

    await sendSummaryEmail({
      to: email,
      title,
      summary,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("EMAIL_ROUTE_ERROR", error);

    return NextResponse.json(
      { error: "Unable to send email right now" },
      { status: 500 }
    );
  }
}
