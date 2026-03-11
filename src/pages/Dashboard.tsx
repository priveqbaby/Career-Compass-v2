import { useState } from "react"
import { KanbanBoard } from "../components/dashboard/KanbanBoard"
import { AddApplicationDialog } from "../components/dashboard/AddApplicationDialog"
import { InterviewDateModal } from "../components/dashboard/InterviewDateModal"
import { useJobStore, type JobStatus, type JobApplication } from "../store/useJobStore"

interface PendingMove {
  application: JobApplication
  newStatus: "Interviewing" | "Offer"
}

export function Dashboard() {
  const { applications, moveApplication, updateApplication } = useJobStore()
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null)

  // Called by KanbanBoard when a card is dropped into a new column
  const handleStatusChange = (id: string, newStatus: JobStatus) => {
    const application = applications.find((app) => app.id === id)
    if (!application) return

    // If moving to Interviewing or Offer — intercept and show modal
    if (newStatus === "Interviewing" || newStatus === "Offer") {
      // Move the card first so the UI updates immediately
      moveApplication(id, newStatus)
      // Then show the modal to optionally add a date
      setPendingMove({ application, newStatus })
    } else {
      // All other columns (Saved, Applied, Rejected) — just move silently
      moveApplication(id, newStatus)
    }
  }

  const handleModalConfirm = (date: string, time: string) => {
    if (!pendingMove) return
    // Write date + time back to the same application
    updateApplication(pendingMove.application.id, { date, time })
    setPendingMove(null)
  }

  const handleModalSkip = () => {
    // Card already moved — just close the modal
    setPendingMove(null)
  }

  return (
    <div className="flex flex-col h-full p-6 bg-background">
      {/* Header */}
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

      {/* Kanban Board */}
      <div className="flex-1 min-h-0 flex flex-col">
        <KanbanBoard
          applications={applications}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Interview Date Modal */}
      <InterviewDateModal
        isOpen={!!pendingMove}
        companyName={pendingMove?.application.company ?? ""}
        role={pendingMove?.application.role ?? ""}
        status={pendingMove?.newStatus ?? "Interviewing"}
        onConfirm={handleModalConfirm}
        onSkip={handleModalSkip}
      />
    </div>
  )
}
