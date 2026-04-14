"use client";

import { useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

const FOCUS_AREAS = [
  { id: "keywords", label: "Keyword Optimization" },
  { id: "formatting", label: "Formatting & Structure" },
  { id: "impact", label: "Impact Statements" },
  { id: "brevity", label: "Brevity & Clarity" },
  { id: "skills", label: "Skills Alignment" },
  { id: "ats", label: "ATS Compatibility" },
];

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "confident", label: "Confident" },
  { value: "conversational", label: "Conversational" },
  { value: "executive", label: "Executive" },
];

const PROGRESS_MESSAGES = [
  "Parsing your resume...",
  "Analyzing content structure...",
  "Checking ATS compatibility...",
  "Evaluating keyword density...",
  "Generating suggestions...",
  "Rewriting optimized content...",
  "Finalizing results...",
];

export default function NewOptimizationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [tone, setTone] = useState("professional");
  const [focusAreas, setFocusAreas] = useState<string[]>(["keywords", "ats"]);
  const [outputFormat, setOutputFormat] = useState<"text" | "pdf">("text");
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressIndex, setProgressIndex] = useState(0);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowedTypes.includes(file.type)) {
      showToast("Invalid file type. Please upload PDF, DOCX, or TXT.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("File too large. Max 5MB.", "error");
      return;
    }

    setFileName(file.name);

    if (file.type === "text/plain") {
      const text = await file.text();
      setResumeText(text);
    } else {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/parse", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.text) {
          setResumeText(data.text);
        } else {
          showToast("Failed to extract text from file.", "error");
        }
      } catch {
        showToast("Error parsing file.", "error");
      }
    }
  }, [showToast]);

  const toggleFocusArea = (id: string) => {
    setFocusAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!resumeText.trim()) {
      showToast("Please enter or upload your resume.", "error");
      return;
    }

    setIsProcessing(true);
    setProgressIndex(0);

    const interval = setInterval(() => {
      setProgressIndex((prev) =>
        prev < PROGRESS_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 2500);

    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          jobTitle,
          tone,
          focusAreas,
          outputFormat,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Optimization failed");
      }

      const data = await res.json();
      clearInterval(interval);
      router.push(`/dashboard/results/${data.id}`);
    } catch (error: unknown) {
      clearInterval(interval);
      setIsProcessing(false);
      showToast(
        error instanceof Error ? error.message : "Something went wrong",
        "error"
      );
    }
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 mb-8 relative">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Optimizing Your Resume</h2>
        <p className="text-gray-600 text-sm animate-pulse">{PROGRESS_MESSAGES[progressIndex]}</p>
        <div className="mt-6 flex gap-1">
          {PROGRESS_MESSAGES.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx <= progressIndex ? "bg-indigo-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Optimization</h1>
        <p className="text-sm text-gray-500 mt-1">
          Paste your resume and job description to get AI-powered suggestions.
        </p>
      </div>

      {/* Resume Input */}
      <Card>
        <CardHeader>
          <CardTitle>Your Resume</CardTitle>
          <CardDescription>Paste your resume text or upload a file (PDF, DOCX, TXT)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload File
            </Button>
            {fileName && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {fileName}
              </span>
            )}
          </div>
          <Textarea
            placeholder="Paste your resume content here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={12}
          />
          <p className="text-xs text-gray-400 text-right">
            {resumeText.length.toLocaleString()} characters
          </p>
        </CardContent>
      </Card>

      {/* Job Description */}
      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
          <CardDescription>Paste the target job posting to tailor your resume (optional but recommended)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Job title (e.g., Senior Frontend Developer)"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <Textarea
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
          />
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle>Options</CardTitle>
          <CardDescription>Customize how your resume is optimized</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tone */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Tone</label>
            <Select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              options={TONE_OPTIONS}
            />
          </div>

          {/* Focus areas */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Focus Areas</label>
            <div className="flex flex-wrap gap-2">
              {FOCUS_AREAS.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => toggleFocusArea(area.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                    focusAreas.includes(area.id)
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {area.label}
                </button>
              ))}
            </div>
          </div>

          {/* Output format */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Output Format</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="text"
                  checked={outputFormat === "text"}
                  onChange={() => setOutputFormat("text")}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Text</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={outputFormat === "pdf"}
                  onChange={() => setOutputFormat("pdf")}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">PDF Export</span>
                <Badge variant="secondary">Pro</Badge>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4 pb-8">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!resumeText.trim()}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Optimize Resume
        </Button>
      </div>
    </div>
  );
}
