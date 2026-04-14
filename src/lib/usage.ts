import { prisma } from "./db";

const FREE_LIMIT = 3;

export async function getUsage(userId: string) {
  const month = new Date().toISOString().slice(0, 7); // '2025-04'

  let usage = await prisma.usage.findUnique({
    where: {
      userId_month: {
        userId,
        month,
      },
    },
  });

  if (!usage) {
    usage = await prisma.usage.create({
      data: {
        userId,
        month,
        optimizationCount: 0,
      },
    });
  }

  return usage;
}

export async function canOptimize(userId: string, plan: string) {
  if (plan === "pro") return { allowed: true, remaining: Infinity, used: 0, limit: Infinity };

  const usage = await getUsage(userId);
  const remaining = Math.max(0, FREE_LIMIT - usage.optimizationCount);

  return {
    allowed: usage.optimizationCount < FREE_LIMIT,
    remaining,
    used: usage.optimizationCount,
    limit: FREE_LIMIT,
  };
}

export async function incrementUsage(userId: string) {
  const month = new Date().toISOString().slice(0, 7);

  await prisma.usage.upsert({
    where: {
      userId_month: {
        userId,
        month,
      },
    },
    update: {
      optimizationCount: {
        increment: 1,
      },
    },
    create: {
      userId,
      month,
      optimizationCount: 1,
    },
  });
}
