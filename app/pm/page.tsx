"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Cpu, Send, FileText, Building2, TrendingUp, Shield, Compass,
    X, Search, Bookmark, Zap, Headphones, Settings, LogOut,
    ChevronDown, ChevronRight, Clock, Users, DollarSign, Target,
    BarChart3, ArrowUpRight, ArrowDownRight, Check, AlertTriangle,
    Sparkles, Copy, ExternalLink, Crown, Eye, Crosshair, Gift,
    Trash2, RotateCcw, MessageSquare, PlayCircle, Command,
    MoreHorizontal,
    Activity,
    Network,
    Mail,
    Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import PMSidebar from "@/app/pm/components/PMSidebar"
import SystemAutonomyWidget from "@/app/pm/components/SystemAutonomyWidget"
import {
    type PMMessage,
    WELCOME_MESSAGE,
    SUGGESTED_PROMPTS,
    DEMO_RUBRICS,
    SENIORITY_CONFIG,
    DEMO_COMPANY,
    getAIResponse,
} from "@/lib/pm-data"
import InterviewPackagePanel from "@/app/pm/panels/InterviewPackagePanel"
import WorkSimPanel from "@/app/pm/panels/WorkSimPanel"
import ProofEnginePanel from "@/app/pm/panels/ProofEnginePanel"
import AnalysisSuitePanel from "@/app/pm/panels/AnalysisSuitePanel"
import PerformanceIntelPanel from "@/app/pm/panels/PerformanceIntelPanel"
import { useNeuralChat } from "@/app/pm/hooks/useNeuralChat"
import { SLASH_COMMANDS } from "@/app/pm/lib/commands"

// ─── Chat Persistence ────────────────────────────────────────────────────────
const STORAGE_KEY = 'forge-pm-chat-history'

function loadSavedMessages(): PMMessage[] {
    if (typeof window === 'undefined') return [WELCOME_MESSAGE]
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (!saved) return [WELCOME_MESSAGE]
        const parsed = JSON.parse(saved) as PMMessage[]
        return parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }))
    } catch {
        return [WELCOME_MESSAGE]
    }
}

