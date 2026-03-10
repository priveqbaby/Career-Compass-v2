import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useJobStore, type JobApplication } from "../../store/useJobStore"
import { Trash2, Edit, Building2, MapPin, DollarSign, Calendar as CalendarIcon, Clock, Tag } from "lucide-react"
import { format, parseISO } from "date-fns"

interface JobDetailsDialogProps {
    job: JobApplication
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function JobDetailsDialog({ job, open, onOpenChange }: JobDetailsDialogProps) {
    const { updateApplication, deleteApplication } = useJobStore()
    const [formData, setFormData] = useState(job)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        setFormData(job)
        setIsEditing(false) // Reset to view mode when job changes
    }, [job])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateApplication(job.id, formData)
        setIsEditing(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this application?")) {
            deleteApplication(job.id)
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => {
            onOpenChange(open)
            if (!open) setIsEditing(false)
        }}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Application" : job.company}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Make changes to your application here." : job.role}
                    </DialogDescription>
                </DialogHeader>

                {!isEditing ? (
                    // Details View
                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Building2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Company</p>
                                        <p className="font-medium truncate">{job.company}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Location</p>
                                        <p className="font-medium truncate">{job.location || "Not specified"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Tag className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Status</p>
                                        <p className="font-medium">{job.status}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Salary</p>
                                        <p className="font-medium truncate">{job.salary || "Not specified"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <CalendarIcon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Date</p>
                                        <p className="font-medium">{format(parseISO(job.date), "MMM d, yyyy")}</p>
                                    </div>
                                </div>

                                {job.time && (
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Clock className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">Time</p>
                                            <p className="font-medium">{job.time}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {job.source && (
                            <div className="pt-4 border-t">
                                <p className="text-xs text-muted-foreground mb-1">Source</p>
                                <p className="text-sm">{job.source}</p>
                            </div>
                        )}

                        <div className="flex gap-2 pt-2">
                            <Button onClick={() => setIsEditing(true)} className="flex-1">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Details
                            </Button>
                            <Button variant="destructive" size="icon" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Edit Form
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="company" className="text-right">
                                    Company
                                </Label>
                                <Input
                                    id="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">
                                    Role
                                </Label>
                                <Input
                                    id="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="location" className="text-right">
                                    Location
                                </Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="salary" className="text-right">
                                    Salary
                                </Label>
                                <Input
                                    id="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                    Status
                                </Label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="Saved">Saved</option>
                                    <option value="Applied">Applied</option>
                                    <option value="Interviewing">Interviewing</option>
                                    <option value="Offer">Offer</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="source" className="text-right">
                                    Source
                                </Label>
                                <Input
                                    id="source"
                                    value={formData.source}
                                    onChange={handleChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">
                                    Date
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="time" className="text-right">
                                    Time
                                </Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={formData.time || ''}
                                    onChange={handleChange}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
