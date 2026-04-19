"use client"

import React, { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Brain, Search, Network, CheckCircle,
    Users, Code, GitCommit,
    ChevronLeft, Cpu, Activity,
    Upload, FileUp, Plus, Scan, X,
    Globe, Shield, Zap, Terminal, Server, Database
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BRAIN_DOCS, type BrainDoc } from "@/lib/brain-data"

// ─── Types ───────────────────────────────────────────────────────────────────
type IngestionStatus = "idle" | "scanning" | "processing" | "indexed"

// ─── Mock Data for HUD ───────────────────────────────────────────────────────
const SYSTEM_LOGS = [
    "[SYSTEM] Neural index re-calibrated (Efficiency: 99.8%)",
    "[NETWORK] Node 42 connected to sector 7",
    "[SECURITY] Handshake verifies. Encryption: Quantum-256",
    "[DATA] Ingesting stream from source: 'HR_POLICY_V4'",
    "[KERNEL] Memory heap optimization complete",
]

// ─── Neural Core Component ───────────────────────────────────────────────────
function NeuralCore({ isActive, pulseSpeed = "normal" }: { isActive: boolean, pulseSpeed?: "normal" | "fast" }) {
    return (
        <div className="relative flex items-center justify-center w-[800px] h-[800px]">
            {/* Core Glow */}
            <div className={cn(
                "absolute bg-violet-600/20 blur-[150px] rounded-full transition-all duration-1000",
                isActive ? "w-[500px] h-[500px] opacity-100" : "w-[300px] h-[300px] opacity-40"
            )} />

            {/* Grid Background Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(36,31,24,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(36,31,24,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-20 animate-pulse" />

            {/* Orbital Rings - Outer */}
            <div className="absolute w-[600px] h-[600px] border border-[#ded2c2] dark:border-white/[0.03] rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-[550px] h-[550px] border border-dashed border-[#ded2c2] dark:border-white/[0.04] rounded-full animate-[spin_40s_linear_infinite_reverse]" />

            {/* Orbital Rings - Inner active */}
            <div className={cn(
                "absolute border rounded-full transition-all duration-1000",
                isActive ? "w-[400px] h-[400px] border-violet-500/30 animate-[spin_10s_linear_infinite]" : "w-[350px] h-[350px] border-[#ded2c2]/60 dark:border-white/5 animate-[spin_20s_linear_infinite]"
            )} />

            {/* Connecting Nodes (Decorative) */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        scale: isActive ? [1, 1.2, 1] : 1,
                        opacity: isActive ? 1 : 0.3
                    }}
                    transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                    className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                    style={{
                        transform: `rotate(${i * 45}deg) translate(${isActive ? 220 : 180}px) rotate(-${i * 45}deg)`,
                    }}
                />
            ))}

            {/* Central Processor */}
            <div className={cn(
                "relative rounded-full flex items-center justify-center shadow-[0_0_70px_rgba(139,92,246,0.15)] dark:shadow-[0_0_100px_rgba(139,92,246,0.5)] z-10 transition-all duration-700",
                isActive ? "w-48 h-48 bg-[#fffaf2] dark:bg-[#0A0A0E] border border-violet-500/50" : "w-32 h-32 bg-[#fffaf2] dark:bg-[#050508] border border-[#ded2c2] dark:border-white/10"
            )}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600/20 to-cyan-600/20 animate-pulse" />
                <Brain className={cn(
                    "transition-all duration-700 text-[#241f18] dark:text-white drop-shadow-[0_0_12px_rgba(36,31,24,0.16)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]",
                    isActive ? "w-20 h-20" : "w-12 h-12"
                )} />

                {/* Data Stream Particles (When Processing) */}
                {pulseSpeed === "fast" && (
                    <>
                        <div className="absolute inset-0 border-2 border-transparent border-t-cyan-400 rounded-full animate-[spin_1s_linear_infinite]" />
                        <div className="absolute inset-2 border-2 border-transparent border-b-violet-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
                    </>
                )}
            </div>

            {/* Status Text - Now Floating */}
            <div className="absolute -bottom-24 text-center">
                <p className="text-[10px] text-[#241f18]/45 dark:text-white/30 uppercase tracking-[0.3em] font-mono mb-1">Neural Core Status</p>
                <p className={cn("text-xs font-bold uppercase tracking-widest", isActive ? "text-emerald-400" : "text-[#241f18]/55 dark:text-white/50")}>
                    {isActive ? "Thinking / Processing" : "Standing By"}
                </p>
            </div>
        </div>
    )
}

