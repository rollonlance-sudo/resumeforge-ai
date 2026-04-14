import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generatePDF } from "@/lib/pdf-export";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });

    if (user?.plan !== "pro") {
      return NextResponse.json(
        { error: "PDF export is a Pro feature" },
        { status: 403 }
      );
    }

    const { optimizationId } = await req.json();

    const optimization = await prisma.optimization.findUnique({
      where: { id: optimizationId, userId: session.user.id },
      select: { optimizedResume: true, jobTitle: true },
    });

    if (!optimization || !optimization.optimizedResume) {
      return NextResponse.json({ error: "Optimization not found" }, { status: 404 });
    }

    const pdfBuffer = await generatePDF(optimization.optimizedResume);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="optimized-resume.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
