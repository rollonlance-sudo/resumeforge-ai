import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canOptimize, incrementUsage } from "@/lib/usage";
import { analyzeResume, generateSuggestions, rewriteResume } from "@/lib/ai";

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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check usage limits
    const usageInfo = await canOptimize(session.user.id, user.plan);
    if (!usageInfo.allowed) {
      return NextResponse.json(
        { error: "Monthly optimization limit reached. Upgrade to Pro for unlimited." },
        { status: 429 }
      );
    }

    const { resumeText, jobDescription, jobTitle, tone, focusAreas } = await req.json();

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Resume text must be at least 50 characters" },
        { status: 400 }
      );
    }

    // Step 1: Analyze
    const model = user.plan === "pro" ? "gpt-4o" : "gpt-4o-mini";
    const analysis = await analyzeResume(resumeText, jobDescription, model);

    // Step 2: Generate suggestions
    const suggestions = await generateSuggestions(
      resumeText,
      jobDescription,
      analysis,
      focusAreas,
      model
    );

    // Step 3: Rewrite
    const optimizedResume = await rewriteResume(
      resumeText,
      jobDescription,
      suggestions,
      tone || "professional",
      model
    );

    // Save to DB
    const optimization = await prisma.optimization.create({
      data: {
        userId: session.user.id,
        originalResume: resumeText,
        optimizedResume,
        jobDescription: jobDescription || null,
        jobTitle: jobTitle || null,
        tone: tone || "professional",
        focusAreas: focusAreas || [],
        overallScore: analysis.overallScore,
        scores: analysis.scores,
        suggestions: JSON.parse(JSON.stringify(suggestions)),
        keyFindings: analysis.keyFindings,
      },
    });

    // Increment usage
    await incrementUsage(session.user.id);

    return NextResponse.json({
      id: optimization.id,
      overallScore: analysis.overallScore,
    });
  } catch (error) {
    console.error("Optimization error:", error);
    return NextResponse.json({ error: "Optimization failed" }, { status: 500 });
  }
}
