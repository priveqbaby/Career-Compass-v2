import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import type { JobApplication, JobStatus } from "../../store/useJobStore"
import { JobCard } from "./JobCard"
import { Badge } from "../ui/badge"
import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { AddApplicationDialog } from "./AddApplicationDialog"

interface KanbanColumnProps {
    id: JobStatus
    title: string
    jobs: JobApplication[]
}

export function KanbanColumn({ id, title, jobs }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
    })

    return (
        <div className="flex flex-col h-full min-w-0 flex-1 bg-secondary/10 rounded-xl p-2">
            <div className="flex items-center justify-between p-3 mb-2">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-foreground">{title}</h3>
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary">
                        {jobs.length}
                    </Badge>
                </div>
                <AddApplicationDialog
                    initialStatus={id}
                    trigger={
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                            <Plus className="h-4 w-4" />
                        </Button>
                    }
                />
            </div>

            <div ref={setNodeRef} className="flex-1 flex flex-col gap-3 overflow-y-auto p-1">
                <SortableContext items={jobs.map((job) => job.id)} strategy={verticalListSortingStrategy}>
                    {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </SortableContext>
                {jobs.length === 0 && (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-muted rounded-lg m-2">
                        <p className="text-xs text-muted-foreground">Drop here</p>
                    </div>
                )}
            </div>
        </div>
    )
}
