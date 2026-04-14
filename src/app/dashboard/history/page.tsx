import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const optimizations = await prisma.optimization.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      jobTitle: true,
      overallScore: true,
      createdAt: true,
      tone: true,
    },
  });

  const serialized = optimizations.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
  }));

  return <HistoryClient optimizations={serialized} />;
}
