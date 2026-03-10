import { CalendarView } from "../components/calendar/CalendarView"

export function CalendarPage() {
    return (
        <div className="flex flex-col h-full p-6 bg-background">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-foreground mb-1">
                    Interview Calendar
                </h1>
                <p className="text-sm text-muted-foreground">
                    Schedule and track your interviews and important dates
                </p>
            </div>

            <div className="flex-1 min-h-0">
                <CalendarView />
            </div>
        </div>
    )
}
