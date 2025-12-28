import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { genAI } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { title, content, maxLength = 150 } = await req.json();
    if (!title || !content)
      return new NextResponse("Missing fields", { status: 400 });

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return new NextResponse("User not synced", { status: 409 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      `Доорх нийтлэлийг ${maxLength} үгнээс хэтрэхгүйгээр хураангуйла:\n\n${content}`
    );

    const summary = result.response.text();

    const article = await prisma.article.create({
      data: {
        title,
        content,
        summary,
        userId: dbUser.id,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    console.error("SUMMARIZE ERROR:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
