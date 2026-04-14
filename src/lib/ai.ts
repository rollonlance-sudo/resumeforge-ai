import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AnalysisResult {
  overall_score: number;
  category_scores: {
    keywords: number;
    formatting: number;
    achievements: number;
    relevance: number;
    readability: number;
  };
  findings: string[];
  missing_keywords: string[];
}

export interface Suggestion {
  priority: "high" | "medium" | "low";
  category: "keywords" | "structure" | "content" | "formatting";
  description: string;
  before?: string;
  after?: string;
}

export interface SuggestionsResult {
  suggestions: Suggestion[];
}

export async function analyzeResume(
  resumeText: string,
  jobDescription: string | null,
  isPro: boolean
): Promise<AnalysisResult> {
  const model = isPro ? "gpt-4o" : "gpt-4o-mini";

  const response = await openai.chat.completions.create({
    model,
    temperature: 0.3,
    max_tokens: 1000,
    messages: [
      {
        role: "system",
        content:
          "You are an expert ATS (Applicant Tracking System) analyst and career coach.",
      },
      {
        role: "user",
        content: `Analyze the following resume and provide:
1. An overall ATS compatibility score (0-100)
2. Scores for: Keyword Optimization, Formatting & Structure, Achievement Quantification, Relevance, Readability (each 0-100)
3. A list of 4-6 key findings/issues
4. A list of missing keywords (if job description provided)

Resume:
${resumeText}

${jobDescription ? `Job Description:\n${jobDescription}` : "No job description provided."}

Respond in JSON format:
{
  "overall_score": number,
  "category_scores": { "keywords": number, "formatting": number, "achievements": number, "relevance": number, "readability": number },
  "findings": [string],
  "missing_keywords": [string]
}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");
  return JSON.parse(content) as AnalysisResult;
}

export async function generateSuggestions(
  resumeText: string,
  jobDescription: string | null,
  analysis: AnalysisResult,
  isPro: boolean
): Promise<SuggestionsResult> {
  const model = isPro ? "gpt-4o" : "gpt-4o-mini";

  const response = await openai.chat.completions.create({
    model,
    temperature: 0.3,
    max_tokens: 1500,
    messages: [
      {
        role: "system",
        content:
          "You are a professional resume consultant. Based on the analysis, generate actionable improvement suggestions.",
      },
      {
        role: "user",
        content: `Given this analysis: ${JSON.stringify(analysis)}
And original resume: ${resumeText}
${jobDescription ? `And target job: ${jobDescription}` : ""}

Generate 5-8 specific suggestions. Each should have:
- priority: "high" | "medium" | "low"
- category: "keywords" | "structure" | "content" | "formatting"
- description: clear actionable text
- before: example snippet from current resume (if applicable)
- after: improved version of that snippet

Respond in JSON: { "suggestions": [...] }`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");
  return JSON.parse(content) as SuggestionsResult;
}

export async function rewriteResume(
  resumeText: string,
  jobDescription: string | null,
  suggestions: SuggestionsResult,
  tone: string,
  format: string,
  focusAreas: string[],
  isPro: boolean
) {
  const model = isPro ? "gpt-4o" : "gpt-4o-mini";

  const stream = await openai.chat.completions.create({
    model,
    temperature: 0.6,
    max_tokens: 3000,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "You are an expert resume writer. Rewrite the resume incorporating all suggestions and optimizations. Maintain the candidate's real experience — do not fabricate details. Optimize for ATS while keeping it human-readable.",
      },
      {
        role: "user",
        content: `Original resume: ${resumeText}
${jobDescription ? `Target job: ${jobDescription}` : ""}
Tone: ${tone}
Format: ${format}
Focus areas: ${focusAreas.join(", ")}
Suggestions to incorporate: ${JSON.stringify(suggestions)}

Output the complete optimized resume as clean formatted text.`,
      },
    ],
  });

  return stream;
}
