import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Clerk user → Prisma user
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json([], { status: 200 });
    }

    const articles = await prisma.article.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
      },
    });

    return NextResponse.json(articles);
  } catch (err) {
    console.error("MY ARTICLES ERROR:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
