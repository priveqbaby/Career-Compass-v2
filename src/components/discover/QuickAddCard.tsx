import { Building2, MapPin, DollarSign, Sparkles } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

export interface MatchedJob {
    id: string
    company: string
    role: string
    location: string
    salary: string
    matchScore: number
    description: string
    requirements: string[]
    source: string
}

interface QuickAddCardProps {
    job: MatchedJob
    onAdd: (job: Omit<MatchedJob, "id" | "matchScore" | "description" | "requirements">) => void
}

export function QuickAddCard({ job, onAdd }: QuickAddCardProps) {
    const handleAdd = () => {
        onAdd({
            company: job.company,
            role: job.role,
            location: job.location,
            salary: job.salary,
            source: job.source,
        })
    }

    return (
        <div className="group relative bg-card border rounded-xl p-6 hover:shadow-lg transition-all">
            {/* Match Score Badge */}
            <div className="absolute top-4 right-4">
                <Badge className="gap-1 bg-gradient-to-r from-primary to-primary/80">
                    <Sparkles className="h-3 w-3" />
                    {job.matchScore}% Match
                </Badge>
            </div>

            {/* Header */}
            <div className="mb-4 pr-24">
                <h3 className="text-xl font-bold mb-1">{job.role}</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{job.company}</span>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

            {/* Requirements */}
            <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Key Requirements:</p>
                <div className="flex flex-wrap gap-1">
                    {job.requirements.slice(0, 3).map((req, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                            {req}
                        </Badge>
                    ))}
                    {job.requirements.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                            +{job.requirements.length - 3} more
                        </Badge>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Button onClick={handleAdd} className="flex-1">
                    Add to Tracker
                </Button>
                <Button variant="outline" className="flex-1">
                    View Details
                </Button>
            </div>
        </div>
    )
}
