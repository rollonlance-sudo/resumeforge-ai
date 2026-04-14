"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

interface Optimization {
  id: string;
  jobTitle: string | null;
  overallScore: number | null;
  createdAt: string;
  tone: string | null;
}

export default function HistoryClient({ optimizations: initial }: { optimizations: Optimization[] }) {
  const [optimizations, setOptimizations] = useState(initial);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "score">("date");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const filtered = optimizations
    .filter((o) =>
      search
        ? (o.jobTitle || "General").toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortBy === "score") return (b.overallScore || 0) - (a.overallScore || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/optimizations/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setOptimizations((prev) => prev.filter((o) => o.id !== deleteId));
      showToast("Optimization deleted.", "success");
    } catch {
      showToast("Failed to delete.", "error");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const getScoreBadge = (score: number | null) => {
    if (!score) return <Badge variant="outline">N/A</Badge>;
    if (score >= 75) return <Badge variant="success">{score}%</Badge>;
    if (score >= 50) return <Badge variant="warning">{score}%</Badge>;
    return <Badge variant="destructive">{score}%</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Optimization History</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage your past optimizations.</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "date" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("date")}
          >
            Date
          </Button>
          <Button
            variant={sortBy === "score" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("score")}
          >
            Score
          </Button>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">
            {search ? "No results found" : "No optimizations yet"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {search ? "Try a different search term." : "Start your first optimization to see history."}
          </p>
          {!search && (
            <Link
              href="/dashboard/new"
              className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition"
            >
              Start Optimizing
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Job Title</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Tone</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">ATS Score</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((opt) => (
                <tr key={opt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(opt.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {opt.jobTitle || "General"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                    {opt.tone || "professional"}
                  </td>
                  <td className="px-6 py-4">{getScoreBadge(opt.overallScore)}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/dashboard/results/${opt.id}`}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => setDeleteId(opt.id)}
                      className="text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-sm text-gray-400 text-right">
        {filtered.length} optimization{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Delete modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Optimization">
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this optimization? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
