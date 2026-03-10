import { KanbanBoard } from "../components/dashboard/KanbanBoard"
import { AddApplicationDialog } from "../components/dashboard/AddApplicationDialog"
import { useJobStore } from "../store/useJobStore"

export function Dashboard() {
    const { applications } = useJobStore()

    return (
        <div className="flex flex-col h-full p-6 bg-background">
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground mb-1">
                            Job Application Tracker
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Drag and drop cards to update their status
                        </p>
                    </div>
                    <AddApplicationDialog />
                </div>
            </div>

            {/* Kanban Board - Core Feature */}
            <div className="flex-1 min-h-0 flex flex-col">
                <KanbanBoard applications={applications} />
            </div>
        </div>
    )
}
