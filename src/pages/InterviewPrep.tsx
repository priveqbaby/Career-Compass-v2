import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InterviewQuestion {
  question: string;
  whatTheyreReallyTesting: string;
  answerFramework: string;
  redFlags: string;
}

interface PrepResult {
  roleSummary: string;
  questions: InterviewQuestion[];
}

// ─── Claude API ───────────────────────────────────────────────────────────────

async function generateInterviewPrep(jobDescription: string): Promise<PrepResult> {
  const prompt = `You are a senior hiring manager and interview coach. Analyze this job description and generate targeted interview prep material.

JOB DESCRIPTION:
${jobDescription}

Return ONLY valid JSON — no preamble, no markdown fences. Use this exact structure:
{
  "roleSummary": "<1 sentence describing what this role is really about, what success looks like>",
  "questions": [
    {
      "question": "<A likely interview question tailored specifically to this JD>",
      "whatTheyreReallyTesting": "<What skill, trait, or signal the interviewer is actually looking for — be specific>",
      "answerFramework": "<A concrete structure for answering well — not a script, a framework. E.g. 'Lead with the outcome, then walk back to the problem you identified and why others missed it. End with what you'd do differently.'>",
      "redFlags": "<What a weak answer looks like — what to avoid>"
    }
  ]
}

Rules:
- Generate exactly 5 questions
- Questions must be specific to THIS role, not generic HR questions
- Mix question types: 1 behavioural, 1 technical/domain, 1 situational, 1 about motivation/fit, 1 about a challenge or failure
- answerFramework should be 2-3 sentences of genuine coaching advice
- Be direct and honest in redFlags — what actually kills candidates`;

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
    .map((b: { type: string; text?: string }) => b.type === "text" ? b.text : "")
    .join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as PrepResult;
}

// ─── Question Types ───────────────────────────────────────────────────────────

const questionTypes = ["Behavioural", "Domain", "Situational", "Fit", "Challenge"];

const questionTypeColors: Record<string, string> = {
  Behavioural: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Domain: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Situational: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Fit: "bg-green-500/10 text-green-400 border-green-500/20",
  Challenge: "bg-red-500/10 text-red-400 border-red-500/20",
};

// ─── Question Card ────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  index,
  isOpen,
  onToggle,
}: {
  question: InterviewQuestion;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const type = questionTypes[index] ?? "General";

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden transition-all">
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-muted-foreground font-mono text-sm shrink-0">
            Q{index + 1}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded border font-mono uppercase tracking-wide shrink-0 ${questionTypeColors[type]}`}
          >
            {type}
          </span>
          <span className="text-sm font-medium text-foreground truncate">
            {question.question}
          </span>
        </div>
        <span className="text-muted-foreground shrink-0 ml-2 transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
          ↓
        </span>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          {/* Full question */}
          <div>
            <p className="text-base text-foreground font-medium leading-snug">
              "{question.question}"
            </p>
          </div>

          {/* What they're testing */}
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider font-mono text-muted-foreground">
              What they're really testing
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {question.whatTheyreReallyTesting}
            </p>
          </div>

          {/* Answer framework */}
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider font-mono text-green-500">
              How to answer well
            </div>
            <div className="border-l-2 border-green-500/40 pl-3">
              <p className="text-sm text-foreground leading-relaxed">
                {question.answerFramework}
              </p>
            </div>
          </div>

          {/* Red flags */}
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider font-mono text-red-400">
              What kills candidates
            </div>
            <div className="border-l-2 border-red-500/40 pl-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {question.redFlags}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InterviewPrep() {
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PrepResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  const handleGenerate = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 50) return;
    setIsGenerating(true);
    setError(null);
    setResult(null);
    setOpenQuestion(0);
    try {
      const prep = await generateInterviewPrep(jobDescription);
      setResult(prep);
    } catch (err) {
      setError("Something went wrong. Check your input and try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setJobDescription("");
    setOpenQuestion(0);
  };

  const canGenerate = jobDescription.trim().length >= 50;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-1">
          Interview Prep
        </h1>
        <p className="text-sm text-muted-foreground">
          Paste any job description — get 5 role-specific interview questions
          with coaching on what they're really testing and how to answer well.
        </p>
      </div>

      {/* Input */}
      {!result && (
        <div className="space-y-3">
          <textarea
            className="w-full h-56 p-4 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Paste the full job description here — the more detail, the more tailored the questions..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">
              {jobDescription.length < 50
                ? `${50 - jobDescription.length} more characters needed`
                : `${jobDescription.length} characters — ready`}
            </span>
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              className="h-10 px-6 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all
                bg-primary text-primary-foreground
                hover:opacity-90 active:scale-[0.99]
                disabled:opacity-40 disabled:cursor-not-allowed
                flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate Questions →"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Role summary + reset */}
          <div className="bg-card border border-border rounded-lg p-4 flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider font-mono text-muted-foreground mb-1">
                Role Summary
              </div>
              <p className="text-sm text-foreground">{result.roleSummary}</p>
            </div>
            <button
              onClick={handleReset}
              className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors shrink-0"
            >
              New JD
            </button>
          </div>

          {/* Questions */}
          <div className="space-y-2">
            {result.questions.map((q, i) => (
              <QuestionCard
                key={i}
                question={q}
                index={i}
                isOpen={openQuestion === i}
                onToggle={() => setOpenQuestion(openQuestion === i ? null : i)}
              />
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Questions generated based on the specific role and JD — not generic templates.
          </p>
        </div>
      )}
    </div>
  );
}