// ─── HUD Components ──────────────────────────────────────────────────────────

function SystemWidget({ label, value, icon: Icon, color }: any) {
    return (
        <div className="bg-[#fffaf2]/50 dark:bg-[#0A0A0E]/50 backdrop-blur border border-[#ded2c2]/60 dark:border-white/5 rounded-lg p-3 w-40">
            <div className="flex items-center gap-2 mb-2">
                <Icon className={cn("w-3.5 h-3.5", color)} />
                <span className="text-[10px] text-[#241f18]/45 dark:text-white/40 uppercase tracking-wider font-mono">{label}</span>
            </div>
            <div className="text-[#241f18] dark:text-white font-mono text-sm">{value}</div>
        </div>
    )
}

function ActivityLog() {
    return (
        <div className="w-80 bg-[#fffaf2]/50 dark:bg-[#0A0A0E]/50 backdrop-blur border border-[#ded2c2]/60 dark:border-white/5 rounded-xl p-4 font-mono text-[10px] text-[#241f18]/55 dark:text-white/50 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-20" />
            <div className="uppercase tracking-widest text-[#241f18]/45 dark:text-white/20 mb-3 text-[9px]">Live Ingestion Stream</div>
            {SYSTEM_LOGS.map((log, i) => (
                <div key={i} className="truncate hover:text-[#241f18]/80 dark:hover:text-white/80 transition-colors cursor-default">
                    <span className="text-violet-500/50 mr-2">{`>`}</span>
                    {log}
                </div>
            ))}
            <div className="animate-pulse text-violet-400 mt-2">{`_`}</div>
        </div>
    )
}

