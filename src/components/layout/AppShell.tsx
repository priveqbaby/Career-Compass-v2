
import { Sidebar } from "./Sidebar"
import type { Page } from "../../App"

interface AppShellProps {
  children: React.ReactNode
  currentPage: Page
  onNavigate: (page: Page) => void
}

export function AppShell({ children, currentPage, onNavigate }: AppShellProps) {
  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

