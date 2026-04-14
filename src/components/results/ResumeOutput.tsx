"use client";

import { useState } from "react";

interface ResumeOutputProps {
  original: string;
  optimized: string;
  optimizationId?: string;
  isPro?: boolean;
}

export function ResumeOutput({ original, optimized, optimizationId, isPro }: ResumeOutputProps) {
  const [showDiff, setShowDiff] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(optimized);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedText);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([editedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized-resume.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    const res = await fetch("/api/optimizations/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editedText, format: "pdf" }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized-resume.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {isPro && (
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition"
          >
            {showDiff ? "Hide Diff" : "Show Diff"}
          </button>
        )}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition"
        >
          {isEditing ? "Done Editing" : "Edit"}
        </button>
        <button
          onClick={handleCopy}
          className="text-sm px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Copy to Clipboard
        </button>
        <button
          onClick={handleDownloadTxt}
          className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition"
        >
          Download TXT
        </button>
        {isPro && (
          <button
            onClick={handleDownloadPdf}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition"
          >
            Download PDF
          </button>
        )}
      </div>

      {showDiff && isPro ? (
        <DiffView original={original} optimized={editedText} />
      ) : isEditing ? (
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="w-full min-h-[500px] p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {editedText}
        </div>
      )}
    </div>
  );
}

function DiffView({ original, optimized }: { original: string; optimized: string }) {
  const origLines = original.split("\n");
  const optLines = optimized.split("\n");
  const maxLen = Math.max(origLines.length, optLines.length);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-gray-200">
        <div className="p-4">
          <h4 className="text-xs font-semibold text-red-600 mb-2 uppercase">Original</h4>
          <div className="space-y-0.5 font-mono text-xs">
            {origLines.map((line, i) => (
              <div
                key={i}
                className={
                  i < optLines.length && line !== optLines[i]
                    ? "bg-red-50 px-2 py-0.5 rounded"
                    : "px-2 py-0.5"
                }
              >
                {line || "\u00A0"}
              </div>
            ))}
          </div>
        </div>
        <div className="p-4">
          <h4 className="text-xs font-semibold text-green-600 mb-2 uppercase">Optimized</h4>
          <div className="space-y-0.5 font-mono text-xs">
            {optLines.map((line, i) => (
              <div
                key={i}
                className={
                  i < origLines.length && line !== origLines[i]
                    ? "bg-green-50 px-2 py-0.5 rounded"
                    : i >= origLines.length
                    ? "bg-green-50 px-2 py-0.5 rounded"
                    : "px-2 py-0.5"
                }
              >
                {line || "\u00A0"}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