function saveMessages(messages: PMMessage[]) {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch { /* storage full */ }
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function PMPage() {
    // Panel State
    const [activePanel, setActivePanel] = useState<string | null>(null)
    const [panelData, setPanelData] = useState<any>(null)

    // Neural Chat Hook
    const {
        messages,
        input,
        setInput,
        isTyping,
        streamingContent,
        sendMessage,
        clearHistory,
    } = useNeuralChat(loadSavedMessages(), setActivePanel)

    // Save messages effect
    useEffect(() => {
        saveMessages(messages)
    }, [messages])

    // Refs
    const chatEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Auto-scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, streamingContent, isTyping])

    // Slash Command Logic
    const showSlashMenu = input.startsWith("/")
    const filteredCommands = SLASH_COMMANDS.filter(cmd =>
        cmd.label.toLowerCase().includes(input.toLowerCase())
    )

    const handleCommandSelect = (cmdKey: string) => {
        const cmd = SLASH_COMMANDS.find(c => c.label === cmdKey)
        if (cmd) {
            cmd.action({ setPanel: setActivePanel, setInput })
            if (!cmdKey.startsWith("/draft")) {
                setInput("")
            }
        }
    }

    return (
        <>
            {/* Main Content Area (Center) - Chat or Panel */}
            <div className="flex-1 flex flex-col min-w-0 relative bg-[#241f18]/5 dark:bg-black/95">
                {/* Global Header - Floating HUD Style */}
                <div className="h-20 flex items-center justify-between px-8 z-10 sticky top-0 bg-transparent">
                    <div className="flex items-center gap-6 p-2 pr-6 rounded-full bg-[#241f18]/[0.03] dark:bg-white/[0.03] backdrop-blur-xl border border-[#ded2c2]/60 dark:border-white/[0.05] shadow-2xl shadow-[#241f18]/10 dark:shadow-black/50">
                        <div className="relative group cursor-pointer">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute inset-0 rounded-full bg-indigo-500/40 blur-md"
                            />
                            <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-[#ded2c2] dark:border-white/10">
                                <Cpu className="w-5 h-5 text-[#241f18] dark:text-white" />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#f7f3ec] dark:bg-[#050505] flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold tracking-wide text-[#241f18] dark:text-white uppercase font-sans">Neural Command</h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-indigo-300/80 font-mono tracking-wider uppercase">System Online</span>
                                <span className="w-1 h-1 rounded-full bg-[#241f18]/20 dark:bg-white/20" />
                                <span className="text-[10px] text-[#241f18]/45 dark:text-white/40 font-mono tracking-wider uppercase">v2.4.0</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {messages.length > 1 && (
                            <button onClick={clearHistory} className="group flex items-center gap-2 px-4 py-2 rounded-full bg-[#241f18]/[0.02] dark:bg-white/[0.02] border border-[#ded2c2]/60 dark:border-white/[0.05] hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300">
                                <Trash2 className="w-3.5 h-3.5 text-[#241f18]/45 dark:text-white/40 group-hover:text-red-400 transition-colors" />
                                <span className="text-[10px] font-medium text-[#241f18]/45 dark:text-white/40 group-hover:text-red-400 uppercase tracking-widest transition-colors">Reset</span>
                            </button>
                        )}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[10px] font-bold text-indigo-300 tracking-wider font-mono">GPT-4o NOETIC</span>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 flex overflow-hidden relative">
                    {/* Background Ambient Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full mix-blend-screen opacity-50" />
                        <div className="absolute bottom-[-10%] right-[30%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full mix-blend-screen opacity-40" />
                        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-cyan-600/5 blur-[100px] rounded-full mix-blend-screen opacity-30" />
                    </div>

                    {/* Chat Interface */}
                    <AnimatePresence mode="wait">
                        {!activePanel ? (
                            <motion.div
                                key="chat"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                className="flex-1 flex flex-col max-w-5xl mx-auto w-full z-0 h-full"
                            >
                                <div className="flex-1 overflow-y-auto px-8 py-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                    <div className="space-y-12 pb-12">
                                        {messages.map((msg, idx) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                                className={cn("flex gap-6 group relative", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                                            >
                                                {/* Line Connector (Decorative) */}
                                                {msg.role === "ai" && idx !== messages.length - 1 && (
                                                    <div className="absolute left-[27px] top-[40px] bottom-[-48px] w-px bg-gradient-to-b from-[#241f18]/10 dark:from-white/10 to-transparent opacity-50" />
                                                )}

                                                {/* Avatar */}
                                                <div className="shrink-0 mt-1 z-10">
                                                    {msg.role === "ai" ? (
                                                        <div className="w-14 h-14 rounded-2xl bg-[#fffaf2] dark:bg-[#0A0A0A] border border-[#ded2c2] dark:border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:border-indigo-500/30 transition-colors duration-500">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                            <Cpu className="w-6 h-6 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-[#241f18]/5 dark:bg-white/5 border border-[#ded2c2] dark:border-white/10 flex items-center justify-center shadow-lg">
                                                            <span className="text-xs font-bold text-[#241f18]/80 dark:text-white/80 font-mono">YO</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Message Content */}
                                                <div className={cn(
                                                    "relative max-w-[85%] text-[15px] leading-relaxed",
                                                    msg.role === "user" ? "text-right" : "text-left"
                                                )}>
                                                    {msg.role === "user" ? (
                                                        <div className="inline-block bg-[#241f18]/[0.08] dark:bg-white/[0.08] backdrop-blur-md rounded-2xl rounded-tr-sm px-6 py-4 border border-[#ded2c2] dark:border-white/10 shadow-lg text-[#241f18] dark:text-white">
                                                            <MessageContent content={msg.content} />
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4 pt-2">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className="text-sm font-bold text-indigo-300 font-sans tracking-wide">NEURAL CORE</span>
                                                                <span className="text-[10px] text-[#241f18]/45 dark:text-white/20 font-mono uppercase">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                            <div className="text-[#241f18]/90 dark:text-white/90 font-light tracking-wide font-sans">
                                                                <MessageContent content={msg.content} />
                                                            </div>

                                                            {/* AI Actions Toolbar */}
                                                            {idx === messages.length - 1 && !isTyping && !streamingContent && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className="flex items-center gap-2 mt-4 pt-4 border-t border-[#ded2c2]/60 dark:border-white/5"
                                                                >
                                                                    <ActionButton icon={Copy} label="Copy" />
                                                                    <ActionButton icon={RotateCcw} label="Regenerate" />
                                                                    <div className="w-px h-4 bg-[#241f18]/10 dark:bg-white/10 mx-2" />
                                                                    <span className="text-[10px] text-[#241f18]/45 dark:text-white/30 font-mono">Tokens: {Math.floor(Math.random() * 500) + 120}</span>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}

                                        {/* Streaming Ghost Message */}
                                        {streamingContent && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-[#fffaf2] dark:bg-[#0A0A0A] border border-[#ded2c2] dark:border-white/10 flex items-center justify-center shrink-0 shadow-2xl overflow-hidden">
                                                    <div className="absolute inset-0 bg-indigo-500/5 animate-pulse" />
                                                    <Cpu className="w-6 h-6 text-indigo-400" />
                                                </div>
                                                <div className="space-y-4 pt-2 w-full max-w-[85%]">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-sm font-bold text-indigo-300 font-sans tracking-wide">NEURAL CORE</span>
                                                        <span className="text-[10px] text-indigo-400/80 font-mono uppercase animate-pulse">GENERATING RESPONSE...</span>
                                                    </div>
                                                    <div className="text-[#241f18]/90 dark:text-white/90 font-light tracking-wide font-sans">
                                                        <MessageContent content={streamingContent} />
                                                        <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {isTyping && !streamingContent && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-[#fffaf2] dark:bg-[#0A0A0A] border border-[#ded2c2] dark:border-white/10 flex items-center justify-center shrink-0 shadow-2xl overflow-hidden">
                                                    <div className="absolute inset-0 bg-indigo-500/5 animate-pulse" />
                                                    <Cpu className="w-6 h-6 text-indigo-400/50" />
                                                </div>
                                                <div className="pt-4 flex items-center gap-3">
                                                    <span className="text-xs font-mono text-indigo-400 animate-pulse">ANALYZING INPUT...</span>
                                                    <div className="flex gap-1">
                                                        {[0, 1, 2].map(i => (
                                                            <motion.div key={i}
                                                                animate={{ height: [4, 12, 4], opacity: [0.5, 1, 0.5] }}
                                                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                                                                className="w-1 bg-indigo-500 rounded-full"
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                        <div ref={chatEndRef} />
                                    </div>
                                </div>

                                {/* Floating Input Area with Slash Commands */}
                                <div className="px-8 pb-8 pt-4 relative z-20">
                                    <div className="relative max-w-4xl mx-auto group">

                                        {/* Slash Command Menu */}
                                        <AnimatePresence>
                                            {showSlashMenu && filteredCommands.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute bottom-full mb-4 left-0 w-64 bg-[#fffaf2]/95 dark:bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#ded2c2] dark:border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
                                                >
                                                    <div className="p-2 border-b border-[#ded2c2]/60 dark:border-white/5 text-[10px] font-mono text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest">
                                                        Neural Commands
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto p-1">
                                                        {filteredCommands.map((cmd) => (
                                                            <button
                                                                key={cmd.id}
                                                                onClick={() => handleCommandSelect(cmd.label)}
                                                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#241f18]/5 dark:hover:bg-white/5 flex items-center gap-3 group transition-colors"
                                                            >
                                                                <div className={`p-1.5 rounded-md bg-[#241f18]/5 dark:bg-white/5 ${cmd.color.replace('text-', 'text-opacity-80 text-')} group-hover:bg-[#241f18]/10 dark:group-hover:bg-white/10 transition-colors`}>
                                                                    <cmd.icon className={`w-4 h-4 ${cmd.color}`} />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-bold text-[#241f18] dark:text-white group-hover:text-indigo-300 font-mono transition-colors">{cmd.label}</div>
                                                                    <div className="text-[10px] text-[#241f18]/45 dark:text-white/40">{cmd.description}</div>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] opacity-20 group-focus-within:opacity-50 blur-xl transition-opacity duration-500" />
                                        <div className="relative flex items-center gap-4 bg-[#f7f3ec]/90 dark:bg-[#050505]/90 backdrop-blur-xl border border-[#ded2c2] dark:border-white/10 rounded-[1.5rem] px-5 py-3 shadow-2xl transition-all duration-300 group-focus-within:border-indigo-500/30">
                                            <div className="p-2.5 rounded-xl bg-[#241f18]/5 dark:bg-white/5 border border-[#ded2c2]/60 dark:border-white/5 text-[#241f18]/45 dark:text-white/40 group-focus-within:text-indigo-400 group-focus-within:bg-indigo-500/10 transition-all cursor-pointer">
                                                <Command className="w-5 h-5" />
                                            </div>
                                            <input
                                                ref={inputRef}
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                                placeholder="Type '/' for commands or ask a question..."
                                                className="flex-1 bg-transparent text-lg font-light text-[#241f18] dark:text-white placeholder:text-[#241f18]/45 dark:placeholder:text-white/20 outline-none caret-indigo-400 font-sans h-10"
                                                disabled={isTyping}
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => sendMessage()}
                                                disabled={!input.trim() || isTyping}
                                                className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center hover:bg-indigo-400 hover:text-[#241f18] dark:hover:text-white transition-all duration-300 disabled:opacity-0 disabled:scale-75 shadow-[0_0_18px_rgba(36,31,24,0.10)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]"
                                            >
                                                <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-center mt-4 flex items-center justify-center gap-6">
                                        <div className="flex items-center gap-1.5 opacity-30">
                                            <Shield className="w-3 h-3" />
                                            <span className="text-[10px] font-mono tracking-widest uppercase">Secure Env</span>
                                        </div>
                                        <p className="text-[10px] text-[#241f18]/45 dark:text-white/20 font-mono">Neural Model v2.4 initialized. Outputs verified.</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="panel"
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                className="flex-1 flex flex-col h-full bg-[#fffaf2]/50 dark:bg-[#080808]/50 backdrop-blur-xl border-l border-[#ded2c2] dark:border-white/[0.08]"
                            >
                                <div className="h-full overflow-y-auto">
                                    {/* Panel Renderer */}
                                    {activePanel === "rubric" && <RubricPanel dataKey={panelData} onClose={() => setActivePanel(null)} />}
                                    {activePanel === "company" && <CompanyPanel onClose={() => setActivePanel(null)} />}
                                    {activePanel === "market" && <MarketPanel dataKey={panelData} onClose={() => setActivePanel(null)} />}
                                    {activePanel === "bias" && <BiasPanel onClose={() => setActivePanel(null)} />}
                                    {activePanel === "strategy" && <StrategyPanel onClose={() => setActivePanel(null)} />}
                                    {activePanel === "poach" && <PoachPanel onClose={() => setActivePanel(null)} />}
                                    {activePanel === "interview-pkg" && <InterviewPackagePanel onClose={() => setActivePanel(null)} />}
                                    {activePanel === "work-sim" && <WorkSimPanel onClose={() => setActivePanel(null)} />}
                                    {activePanel === "proof-engine" && <ProofEnginePanel onClose={() => setActivePanel(null)} />}
                                    {activePanel === "analysis" && <AnalysisSuitePanel onClose={() => setActivePanel(null)} />}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Neural Context Holographic Rail */}
            <div className="w-[380px] bg-[#fffaf2] dark:bg-[#020202] border-l border-[#ded2c2] dark:border-white/[0.08] flex flex-col shrink-0 z-30 shadow-[0_0_40px_rgba(36,31,24,0.12)] dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

                <div className="h-20 flex items-center justify-between px-6 border-b border-[#ded2c2] dark:border-white/[0.08] bg-[#241f18]/5 dark:bg-black/40 backdrop-blur-sm">
                    <h2 className="text-xs font-bold text-[#241f18]/80 dark:text-white/80 uppercase tracking-[0.2em] flex items-center gap-3 font-mono">
                        <Activity className="w-3.5 h-3.5 text-indigo-500" />
                        Context Stream
                    </h2>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/30" />
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/10" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-none relative">
                    {/* Active Candidate Widget - Holographic Card */}
                    <div className="space-y-4">
                        <SectionLabel>Active Focus</SectionLabel>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="p-5 rounded-2xl bg-gradient-to-b from-[#241f18]/[0.04] dark:from-white/[0.04] to-transparent border border-[#ded2c2] dark:border-white/[0.08] relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-indigo-900/20"
                        >
                            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute top-0 right-0 p-3 opacity-50">
                                <Activity className="w-4 h-4 text-indigo-400" />
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                    <span className="text-lg font-bold text-indigo-300">AR</span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-[#241f18] dark:text-white mb-0.5 font-sans">Alex Rivero</h3>
                                    <p className="text-xs text-indigo-300/80 font-mono">Senior Backend Engineer</p>
                                </div>
                            </div>

                            <div className="space-y-3 bg-[#241f18]/5 dark:bg-black/40 rounded-xl p-3 border border-[#ded2c2]/60 dark:border-white/5">
                                <div className="flex justify-between text-[10px] text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest font-mono">
                                    <span>Match Compatibility</span>
                                    <span className="text-indigo-400 font-bold">88%</span>
                                </div>
                                <div className="h-1.5 bg-[#241f18]/5 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[88%] bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Company Brain */}
                    <div className="space-y-4">
                        <SectionLabel>Knowledge Graph</SectionLabel>
                        <Link href="/pm/brain">
                            <div className="p-4 rounded-2xl bg-[#241f18]/[0.02] dark:bg-white/[0.02] border border-[#ded2c2]/60 dark:border-white/[0.06] flex items-center justify-between group cursor-pointer hover:bg-emerald-500/[0.05] hover:border-emerald-500/20 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                                        <Network className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-[#241f18]/90 dark:text-white/90 font-sans group-hover:text-emerald-300 transition-colors">Main Knowledge</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-[10px] text-emerald-400/80 font-mono tracking-wide">LIVE SYNC</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Autonomy Widget */}
                    <div className="space-y-4">
                        <SectionLabel>Autonomy Agents</SectionLabel>
                        <div className="transform hover:scale-[1.02] transition-transform duration-300">
                            <SystemAutonomyWidget />
                        </div>
                    </div>
                </div>

                {/* Decorative Footer */}
                <div className="p-4 border-t border-[#ded2c2]/60 dark:border-white/5 bg-[#241f18]/5 dark:bg-black/60 backdrop-blur text-center">
                    <p className="text-[9px] text-[#241f18]/45 dark:text-white/20 font-mono tracking-[0.2em] uppercase">Forged in Intelligence</p>
                </div>
            </div>
        </>
    )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return <p className="text-[10px] text-[#241f18]/45 dark:text-white/20 font-bold uppercase tracking-[0.15em] pl-1 font-mono mb-2">{children}</p>
}

function ActionButton({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241f18]/5 dark:bg-white/5 hover:bg-[#241f18]/10 dark:hover:bg-white/10 text-xs text-[#241f18]/60 dark:text-white/60 hover:text-[#241f18] dark:hover:text-white transition-colors">
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
        </button>
    )
}

// ─── Message Content Renderer ──────────────────────────────────────────────
function MessageContent({ content }: { content: string }) {
    const lines = content.split("\n")
    return (
        <div className="space-y-3 font-sans">
            {lines.map((line, i) => {
                if (!line.trim()) return <div key={i} className="h-2" />
                // Headers
                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-[#241f18] dark:text-white mt-4 mb-2 tracking-tight">{line.replace('# ', '')}</h1>
                if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-indigo-200 mt-4 mb-2 tracking-wide">{line.replace('## ', '')}</h2>

                // Bold
                const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#241f18] dark:text-white font-bold">$1</strong>')

                // Bullet
                if (line.trim().startsWith("•") || line.trim().startsWith("- ")) {
                    return (
                        <div key={i} className="flex gap-3 pl-1 group hover:translate-x-1 transition-transform duration-300">
                            <span className="text-indigo-500 mt-1.5">•</span>
                            <div dangerouslySetInnerHTML={{ __html: formatted.replace(/^[•-]\s*/, '') }} className="text-[#241f18]/80 dark:text-white/80 leading-relaxed font-light" />
                        </div>
                    )
                }
                return <div key={i} dangerouslySetInnerHTML={{ __html: formatted }} className="text-[#241f18]/80 dark:text-white/80 leading-relaxed font-light" />
            })}
        </div>
    )
}

// ─── Shared Components for Panels ─────────────────────────────────────────────
function PanelHeader({ title, subtitle, icon: Icon, color, onClose }: {
    title: string; subtitle: string; icon: React.ElementType; color: string; onClose: () => void
}) {
    return (
        <div className="flex items-center justify-between p-6 border-b border-[#ded2c2] dark:border-white/[0.04] sticky top-0 bg-[#fffaf2]/90 dark:bg-[#080808]/90 backdrop-blur z-20">
            <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg", color.replace('text-', 'shadow-').replace('400', '500/20'))}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-base font-semibold text-[#241f18]/90 dark:text-white/90">{title}</h2>
                    <p className="text-[10px] text-[#241f18]/45 dark:text-white/40 uppercase tracking-wider font-medium">{subtitle}</p>
                </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-[#241f18]/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors group">
                <X className="w-4 h-4 text-[#241f18]/45 dark:text-white/30 group-hover:text-[#241f18]/60 dark:group-hover:text-white/60" />
            </button>
        </div>
    )
}


// ═══════════════════════════════════════════════════════════════════════════════
// PANEL: RUBRIC
// ═══════════════════════════════════════════════════════════════════════════════
function RubricPanel({ dataKey, onClose }: { dataKey: string; onClose: () => void }) {
    const rubric = DEMO_RUBRICS[dataKey] || DEMO_RUBRICS["senior-react"]
    const seniorityConf = SENIORITY_CONFIG[rubric.seniority]

    return (
        <div className="bg-[#fffaf2] dark:bg-[#0A0A0A] min-h-full">
            <PanelHeader title="Role-to-Rubric Engine" subtitle="Structured Hiring Criteria" icon={FileText} color="bg-violet-500/20 text-violet-400" onClose={onClose} />

            <div className="p-8 space-y-8">
                {/* Role Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-light tracking-tight">{rubric.roleTitle}</h3>
                    <span className={cn("text-xs px-3 py-1.5 rounded-full border font-medium tracking-wide", seniorityConf.color)}>
                        {seniorityConf.label} · {seniorityConf.years}
                    </span>
                </div>

                {/* Skills Grid */}
                <div>
                    <div className="text-[10px] text-[#241f18]/45 dark:text-white/30 font-bold uppercase tracking-widest mb-4">Skills & Weights</div>
                    <div className="space-y-3">
                        {rubric.skills.map((skill) => (
                            <div key={skill.name} className="flex items-center gap-4 p-4 rounded-2xl bg-[#241f18]/[0.02] dark:bg-white/[0.02] border border-[#ded2c2] dark:border-white/[0.04] hover:bg-[#241f18]/[0.04] dark:hover:bg-white/[0.04] hover:border-[#ded2c2] dark:hover:border-white/[0.08] transition-all group">
                                <div className="w-12 text-right font-mono text-sm font-bold text-[#241f18]/90 dark:text-white/90 group-hover:text-violet-400 transition-colors">{skill.weight}%</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-[#241f18]/90 dark:text-white/90">{skill.name}</span>
                                    </div>
                                    <div className="h-1 bg-[#241f18]/5 dark:bg-white/5 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-violet-500/50" style={{ width: `${skill.weight * 3}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function CompanyPanel({ onClose }: { onClose: () => void }) {
    return (
        <div className="bg-[#fffaf2] dark:bg-[#0A0A0A] min-h-full">
            <PanelHeader title="Company Intelligence" subtitle="Organization Graph" icon={Building2} color="bg-blue-500/20 text-blue-400" onClose={onClose} />
            <div className="p-8">
                <div className="p-6 rounded-2xl bg-[#241f18]/[0.02] dark:bg-white/[0.02] border border-[#ded2c2] dark:border-white/[0.04]">
                    <h3 className="text-lg font-bold text-[#241f18] dark:text-white mb-2">{DEMO_COMPANY.name}</h3>
                    <p className="text-[#241f18]/60 dark:text-white/60 mb-6">{DEMO_COMPANY.mission}</p>
                    <div className="grid grid-cols-2 gap-4">
                        {DEMO_COMPANY.values.map(v => (
                            <div key={v} className="px-4 py-2 rounded-lg bg-[#241f18]/5 dark:bg-white/5 text-sm text-[#241f18]/80 dark:text-white/80">{v}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function MarketPanel({ dataKey, onClose }: { dataKey: string; onClose: () => void }) {
    // Mock data for market
    return (
        <div className="bg-[#fffaf2] dark:bg-[#0A0A0A] min-h-full">
            <PanelHeader title="Market Intelligence" subtitle="Real-time Compensation Data" icon={TrendingUp} color="bg-emerald-500/20 text-emerald-400" onClose={onClose} />
            <div className="p-8">
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 mb-6">
                    <h3 className="text-xl font-bold text-emerald-400 mb-1">$165k - $195k</h3>
                    <p className="text-sm text-emerald-400/60 uppercase tracking-wider">Target Range</p>
                </div>
            </div>
        </div>
    )
}

function BiasPanel({ onClose }: { onClose: () => void }) {
    return (
        <div className="bg-[#fffaf2] dark:bg-[#0A0A0A] min-h-full">
            <PanelHeader title="Bias Detection" subtitle="Fairness Analysis" icon={Shield} color="bg-rose-500/20 text-rose-400" onClose={onClose} />
            <div className="p-8">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-3">
                    <Check className="w-5 h-5" />
                    <span className="font-bold">No critical bias detected in current session.</span>
                </div>
            </div>
        </div>
    )
}

function StrategyPanel({ onClose }: { onClose: () => void }) {
    return (
        <div className="bg-[#fffaf2] dark:bg-[#0A0A0A] min-h-full">
            <PanelHeader title="Strategic Alignment" subtitle="Hiring Goals" icon={Compass} color="bg-amber-500/20 text-amber-400" onClose={onClose} />
        </div>
    )
}

function PoachPanel({ onClose }: { onClose: () => void }) {
    return (
        <div className="bg-[#fffaf2] dark:bg-[#0A0A0A] min-h-full">
            <PanelHeader title="Talent Sourcing" subtitle="Target Companies" icon={Target} color="bg-cyan-500/20 text-cyan-400" onClose={onClose} />
        </div>
    )
}
