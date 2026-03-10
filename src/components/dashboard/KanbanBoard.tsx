
import { useState } from "react"
import {
    DndContext,
    DragOverlay,
    useSensors,
    useSensor,
    PointerSensor,
    type DragStartEvent,
    type DragEndEvent,
    type DragOverEvent,
    closestCorners,
} from "@dnd-kit/core"
import { createPortal } from "react-dom"
import { useJobStore, type JobStatus, type JobApplication } from "../../store/useJobStore"
import { KanbanColumn } from "./KanbanColumn"
import { JobCard } from "./JobCard"

const columns: { id: JobStatus; title: string }[] = [
    { id: "Saved", title: "Saved" },
    { id: "Applied", title: "Applied" },
    { id: "Interviewing", title: "Interviewing" },
    { id: "Offer", title: "Offer" },
    { id: "Rejected", title: "Rejected" },
]

interface KanbanBoardProps {
    applications: JobApplication[]
}

export function KanbanBoard({ applications }: KanbanBoardProps) {
    const { moveApplication } = useJobStore()
    const [activeJob, setActiveJob] = useState<JobApplication | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Job") {
            setActiveJob(event.active.data.current.job)
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return

        // Find the containers
        // This is handled by onDragEnd for simple column moves
    }

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (!over) {
            setActiveJob(null)
            return
        }

        const activeJobId = active.id as string
        const overId = over.id as string

        // If dropped over a column
        const overColumn = columns.find(col => col.id === overId)
        if (overColumn) {
            moveApplication(activeJobId, overColumn.id)
        } else {
            // If dropped over another card, find that card's column?
            // For simplicity, let's assume dropping on column container for now
            // But dnd-kit sortable usually handles reordering.
            // Since we only have one store list, we just update status.

            // If over is a job card, find its status
            const overJob = applications.find(app => app.id === overId)
            if (overJob) {
                moveApplication(activeJobId, overJob.status)
            }
        }

        setActiveJob(null)
    }

    return (
        <div className="h-full flex flex-col">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                <div className="grid grid-cols-5 gap-4 h-full">
                    {columns.map((col) => (
                        <KanbanColumn
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            jobs={applications.filter((job) => job.status === col.id)}
                        />
                    ))}
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeJob && <JobCard job={activeJob} />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    )
}
