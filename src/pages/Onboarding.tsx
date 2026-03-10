import { useState } from "react"
import { motion } from "framer-motion"
import { CVUpload } from "../components/onboarding/CVUpload"
import { PreferencesForm } from "../components/onboarding/PreferencesForm"
import { useUserStore } from "../store/useUserStore"
import { CheckCircle2 } from "lucide-react"

interface OnboardingProps {
    onComplete?: () => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
    const { updateProfile, updatePreferences, completeOnboarding } = useUserStore()
    const [step, setStep] = useState(1)
    const [cvFileName, setCvFileName] = useState<string>()

    const handleCVUpload = (fileName: string) => {
        setCvFileName(fileName)
        updateProfile({ cvFileName: fileName })
    }

    const handlePreferencesComplete = (preferences: {
        roles: string[]
        industries: string[]
        locations: string[]
    }) => {
        updatePreferences(preferences)
        completeOnboarding()
        onComplete?.()
    }

    const handleSkip = () => {
        completeOnboarding()
        onComplete?.()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="bg-card rounded-2xl shadow-xl border p-8">
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center gap-2">
                            <div
                                className={`flex items-center justify-center h-10 w-10 rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
                                    }`}
                            >
                                {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
                            </div>
                            <div className={`h-1 w-16 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
                            <div
                                className={`flex items-center justify-center h-10 w-10 rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
                                    }`}
                            >
                                2
                            </div>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            {step === 1 ? "Welcome to Career Compass" : "Set Your Preferences"}
                        </h1>
                        <p className="text-muted-foreground">
                            {step === 1
                                ? "Let's start by uploading your CV or resume"
                                : "Tell us what you're looking for"}
                        </p>
                    </div>

                    {/* Content */}
                    {step === 1 ? (
                        <div className="space-y-6">
                            <CVUpload onFileSelect={handleCVUpload} selectedFile={cvFileName} />
                            <button
                                onClick={() => setStep(2)}
                                disabled={!cvFileName}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed h-11 px-8 rounded-md font-medium transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    ) : (
                        <PreferencesForm onComplete={handlePreferencesComplete} />
                    )}

                    {/* Skip Option */}
                    {step === 1 && (
                        <div className="text-center mt-6">
                            <button
                                onClick={handleSkip}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Skip for now
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
