import { useState } from "react"

interface InterviewDateModalProps {
  isOpen: boolean
  companyName: string
  role: string
  status: "Interviewing" | "Offer"
  onConfirm: (date: string, time: string) => void
  onSkip: () => void
}

export function InterviewDateModal({
  isOpen,
  companyName,
  role,
  status,
  onConfirm,
  onSkip,
}: InterviewDateModalProps) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")

  if (!isOpen) return null

  const isInterviewing = status === "Interviewing"
  const title = isInterviewing
    ? "Add interview to calendar?"
    : "Add decision deadline?"
  const description = isInterviewing
    ? `When is your interview with ${companyName}?`
    : `When do you need to decide on the ${companyName} offer?`
  const confirmLabel = isInterviewing ? "Add to Calendar" : "Add Deadline"

  const handleConfirm = () => {
    if (!date) return
    onConfirm(date, time)
    setDate("")
    setTime("")
  }

  const handleSkip = () => {
    setDate("")
    setTime("")
    onSkip()
  }

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 z-10">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">
              {isInterviewing ? "🗓️" : "⏰"}
            </span>
            <h2 className="text-base font-semibold text-foreground">
              {title}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            {role}
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3 mb-6">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Date <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-border bg-muted/30 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Time <span className="text-muted-foreground/50">(optional)</span>
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-border bg-muted/30 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleSkip}
            className="flex-1 h-9 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleConfirm}
            disabled={!date}
            className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
