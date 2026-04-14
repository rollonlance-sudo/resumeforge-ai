import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { defaultTone } = await req.json();

    const validTones = ["professional", "confident", "conversational", "executive"];
    if (defaultTone && !validTones.includes(defaultTone)) {
      return NextResponse.json({ error: "Invalid tone" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { defaultTone },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Preferences update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
