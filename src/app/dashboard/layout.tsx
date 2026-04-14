import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUsage, canOptimize } from "@/lib/usage";
import { DashboardShell } from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      plan: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const usageInfo = await canOptimize(user.id, user.plan);

  return (
    <DashboardShell
      userName={user.name || "User"}
      userEmail={user.email}
      userImage={user.image}
      plan={user.plan}
      usage={{ used: usageInfo.used, limit: usageInfo.limit === Infinity ? 999 : usageInfo.limit }}
    >
      {children}
    </DashboardShell>
  );
}
