"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Send, Sparkles, Bot, User,
    FileText, CheckCircle2, AlertOctagon,
    Clock, Globe, Users, Zap, Layout,
    Cpu, ArrowRight, Save, Share2,
    Code, Terminal, Activity, Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { generateArchitectBlueprint, InterviewBlueprint } from "@/lib/architect-data"

type Message = {
    id: string
    role: "user" | "ai"
    content: string
}

export default function SandboxArchitectView() {
    const router = useRouter()
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", role: "ai", content: "Architect System Online. Initialize blueprint parameters by describing the target role." }
    ])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [blueprint, setBlueprint] = useState<InterviewBlueprint | null>(null)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isTyping])

    const handleSend = async (customInput?: string) => {
        const text = typeof customInput === 'string' ? customInput : input
        if (!text.trim()) return

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: text }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsTyping(true)

        // Dynamic AI Logic
        setTimeout(() => {
            const generated = generateArchitectBlueprint(text)
            setBlueprint(generated)

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: `Blueprint generated for ${generated.seniority} ${generated.role}. Analyzing ${generated.constraints.focus} requirements...`
            }

            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
        }, 1200)
    }

    const handleExport = () => {
        if (!blueprint) return
        const template = {
            id: `custom-${Date.now()}`,
            role: blueprint.role,
            title: `Architect: ${blueprint.role}`,
            difficulty: blueprint.seniority,
            duration: blueprint.constraints.time,
            skills: blueprint.rubric.map(r => r.category),
            description: `${blueprint.summary}\n\nTasks:\n${blueprint.tasks.map((t, i) => `${i + 1}. ${t.title}: ${t.description}`).join('\n')}`
        }
        localStorage.setItem("worksim_draft_template", JSON.stringify(template))
        router.push("/pm/worksim")
    }

    return (
        <div className="flex h-full bg-[#fffaf2] dark:bg-[#030303] font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* ─── Left: Neural Chat Interface ────────────────────────────────────────── */}
            <div className="w-[420px] flex flex-col border-r border-[#ded2c2]/60 dark:border-white/[0.06] bg-[#f7f3ec] dark:bg-[#050505] relative z-20">
                {/* Header */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-[#ded2c2]/60 dark:border-white/[0.06] bg-[#f7f3ec]/80 dark:bg-[#050505]/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                                <Cpu className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#f7f3ec] dark:bg-[#050505] flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-[#241f18] dark:text-white tracking-widest uppercase font-mono">Architect</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-indigo-400/60 font-mono">NEURAL ENGINE V4.0</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={cn("flex gap-4 max-w-full", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                        >
                            {/* Avatar */}
                            <div className="shrink-0 mt-1">
                                {msg.role === "ai" ? (
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                                        <Cpu className="w-4 h-4 text-indigo-400" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-[#241f18]/5 dark:bg-white/5 border border-[#ded2c2] dark:border-white/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-[#241f18]/55 dark:text-white/50" />
                                    </div>
                                )}
                            </div>

                            {/* Bubble */}
                            <div className={cn(
                                "relative p-4 rounded-xl text-sm leading-relaxed max-w-[85%]",
                                msg.role === "user"
                                    ? "bg-[#241f18]/5 dark:bg-white/5 text-[#241f18]/90 dark:text-white/90 border border-[#ded2c2] dark:border-white/10 rounded-tr-sm"
                                    : "text-indigo-100/80 font-light tracking-wide rounded-tl-sm"
                            )}>
                                {msg.role === "ai" && idx === messages.length - 1 && (
                                    <div className="absolute -left-1 top-4 w-0.5 h-full bg-gradient-to-b from-indigo-500/50 to-transparent" />
                                )}
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                <Cpu className="w-4 h-4 text-indigo-400/50" />
                            </div>
                            <div className="flex items-center gap-1.5 pt-3 pl-1">
                                <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce duration-1000" />
                                <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce duration-1000 delay-100" />
                                <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce duration-1000 delay-200" />
                            </div>
                        </motion.div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 pt-2 bg-gradient-to-t from-[#f7f3ec] dark:from-[#050505] to-transparent">
                    {blueprint && !isTyping && (
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                            <ActionChip onClick={() => handleSend(`Make the ${blueprint.role} interview significantly harder`)} label="Increase Difficulty" color="red" />
                            <ActionChip onClick={() => handleSend(`Switch ${blueprint.role} to Async Mode`)} label="Async Mode" color="blue" />
                            <ActionChip onClick={() => handleSend(`Add a system design nuance`)} label="Add Nuance" color="purple" />
                        </div>
                    )}

                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-20 group-focus-within:opacity-50 transition-opacity duration-300" />
                        <div className="relative flex items-center bg-[#fffaf2] dark:bg-[#0A0A0A] border border-[#ded2c2] dark:border-white/10 rounded-xl shadow-xl">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Describe the role to architect..."
                                className="flex-1 bg-transparent px-4 py-3.5 text-sm text-[#241f18] dark:text-white placeholder:text-[#241f18]/45 dark:placeholder:text-white/20 focus:outline-none"
                                disabled={isTyping}
                                autoFocus
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isTyping}
                                className="p-2 mr-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 disabled:opacity-0 transition-all"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="text-center mt-3">
                        <p className="text-[9px] text-[#241f18]/45 dark:text-white/10 font-mono uppercase tracking-[0.2em]">Secure Construction Runtime</p>
                    </div>
                </div>
            </div>

            {/* ─── Right: Holographic Blueprint Preview ────────────────────────────── */}
            <div className="flex-1 bg-[#fffaf2] dark:bg-[#020202] relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(36,31,24,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(36,31,24,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

                {!blueprint ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#241f18]/45 dark:text-white/20 relative z-10">
                        <div className="w-24 h-24 rounded-full bg-[#241f18]/[0.02] dark:bg-white/[0.02] border border-[#ded2c2]/60 dark:border-white/5 flex items-center justify-center mb-6 animate-pulse">
                            <Layers className="w-10 h-10 opacity-30" />
                        </div>
                        <p className="text-base font-medium tracking-wide font-mono text-[#241f18]/45 dark:text-white/40">AWAITING SPECIFICATION</p>
                        <p className="text-xs mt-2 text-[#241f18]/45 dark:text-white/20">System idle. Ready to fabricate.</p>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col relative z-10 animate-in fade-in slide-in-from-right-8 duration-700">
                        {/* Blueprint Toolbar */}
                        <div className="h-16 flex items-center justify-between px-8 border-b border-[#ded2c2]/60 dark:border-white/[0.06] bg-[#fffaf2]/80 dark:bg-[#030303]/80 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">
                                    Generated Blueprint
                                </div>
                                <div className="h-4 w-px bg-[#241f18]/10 dark:bg-white/10" />
                                <div className="text-xs text-[#241f18]/45 dark:text-white/40 font-mono">ID: {Date.now().toString().slice(-6)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="ghost" className="h-8 text-xs text-[#241f18]/60 dark:text-white/60 hover:text-[#241f18] dark:hover:text-white hover:bg-[#241f18]/5 dark:hover:bg-white/5">
                                    <Save className="w-3.5 h-3.5 mr-2" /> Save Draft
                                </Button>
                                <Button size="sm" onClick={handleExport} className="h-8 bg-indigo-600 hover:bg-indigo-500 text-[#241f18] dark:text-white border border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                                    <Terminal className="w-3.5 h-3.5 mr-2" /> Deploy to WorkSim
                                </Button>
                            </div>
                        </div>

                        {/* Content Scroll */}
                        <div className="flex-1 overflow-y-auto p-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            <div className="max-w-4xl mx-auto space-y-8">

                                {/* Header Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                    className="p-8 rounded-3xl bg-gradient-to-br from-[#241f18]/[0.03] dark:from-white/[0.03] to-transparent border border-[#ded2c2]/60 dark:border-white/[0.06] relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <FileText className="w-32 h-32" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-sm text-indigo-400 font-mono mb-2 uppercase tracking-widest">Target Configuration</div>
                                                <h1 className="text-4xl font-light text-[#241f18] dark:text-white tracking-tight mb-4">{blueprint.role}</h1>
                                                <div className="flex items-center gap-3">
                                                    <Badge icon={SignalHigh} label={blueprint.seniority} color="emerald" />
                                                    <Badge icon={Clock} label={blueprint.constraints.time} color="blue" />
                                                    <Badge icon={Globe} label={blueprint.constraints.mode} color="purple" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-8 border-t border-[#ded2c2]/60 dark:border-white/5">
                                            <div className="text-xs text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest font-mono mb-2">Executive Summary</div>
                                            <p className="text-base text-[#241f18]/80 dark:text-white/80 font-light leading-relaxed max-w-2xl">{blueprint.summary}</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Task Flow Timeline */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <Activity className="w-4 h-4 text-indigo-400" />
                                        <h3 className="text-sm font-bold text-[#241f18] dark:text-white uppercase tracking-widest font-mono">Simulation Timeline</h3>
                                    </div>

                                    <div className="relative space-y-4">
                                        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-indigo-500/20 via-indigo-500/20 to-transparent" />

                                        {blueprint.tasks.map((task, i) => (
                                            <div key={i} className="relative pl-12 group">
                                                {/* Node */}
                                                <div className={cn(
                                                    "absolute left-0 top-1 w-10 h-10 rounded-xl border flex items-center justify-center bg-[#f7f3ec] dark:bg-[#050505] z-10 transition-colors duration-300",
                                                    task.type === 'chaos' ? "border-amber-500/30 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]" :
                                                        task.type === 'stretch' ? "border-purple-500/30 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]" :
                                                            "border-emerald-500/30 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                                                )}>
                                                    <span className="font-mono font-bold text-sm">{i + 1}</span>
                                                </div>

                                                {/* Card */}
                                                <div className="p-5 rounded-2xl bg-[#241f18]/[0.02] dark:bg-white/[0.02] border border-[#ded2c2] dark:border-white/[0.04] hover:bg-[#241f18]/[0.04] dark:hover:bg-white/[0.04] hover:border-[#ded2c2] dark:hover:border-white/[0.08] transition-all">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="text-base font-semibold text-[#241f18]/90 dark:text-white/90">{task.title}</h4>
                                                        <span className="text-xs text-[#241f18]/45 dark:text-white/30 font-mono">{task.duration}</span>
                                                    </div>
                                                    <div className="flex gap-2 mb-3">
                                                        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ml-0",
                                                            task.type === 'chaos' ? "bg-amber-500/10 text-amber-400" :
                                                                task.type === 'stretch' ? "bg-purple-500/10 text-purple-400" :
                                                                    "bg-emerald-500/10 text-emerald-400"
                                                        )}>{task.type} PHASE</span>
                                                    </div>
                                                    <p className="text-sm text-[#241f18]/60 dark:text-white/60 leading-relaxed mb-4">{task.description}</p>

                                                    {/* Failure Modes */}
                                                    <div className="pl-4 border-l-2 border-red-500/20">
                                                        <div className="text-[10px] text-red-400/80 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                                                            <AlertOctagon className="w-3 h-3" /> Failure Protocol
                                                        </div>
                                                        <div className="space-y-1">
                                                            {task.failureModes.map((fm, idx) => (
                                                                <div key={idx} className="text-xs text-[#241f18]/45 dark:text-white/40 flex items-start gap-2">
                                                                    <span className="text-red-500/40 mt-1">×</span> {fm}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Skills / Proof */}
                                <div className="grid grid-cols-2 gap-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                        className="p-6 rounded-2xl bg-[#241f18]/[0.02] dark:bg-white/[0.02] border border-[#ded2c2]/60 dark:border-white/[0.06]"
                                    >
                                        <h3 className="text-xs font-bold text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest mb-4 font-mono">Eval Matrix</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {blueprint.rubric.map((skill, i) => (
                                                <div key={i} className="px-3 py-1.5 rounded-lg bg-[#241f18]/5 dark:bg-white/5 border border-[#ded2c2]/60 dark:border-white/5 text-xs text-[#241f18]/70 dark:text-white/70">
                                                    {skill.category}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                        className="p-6 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10"
                                    >
                                        <h3 className="text-xs font-bold text-emerald-500/60 uppercase tracking-widest mb-4 font-mono flex items-center gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Proof Definition
                                        </h3>
                                        <p className="text-sm text-emerald-700/70 dark:text-emerald-200/60 italic leading-relaxed">
                                            "{blueprint.proofDefinition}"
                                        </p>
                                    </motion.div>
                                </div>

                                <div className="h-20" /> {/* Spacer */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function ActionChip({ onClick, label, color }: { onClick: () => void, label: string, color: string }) {
    const colors: Record<string, string> = {
        red: "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20",
        blue: "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20",
        purple: "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20",
    }
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 py-1.5 rounded-lg border text-[10px] whitespace-nowrap font-medium uppercase tracking-wider transition-all hover:scale-105 active:scale-95",
                colors[color]
            )}
        >
            {label}
        </button>
    )
}

function Badge({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
    const colors: Record<string, string> = {
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    }
    return (
        <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium", colors[color])}>
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
        </div>
    )
}

// Custom Icon wrapper to avoid import errors if Lucide doesn't index 'SignalHigh' correctly
function SignalHigh(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 20h.01" />
            <path d="M7 20v-4" />
            <path d="M12 20v-8" />
            <path d="M17 20V8" />
            <path d="M22 20V4" />
        </svg>
    )
}
