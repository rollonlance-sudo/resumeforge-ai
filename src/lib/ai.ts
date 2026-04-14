import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

export interface AnalysisResult {
  overallScore: number;
  scores: Record<string, number>;
  keyFindings: string[];
}

export interface Suggestion {
  priority: string;
  category: string;
  title: string;
  description: string;
  before?: string;
  after?: string;
}

export async function analyzeResume(
  resumeText: string,
  jobDescription: string | null,
  model: string
): Promise<AnalysisResult> {
  const response = await getOpenAI().chat.completions.create({
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
2. Scores for: keywords, formatting, achievements, relevance, readability (each 0-100)
3. A list of 4-6 key findings/issues

Resume:
${resumeText}

${jobDescription ? `Job Description:\n${jobDescription}` : "No job description provided."}

Respond in JSON format:
{
  "overallScore": number,
  "scores": { "keywords": number, "formatting": number, "achievements": number, "relevance": number, "readability": number },
  "keyFindings": [string]
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
  focusAreas: string[],
  model: string
): Promise<Suggestion[]> {
  const response = await getOpenAI().chat.completions.create({
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
Focus areas: ${focusAreas.join(", ")}

Generate 5-8 specific suggestions. Each should have:
- priority: "high" | "medium" | "low"
- category: "keywords" | "structure" | "content" | "formatting"
- title: short title
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
  const parsed = JSON.parse(content);
  return parsed.suggestions as Suggestion[];
}

export async function rewriteResume(
  resumeText: string,
  jobDescription: string | null,
  suggestions: Suggestion[],
  tone: string,
  model: string
): Promise<string> {
  const response = await getOpenAI().chat.completions.create({
    model,
    temperature: 0.6,
    max_tokens: 3000,
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
Suggestions to incorporate: ${JSON.stringify(suggestions)}

Output the complete optimized resume as clean formatted text.`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");
  return content;
}
