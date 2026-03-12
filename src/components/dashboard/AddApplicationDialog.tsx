import { useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useJobStore, type JobStatus } from "../../store/useJobStore"

interface AddApplicationDialogProps {
    initialStatus?: JobStatus
    open?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: React.ReactNode
}

const emptyForm = () => ({
    company: "",
    role: "",
    location: "",
    salary: "",
    source: "",
    date: new Date().toISOString().split('T')[0],
    time: "",
})

export function AddApplicationDialog({ initialStatus = "Saved", open: controlledOpen, onOpenChange: setControlledOpen, trigger }: AddApplicationDialogProps) {
    const { addApplication } = useJobStore()
    const [internalOpen, setInternalOpen] = useState(false)

    const open = controlledOpen !== undefined ? controlledOpen : internalOpen
    const setOpen = setControlledOpen || setInternalOpen

    const [formData, setFormData] = useState(emptyForm)

    const [urlInput, setUrlInput] = useState("")
    const [urlLoading, setUrlLoading] = useState(false)
    const [urlError, setUrlError] = useState<string | null>(null)
    const [urlSuccess, setUrlSuccess] = useState(false)

    const handleAutofill = async () => {
        if (!urlInput.trim()) return
        setUrlLoading(true)
        setUrlError(null)
        setUrlSuccess(false)
        try {
            const response = await fetch("/api/scrape", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: urlInput.trim() }),
            })
            const data = await response.json()
            if (!response.ok) {
                setUrlError(data.error || "Failed to extract job details")
                return
            }
            setFormData(prev => ({
                ...prev,
                company: data.company || prev.company,
                role: data.role || prev.role,
                location: data.location || prev.location,
                salary: data.salary || prev.salary,
                source: data.source || prev.source,
            }))
            setUrlSuccess(true)
        } catch {
            setUrlError("Network error — check your connection and try again.")
        } finally {
            setUrlLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        addApplication({
            ...formData,
            status: initialStatus,
        })
        setOpen(false)
        setFormData(emptyForm)
        setUrlInput("")
        setUrlError(null)
        setUrlSuccess(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ?? <Button><Plus className="mr-2 h-4 w-4" /> New Application</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Application</DialogTitle>
                    <DialogDescription>
                        Add a new job application to your tracker.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Paste job URL to auto-fill..."
                                value={urlInput}
                                onChange={e => {
                                    setUrlInput(e.target.value)
                                    setUrlError(null)
                                    setUrlSuccess(false)
                                }}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAutofill}
                                disabled={urlLoading || !urlInput.trim()}
                            >
                                {urlLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Auto-fill"
                                )}
                            </Button>
                        </div>
                        {urlError && (
                            <p className="text-sm text-destructive">{urlError}</p>
                        )}
                        {urlSuccess && (
                            <p className="text-sm text-green-600">Fields filled from job posting</p>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="company" className="text-right">
                                Company
                            </Label>
                            <Input
                                id="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="col-span-3"
                                required
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
                                required
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
                                placeholder="$100k - $120k"
                            />
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
                                placeholder="LinkedIn, Referral, etc."
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
                                value={formData.time}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Application</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
