import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canOptimize } from "@/lib/usage";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, plan: true },
  });

  const [recentOptimizations, totalCount, usageInfo] = await Promise.all([
    prisma.optimization.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        jobTitle: true,
        overallScore: true,
        createdAt: true,
      },
    }),
    prisma.optimization.count({
      where: { userId: session.user.id },
    }),
    canOptimize(session.user.id, user?.plan || "free"),
  ]);

  const avgScore =
    recentOptimizations.length > 0
      ? Math.round(
          recentOptimizations.reduce((sum, o) => sum + (o.overallScore || 0), 0) /
            recentOptimizations.filter((o) => o.overallScore).length || 0
        )
      : 0;

  const getScoreBadge = (score: number | null) => {
    if (!score) return <Badge variant="outline">N/A</Badge>;
    if (score >= 75) return <Badge variant="success">{score}</Badge>;
    if (score >= 50) return <Badge variant="warning">{score}</Badge>;
    return <Badge variant="destructive">{score}</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name || "User"}!</h1>
        <p className="mt-2 text-indigo-100">Ready to optimize your resume?</p>
        <Link
          href="/dashboard/new"
          className="mt-4 inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-50 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Start New Optimization
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Optimizations"
          value={totalCount}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatsCard
          title="Average ATS Score"
          value={avgScore > 0 ? `${avgScore}%` : "N/A"}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <StatsCard
          title="This Month's Usage"
          value={
            usageInfo.limit === Infinity
              ? `${usageInfo.used} (Unlimited)`
              : `${usageInfo.used}/${usageInfo.limit}`
          }
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Recent History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Optimizations</h2>
          {recentOptimizations.length > 0 && (
            <Link href="/dashboard/history" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All
            </Link>
          )}
        </div>

        {recentOptimizations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900">No optimizations yet</h3>
            <p className="text-sm text-gray-500 mt-1">Start your first optimization to see results here.</p>
            <Link
              href="/dashboard/new"
              className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition"
            >
              Start Optimizing
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Job Title</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">ATS Score</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOptimizations.map((opt) => (
                  <tr key={opt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(opt.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {opt.jobTitle || "General"}
                    </td>
                    <td className="px-6 py-4">{getScoreBadge(opt.overallScore)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/results/${opt.id}`}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upgrade CTA for free users */}
      {user?.plan === "free" && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upgrade to Pro</h3>
              <p className="text-sm text-gray-600 mt-1">
                Get unlimited optimizations, detailed scoring, PDF exports, and more.
              </p>
            </div>
            <Link
              href="/dashboard/settings"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 transition"
            >
              Upgrade — $19/mo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