// ─── Neural Interface Component (Right Panel) ─────────────────────────────────
function NeuralInterface() {
    return (
        <div className="w-[400px] shrink-0 border-l border-[#ded2c2]/60 dark:border-white/[0.06] bg-[#fffaf2]/50 dark:bg-[#050508]/50 flex flex-col z-20">
            <div className="p-4 border-b border-[#ded2c2]/60 dark:border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-bold text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest font-mono">Neural Interface</span>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-500 font-mono">ONLINE</span>
                </div>
            </div>

            {/* Chat History / terminal output */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-sm">
                <div className="flex gap-3">
                    <div className="w-6 h-6 rounded bg-violet-500/10 flex items-center justify-center shrink-0 border border-violet-500/20">
                        <Terminal className="w-3 h-3 text-violet-400" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[#241f18]/60 dark:text-white/60 text-xs">System initialized. Neural index loaded.</p>
                        <p className="text-[#241f18]/45 dark:text-white/40 text-[10px]">10:42:05 AM</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="w-6 h-6 rounded bg-violet-500/10 flex items-center justify-center shrink-0 border border-violet-500/20">
                        <Brain className="w-3 h-3 text-violet-400" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-violet-700 dark:text-violet-200 text-xs">Hello Admin. I am ready to process queries regarding the company knowledge base.</p>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#ded2c2]/60 dark:border-white/[0.06] bg-[#fffaf2] dark:bg-[#0A0A0E]">
                <div className="relative">
                    <input
                        className="w-full bg-[#fffaf2] dark:bg-[#030303] border border-[#ded2c2] dark:border-white/10 rounded-lg pl-4 pr-10 py-3 text-sm text-[#241f18] dark:text-white focus:outline-none focus:border-violet-500/50 placeholder:text-[#241f18]/45 dark:placeholder:text-white/20 font-mono transition-colors"
                        placeholder="Ask the brain..."
                    />
                    <div className="absolute right-2 top-2 p-1 rounded hover:bg-[#241f18]/10 dark:hover:bg-white/10 cursor-pointer transition-colors">
                        <ChevronLeft className="w-4 h-4 text-[#241f18]/45 dark:text-white/40 rotate-180" />
                    </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#241f18]/5 dark:bg-white/5 border border-[#ded2c2]/60 dark:border-white/5 text-[9px] text-[#241f18]/45 dark:text-white/30 uppercase cursor-pointer hover:bg-[#241f18]/10 dark:hover:bg-white/10 transition-colors">Summarize</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#241f18]/5 dark:bg-white/5 border border-[#ded2c2]/60 dark:border-white/5 text-[9px] text-[#241f18]/45 dark:text-white/30 uppercase cursor-pointer hover:bg-[#241f18]/10 dark:hover:bg-white/10 transition-colors">Draft</span>
                    </div>
                    <span className="text-[9px] text-[#241f18]/45 dark:text-white/20 font-mono">AI-MODEL-v2.1</span>
                </div>
            </div>
        </div>
    )
}

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function CompanyBrainPage() {
    // State
    const [docs, setDocs] = useState<BrainDoc[]>(BRAIN_DOCS)
    const [searchQuery, setSearchQuery] = useState("")
    const [isIngesting, setIsIngesting] = useState(false)
    const [ingestionStatus, setIngestionStatus] = useState<IngestionStatus>("idle")
    const [activeDoc, setActiveDoc] = useState<BrainDoc | null>(null)
    const [newDocContent, setNewDocContent] = useState("")

    // Ingestion Handler
    const handleIngest = () => {
        if (!newDocContent.trim()) return

        setIngestionStatus("scanning")

        // Simulation Sequence
        setTimeout(() => setIngestionStatus("processing"), 1500)
        setTimeout(() => {
            setIngestionStatus("indexed")
            const newDoc: BrainDoc = {
                id: `new-${Date.now()}`,
                title: "New Knowledge Fragment",
                category: "core",
                snippet: newDocContent.slice(0, 100) + "...",
                author: "Admin User",
                lastUpdated: "Just now",
                content: newDocContent,
                tags: ["new", "user-upload"]
            }
            setDocs(prev => [newDoc, ...prev])
            setTimeout(() => {
                setIngestionStatus("idle")
                setIsIngesting(false)
                setNewDocContent("")
            }, 1000)
        }, 3500)
    }

    // Filter Logic
    const filtered = useMemo(() => {
        return docs.filter(d =>
            d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.snippet.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [docs, searchQuery])

    return (
        <div className="flex bg-[#fffaf2] dark:bg-[#030303] h-full w-full overflow-hidden font-sans relative selection:bg-violet-500/30 selection:text-violet-200">
            {/* ─── Background FX ───────────────────────────────────────────────── */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-500/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />

            {/* ─── Main Content Area ───────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col relative z-10 w-full">
                {/* Header */}
                <header className="h-20 flex items-center justify-between px-8 border-b border-[#ded2c2]/60 dark:border-white/[0.06] bg-[#fffaf2]/80 dark:bg-[#030303]/80 backdrop-blur-md z-20 sticky top-0 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500/20 to-indigo-500/10 border border-violet-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                            <Network className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-[#241f18] dark:text-white tracking-tight flex items-center gap-2">
                                NEURAL BRAIN
                                <span className="text-[10px] bg-[#241f18]/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-[#241f18]/55 dark:text-white/50 font-mono tracking-wide">v2.0</span>
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[10px] text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest font-mono">System Nominal · {docs.length} Nodes Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative group w-64">
                            <div className="absolute inset-0 bg-violet-500/20 rounded-lg opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
                            <div className="relative flex items-center bg-[#fffaf2] dark:bg-[#0A0A0E] border border-[#ded2c2] dark:border-white/10 rounded-lg px-3 py-2">
                                <Search className="w-4 h-4 text-[#241f18]/45 dark:text-white/40 mr-2" />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search neural index..."
                                    className="bg-transparent border-none outline-none text-xs text-[#241f18] dark:text-white placeholder:text-[#241f18]/45 dark:placeholder:text-white/20 w-full"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={() => setIsIngesting(true)}
                            className="bg-white text-black hover:bg-violet-200 border-none shadow-[0_0_18px_rgba(36,31,24,0.10)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Feed Brain
                        </Button>
                    </div>
                </header>

                <div className="flex-1 flex relative overflow-hidden w-full">
                    {/* ─── Left Panel: Neural List ─────────────────────────────────── */}
                    <div className="w-[400px] shrink-0 border-r border-[#ded2c2]/60 dark:border-white/[0.06] bg-[#fffaf2]/50 dark:bg-[#050508]/50 flex flex-col z-20">
                        <div className="p-4 border-b border-[#ded2c2]/60 dark:border-white/[0.06] flex items-center justify-between">
                            <span className="text-xs font-bold text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest font-mono">Memory Banks</span>
                            <div className="flex gap-1">
                                <span className="w-1 h-1 rounded-full bg-[#241f18]/20 dark:bg-white/20" />
                                <span className="w-1 h-1 rounded-full bg-[#241f18]/20 dark:bg-white/20" />
                                <span className="w-1 h-1 rounded-full bg-[#241f18]/20 dark:bg-white/20" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {filtered.map((doc, i) => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setActiveDoc(doc)}
                                    className={cn(
                                        "p-4 rounded-xl border cursor-pointer transition-all group relative overflow-hidden",
                                        activeDoc?.id === doc.id
                                            ? "bg-violet-500/10 border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                                            : "bg-[#241f18]/[0.02] dark:bg-white/[0.02] border-[#ded2c2] dark:border-white/[0.04] hover:bg-[#241f18]/[0.04] dark:hover:bg-white/[0.04] hover:border-[#ded2c2] dark:hover:border-white/10"
                                    )}
                                >
                                    {activeDoc?.id === doc.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500" />}
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={cn("text-sm font-semibold transition-colors", activeDoc?.id === doc.id ? "text-[#241f18] dark:text-white" : "text-[#241f18]/80 dark:text-white/80 group-hover:text-[#241f18] dark:group-hover:text-white")}>{doc.title}</h3>
                                        <span className="text-[10px] text-[#241f18]/45 dark:text-white/30 font-mono">{doc.lastUpdated}</span>
                                    </div>
                                    <p className="text-xs text-[#241f18]/45 dark:text-white/40 line-clamp-2 leading-relaxed mb-3">{doc.snippet}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="px-1.5 py-0.5 rounded bg-[#241f18]/5 dark:bg-white/5 border border-[#ded2c2]/60 dark:border-white/5 text-[9px] text-[#241f18]/45 dark:text-white/30 uppercase tracking-wider">
                                            {doc.category}
                                        </div>
                                        {doc.tags?.slice(0, 2).map(t => (
                                            <span key={t} className="text-[9px] text-[#241f18]/45 dark:text-white/20">#{t}</span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* ─── Center: Neural Visualizer or Doc View ──────────────────── */}
                    <div className="flex-1 relative flex flex-col min-w-0">
                        {/* HUD Elements (Only visible when no doc is active) */}
                        {!activeDoc && (
                            <div className="absolute inset-0 pointer-events-none z-10 p-8 flex flex-col justify-between">
                                {/* Top Row HUD */}
                                <div className="flex justify-between items-start opacity-70">
                                    <div className="space-y-4">
                                        <SystemWidget label="Protocol" value="QUANTUM-V2" icon={Shield} color="text-emerald-400" />
                                        <SystemWidget label="Uptime" value="99.999%" icon={Activity} color="text-blue-400" />
                                    </div>
                                    <SystemWidget label="Active Nodes" value={docs.length.toString()} icon={Server} color="text-violet-400" />
                                </div>

                                {/* Bottom Row HUD */}
                                <div className="flex justify-between items-end opacity-70">
                                    <div className="flex gap-4">
                                        <SystemWidget label="CPU Load" value="12%" icon={Cpu} color="text-cyan-400" />
                                        <SystemWidget label="Memory" value="4.2TB / 8TB" icon={Database} color="text-indigo-400" />
                                    </div>
                                    <ActivityLog />
                                </div>
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {activeDoc ? (
                                <motion.div
                                    key="doc-view"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute inset-0 flex flex-col bg-[#fffaf2] dark:bg-[#050508] z-20"
                                >
                                    {/* Doc Header */}
                                    <div className="h-16 flex items-center justify-between px-8 border-b border-[#ded2c2]/60 dark:border-white/[0.06] bg-[#fffaf2] dark:bg-[#08080A]">
                                        <div className="flex items-center gap-4">
                                            <Button variant="ghost" size="icon" onClick={() => setActiveDoc(null)} className="h-8 w-8 rounded-full hover:bg-[#241f18]/10 dark:hover:bg-white/10">
                                                <ChevronLeft className="w-4 h-4 text-[#241f18]/60 dark:text-white/60" />
                                            </Button>
                                            <div className="h-4 w-px bg-[#241f18]/10 dark:bg-white/10" />
                                            <h2 className="text-sm font-bold text-[#241f18] dark:text-white tracking-wide">{activeDoc.title}</h2>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-[#241f18]/45 dark:text-white/40 font-mono">ID: {activeDoc.id}</span>
                                            <Button size="sm" variant="outline" className="border-[#ded2c2] dark:border-white/10 bg-[#241f18]/5 dark:bg-white/5 text-xs">Edit Source</Button>
                                        </div>
                                    </div>

                                    {/* Doc Content */}
                                    <div className="flex-1 overflow-y-auto p-12">
                                        <div className="max-w-3xl mx-auto space-y-8">
                                            <div className="prose prose-invert prose-p:text-[#241f18]/70 dark:prose-p:text-white/70 prose-headings:text-[#241f18] dark:prose-headings:text-white max-w-none">
                                                <h1 className="text-3xl font-light tracking-tight mb-8">{activeDoc.title}</h1>
                                                <div className="flex items-center gap-4 mb-8 text-xs text-[#241f18]/45 dark:text-white/40 font-mono uppercase tracking-wider border-b border-[#ded2c2]/60 dark:border-white/5 pb-8">
                                                    <span>Author: {activeDoc.author}</span>
                                                    <span>•</span>
                                                    <span>Updated: {activeDoc.lastUpdated}</span>
                                                    <span>•</span>
                                                    <span>Access: Restricted</span>
                                                </div>
                                                <div className="bg-[#241f18]/[0.02] dark:bg-white/[0.02] border border-[#ded2c2]/60 dark:border-white/5 rounded-2xl p-8 leading-loose text-[#241f18]/80 dark:text-white/80">
                                                    <MarkdownRenderer content={activeDoc.content} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="neural-core"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex items-center justify-center p-20"
                                >
                                    <NeuralCore isActive={isIngesting || !!searchQuery} pulseSpeed={isIngesting ? "fast" : "normal"} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ─── Right Panel: Neural Interface ───────────────────────────── */}
                    <NeuralInterface />
                </div>
            </div>

            {/* ─── Ingestion Modal ("Feed the Brain") ────────────────────────────── */}
            <AnimatePresence>
                {isIngesting && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#241f18]/5 dark:bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-[600px] bg-[#fffaf2] dark:bg-[#0A0A0E] border border-[#ded2c2] dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden relative"
                        >
                            {/* Ingestion Visuals */}
                            <div className="h-32 bg-gradient-to-b from-violet-500/10 to-transparent flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                                {ingestionStatus === "idle" && <FileUp className="w-10 h-10 text-[#241f18]/45 dark:text-white/20" />}
                                {ingestionStatus === "scanning" && <Scan className="w-10 h-10 text-cyan-400 animate-pulse" />}
                                {ingestionStatus === "processing" && <Cpu className="w-10 h-10 text-violet-400 animate-spin" />}
                                {ingestionStatus === "indexed" && <CheckCircle className="w-10 h-10 text-emerald-400 scale-110 duration-300" />}
                            </div>

                            <div className="p-8">
                                <h2 className="text-xl font-bold text-[#241f18] dark:text-white text-center mb-2">Feed Neural Network</h2>
                                <p className="text-sm text-[#241f18]/45 dark:text-white/40 text-center mb-8">Upload documents or paste text to expand the company brain.</p>

                                {ingestionStatus === "idle" ? (
                                    <div className="space-y-4">
                                        <textarea
                                            value={newDocContent}
                                            onChange={(e) => setNewDocContent(e.target.value)}
                                            placeholder="Paste knowledge fragment here..."
                                            className="w-full h-32 bg-[#241f18]/5 dark:bg-white/5 border border-[#ded2c2] dark:border-white/10 rounded-xl p-4 text-sm text-[#241f18] dark:text-white placeholder:text-[#241f18]/45 dark:placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 resize-none transition-colors"
                                        />
                                        <div className="flex gap-3">
                                            <Button variant="outline" className="flex-1 border-[#ded2c2] dark:border-white/10 hover:bg-[#241f18]/5 dark:hover:bg-white/5 text-[#241f18]/60 dark:text-white/60 h-10">
                                                <Upload className="w-4 h-4 mr-2" /> Upload File
                                            </Button>
                                            <Button onClick={handleIngest} disabled={!newDocContent} className="flex-1 bg-violet-600 hover:bg-violet-500 text-[#241f18] dark:text-white h-10">
                                                Process Data
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center space-y-4">
                                        <div className="h-1 w-full bg-[#241f18]/5 dark:bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: "0%" }}
                                                animate={{ width: ingestionStatus === "processing" ? "60%" : "100%" }}
                                                className={cn("h-full", ingestionStatus === "indexed" ? "bg-emerald-500" : "bg-violet-500")}
                                            />
                                        </div>
                                        <p className="text-xs text-[#241f18]/45 dark:text-white/40 font-mono uppercase tracking-widest animate-pulse">
                                            {ingestionStatus === "scanning" && "Scanning Content..."}
                                            {ingestionStatus === "processing" && "Neural Indexing..."}
                                            {ingestionStatus === "indexed" && "Knowledge Integrated"}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 hover:bg-[#241f18]/5 dark:hover:bg-white/5 rounded-full"
                                onClick={() => setIsIngesting(false)}
                            >
                                <X className="w-4 h-4 text-[#241f18]/45 dark:text-white/40" />
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function MarkdownRenderer({ content }: { content: string }) {
    const lines = content.split('\n')
    return (
        <div className="space-y-4">
            {lines.map((line, i) => {
                if (line.startsWith('# ')) return <h3 key={i} className="text-xl font-bold text-[#241f18] dark:text-white mt-4">{line.replace('# ', '')}</h3>
                if (line.startsWith('## ')) return <h4 key={i} className="text-lg font-semibold text-violet-700 dark:text-violet-200 mt-2">{line.replace('## ', '')}</h4>
                if (line.trim().startsWith('- ')) return <li key={i} className="ml-4 list-disc marker:text-violet-500 pl-2 text-[#241f18]/70 dark:text-white/70">{line.replace('- ', '')}</li>
                return <p key={i} className="text-[#241f18]/70 dark:text-white/70">{line}</p>
            })}
        </div>
    )
}
