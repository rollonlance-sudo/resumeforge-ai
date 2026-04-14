import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ResultsClient from "./ResultsClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ResultsPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const optimization = await prisma.optimization.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!optimization) redirect("/dashboard");

  const result = {
    id: optimization.id,
    jobTitle: optimization.jobTitle,
    originalResume: optimization.originalResume,
    optimizedResume: optimization.optimizedResume,
    overallScore: optimization.overallScore,
    scores: optimization.scores as Record<string, number> | null,
    suggestions: optimization.suggestions as Array<{
      category: string;
      priority: string;
      title: string;
      description: string;
      before?: string;
      after?: string;
    }> | null,
    keyFindings: optimization.keyFindings as string[] | null,
    createdAt: optimization.createdAt.toISOString(),
  };

  return <ResultsClient result={result} />;
}
