import React from "react"
import type { Metadata } from "next"
import PMSidebar from "@/app/pm/components/PMSidebar"

export const metadata: Metadata = {
    title: "Ingen — Talent Search",
    description: "Search verified technical talent with Ingen.",
}

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-screen flex overflow-hidden bg-[#f7f3ec] text-[#241f18] font-sans dark:bg-[#050505] dark:text-white">
            <PMSidebar />
            {children}
        </div>
    )
}
