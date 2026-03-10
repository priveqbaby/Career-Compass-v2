import { useState } from "react"
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    parseISO,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"
import { useJobStore, type JobApplication } from "../../store/useJobStore"
import { JobDetailsDialog } from "../dashboard/JobDetailsDialog"
import {
    DndContext,
    useDraggable,
    useDroppable,
    DragOverlay,
    type DragEndEvent,
    useSensors,
    useSensor,
    PointerSensor,
} from "@dnd-kit/core"
import { createPortal } from "react-dom"

function DraggableEvent({ job, onClick }: { job: JobApplication; onClick: (e: React.MouseEvent) => void }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: job.id,
        data: { job },
    })

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
    } : undefined

    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style} className="opacity-50">
                <div className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded truncate border border-primary/20">
                    {job.company}
                </div>
            </div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={onClick}
            className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded truncate border border-primary/20 hover:bg-primary/20 cursor-grab active:cursor-grabbing"
        >
            {job.company}
        </div>
    )
}

function DroppableDay({ date, children, isCurrentMonth, isToday, isSelected, onClick }: { date: Date; children: React.ReactNode; isCurrentMonth: boolean; isToday: boolean; isSelected: boolean; onClick: () => void }) {
    const { setNodeRef, isOver } = useDroppable({
        id: date.toISOString(),
        data: { date },
    })

    return (
        <div
            ref={setNodeRef}
            onClick={onClick}
            className={cn(
                "min-h-[120px] p-2 border-b border-r transition-colors cursor-pointer hover:bg-muted/20",
                !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                isToday && "bg-primary/5",
                isSelected && "bg-primary/10 ring-2 ring-inset ring-primary",
                isOver && "bg-primary/20 ring-2 ring-inset ring-primary/40"
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <span
                    className={cn(
                        "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                        isToday && "bg-primary text-primary-foreground",
                        isSelected && !isToday && "bg-primary/20 text-primary"
                    )}
                >
                    {format(date, "d")}
                </span>
            </div>
            <div className="space-y-1">{children}</div>
        </div>
    )
}

export function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())

    const { applications, updateApplication } = useJobStore()
    const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [activeDragJob, setActiveDragJob] = useState<JobApplication | null>(null)

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    })

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    const handleDragStart = (event: any) => {
        setActiveDragJob(event.active.data.current?.job)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const job = active.data.current?.job as JobApplication
            const newDate = over.data.current?.date as Date

            if (job && newDate) {
                updateApplication(job.id, {
                    date: format(newDate, 'yyyy-MM-dd')
                })
            }
        }
        setActiveDragJob(null)
    }

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const goToToday = () => {
        const today = new Date()
        setCurrentDate(today)
        setSelectedDate(today)
    }

    return (
        <div className="flex h-full bg-card rounded-xl border shadow-sm overflow-hidden">
            {/* Main Calendar Area - Core Feature */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">
                        {format(currentDate, "MMMM yyyy")}
                    </h2>
                    <div className="flex items-center rounded-md border bg-background shadow-sm">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={prevMonth}
                            className="h-8 w-8 rounded-none rounded-l-md border-r"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={goToToday}
                            className="h-8 px-3 rounded-none text-xs font-medium"
                        >
                            Today
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={nextMonth}
                            className="h-8 w-8 rounded-none rounded-r-md border-l"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-7 border-b bg-muted/40">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div
                            key={day}
                            className="p-3 text-xs font-medium text-muted-foreground text-center border-r last:border-r-0"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto">
                    <DndContext
                        sensors={sensors}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="grid grid-cols-7 auto-rows-fr min-h-[600px]">
                            {days.map((day) => {
                                const dayJobs = applications.filter((app) =>
                                    isSameDay(parseISO(app.date), day)
                                )

                                return (
                                    <DroppableDay
                                        key={day.toISOString()}
                                        date={day}
                                        isCurrentMonth={isSameMonth(day, monthStart)}
                                        isToday={isSameDay(day, new Date())}
                                        isSelected={isSameDay(day, selectedDate)}
                                        onClick={() => setSelectedDate(day)}
                                    >
                                        {dayJobs.map((job) => (
                                            <DraggableEvent
                                                key={job.id}
                                                job={job}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setSelectedJob(job)
                                                    setDialogOpen(true)
                                                }}
                                            />
                                        ))}
                                    </DroppableDay>
                                )
                            })}
                        </div>
                        {createPortal(
                            <DragOverlay>
                                {activeDragJob ? (
                                    <div className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded truncate border border-primary/20 shadow-lg">
                                        {activeDragJob.company}
                                    </div>
                                ) : null}
                            </DragOverlay>,
                            document.body
                        )}
                    </DndContext>
                </div>
            </div>

            {selectedJob && (
                <JobDetailsDialog
                    job={selectedJob}
                    open={dialogOpen}
                    onOpenChange={(open) => {
                        setDialogOpen(open)
                        if (!open) {
                            setSelectedJob(null)
                        }
                    }}
                />
            )}
        </div>
    )
}
