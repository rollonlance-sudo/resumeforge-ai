import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      defaultTone: true,
      stripeCustomerId: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <SettingsClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email!,
        plan: user.plan,
        defaultTone: user.defaultTone,
        stripeCustomerId: user.stripeCustomerId,
      }}
    />
  );
}
