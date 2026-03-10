import { useState } from "react"
import { AppShell } from "./components/layout/AppShell"
import { Dashboard } from "./pages/Dashboard"
import { CalendarPage } from "./pages/CalendarPage"
import { Analytics } from "./pages/Analytics"
import { Discover } from "./pages/Discover"
import { CVOptimizer } from "./pages/CVOptimizer"

export type Page = 'dashboard' | 'calendar' | 'analytics' | 'discover' | 'cv-optimizer'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  return (
    <AppShell currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'calendar' && <CalendarPage />}
      {currentPage === 'analytics' && <Analytics />}
      {currentPage === 'discover' && <Discover />}
      {currentPage === 'cv-optimizer' && <CVOptimizer />}
    </AppShell>
  )
}

export default App

