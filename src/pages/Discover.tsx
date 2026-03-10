import { QuickAddCard, type MatchedJob } from "../components/discover/QuickAddCard"
import { useJobStore } from "../store/useJobStore"

// Mock matched jobs data
const MATCHED_JOBS: MatchedJob[] = [
    {
        id: "1",
        company: "Stripe",
        role: "Senior Product Manager",
        location: "San Francisco, CA",
        salary: "$180,000 - $220,000",
        matchScore: 95,
        description:
            "Lead product strategy for our payments platform, working with cross-functional teams to deliver innovative solutions for millions of businesses worldwide.",
        requirements: ["5+ years PM experience", "Fintech background", "Data-driven", "Leadership"],
        source: "LinkedIn",
    },
    {
        id: "2",
        company: "Notion",
        role: "Software Engineer - Frontend",
        location: "Remote",
        salary: "$160,000 - $200,000",
        matchScore: 92,
        description:
            "Build delightful user experiences for millions of users. Work on our core editor, collaboration features, and design system.",
        requirements: ["React/TypeScript", "3+ years experience", "Design sense", "Remote-first"],
        source: "Company Website",
    },
    {
        id: "3",
        company: "Figma",
        role: "UX Designer",
        location: "New York, NY",
        salary: "$140,000 - $180,000",
        matchScore: 88,
        description:
            "Design the future of collaborative design tools. Work on features that empower designers and developers to create better products together.",
        requirements: ["Portfolio required", "Figma expert", "Systems thinking", "Prototyping"],
        source: "Indeed",
    },
    {
        id: "4",
        company: "Airbnb",
        role: "Data Scientist",
        location: "Seattle, WA",
        salary: "$150,000 - $190,000",
        matchScore: 85,
        description:
            "Use data to drive product decisions and improve the guest and host experience. Build models and insights that shape our marketplace.",
        requirements: ["Python/R", "ML experience", "SQL", "Communication"],
        source: "Handshake",
    },
    {
        id: "5",
        company: "Shopify",
        role: "Full Stack Engineer",
        location: "Austin, TX",
        salary: "$145,000 - $175,000",
        matchScore: 82,
        description:
            "Build tools that empower entrepreneurs around the world. Work across the stack to deliver features that help merchants grow their businesses.",
        requirements: ["Ruby/Rails", "React", "4+ years", "E-commerce"],
        source: "LinkedIn",
    },
    {
        id: "6",
        company: "Databricks",
        role: "Machine Learning Engineer",
        location: "Remote",
        salary: "$170,000 - $210,000",
        matchScore: 80,
        description:
            "Build ML infrastructure and tools for data teams. Work on cutting-edge problems in distributed computing and machine learning at scale.",
        requirements: ["Python", "Spark", "ML frameworks", "Distributed systems"],
        source: "Company Website",
    },
]

export function Discover() {
    const { addApplication } = useJobStore()

    const handleAddJob = (job: Omit<MatchedJob, "id" | "matchScore" | "description" | "requirements">) => {
        addApplication({
            ...job,
            status: "Saved",
            date: new Date().toISOString().split("T")[0],
        })
    }

    return (
        <div className="flex flex-col h-full p-6 bg-background">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-foreground mb-1">
                    Job Discovery
                </h1>
                <p className="text-sm text-muted-foreground">
                    AI-matched job recommendations based on your profile
                </p>
            </div>

            {/* Job Grid - Core Feature */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
                    {MATCHED_JOBS.map((job) => (
                        <QuickAddCard key={job.id} job={job} onAdd={handleAddJob} />
                    ))}
                </div>
            </div>
        </div>
    )
}
