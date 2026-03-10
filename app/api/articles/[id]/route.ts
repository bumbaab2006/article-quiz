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

    const article = await prisma.article.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
      include: {
        quizzes: {
          include: {
            attempts: {
              where: {
                userId: dbUser.id,
              },
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!article) return new NextResponse("Article not found", { status: 404 });

    return NextResponse.json(article);
  } catch (err) {
    console.error("ARTICLE_DETAIL_ERROR", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
