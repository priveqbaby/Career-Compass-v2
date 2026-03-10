import { useState } from "react"
import { Upload, FileText } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

interface CVUploadProps {
    onFileSelect: (fileName: string) => void
    selectedFile?: string
}

export function CVUpload({ onFileSelect, selectedFile }: CVUploadProps) {
    const [isDragging, setIsDragging] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            onFileSelect(file.name)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) {
            onFileSelect(file.name)
        }
    }

    return (
        <div className="space-y-4">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "border-2 border-dashed rounded-xl p-12 text-center transition-all",
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                    selectedFile && "bg-primary/5 border-primary"
                )}
            >
                {selectedFile ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium">{selectedFile}</p>
                            <p className="text-sm text-muted-foreground mt-1">File uploaded successfully</p>
                        </div>
                        <label htmlFor="cv-upload">
                            <Button variant="outline" size="sm" asChild>
                                <span>Change File</span>
                            </Button>
                        </label>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-medium">Upload your CV or Resume</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Drag and drop or click to browse
                            </p>
                        </div>
                        <label htmlFor="cv-upload">
                            <Button asChild>
                                <span>Choose File</span>
                            </Button>
                        </label>
                    </div>
                )}
                <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
            <p className="text-xs text-muted-foreground text-center">
                Supported formats: PDF, DOC, DOCX (Max 5MB)
            </p>
        </div>
    )
}
