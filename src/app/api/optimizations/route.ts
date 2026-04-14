import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const optimizations = await prisma.optimization.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        jobTitle: true,
        overallScore: true,
        tone: true,
        createdAt: true,
      },
    });

    return NextResponse.json(optimizations);
  } catch (error) {
    console.error("Fetch optimizations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
