"use client";

import { useState } from "react";
import Link from "next/link";
import { ScoreCircle } from "@/components/results/ScoreCircle";
import { ScoreBreakdown } from "@/components/results/ScoreBreakdown";
import { SuggestionCard } from "@/components/results/SuggestionCard";
import { ResumeOutput } from "@/components/results/ResumeOutput";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ResultData {
  id: string;
  jobTitle: string | null;
  originalResume: string;
  optimizedResume: string | null;
  overallScore: number | null;
  scores: Record<string, number> | null;
  suggestions: Array<{
    category: string;
    priority: string;
    title: string;
    description: string;
    before?: string;
    after?: string;
  }> | null;
  keyFindings: string[] | null;
  createdAt: string;
}

export default function ResultsClient({ result }: { result: ResultData }) {
  const [activeTab, setActiveTab] = useState<"overview" | "suggestions" | "output">("overview");

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "suggestions", label: `Suggestions (${result.suggestions?.length || 0})` },
    { key: "output", label: "Optimized Resume" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Optimization Results</h1>
          </div>
          <div className="flex items-center gap-3 ml-8">
            {result.jobTitle && (
              <Badge variant="secondary">{result.jobTitle}</Badge>
            )}
            <span className="text-sm text-gray-500">
              {new Date(result.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/new">
            <Button variant="outline">New Optimization</Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.key
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score circle */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="bg-white rounded-xl border border-gray-200 p-8 w-full flex flex-col items-center">
              <h3 className="text-sm font-medium text-gray-500 mb-4">ATS Score</h3>
              <ScoreCircle score={result.overallScore || 0} size={180} />
              <p className="mt-4 text-sm text-gray-500 text-center">
                {(result.overallScore || 0) >= 75
                  ? "Great score! Your resume is well-optimized."
                  : (result.overallScore || 0) >= 50
                  ? "Good start. Apply the suggestions to improve."
                  : "Needs improvement. Follow the suggestions below."}
              </p>
            </div>
          </div>

          {/* Score breakdown & Key findings */}
          <div className="lg:col-span-2 space-y-6">
            {result.scores && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Score Breakdown</h3>
                <ScoreBreakdown scores={result.scores} />
              </div>
            )}

            {result.keyFindings && result.keyFindings.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Key Findings</h3>
                <ul className="space-y-3">
                  {result.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "suggestions" && (
        <div className="space-y-4">
          {result.suggestions && result.suggestions.length > 0 ? (
            result.suggestions.map((suggestion, idx) => (
              <SuggestionCard key={idx} suggestion={suggestion} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">No suggestions available.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "output" && (
        <ResumeOutput
          original={result.originalResume}
          optimized={result.optimizedResume || ""}
          optimizationId={result.id}
        />
      )}
    </div>
  );
}
