import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all user data in order
    await prisma.optimization.deleteMany({ where: { userId: session.user.id } });
    await prisma.usage.deleteMany({ where: { userId: session.user.id } });
    await prisma.account.deleteMany({ where: { userId: session.user.id } });
    await prisma.session.deleteMany({ where: { userId: session.user.id } });
    await prisma.user.delete({ where: { id: session.user.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
