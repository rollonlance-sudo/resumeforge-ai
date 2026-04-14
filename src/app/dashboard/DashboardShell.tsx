"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
  userImage?: string | null;
  plan: string;
  usage: { used: number; limit: number };
}

export function DashboardShell({
  children,
  userName,
  userEmail,
  userImage,
  plan,
  usage,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        userName={userName}
        userEmail={userEmail}
        userImage={userImage}
        plan={plan}
        usage={usage}
      />
      <main className="lg:pl-64">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
