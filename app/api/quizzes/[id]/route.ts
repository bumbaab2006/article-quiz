import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const quiz = await prisma.quiz.findFirst({
      where: {
        id,
        article: {
          userId: dbUser.id,
        },
      },
      include: { article: true },
    });

    if (!quiz) return new NextResponse("Quiz not found", { status: 404 });

    return NextResponse.json(quiz);
  } catch (err) {
    console.error("GET QUIZ ERROR:", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
