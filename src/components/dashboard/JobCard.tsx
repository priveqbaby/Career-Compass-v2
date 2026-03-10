import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Calendar, MapPin, Building2, ExternalLink, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import type { JobApplication } from "../../store/useJobStore"
import { JobDetailsDialog } from "./JobDetailsDialog"

interface JobCardProps {
    job: JobApplication
}

export function JobCard({ job }: JobCardProps) {
    const [showDetails, setShowDetails] = useState(false)
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: job.id, data: { type: "Job", job } })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-50"
            >
                <Card className="h-[200px] border-dashed border-2 bg-muted/50" />
            </div>
        )
    }

    return (
        <>
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
                    <CardHeader className="p-4 pb-2 space-y-2">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold leading-tight">
                                        {job.role}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                                        {job.company}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-3">
                        <div className="space-y-1.5">
                            <div className="flex items-center text-xs text-muted-foreground gap-2">
                                <MapPin className="h-3.5 w-3.5" />
                                {job.location}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground gap-2">
                                <Calendar className="h-3.5 w-3.5" />
                                {job.date}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground gap-2">
                                <DollarSign className="h-3.5 w-3.5" />
                                {job.salary}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <Badge variant="secondary" className="text-[10px] font-normal">
                                {job.source}
                            </Badge>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation() // Prevent drag start
                                    setShowDetails(true)
                                }}
                                onPointerDown={(e) => e.stopPropagation()} // Prevent drag start on pointer down
                            >
                                <ExternalLink className="h-3 w-3" />
                                View
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <JobDetailsDialog job={job} open={showDetails} onOpenChange={setShowDetails} />
        </>
    )
}
