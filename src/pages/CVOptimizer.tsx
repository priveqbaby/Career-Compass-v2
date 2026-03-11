import { useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnalysisResult {
  matchScore: number;
  improvedScore: number;
  missingKeywords: string[];
  bulletRewrites: { original: string; improved: string; reason: string }[];
  positioningStatement: string;
  topRecommendations: { category: string; suggestion: string }[];
}

// ─── Claude API Call ──────────────────────────────────────────────────────────

async function analyzeWithClaude(
  jobDescription: string,
  resumeText: string
): Promise<AnalysisResult> {
  const prompt = `You are an expert resume coach and talent acquisition specialist. Analyze this resume against the job description and return a JSON object only — no preamble, no markdown fences.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Return ONLY valid JSON with this exact structure:
{
  "matchScore": <integer 0-100 representing how well the resume currently matches>,
  "improvedScore": <integer 0-100 representing score after applying your suggestions, always higher than matchScore>,
  "missingKeywords": [<array of 5-8 specific keywords/phrases from the JD missing from the resume>],
  "bulletRewrites": [
    {
      "original": "<exact bullet or phrase from the resume>",
      "improved": "<rewritten version tailored to the JD, with stronger impact and relevant keywords>",
      "reason": "<1 sentence explaining what changed and why>"
    }
  ],
  "positioningStatement": "<2-3 sentence cover letter opener positioning the candidate for this specific role, written in first person>",
  "topRecommendations": [
    { "category": "<Keywords|Structure|Impact|Language>", "suggestion": "<specific, actionable recommendation>" },
    { "category": "<Keywords|Structure|Impact|Language>", "suggestion": "<specific, actionable recommendation>" },
    { "category": "<Keywords|Structure|Impact|Language>", "suggestion": "<specific, actionable recommendation>" }
  ]
}

Rules:
- bulletRewrites: pick the 3 most impactful bullets to rewrite from the resume
- Be specific and actionable, not generic
- The positioningStatement should reference the company/role by name if detectable from the JD
- matchScore should be honest, not inflated`;

  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `API error: ${response.status}`);
  }
  const data = await response.json();
  const text = data.content
    .map((b: { type: string; text?: string }) => (b.type === "text" ? b.text : ""))
    .join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as AnalysisResult;
}

// ─── PDF Text Extraction (basic) ─────────────────────────────────────────────

async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // For non-binary files, just return text
      resolve(reader.result as string);
    };
    reader.onerror = () => resolve("");
    reader.readAsText(file);
  });
}

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({
  score,
  label,
  color,
}: {
  score: number;
  label: string;
  color: string;
}) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold font-mono">{score}%</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

// ─── Category Badge ───────────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  Keywords: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Structure: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Impact: "bg-green-500/10 text-green-400 border-green-500/20",
  Language: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CVOptimizer() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"bullets" | "keywords" | "positioning">("bullets");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const text = await extractTextFromFile(file);
    setResumeText(text);
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    try {
      const analysis = await analyzeWithClaude(jobDescription, resumeText);
      setResult(analysis);
      setActiveTab("bullets");
    } catch (err) {
      setError("Analysis failed. Please check your inputs and try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setJobDescription("");
    setResumeText("");
    setFileName(null);
  };

  const canAnalyze = jobDescription.trim().length > 50 && resumeText.trim().length > 50;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-1">
          CV Optimizer
        </h1>
        <p className="text-sm text-muted-foreground">
          Paste a job description and upload your CV — Claude will analyze the
          match and rewrite your bullets for this specific role.
        </p>
      </div>

      {/* Input Section */}
      {!result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* JD Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              1. Paste Job Description
            </label>
            <p className="text-xs text-muted-foreground">
              Copy and paste the full job posting
            </p>
            <textarea
              className="w-full h-64 p-3 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* Resume Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              2. Add Your Resume
            </label>
            <p className="text-xs text-muted-foreground">
              Upload a plain text file (.txt) or paste directly below
            </p>

            {/* Upload Zone */}
            <div
              className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md"
                className="hidden"
                onChange={handleFileUpload}
              />
              {fileName ? (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-primary">
                    ✓ {fileName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Click to replace
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Upload .txt resume
                  </div>
                  <div className="text-xs text-muted-foreground">
                    or paste below
                  </div>
                </div>
              )}
            </div>

            <textarea
              className="w-full h-36 p-3 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Or paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Analyze Button */}
      {!result && (
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className="w-full h-12 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all
            bg-primary text-primary-foreground 
            hover:opacity-90 active:scale-[0.99]
            disabled:opacity-40 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Analyzing with Claude...
            </>
          ) : (
            "Analyze & Optimize →"
          )}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Score Cards */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex gap-10">
                <ScoreRing
                  score={result.matchScore}
                  label="Current Match"
                  color="hsl(var(--muted-foreground))"
                />
                <div className="flex items-center text-2xl text-muted-foreground self-center">
                  →
                </div>
                <ScoreRing
                  score={result.improvedScore}
                  label="After Optimizing"
                  color="hsl(142, 71%, 45%)"
                />
              </div>
              <div className="flex-1 max-w-xs">
                <div className="text-center sm:text-left">
                  <div className="text-3xl font-bold font-mono text-green-500">
                    +{result.improvedScore - result.matchScore}%
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Potential score improvement by applying these recommendations
                  </div>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
              >
                Analyze another CV
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-border">
            {(["bullets", "keywords", "positioning"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "bullets"
                  ? "Bullet Rewrites"
                  : tab === "keywords"
                  ? "Missing Keywords"
                  : "Positioning"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {/* Bullet Rewrites */}
            {activeTab === "bullets" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The 3 highest-impact bullets to rewrite for this specific role:
                </p>
                {result.bulletRewrites.map((item, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-lg p-4 space-y-3"
                  >
                    <div className="space-y-1">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                        Original
                      </div>
                      <div className="text-sm text-muted-foreground line-through decoration-red-500/50">
                        {item.original}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs uppercase tracking-wider text-green-500 font-mono">
                        Improved
                      </div>
                      <div className="text-sm text-foreground font-medium">
                        {item.improved}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground border-t border-border pt-2">
                      💡 {item.reason}
                    </div>
                  </div>
                ))}

                {/* Top Recommendations */}
                <div className="space-y-2 mt-2">
                  <p className="text-sm font-medium text-foreground">
                    Top Recommendations
                  </p>
                  {result.topRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex gap-3 items-start bg-card border border-border rounded-lg p-3"
                    >
                      <span
                        className={`text-xs px-2 py-0.5 rounded border font-mono uppercase tracking-wide shrink-0 ${
                          categoryColors[rec.category] ??
                          "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {rec.category}
                      </span>
                      <span className="text-sm text-foreground">
                        {rec.suggestion}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {activeTab === "keywords" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  These keywords appear in the job description but are absent or
                  underrepresented in your resume:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  Add these naturally into your bullets, skills section, or
                  summary to improve ATS match rate.
                </p>
              </div>
            )}

            {/* Positioning Statement */}
            {activeTab === "positioning" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  A tailored cover letter opener positioning you for this role:
                </p>
                <div className="bg-card border border-border rounded-lg p-5">
                  <div className="border-l-2 border-primary pl-4">
                    <p className="text-sm text-foreground leading-relaxed italic">
                      "{result.positioningStatement}"
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this as your opening paragraph. Customize further with
                  specific details about why this company.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
