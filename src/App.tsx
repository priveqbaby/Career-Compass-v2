import { useState, useEffect } from "react"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { AppShell } from "./components/layout/AppShell"
import { Dashboard } from "./pages/Dashboard"
import { CalendarPage } from "./pages/CalendarPage"
import { Analytics } from "./pages/Analytics"
import InterviewPrep from "./pages/InterviewPrep"
import CVOptimizer from "./pages/CVOptimizer"
import { Onboarding } from "./pages/Onboarding"
import { AuthPage } from "./pages/AuthPage"
import { supabase } from "./lib/supabaseClient"
import { useAuthStore } from "./store/useAuthStore"
import { useUserStore } from "./store/useUserStore"
import { useJobStore } from "./store/useJobStore"

export type Page = 'dashboard' | 'calendar' | 'analytics' | 'discover' | 'cv-optimizer' | 'onboarding'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const { session, loading, setSession, setLoading } = useAuthStore()
  const { profile, loadFromSupabase: loadUser } = useUserStore()
  const { loadFromSupabase: loadJobs } = useJobStore()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session) {
        await loadUser(session.user.id, session.user.email ?? '')
        await loadJobs(session.user.id)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <AuthPage />
  }

  if (!profile.hasCompletedOnboarding) {
    return <Onboarding />
  }

  return (
    <ErrorBoundary>
      <AppShell currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'calendar' && <CalendarPage />}
        {currentPage === 'analytics' && <Analytics />}
        {currentPage === 'discover' && <InterviewPrep />}
        {currentPage === 'cv-optimizer' && <CVOptimizer />}
      </AppShell>
    </ErrorBoundary>
  )
}

export default App
