import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const optimization = await prisma.optimization.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!optimization) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(optimization);
  } catch (error) {
    console.error("Fetch optimization error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const optimization = await prisma.optimization.findUnique({
      where: { id, userId: session.user.id },
      select: { id: true },
    });

    if (!optimization) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.optimization.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete optimization error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
