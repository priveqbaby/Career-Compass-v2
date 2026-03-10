// Mock AI CV Analysis Logic (Demo Only)

export interface AnalysisResult {
    originalScore: number
    optimizedScore: number
    missingKeywords: string[]
    suggestions: Suggestion[]
    optimizedText: string
}

export interface Suggestion {
    category: string
    issue: string
    recommendation: string
    impact: 'high' | 'medium' | 'low'
}

export function analyzeCVMatch(jobDescription: string, cvText: string): AnalysisResult {
    // Extract keywords from job description (simplified)
    const jobKeywords = extractKeywords(jobDescription)
    const cvKeywords = extractKeywords(cvText)

    // Calculate match score
    const matchedKeywords = jobKeywords.filter(keyword =>
        cvKeywords.some(cvKeyword => cvKeyword.toLowerCase().includes(keyword.toLowerCase()))
    )

    const originalScore = Math.min(95, Math.round((matchedKeywords.length / jobKeywords.length) * 100))

    // Find missing keywords
    const missingKeywords = jobKeywords.filter(keyword =>
        !cvKeywords.some(cvKeyword => cvKeyword.toLowerCase().includes(keyword.toLowerCase()))
    ).slice(0, 8)

    // Generate suggestions
    const suggestions = generateSuggestions(jobDescription, cvText, missingKeywords)

    // Generate optimized CV text
    const optimizedText = generateOptimizedCV(cvText, missingKeywords, suggestions)

    // Calculate improved score (add 15-25 points)
    const optimizedScore = Math.min(98, originalScore + 15 + Math.floor(Math.random() * 10))

    return {
        originalScore,
        optimizedScore,
        missingKeywords,
        suggestions,
        optimizedText
    }
}

function extractKeywords(text: string): string[] {
    // Simple keyword extraction (in real app, use NLP)
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how'])

    const words = text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.has(word))

    // Get unique words and sort by frequency
    const wordFreq = new Map<string, number>()
    words.forEach(word => {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
    })

    return Array.from(wordFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([word]) => word)
}

function generateSuggestions(_jobDescription: string, cvText: string, missingKeywords: string[]): Suggestion[] {
    const suggestions: Suggestion[] = []

    // Keyword suggestions
    if (missingKeywords.length > 0) {
        suggestions.push({
            category: 'Keywords',
            issue: `Missing ${missingKeywords.length} key terms from job description`,
            recommendation: `Add these keywords naturally: ${missingKeywords.slice(0, 5).join(', ')}`,
            impact: 'high'
        })
    }

    // Skills section
    if (!cvText.toLowerCase().includes('skills')) {
        suggestions.push({
            category: 'Structure',
            issue: 'No dedicated skills section found',
            recommendation: 'Add a "Skills" section highlighting technical and soft skills',
            impact: 'high'
        })
    }

    // Quantifiable achievements
    const hasNumbers = /\d+%|\d+\+|\$\d+/.test(cvText)
    if (!hasNumbers) {
        suggestions.push({
            category: 'Impact',
            issue: 'Lack of quantifiable achievements',
            recommendation: 'Add metrics and numbers to demonstrate impact (e.g., "Increased efficiency by 30%")',
            impact: 'medium'
        })
    }

    // Action verbs
    const weakVerbs = ['responsible for', 'worked on', 'helped with']
    const hasWeakVerbs = weakVerbs.some(verb => cvText.toLowerCase().includes(verb))
    if (hasWeakVerbs) {
        suggestions.push({
            category: 'Language',
            issue: 'Using passive language',
            recommendation: 'Replace weak verbs with strong action verbs (Led, Developed, Implemented, Achieved)',
            impact: 'medium'
        })
    }

    // Length check
    if (cvText.length < 500) {
        suggestions.push({
            category: 'Content',
            issue: 'CV appears too brief',
            recommendation: 'Expand on your experiences and achievements to provide more context',
            impact: 'low'
        })
    }

    return suggestions
}

function generateOptimizedCV(originalCV: string, missingKeywords: string[], _suggestions: Suggestion[]): string {
    let optimized = originalCV

    // Add a note about optimizations
    const optimizationNote = `\n\n[OPTIMIZED VERSION]\n\n`

    // Add skills section if missing
    if (!originalCV.toLowerCase().includes('skills')) {
        const skillsSection = `\n\nSKILLS\n${missingKeywords.slice(0, 6).join(' • ')}\n`
        optimized += skillsSection
    }

    // Add keywords naturally in a summary
    const keywordSummary = `\n\nPROFESSIONAL SUMMARY\nExperienced professional with expertise in ${missingKeywords.slice(0, 4).join(', ')}. Proven track record of delivering results and driving innovation.\n`

    return optimizationNote + keywordSummary + optimized
}
