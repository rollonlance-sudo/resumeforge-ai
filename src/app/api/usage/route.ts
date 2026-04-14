import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUsage } from "@/lib/usage";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usage = await getUsage(session.user.id);
    return NextResponse.json(usage);
  } catch (error) {
    console.error("Usage error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
