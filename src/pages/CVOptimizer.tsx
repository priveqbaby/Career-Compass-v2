import { useState } from "react"
import { FileText, TrendingUp } from "lucide-react"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { analyzeCVMatch, type AnalysisResult } from "../lib/cvAnalyzer"
import { Badge } from "../components/ui/badge"

export function CVOptimizer() {
    const [jobDescription, setJobDescription] = useState("")
    const [cvFile, setCvFile] = useState<File | null>(null)
    const [cvText, setCvText] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<AnalysisResult | null>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setCvFile(file)
            // In a real app, we'd parse the PDF/DOC. For demo, use sample text
            setCvText(`John Doe
Software Engineer

EXPERIENCE
Senior Developer at Tech Corp
- Developed web applications using React and Node.js
- Collaborated with cross-functional teams
- Improved system performance

EDUCATION
Bachelor of Science in Computer Science
University of Technology`)
        }
    }

    const handleAnalyze = () => {
        if (!jobDescription || !cvText) return

        setIsAnalyzing(true)
        // Simulate API call delay
        setTimeout(() => {
            const analysis = analyzeCVMatch(jobDescription, cvText)
            setResult(analysis)
            setIsAnalyzing(false)
        }, 1500)
    }

    const handleReset = () => {
        setJobDescription("")
        setCvFile(null)
        setCvText("")
        setResult(null)
    }

    return (
        <div className="flex flex-col h-full p-6 bg-background">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-foreground mb-1">
                    CV Optimizer
                </h1>
                <p className="text-sm text-muted-foreground">
                    Get AI-powered suggestions to improve your resume for specific job postings
                </p>
            </div>

            <div className="flex-1 overflow-y-auto">
                {!result ? (
                    // Input Section
                    <div className="grid grid-cols-2 gap-6 max-w-6xl">
                        {/* Job Description */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="job-description" className="text-base font-semibold">
                                    1. Paste Job Description
                                </Label>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Copy and paste the job posting you're applying for
                                </p>
                                <Textarea
                                    id="job-description"
                                    placeholder="Paste the full job description here..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    className="min-h-[300px] resize-none"
                                />
                            </div>
                        </div>

                        {/* CV Upload */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="cv-upload" className="text-base font-semibold">
                                    2. Upload Your CV
                                </Label>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Upload your current resume (PDF, DOC, DOCX)
                                </p>
                                <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary transition-colors">
                                    {cvFile ? (
                                        <div className="space-y-3">
                                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                                <FileText className="h-8 w-8 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{cvFile.name}</p>
                                                <p className="text-sm text-muted-foreground">Ready to analyze</p>
                                            </div>
                                            <label htmlFor="cv-upload">
                                                <Button variant="outline" size="sm" asChild>
                                                    <span>Change File</span>
                                                </Button>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                                                <FileText className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Upload your CV</p>
                                                <p className="text-sm text-muted-foreground">PDF, DOC, or DOCX</p>
                                            </div>
                                            <label htmlFor="cv-upload">
                                                <Button asChild>
                                                    <span>Choose File</span>
                                                </Button>
                                            </label>
                                        </div>
                                    )}
                                    <input
                                        id="cv-upload"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleAnalyze}
                                disabled={!jobDescription || !cvFile || isAnalyzing}
                                className="w-full"
                                size="lg"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                        Analyzing...
                                    </>
                                ) : (
                                    "Analyze & Optimize"
                                )}
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Results Section - Core Features Only
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {/* Score Comparison - Core Value */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card border rounded-xl p-6">
                                <p className="text-sm text-muted-foreground mb-2">Current Match Score</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-bold">{result.originalScore}%</p>
                                    <Badge variant="secondary">Before</Badge>
                                </div>
                                <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-orange-500 transition-all"
                                        style={{ width: `${result.originalScore}%` }}
                                    />
                                </div>
                            </div>

                            <div className="bg-card border rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-2 right-2">
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">Potential Match Score</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-bold text-green-600">{result.optimizedScore}%</p>
                                    <Badge className="bg-green-500">
                                        +{result.optimizedScore - result.originalScore}%
                                    </Badge>
                                </div>
                                <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all"
                                        style={{ width: `${result.optimizedScore}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Top 3 Suggestions Only */}
                        <div className="bg-card border rounded-xl p-6">
                            <h3 className="font-semibold mb-4">Top Recommendations</h3>
                            <div className="space-y-3">
                                {result.suggestions.slice(0, 3).map((suggestion, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${suggestion.impact === 'high' ? 'bg-red-500/10 text-red-500' :
                                            suggestion.impact === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium">{suggestion.category}</p>
                                                <Badge variant="outline" className="text-xs">
                                                    {suggestion.impact} impact
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">{suggestion.issue}</p>
                                            <p className="text-sm">{suggestion.recommendation}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button onClick={handleReset} variant="outline" className="flex-1">
                                Analyze Another CV
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
