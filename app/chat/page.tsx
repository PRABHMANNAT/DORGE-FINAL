"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { OmniLogo } from "@/components/omni-logo"
import { CandidateProfile } from "@/components/candidate-profile"
import { OutreachPanel } from "@/components/outreach-panel"
import {
    Search,
    ArrowUp,
    Github,
    ArrowUpRight,
    Sparkles,
    X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { DEMO_CANDIDATES } from "@/lib/demo-data"
import {
    applyFollowupPrompt,
    applyManualReset,
    classifyIntent,
    completeInitialSearch,
    createEmptyActiveQuery,
    createInitialSearchState,
    getActiveFilterChips,
    removeFilterChip,
    type ActiveFilterChip,
    type ChatSearchState,
} from "./search-state"

// Types
type ViewState = "input" | "processing" | "results"

const SUGGESTIONS = [
    "SIMD optimization experts",
    "Binary instrumentation experts",
    "JIT compiler engineers",
    "Ray tracing specialists",
    "Hardware emulator developers"
]

const PROCESSING_STEPS = [
    "Scanning GitHub Graph...",
    "Analyzing contribution topology...",
    "Verifying cross-reference signals...",
    "Calculating expertise vectors...",
    "Ranking by proof depth..."
]

const ARISTOTLE_WORD = "Aristotle"
const ARISTOTLE_REVEAL_DELAY = 0.12
const ARISTOTLE_REVEAL_DURATION = 0.88
const ARISTOTLE_REVEAL_EASE = [0.22, 1, 0.36, 1] as const

export default function ChatPage() {
    const [view, setView] = useState<ViewState>("input")
    const [query, setQuery] = useState("")
    const [displayQuery, setDisplayQuery] = useState("")
    const [processingStep, setProcessingStep] = useState(0)
    const [aristotleCycle, setAristotleCycle] = useState(0)
    const [analysisResults, setAnalysisResults] = useState<any>(null)
    const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
    const [streamingCandidates, setStreamingCandidates] = useState<any[]>([])
    const [chatState, setChatState] = useState<ChatSearchState<any>>(() => createInitialSearchState())
    const [filterStatus, setFilterStatus] = useState<string | null>(null)
    const [showOutreach, setShowOutreach] = useState(false)
    const resultsScrollRef = useRef<HTMLDivElement>(null)
    const resultsEndRef = useRef<HTMLDivElement>(null)

    const displayedCandidates = chatState.candidateSet.length > 0 ? chatState.candidateSet : DEMO_CANDIDATES
    const activeFilterChips = getActiveFilterChips(chatState.activeQuery)

    useEffect(() => {
        if (view !== "input") return

        setAristotleCycle(0)

        const id = window.setInterval(() => {
            setAristotleCycle((currentCycle) => currentCycle + 1)
        }, 3500)

        return () => window.clearInterval(id)
    }, [view])

    // Helper to get stable score from candidate ID
    const getStableScore = (candidateId: string) => {
        // Simple hash function to get consistent "random" number from ID
        let hash = 0
        for (let i = 0; i < candidateId.length; i++) {
            hash = ((hash << 5) - hash) + candidateId.charCodeAt(i)
            hash = hash & hash // Convert to 32bit integer
        }
        const normalized = Math.abs(hash) % 100

        if (candidateId.startsWith('vip')) {
            return 95 + (normalized % 5) // VIP: 95-99
        }
        return 60 + (normalized % 31) // Others: 60-90
    }

    const getCandidateAvatar = (candidate: any) => {
        if (candidate.avatarUrl) return candidate.avatarUrl
        if (candidate.avatar) return candidate.avatar
        const seed = encodeURIComponent(candidate.username || candidate.name || candidate.id)
        return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=1f2937,111827,0f172a&fontFamily=IBM%20Plex%20Mono`
    }

    const scheduleResultsScroll = (behavior: "append" | "stable" | "top") => {
        window.setTimeout(() => {
            if (behavior === "append") {
                resultsEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" })
            } else if (behavior === "top") {
                resultsScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
            }
        }, 0)
    }

    const runFreshSearch = async (submittedQuery: string, baseState: ChatSearchState<any>) => {
        setView("processing")
        setProcessingStep(0)
        setStreamingCandidates([])
        let scanInterval: ReturnType<typeof setInterval> | null = null

        try {
            // 1. Start streaming "found" candidates
            // Slower, more deliberate pace to simulate "deep analysis"
            scanInterval = setInterval(() => {
                setStreamingCandidates(prev => {
                    // Keep scanning until we hit the demo limit or api finishes
                    if (prev.length >= DEMO_CANDIDATES.length) {
                        if (scanInterval) clearInterval(scanInterval)
                        return prev
                    }
                    return [...prev, DEMO_CANDIDATES[prev.length]]
                })
            }, 120) // Balanced: 120ms (approx 8 updates/sec)

            // Step 1
            await new Promise(r => setTimeout(r, 1200))
            setProcessingStep(1)

            // Step 2: Extract Skills (Real API)
            const diffRes = await fetch("/api/job/extract-skills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description: submittedQuery }),
            })
            const diffData = await diffRes.json()
            await new Promise(r => setTimeout(r, 1000))
            setProcessingStep(2)

            // Step 3
            await new Promise(r => setTimeout(r, 1000))
            setProcessingStep(3)

            // Step 4: Analyze (Real API call structure, but using our expanded demo data)
            const analysisRes = await fetch("/api/candidates/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    skills: diffData.skills || [],
                    candidates: DEMO_CANDIDATES.map(c => ({
                        id: c.id,
                        name: c.name,
                        roleType: c.roleType,
                        github: c.github,
                        signals: { githubUsername: c.github },
                        stats: c.stats, // Pass mock stats to backend
                        topRepos: c.topRepos // Pass mock repos
                    })),
                    job: { title: "Search Role", description: submittedQuery },
                    tau: 0.4,
                    message: submittedQuery,
                    activeQuery: baseState.activeQuery,
                    lastIntent: baseState.lastIntent,
                    sessionPhase: baseState.sessionPhase,
                }),
            })
            const analysisData = await analysisRes.json()
            setAnalysisResults(analysisData)

            if (analysisData.success) {
                localStorage.setItem("forge_job_config", JSON.stringify({
                    title: "Search Role",
                    description: submittedQuery,
                    skills: diffData.skills,
                    updatedAt: new Date().toISOString()
                }))
                localStorage.setItem("forge_analysis", JSON.stringify(analysisData))
            }

            // Final Step
            await new Promise(r => setTimeout(r, 800))
            setProcessingStep(4)
            await new Promise(r => setTimeout(r, 500))

            if (scanInterval) clearInterval(scanInterval)
            return completeInitialSearch(baseState, submittedQuery, DEMO_CANDIDATES)

        } catch (error) {
            if (scanInterval) clearInterval(scanInterval)
            console.error("Search failed", error)
            setView("input")
            return null
        }
    }

    const runFollowupProcessing = async () => {
        setView("processing")
        setProcessingStep(0)
        setStreamingCandidates(displayedCandidates.slice(0, 6))
        await new Promise(r => setTimeout(r, 500))
        setProcessingStep(4)
        await new Promise(r => setTimeout(r, 180))
    }

    const handleManualNewSearch = () => {
        setChatState(applyManualReset())
        setFilterStatus(null)
        setDisplayQuery("")
        setQuery("")
        setAnalysisResults(null)
        setStreamingCandidates([])
        setView("input")
    }

    const handleRemoveFilter = (chip: ActiveFilterChip) => {
        const update = removeFilterChip(chatState, chip, DEMO_CANDIDATES)
        setChatState(update.state)
        setFilterStatus(update.explanation)
        scheduleResultsScroll(update.scrollBehavior)
    }

    // Handlers
    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault()
        const submittedQuery = query.trim()
        if (!submittedQuery) return

        if (chatState.sessionPhase === "initial") {
            const update = await runFreshSearch(submittedQuery, chatState)
            if (!update) return

            setChatState(update.state)
            setFilterStatus(update.explanation)
            setDisplayQuery(submittedQuery)
            setQuery("")
            setView("results")
            scheduleResultsScroll(update.scrollBehavior)
            return
        }

        const classified = classifyIntent(submittedQuery, chatState)

        if (classified.intent === "new_search") {
            const resetForFreshSearch: ChatSearchState<any> = {
                ...chatState,
                activeQuery: createEmptyActiveQuery(),
                candidateSet: [],
                lastIntent: null,
            }
            const update = await runFreshSearch(submittedQuery, resetForFreshSearch)
            if (!update) return

            setChatState(update.state)
            setFilterStatus(`Started new search - ${update.candidates.length} candidates`)
            setDisplayQuery(submittedQuery)
            setQuery("")
            setView("results")
            scheduleResultsScroll("top")
            return
        }

        await runFollowupProcessing()
        const update = applyFollowupPrompt(submittedQuery, chatState, DEMO_CANDIDATES)
        setChatState(update.state)
        setFilterStatus(update.explanation)
        setQuery("")
        setView("results")
        scheduleResultsScroll(update.scrollBehavior)
    }

    return (
        <>
            <AnimatePresence>
                {selectedCandidate && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCandidate(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[90]"
                        />
                        {/* Side Panel */}
                        <CandidateProfile
                            candidate={selectedCandidate}
                            onClose={() => setSelectedCandidate(null)}
                            analysis={analysisResults?.candidates?.find((c: any) => c.id === selectedCandidate.id)}
                            onAutoContact={() => { setSelectedCandidate(null); setShowOutreach(true) }}
                        />
                    </>
                )}
                {showOutreach && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowOutreach(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[90]"
                        />
                        <OutreachPanel onClose={() => setShowOutreach(false)} candidates={DEMO_CANDIDATES} />
                    </>
                )}
            </AnimatePresence>

            {/* Sidebar is handled by app/chat/layout.tsx and intentionally left unchanged. */}

            {/* Chat-only 3-column surface: existing sidebar + middle prompt panel + right output panel. */}
            <main className="chat-surface flex-1 relative overflow-y-auto lg:overflow-hidden bg-[var(--chat-bg)] text-[var(--chat-text)] font-mono selection:bg-[var(--chat-focus)]">
                <div className="chat-grid absolute inset-0 pointer-events-none" />

                <div className="relative z-10 grid min-h-full lg:h-full grid-cols-1 lg:grid-cols-[minmax(280px,28%)_minmax(0,72%)]">
                    {/* Column 2: prompt control panel */}
                    <section className="relative flex min-h-[520px] lg:min-h-0 flex-col border-b border-[var(--chat-border)] bg-[var(--chat-panel)] px-5 py-8 backdrop-blur-sm lg:border-b-0 lg:border-r">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex h-full w-full flex-col"
                        >
                            <div className="flex w-full items-start">
                                <div className="flex h-16 w-40 max-w-[70vw] items-start justify-start sm:w-44 lg:w-40 xl:w-44 2xl:w-48">
                                    <Image
                                        src="/ibm-logo-light.svg"
                                        alt="IBM"
                                        width={192}
                                        height={80}
                                        className="h-auto w-full object-contain dark:hidden"
                                        priority
                                    />
                                    <Image
                                        src="/ibm-logo-dark.svg"
                                        alt="IBM"
                                        width={192}
                                        height={80}
                                        className="hidden h-auto w-full object-contain dark:block"
                                        priority
                                    />
                                </div>
                            </div>

                            <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 py-8">
                                <OmniLogo size={72} className="chat-pulse-logo" />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="h-px w-16 bg-[var(--chat-accent)]/60 shadow-[0_0_18px_var(--chat-accent-glow)]" />
                                    <h1 className="text-2xl font-light tracking-tight text-center text-[var(--chat-text-soft)]">
                                        Who&apos;s the one you&apos;re searching for?
                                    </h1>
                                </div>
                            </div>

                            <div className="mx-auto mt-auto w-full max-w-md space-y-4">
                                {chatState.sessionPhase === "initial" && view === "input" && (
                                    <div className="flex flex-wrap justify-center gap-3 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-forwards">
                                        {SUGGESTIONS.map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => setQuery(tag)}
                                                className="px-3 py-1.5 rounded-full bg-[var(--chat-chip)] text-xs text-[var(--chat-muted)] hover:text-[var(--chat-text)] hover:bg-[var(--chat-chip-hover)] hover:ring-1 hover:ring-[var(--chat-focus)] transition-all"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {chatState.sessionPhase === "followup" && (
                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={handleManualNewSearch}
                                            className="inline-flex items-center gap-2 rounded-full bg-[var(--chat-chip)] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[var(--chat-muted)] transition-all hover:bg-[var(--chat-chip-hover)] hover:text-[var(--chat-text)]"
                                        >
                                            <Search className="h-3 w-3" />
                                            New Search
                                        </button>
                                    </div>
                                )}

                                <form onSubmit={handleSearch} className="w-full relative group">
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Ex: Senior Rust Engineer with Kernel experience"
                                        className="w-full bg-[var(--chat-input)] rounded-2xl text-lg xl:text-xl font-light text-[var(--chat-text)] placeholder:text-[var(--chat-placeholder)] px-6 py-4 pr-16 focus:outline-none focus:ring-1 focus:ring-[var(--chat-focus)] transition-all shadow-xl"
                                        autoFocus
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Button
                                            type="submit"
                                            size="icon"
                                            disabled={!query.trim()}
                                            className={cn(
                                                "rounded-lg w-10 h-10 transition-all duration-200",
                                                query.trim()
                                                    ? "bg-[var(--chat-accent)] text-white hover:bg-[var(--chat-accent-hover)] shadow-[0_0_28px_var(--chat-accent-glow)]"
                                                    : "bg-[var(--chat-chip)] text-[var(--chat-placeholder)] hover:bg-[var(--chat-chip-hover)]"
                                            )}
                                        >
                                            <ArrowUp className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </section>

                    {/* Column 3: idle animation or active output */}
                    <section className="relative min-h-[520px] lg:min-h-0 overflow-hidden">
                        <AnimatePresence mode="wait">
                            {view === "input" && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -24 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    className="flex h-full min-h-[520px] lg:min-h-0 flex-col items-center justify-center gap-5 px-6"
                                >
                                    <div className="text-[10px] uppercase tracking-[0.35em] text-[var(--chat-subtle)]">Loading</div>
                                    <div className="flex flex-col items-center gap-3">
                                        <motion.div
                                            key={`aristotle-word-${aristotleCycle}`}
                                            aria-label={`Loading ${ARISTOTLE_WORD}`}
                                            aria-live="polite"
                                            className="flex min-w-[18ch] items-center justify-center gap-[0.12em] text-3xl font-light tracking-[0.32em] text-[var(--chat-text-soft)] sm:text-4xl xl:text-5xl"
                                            animate={{
                                                textShadow: [
                                                    "0 0 0 rgba(255,255,255,0)",
                                                    "0 0 22px rgba(255,255,255,0.16)",
                                                    "0 0 0 rgba(255,255,255,0)",
                                                ],
                                            }}
                                            transition={{
                                                delay: ARISTOTLE_WORD.length * ARISTOTLE_REVEAL_DELAY + 0.48,
                                                duration: 1.2,
                                                ease: ARISTOTLE_REVEAL_EASE,
                                            }}
                                        >
                                            {ARISTOTLE_WORD.split("").map((letter, i) => (
                                                <motion.span
                                                    key={`${letter}-${i}`}
                                                    aria-hidden="true"
                                                    initial={{ opacity: 0, y: 12, filter: "blur(7px)" }}
                                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                                    transition={{
                                                        delay: i * ARISTOTLE_REVEAL_DELAY,
                                                        duration: ARISTOTLE_REVEAL_DURATION,
                                                        ease: ARISTOTLE_REVEAL_EASE,
                                                    }}
                                                >
                                                    {letter}
                                                </motion.span>
                                            ))}
                                        </motion.div>
                                        <motion.div
                                            key={`aristotle-underline-${aristotleCycle}`}
                                            initial={{ scaleX: 0, opacity: 0 }}
                                            animate={{ scaleX: 1, opacity: 1 }}
                                            transition={{
                                                delay: 0.08,
                                                duration: ARISTOTLE_WORD.length * ARISTOTLE_REVEAL_DELAY + 0.32,
                                                ease: ARISTOTLE_REVEAL_EASE,
                                            }}
                                            className="h-px w-40 origin-left bg-[var(--chat-accent)]/70 shadow-[0_0_20px_var(--chat-accent-glow)]"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {view === "processing" && (
                                <motion.div
                                    key="processing"
                                    initial={{ opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -24 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    className="h-full flex flex-col items-center justify-center p-12 z-10 relative overflow-hidden"
                                >
                                    {/* Central Scanner Interface */}
                                    <div className="flex flex-col items-center gap-8 relative z-20 w-full max-w-4xl">

                                        <div className="text-center space-y-2 mb-8">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-4"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        LIVE_SCAN_ACTIVE
                                    </motion.div>
                                    <h2 className="text-3xl font-light tracking-tight text-white">
                                        Scanning <span className="font-mono text-emerald-500">{streamingCandidates.length}</span> / {DEMO_CANDIDATES.length} profiles
                                    </h2>
                                    <p className="text-white/40 text-sm">Identifying partial matches across 12 dimensions...</p>
                                </div>

                                        {/* Active Scan Region */}
                                        <div className="relative w-full h-96 rounded-xl bg-black/50 backdrop-blur-sm overflow-hidden flex items-center justify-center">

                                            {/* Scanning Line */}
                                            <motion.div
                                                animate={{ top: ["0%", "100%", "0%"] }}
                                                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                                                className="absolute left-0 right-0 h-px bg-emerald-500/50 z-30 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                            />

                                            {/* Rapid Fire Cards */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8 w-full h-full opacity-50">
                                                <AnimatePresence mode="popLayout">
                                                    {streamingCandidates.slice(-6).map((c, i) => ( // Show last 6
                                                        <motion.div
                                                            key={`scan-${c.id || i}`}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                                                            transition={{ duration: 0.2 }}
                                                            className="flex items-center gap-4 p-4 rounded bg-white/5"
                                                        >
                                                            <img src={`https://github.com/${c.github}.png`} className="w-10 h-10 rounded bg-white/10 grayscale" alt="" />
                                                            <div className="min-w-0">
                                                                <div className="text-xs font-mono text-white/50 truncate w-full">{c.id}</div>
                                                                <div className="text-sm font-medium text-white truncate w-full">{c.name}</div>
                                                                <div className="flex gap-2 text-[9px] text-white/30 uppercase mt-1">
                                                                    <span>{c.roleType}</span>
                                                                    <span className="text-emerald-500/50">MATCH: {85 + (i * 2)}%</span>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>

                                            {/* Tech Overlay */}
                                            <div className="absolute inset-0 pointer-events-none">
                                                <div className="absolute top-4 right-4 text-[10px] font-mono text-emerald-500/50 flex flex-col items-end gap-1">
                                                    <span>MEM_USAGE: 402MB</span>
                                                    <span>THREADS: 12</span>
                                                    <span>LATENCY: 12ms</span>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="h-4 overflow-hidden relative w-full max-w-md mx-auto mt-4">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={processingStep}
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: -20, opacity: 0 }}
                                                    className="absolute inset-0 text-xs text-white/40 font-mono text-center uppercase tracking-widest"
                                                >
                                                    {PROCESSING_STEPS[processingStep]}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {view === "results" && (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -24 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    className="h-full flex w-full z-10"
                                >
                                    {/* Main Content Area */}
                                    <div className="flex-1 flex flex-col min-w-0">
                                        {/* Sleek Header */}
                                        <header className="flex items-center justify-between gap-4 px-8 py-6 bg-[var(--chat-panel)] dark:bg-[#050505]/80 backdrop-blur-md sticky top-0 z-30 max-xl:flex-col max-xl:items-start">
                                            <div className="flex items-center gap-6">
                                                <Button variant="ghost" size="icon" onClick={handleManualNewSearch} className="text-[#241f18]/55 hover:text-[#241f18] dark:text-white/40 dark:hover:text-white -ml-2 rounded-full">
                                                    <ArrowUp className="w-5 h-5 -rotate-90" />
                                                </Button>
                                                <div>
                                                    <h2 className="text-lg font-medium text-[#241f18] dark:text-white tracking-tight">{displayQuery || "Search results"}</h2>
                                                    <div className="flex items-center gap-2 text-xs text-[#241f18]/70 dark:text-white/70">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                        {displayedCandidates.length} verified matches
                                                        {activeFilterChips.length > 0 && (
                                                            <span className="text-[#241f18]/45 dark:text-white/25">- {activeFilterChips.length} active filters</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Button variant="ghost" size="sm" className="h-8 bg-[#efe6d6]/70 hover:bg-[#eadfcb] text-[#241f18] dark:bg-white/5 dark:hover:bg-white/10 dark:text-white text-xs font-medium rounded-full px-4">
                                                    Export CSV
                                                </Button>
                                                <Button size="sm" className="h-8 bg-white text-black hover:bg-white/90 text-xs font-medium rounded-full px-4" onClick={() => setShowOutreach(true)}>
                                                    <Sparkles className="w-3.5 h-3.5 mr-2" /> Auto-Contact
                                                </Button>
                                            </div>
                                        </header>

                                        {chatState.sessionPhase === "followup" && (
                                            <div className="border-b border-[#e6dcc9] bg-[#f7f3ec]/40 px-8 py-4 dark:border-white/[0.03] dark:bg-[#050505]/50">
                                                {activeFilterChips.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {activeFilterChips.map((chip) => (
                                                            <button
                                                                key={chip.id}
                                                                type="button"
                                                                onClick={() => handleRemoveFilter(chip)}
                                                                className="inline-flex items-center gap-2 rounded-full border border-[#ded2c2] bg-[#f0e7d6] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#241f18] transition-all hover:border-[#df5f12]/60 hover:bg-[#eadfcb] dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-200 dark:hover:border-orange-500/60 dark:hover:bg-orange-500/15"
                                                            >
                                                                <span>{chip.label}</span>
                                                                <X className="h-3 w-3 text-[#DF5F12] dark:text-orange-400" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                {filterStatus && (
                                                    <div className={cn(
                                                        "text-[10px] uppercase tracking-[0.22em] text-[#241f18]/55 dark:text-white/35",
                                                        activeFilterChips.length > 0 && "mt-3"
                                                    )}>
                                                        {filterStatus}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Results List - No "Cards", sleek rows */}
                                        <div ref={resultsScrollRef} className="flex-1 overflow-y-auto w-full">
                                            <div className="divide-y divide-[#e6dcc9] dark:divide-white/[0.03]">
                                                {displayedCandidates.map((candidate, i) => {
                                                    const analysis = analysisResults?.candidates?.find((c: any) => c.id === candidate.id);
                                                    const score = analysis?.score ? Math.round(analysis.score * 100) : getStableScore(candidate.id);

                                                    return (
                                                        <motion.div
                                                            key={candidate.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: i * 0.02 }}
                                                            onClick={() => setSelectedCandidate(candidate)}
                                                            className="group flex items-center gap-6 px-8 py-4 hover:bg-[#efe6d6]/50 dark:hover:bg-white/[0.02] transition-all cursor-pointer"
                                                        >
                                                            {/* Rank/Score */}
                                                            <div className="w-12 text-center shrink-0">
                                                                <div className={cn(
                                                                    "text-lg font-light",
                                                                    score >= 90 ? "text-emerald-700 dark:text-emerald-400" :
                                                                        score >= 80 ? "text-[#241f18]/90 dark:text-white/90" :
                                                                            "text-[#241f18]/55 dark:text-white/50"
                                                                )}>{score}</div>
                                                                <div className="text-[9px] text-[#241f18]/45 dark:text-white/20 uppercase tracking-wider">Fit</div>
                                                            </div>

                                                            {/* Avatar */}
                                                            <div className="w-10 h-10 rounded-full bg-[#e9dfcf] dark:bg-white/10 flex items-center justify-center text-sm font-medium text-[#241f18]/60 dark:text-white/60 shrink-0 overflow-hidden relative">
                                                                <img
                                                                    src={getCandidateAvatar(candidate)}
                                                                    alt={`${candidate.name} profile`}
                                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100"
                                                                />
                                                            </div>

                                                            {/* Main Info */}
                                                            <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
                                                                <div className="col-span-5">
                                                                    <div className="flex items-center gap-3 mb-0.5">
                                                                        <h3 className="text-sm font-medium text-[#241f18] dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                                                            {candidate.name}
                                                                        </h3>
                                                                        {candidate.id.startsWith('vip') && (
                                                                            <span className="px-1.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-transparent dark:bg-emerald-500/10 dark:text-emerald-500 text-[9px] font-medium tracking-wide uppercase">
                                                                                VIP
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-xs text-[#241f18]/55 dark:text-white/55 truncate font-light flex items-center gap-2">
                                                                        <Github className="w-3 h-3" />
                                                                        {candidate.username}
                                                                    </div>
                                                                </div>

                                                                <div className="col-span-7 flex items-center justify-between text-xs text-[#241f18]/55 dark:text-white/40">
                                                                    <span className="truncate max-w-[200px]">{candidate.roleType}</span>

                                                                    {/* Mini Stats */}
                                                                    <div className="flex items-center gap-6">
                                                                        <div className="flex flex-col items-end w-16">
                                                                            <span className="text-[#241f18]/75 dark:text-white/70">{candidate.stats?.commits?.toLocaleString() || "-"}</span>
                                                                            <span className="text-[9px] uppercase tracking-wider text-[#241f18]/45 dark:text-white/40">Commits</span>
                                                                        </div>
                                                                        <div className="flex flex-col items-end w-16">
                                                                            <span className="text-[#241f18]/75 dark:text-white/70">{candidate.stats?.stars?.toLocaleString() || "-"}</span>
                                                                            <span className="text-[9px] uppercase tracking-wider text-[#241f18]/45 dark:text-white/40">Stars</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-[#241f18]/55 hover:text-[#241f18] dark:text-white/40 dark:hover:text-white rounded-full" onClick={(e) => e.stopPropagation()}>
                                                                    <ArrowUpRight className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                })}
                                                <div ref={resultsEndRef} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                </div>
            </main>

            <style jsx global>{`
                .chat-surface {
                    --chat-bg: #f7f3ec;
                    --chat-panel: rgba(250, 247, 241, 0.78);
                    --chat-text: #241f18;
                    --chat-text-soft: rgba(36, 31, 24, 0.82);
                    --chat-muted: rgba(36, 31, 24, 0.54);
                    --chat-subtle: rgba(36, 31, 24, 0.34);
                    --chat-border: rgba(116, 96, 72, 0.2);
                    --chat-input: rgba(255, 252, 247, 0.94);
                    --chat-chip: rgba(36, 31, 24, 0.055);
                    --chat-chip-hover: rgba(226, 97, 18, 0.1);
                    --chat-placeholder: rgba(36, 31, 24, 0.34);
                    --chat-accent: #df5f12;
                    --chat-accent-hover: #c94f0b;
                    --chat-accent-glow: rgba(223, 95, 18, 0.28);
                    --chat-focus: rgba(223, 95, 18, 0.34);
                    --chat-loader: #1f2937;
                }
                .dark .chat-surface {
                    --chat-bg: #050505;
                    --chat-panel: rgba(5, 5, 5, 0.7);
                    --chat-text: #ffffff;
                    --chat-text-soft: rgba(255, 255, 255, 0.8);
                    --chat-muted: rgba(255, 255, 255, 0.4);
                    --chat-subtle: rgba(255, 255, 255, 0.25);
                    --chat-border: rgba(255, 255, 255, 0.06);
                    --chat-input: #0a0a0a;
                    --chat-chip: rgba(255, 255, 255, 0.05);
                    --chat-chip-hover: rgba(255, 107, 0, 0.1);
                    --chat-placeholder: rgba(255, 255, 255, 0.2);
                    --chat-accent: #ff6b00;
                    --chat-accent-hover: #ff7f22;
                    --chat-accent-glow: rgba(255, 107, 0, 0.34);
                    --chat-focus: rgba(255, 107, 0, 0.4);
                    --chat-loader: #ffffff;
                }
                .chat-grid {
                    background-image:
                        linear-gradient(rgba(36, 31, 24, 0.035) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(36, 31, 24, 0.035) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
                .dark .chat-grid {
                    background-image:
                        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
                }
                .chat-pulse-logo .omni-ring {
                    animation-duration: 16.5s;
                }
                .chat-pulse-logo .bg-white {
                    background-color: var(--chat-loader);
                }
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(1000%); }
                }
                .animate-scan {
                    animation: scan 4s linear infinite;
                }
                .mask-image-b {
                    mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
                }
            `}</style>
        </>
    )
}
