import { LayoutDashboard, Calendar, BarChart3, MessageSquare, FileText, LogOut } from "lucide-react"
import { cn } from "../../lib/utils"
import type { Page } from "../../App"
import { useAuthStore } from "../../store/useAuthStore"
import { useUserStore } from "../../store/useUserStore"

interface SidebarProps {
    currentPage: Page
    onNavigate: (page: Page) => void
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    const { signOut } = useAuthStore()
    const { profile } = useUserStore()

    return (
        <div className="w-64 border-r border-border bg-card h-full flex flex-col">
            <div className="p-6 flex-1">
                <div className="flex items-center gap-2 mb-8">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                        CC
                    </div>
                    <div>
                        <h2 className="font-semibold text-sm">Career Compass</h2>
                        <p className="text-xs text-muted-foreground">Job Search Hub</p>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground px-2 mb-2">Workspace</p>
                    <NavItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active={currentPage === 'dashboard'}
                        onClick={() => onNavigate('dashboard')}
                    />
                    <NavItem
                        icon={MessageSquare}
                        label="Interview Prep"
                        active={currentPage === 'discover'}
                        onClick={() => onNavigate('discover')}
                    />
                    <NavItem
                        icon={FileText}
                        label="CV Optimizer"
                        active={currentPage === 'cv-optimizer'}
                        onClick={() => onNavigate('cv-optimizer')}
                    />
                    <NavItem
                        icon={Calendar}
                        label="Calendar"
                        active={currentPage === 'calendar'}
                        onClick={() => onNavigate('calendar')}
                    />
                    <NavItem
                        icon={BarChart3}
                        label="Analytics"
                        active={currentPage === 'analytics'}
                        onClick={() => onNavigate('analytics')}
                    />
                </div>
            </div>

            <div className="p-4 border-t border-border mt-auto">
                <div className="flex items-center justify-between">
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{profile.name || 'Account'}</p>
                        <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                    </div>
                    <button
                        onClick={signOut}
                        className="ml-2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors flex-shrink-0"
                        title="Sign out"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

interface NavItemProps {
    icon: React.ElementType
    label: string
    active?: boolean
    onClick: () => void
}

function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md transition-colors",
                active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
        >
            <Icon className="h-4 w-4" />
            {label}
        </button>
    )
}
