import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  plan: string;
  defaultTone: string;
  stripeCustomerId: string | null;
  createdAt: string;
}

export interface OptimizationResult {
  id: string;
  originalResume: string;
  jobDescription: string | null;
  optimizedResume: string | null;
  jobTitle: string | null;
  company: string | null;
  tone: string | null;
  format: string | null;
  focusAreas: string[];
  overallScore: number | null;
  categoryScores: {
    keywords: number;
    formatting: number;
    achievements: number;
    relevance: number;
    readability: number;
  } | null;
  findings: string[] | null;
  suggestions: {
    priority: "high" | "medium" | "low";
    category: "keywords" | "structure" | "content" | "formatting";
    description: string;
    before?: string;
    after?: string;
  }[] | null;
  missingKeywords: string[] | null;
  createdAt: string;
}

export interface UsageInfo {
  used: number;
  limit: number;
  remaining: number;
  allowed: boolean;
}
