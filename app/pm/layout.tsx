import React from "react"
import PMSidebar from "@/app/pm/components/PMSidebar"

export default function PMLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-screen flex bg-[#f7f3ec] dark:bg-[#050505] text-[#241f18] dark:text-white overflow-hidden font-sans [--pm-chart-grid:rgba(36,31,24,0.10)] [--pm-chart-axis:rgba(36,31,24,0.58)] [--pm-chart-muted:rgba(36,31,24,0.42)] [--pm-chart-cursor:rgba(36,31,24,0.05)] [--pm-tooltip-bg:rgba(255,250,242,0.96)] [--pm-tooltip-border:#ded2c2] [--pm-tooltip-text:#241f18] dark:[--pm-chart-grid:rgba(255,255,255,0.06)] dark:[--pm-chart-axis:rgba(255,255,255,0.45)] dark:[--pm-chart-muted:rgba(255,255,255,0.28)] dark:[--pm-chart-cursor:rgba(255,255,255,0.05)] dark:[--pm-tooltip-bg:rgba(0,0,0,0.80)] dark:[--pm-tooltip-border:rgba(255,255,255,0.10)] dark:[--pm-tooltip-text:#ffffff]">
            <PMSidebar />
            {children}
        </div>
    )
}
