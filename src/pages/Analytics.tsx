import { AnalyticsCharts } from "../components/analytics/AnalyticsCharts"

export function Analytics() {
    return (
        <div className="flex flex-col h-full p-6 bg-background overflow-y-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-foreground mb-1">
                    Analytics & Insights
                </h1>
                <p className="text-sm text-muted-foreground">
                    Track your job search performance and trends
                </p>
            </div>

            <AnalyticsCharts />
        </div>
    )
}
