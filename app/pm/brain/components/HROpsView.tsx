import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Shield, AlertTriangle, FileText, Send,
    CheckCircle, MessageSquare, Scale,
    AlertCircle, FileWarning, Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { HR_POLICIES, COMPLIANCE_RISKS } from "@/lib/hr-policy-data"
import { cn } from "@/lib/utils"

export default function HROpsView() {
    const [query, setQuery] = useState("")
    const [messages, setMessages] = useState<{ role: "user" | "agent", content: string }[]>([
        { role: "agent", content: "I am the HR Policy Agent. Ask me about termination protocols, remote work compliance, or harassment reporting." }
    ])
    const [isTyping, setIsTyping] = useState(false)

    const handleAsk = async () => {
        if (!query.trim()) return

        const userMsg = query
        setMessages(prev => [...prev, { role: "user", content: userMsg }])
        setQuery("")
        setIsTyping(true)

        // Mock AI Response
        setTimeout(() => {
            let response = "I can help with that. Please verify the specific policy document."
            if (userMsg.toLowerCase().includes("remote")) {
                response = "According to the **Remote Work Policy**, employees can work from the US, Canada (BC, ON, QC), UK, and Australia. For other locations, a PEO is required. Warning: Stays > 183 days trigger tax residency."
            } else if (userMsg.toLowerCase().includes("pip") || userMsg.toLowerCase().includes("performance")) {
                response = "Key PIP Requirements: 1. Duration must be 30-60 days. 2. Goals must be SMART. 3. Legal review is mandatory for protected classes over 40. Do you want to draft a PIP notice?"
            } else if (userMsg.toLowerCase().includes("termination") || userMsg.toLowerCase().includes("fire")) {
                response = "⚠️ **Compliance Warning**: Termination requires documented cause or specific redundancy selection criteria. Have you consulted the 'Termination Playbook'?"
            }

            setMessages(prev => [...prev, { role: "agent", content: response }])
            setIsTyping(false)
        }, 1200)
    }

    return (
        <div className="h-[500px] grid grid-cols-12 gap-6 animate-in fade-in duration-500">

            {/* Left: Policy Agent Chat */}
            <div className="col-span-7 flex flex-col bg-[#241f18]/[0.02] dark:bg-white/[0.02] border border-[#ded2c2] dark:border-white/10 rounded-3xl overflow-hidden relative">
                {/* Header */}
                <div className="p-4 border-b border-[#ded2c2]/60 dark:border-white/5 bg-[#241f18]/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Scale className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-[#241f18] dark:text-white">HR Policy Agent</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] text-[#241f18]/45 dark:text-white/40 uppercase tracking-wider">Online · RAG Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={cn(
                            "flex gap-3 max-w-[90%]",
                            msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                        )}>
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                msg.role === "user" ? "bg-[#241f18]/10 dark:bg-white/10" : "bg-amber-500/10"
                            )}>
                                {msg.role === "user" ? <div className="text-xs">You</div> : <Scale className="w-4 h-4 text-amber-400" />}
                            </div>
                            <div className={cn(
                                "p-3 rounded-2xl text-sm leading-relaxed",
                                msg.role === "user" ? "bg-[#241f18]/10 dark:bg-white/10 text-[#241f18] dark:text-white rounded-tr-sm" : "bg-[#241f18]/[0.05] dark:bg-white/[0.05] text-[#241f18]/80 dark:text-white/80 rounded-tl-sm border border-[#ded2c2]/60 dark:border-white/5"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                                <Scale className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="p-3 bg-[#241f18]/[0.05] dark:bg-white/[0.05] rounded-2xl rounded-tl-sm border border-[#ded2c2]/60 dark:border-white/5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-[#241f18]/40 dark:bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-[#241f18]/40 dark:bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-[#241f18]/40 dark:bg-white/40 rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-[#ded2c2]/60 dark:border-white/5 bg-[#241f18]/[0.02] dark:bg-white/[0.02]">
                    <div className="relative">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                            placeholder="Ask about compliance or policies..."
                            className="w-full bg-[#241f18]/5 dark:bg-black/40 border border-[#ded2c2] dark:border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-[#241f18] dark:text-white placeholder:text-[#241f18]/45 dark:placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 transition-colors"
                        />
                        <button
                            onClick={handleAsk}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#241f18]/10 dark:bg-white/10 hover:bg-emerald-500 hover:text-[#241f18] dark:hover:text-white text-[#241f18]/45 dark:text-white/40 transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Risk Dashboard & Actions */}
            <div className="col-span-5 flex flex-col gap-6">

                {/* Risk Panel */}
                <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <h3 className="text-sm font-semibold text-red-700 dark:text-red-100">Compliance Risks</h3>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold uppercase">
                            {COMPLIANCE_RISKS.filter(r => r.status !== 'Resolved').length} Active
                        </span>
                    </div>

                    <div className="space-y-3">
                        {COMPLIANCE_RISKS.map((risk) => (
                            <div key={risk.id} className="p-3 rounded-xl bg-[#241f18]/5 dark:bg-black/40 border border-red-500/10 flex gap-3 group hover:border-red-500/30 transition-colors">
                                <div className="mt-1">
                                    {risk.severity === 'Critical' ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <FileWarning className="w-4 h-4 text-orange-400" />}
                                </div>
                                <div>
                                    <p className="text-xs text-[#241f18]/90 dark:text-white/90 font-medium leading-snug">{risk.description}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[10px] text-[#241f18]/45 dark:text-white/30">{risk.timestamp}</span>
                                        <span className="text-[10px] px-1.5 rounded bg-[#241f18]/5 dark:bg-white/5 text-[#241f18]/45 dark:text-white/40 uppercase">{risk.category}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex-1 bg-[#241f18]/[0.02] dark:bg-white/[0.02] border border-[#ded2c2] dark:border-white/10 rounded-3xl p-5">
                    <h3 className="text-xs font-bold text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest mb-4">Ops Toolkit</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 bg-[#241f18]/5 dark:bg-white/5 border-[#ded2c2]/60 dark:border-white/5 hover:bg-[#241f18]/10 dark:hover:bg-white/10 hover:border-emerald-500/30">
                            <FileText className="w-5 h-5 text-emerald-400" />
                            <span className="text-xs font-medium text-[#241f18]/80 dark:text-white/80">Draft PIP</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 bg-[#241f18]/5 dark:bg-white/5 border-[#ded2c2]/60 dark:border-white/5 hover:bg-[#241f18]/10 dark:hover:bg-white/10 hover:border-purple-500/30">
                            <Search className="w-5 h-5 text-purple-400" />
                            <span className="text-xs font-medium text-[#241f18]/80 dark:text-white/80">Comp Review</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 bg-[#241f18]/5 dark:bg-white/5 border-[#ded2c2]/60 dark:border-white/5 hover:bg-[#241f18]/10 dark:hover:bg-white/10 hover:border-blue-500/30">
                            <MessageSquare className="w-5 h-5 text-blue-400" />
                            <span className="text-xs font-medium text-[#241f18]/80 dark:text-white/80">Dispute Log</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 bg-[#241f18]/5 dark:bg-white/5 border-[#ded2c2]/60 dark:border-white/5 hover:bg-[#241f18]/10 dark:hover:bg-white/10 hover:border-amber-500/30">
                            <Shield className="w-5 h-5 text-amber-400" />
                            <span className="text-xs font-medium text-[#241f18]/80 dark:text-white/80">Audit Trail</span>
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
