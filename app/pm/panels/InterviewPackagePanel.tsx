"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, ClipboardList, Clock, Target, MessageSquare, ShieldCheck, BookOpen, Users,
    ChevronDown, ChevronRight, AlertTriangle, CheckCircle2, Zap,
} from "lucide-react"
import {
    DEMO_INTERVIEW_PLAN,
    DEMO_QUESTION_BANK, DIFFICULTY_CONFIG,
    DEMO_FOLLOW_UPS, RESPONSE_QUALITY_CONFIG,
    DEMO_VARIANTS,
    DEMO_INTERVIEWER_GUIDANCE,
    DEMO_CANDIDATE_INSTRUCTIONS,
} from "@/lib/pm-interview-data"

type Tab = 'plan' | 'questions' | 'followups' | 'anticheat' | 'guidance' | 'instructions'

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'plan', label: 'Plan', icon: ClipboardList },
    { key: 'questions', label: 'Questions', icon: MessageSquare },
    { key: 'followups', label: 'Follow-ups', icon: Zap },
    { key: 'anticheat', label: 'Anti-Cheat', icon: ShieldCheck },
    { key: 'guidance', label: 'Guidance', icon: BookOpen },
    { key: 'instructions', label: 'Instructions', icon: Users },
]

const SECTION_COLORS: Record<string, string> = {
    intro: 'border-violet-500/40 bg-violet-500/5',
    technical: 'border-blue-500/40 bg-blue-500/5',
    'system-design': 'border-amber-500/40 bg-amber-500/5',
    behavioural: 'border-emerald-500/40 bg-emerald-500/5',
    culture: 'border-rose-500/40 bg-rose-500/5',
    closing: 'border-zinc-500/40 bg-zinc-500/5',
}

export default function InterviewPackagePanel({ onClose }: { onClose: () => void }) {
    const [tab, setTab] = useState<Tab>('plan')
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

    const toggleExpand = (id: string) => {
        setExpandedItems(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    return (
        <div className="h-full flex flex-col bg-[#fffaf2] dark:bg-[#0A0A0A]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#ded2c2]/60 dark:border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-[#241f18] dark:text-white">Interview Package Generator</h2>
                        <p className="text-[11px] text-[#241f18]/45 dark:text-white/40 uppercase tracking-wider">Structured Interview Plan</p>
                    </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#241f18]/[0.04] dark:bg-white/[0.04] hover:bg-[#241f18]/[0.08] dark:hover:bg-white/[0.08] flex items-center justify-center transition-colors">
                    <X className="w-4 h-4 text-[#241f18]/45 dark:text-white/40" />
                </button>
            </div>

            {/* Tabs */}
            <div className="px-4 pt-3 pb-1 flex gap-1 overflow-x-auto border-b border-[#ded2c2]/60 dark:border-white/[0.06]">
                {TABS.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${tab === t.key
                                ? 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
                                : 'text-[#241f18]/45 dark:text-white/40 hover:text-[#241f18]/60 dark:hover:text-white/60 hover:bg-[#241f18]/[0.04] dark:hover:bg-white/[0.04]'
                            }`}
                    >
                        <t.icon className="w-3.5 h-3.5" />
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                    >
                        {tab === 'plan' && <PlanTab />}
                        {tab === 'questions' && <QuestionsTab expandedItems={expandedItems} toggleExpand={toggleExpand} />}
                        {tab === 'followups' && <FollowupsTab />}
                        {tab === 'anticheat' && <AntiCheatTab />}
                        {tab === 'guidance' && <GuidanceTab expandedItems={expandedItems} toggleExpand={toggleExpand} />}
                        {tab === 'instructions' && <InstructionsTab expandedItems={expandedItems} toggleExpand={toggleExpand} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

/* ─── Plan Tab ──────────────────────────────────────────────────────────────── */
function PlanTab() {
    const plan = DEMO_INTERVIEW_PLAN
    const totalMinutes = plan.sections.reduce((s, sec) => s + sec.durationMinutes, 0)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-[#241f18] dark:text-white">{plan.roleTitle}</h3>
                    <p className="text-[11px] text-[#241f18]/45 dark:text-white/40 mt-0.5">{plan.totalDuration}</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                    <Clock className="w-3 h-3 text-violet-400" />
                    <span className="text-[10px] text-violet-400 font-medium">{totalMinutes} min total</span>
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
                {plan.sections.map((sec, i) => (
                    <div key={sec.id} className={`relative rounded-xl border p-4 ${SECTION_COLORS[sec.type] || 'border-[#ded2c2] dark:border-white/10 bg-[#241f18]/[0.02] dark:bg-white/[0.02]'}`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[#241f18]/10 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-[#241f18]/60 dark:text-white/60">{i + 1}</span>
                                <div>
                                    <h4 className="text-[13px] font-semibold text-[#241f18] dark:text-white">{sec.title}</h4>
                                    {sec.interviewer && <p className="text-[10px] text-[#241f18]/45 dark:text-white/40 mt-0.5">Interviewer: {sec.interviewer}</p>}
                                </div>
                            </div>
                            <span className="text-[10px] text-[#241f18]/55 dark:text-white/50 font-mono bg-[#241f18]/[0.06] dark:bg-white/[0.06] px-2 py-0.5 rounded">{sec.duration}</span>
                        </div>

                        <div className="space-y-2 mb-3">
                            <p className="text-[10px] text-[#241f18]/45 dark:text-white/30 uppercase tracking-wider font-medium">Objectives</p>
                            <div className="flex flex-wrap gap-1.5">
                                {sec.objectives.map((obj, j) => (
                                    <span key={j} className="text-[10px] text-[#241f18]/60 dark:text-white/60 bg-[#241f18]/[0.06] dark:bg-white/[0.06] px-2 py-0.5 rounded-full">{obj}</span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-[10px] text-[#241f18]/45 dark:text-white/30 uppercase tracking-wider font-medium">Sample Probes</p>
                            {sec.probes.slice(0, 2).map((p, j) => (
                                <p key={j} className="text-[11px] text-[#241f18]/55 dark:text-white/50 pl-3 border-l-2 border-[#ded2c2] dark:border-white/10">{p}</p>
                            ))}
                        </div>

                        {/* Duration bar */}
                        <div className="mt-3 h-1 rounded-full bg-[#241f18]/[0.06] dark:bg-white/[0.06] overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-violet-500/60 to-violet-500/20" style={{ width: `${(sec.durationMinutes / totalMinutes) * 100}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ─── Questions Tab ─────────────────────────────────────────────────────────── */
function QuestionsTab({ expandedItems, toggleExpand }: { expandedItems: Set<string>; toggleExpand: (id: string) => void }) {
    const categories = ['technical', 'domain', 'soft', 'leadership'] as const
    const catConfig: Record<string, { label: string; color: string }> = {
        technical: { label: 'Technical', color: 'text-blue-400' },
        domain: { label: 'Domain', color: 'text-amber-400' },
        soft: { label: 'Soft Skills', color: 'text-emerald-400' },
        leadership: { label: 'Leadership', color: 'text-violet-400' },
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#241f18] dark:text-white">Competency Question Bank</h3>
                <span className="text-[10px] text-[#241f18]/45 dark:text-white/40">{DEMO_QUESTION_BANK.length} questions</span>
            </div>

            {categories.map(cat => {
                const qs = DEMO_QUESTION_BANK.filter(q => q.category === cat)
                if (!qs.length) return null
                return (
                    <div key={cat} className="space-y-2">
                        <h4 className={`text-[11px] font-semibold uppercase tracking-wider ${catConfig[cat].color}`}>{catConfig[cat].label}</h4>
                        {qs.map(q => {
                            const dc = DIFFICULTY_CONFIG[q.difficulty]
                            const isOpen = expandedItems.has(q.id)
                            return (
                                <div key={q.id} className="rounded-xl border border-[#ded2c2] dark:border-white/[0.08] bg-[#241f18]/[0.02] dark:bg-white/[0.02] overflow-hidden">
                                    <button onClick={() => toggleExpand(q.id)} className="w-full px-4 py-3 flex items-start gap-3 text-left">
                                        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#241f18]/45 dark:text-white/30 mt-0.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-[#241f18]/45 dark:text-white/30 mt-0.5 shrink-0" />}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] text-[#241f18]/80 dark:text-white/80">{q.question}</p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${dc.color}`}>{dc.label}</span>
                                                <span className="text-[9px] text-[#241f18]/45 dark:text-white/30">{q.competency}</span>
                                                <span className="text-[9px] text-[#241f18]/45 dark:text-white/20">•</span>
                                                <span className="text-[9px] text-[#241f18]/45 dark:text-white/30">{q.timeAllocation}</span>
                                            </div>
                                        </div>
                                    </button>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            className="px-4 pb-3 border-t border-[#ded2c2]/60 dark:border-white/[0.06] pt-3 space-y-2"
                                        >
                                            <div>
                                                <p className="text-[10px] text-emerald-400/80 font-medium mb-1">✅ Expected Signals</p>
                                                {q.expectedSignals.map((s, i) => (
                                                    <p key={i} className="text-[11px] text-[#241f18]/55 dark:text-white/50 pl-3 border-l border-emerald-500/20 mb-1">{s}</p>
                                                ))}
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-red-400/80 font-medium mb-1">🚩 Red Flags</p>
                                                {q.redFlags.map((f, i) => (
                                                    <p key={i} className="text-[11px] text-[#241f18]/55 dark:text-white/50 pl-3 border-l border-red-500/20 mb-1">{f}</p>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

/* ─── Follow-ups Tab ────────────────────────────────────────────────────────── */
function FollowupsTab() {
    const grouped = DEMO_FOLLOW_UPS.reduce((acc, fu) => {
        if (!acc[fu.baseQuestion]) acc[fu.baseQuestion] = []
        acc[fu.baseQuestion].push(fu)
        return acc
    }, {} as Record<string, typeof DEMO_FOLLOW_UPS>)

    return (
        <div className="space-y-5">
            <div>
                <h3 className="text-sm font-semibold text-[#241f18] dark:text-white">Dynamic Follow-up Generator</h3>
                <p className="text-[11px] text-[#241f18]/45 dark:text-white/40 mt-0.5">Adapts based on candidate response quality</p>
            </div>

            {Object.entries(grouped).map(([question, followUps]) => (
                <div key={question} className="rounded-xl border border-[#ded2c2] dark:border-white/[0.08] bg-[#241f18]/[0.02] dark:bg-white/[0.02] overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#ded2c2]/60 dark:border-white/[0.06]">
                        <p className="text-[10px] text-[#241f18]/45 dark:text-white/30 uppercase tracking-wider font-medium mb-1">Base Question</p>
                        <p className="text-[12px] text-[#241f18]/70 dark:text-white/70 font-medium">{question}</p>
                    </div>
                    <div className="p-3 space-y-2">
                        {followUps.map(fu => {
                            const rc = RESPONSE_QUALITY_CONFIG[fu.responseQuality]
                            return (
                                <div key={fu.id} className="rounded-lg border border-[#ded2c2]/60 dark:border-white/[0.06] bg-[#241f18]/[0.02] dark:bg-white/[0.02] p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${rc.color}`}>{rc.icon} {rc.label} Response</span>
                                        <span className="text-[9px] text-[#241f18]/45 dark:text-white/20">Depth {fu.depth}</span>
                                    </div>
                                    <p className="text-[11px] text-[#241f18]/60 dark:text-white/60 mb-1.5">{fu.followUp}</p>
                                    <p className="text-[10px] text-[#241f18]/45 dark:text-white/30 italic">{fu.purpose}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}

/* ─── Anti-Cheat Tab ────────────────────────────────────────────────────────── */
function AntiCheatTab() {
    const grouped = DEMO_VARIANTS.reduce((acc, v) => {
        if (!acc[v.originalId]) acc[v.originalId] = []
        acc[v.originalId].push(v)
        return acc
    }, {} as Record<string, typeof DEMO_VARIANTS>)

    const original = DEMO_QUESTION_BANK.reduce((acc, q) => {
        acc[q.id] = q
        return acc
    }, {} as Record<string, (typeof DEMO_QUESTION_BANK)[number]>)

    return (
        <div className="space-y-5">
            <div>
                <h3 className="text-sm font-semibold text-[#241f18] dark:text-white">Anti-Cheat Question Variants</h3>
                <p className="text-[11px] text-[#241f18]/45 dark:text-white/40 mt-0.5">Isomorphic versions prevent memorisation and leakage</p>
            </div>

            {Object.entries(grouped).map(([origId, variants]) => (
                <div key={origId} className="rounded-xl border border-[#ded2c2] dark:border-white/[0.08] bg-[#241f18]/[0.02] dark:bg-white/[0.02] overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#ded2c2]/60 dark:border-white/[0.06]">
                        <p className="text-[10px] text-[#241f18]/45 dark:text-white/30 uppercase tracking-wider font-medium mb-1">Original</p>
                        <p className="text-[12px] text-[#241f18]/70 dark:text-white/70 font-medium">{original[origId]?.question || origId}</p>
                    </div>
                    <div className="p-3 grid gap-2">
                        {variants.map(v => (
                            <div key={v.id} className="rounded-lg border border-[#ded2c2]/60 dark:border-white/[0.06] bg-[#241f18]/[0.02] dark:bg-white/[0.02] p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-semibold text-violet-400">{v.variantLabel}</span>
                                    <div className="flex items-center gap-1.5">
                                        {v.isIsomorphic && <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">✓ Isomorphic</span>}
                                        {v.difficultyDelta !== 0 && (
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${v.difficultyDelta > 0 ? 'text-red-400 bg-red-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
                                                {v.difficultyDelta > 0 ? '↑ Harder' : '↓ Easier'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-[11px] text-[#241f18]/60 dark:text-white/60 mb-1.5">{v.question}</p>
                                <p className="text-[10px] text-[#241f18]/45 dark:text-white/30">Context: {v.context}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

/* ─── Guidance Tab ──────────────────────────────────────────────────────────── */
function GuidanceTab({ expandedItems, toggleExpand }: { expandedItems: Set<string>; toggleExpand: (id: string) => void }) {
    return (
        <div className="space-y-5">
            <div>
                <h3 className="text-sm font-semibold text-[#241f18] dark:text-white">Interviewer Guidance Pack</h3>
                <p className="text-[11px] text-[#241f18]/45 dark:text-white/40 mt-0.5">Expected answers, probing strategies, and scoring</p>
            </div>

            {DEMO_INTERVIEWER_GUIDANCE.map(g => {
                const isOpen = expandedItems.has(g.id)
                return (
                    <div key={g.id} className="rounded-xl border border-[#ded2c2] dark:border-white/[0.08] bg-[#241f18]/[0.02] dark:bg-white/[0.02] overflow-hidden">
                        <button onClick={() => toggleExpand(g.id)} className="w-full px-4 py-3 flex items-start gap-2 text-left">
                            {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#241f18]/45 dark:text-white/30 mt-0.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-[#241f18]/45 dark:text-white/30 mt-0.5 shrink-0" />}
                            <p className="text-[12px] text-[#241f18]/70 dark:text-white/70 font-medium">{g.question}</p>
                        </button>
                        {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-4 pb-4 space-y-3 border-t border-[#ded2c2]/60 dark:border-white/[0.06] pt-3">
                                <div>
                                    <p className="text-[10px] text-blue-400/80 font-medium mb-1">📝 Expected Answer</p>
                                    <p className="text-[11px] text-[#241f18]/55 dark:text-white/50">{g.expectedAnswer}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-violet-400/80 font-medium mb-1">🎯 Probing Strategy</p>
                                    {g.probingStrategy.map((s, i) => (
                                        <p key={i} className="text-[11px] text-[#241f18]/55 dark:text-white/50 pl-3 border-l border-violet-500/20 mb-1">{s}</p>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-[10px] text-emerald-400/80 font-medium mb-1">✅ Green Flags</p>
                                        {g.greenFlags.map((f, i) => (
                                            <p key={i} className="text-[10px] text-[#241f18]/45 dark:text-white/40 mb-0.5 flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500/60 shrink-0 mt-0.5" />{f}</p>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-red-400/80 font-medium mb-1">🚩 Red Flags</p>
                                        {g.redFlags.map((f, i) => (
                                            <p key={i} className="text-[10px] text-[#241f18]/45 dark:text-white/40 mb-0.5 flex items-start gap-1"><AlertTriangle className="w-3 h-3 text-red-500/60 shrink-0 mt-0.5" />{f}</p>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-amber-400/80 font-medium mb-1.5">📊 Scoring</p>
                                    <div className="space-y-1">
                                        {g.scoringCriteria.map(sc => (
                                            <div key={sc.score} className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded bg-[#241f18]/[0.06] dark:bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-[#241f18]/60 dark:text-white/60">{sc.score}</span>
                                                <p className="text-[10px] text-[#241f18]/45 dark:text-white/40">{sc.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

/* ─── Instructions Tab ──────────────────────────────────────────────────────── */
function InstructionsTab({ expandedItems, toggleExpand }: { expandedItems: Set<string>; toggleExpand: (id: string) => void }) {
    return (
        <div className="space-y-5">
            <div>
                <h3 className="text-sm font-semibold text-[#241f18] dark:text-white">Candidate Instructions</h3>
                <p className="text-[11px] text-[#241f18]/45 dark:text-white/40 mt-0.5">Auto-generated briefs for each interview section</p>
            </div>

            {DEMO_CANDIDATE_INSTRUCTIONS.map(ci => {
                const isOpen = expandedItems.has(ci.id)
                return (
                    <div key={ci.id} className="rounded-xl border border-[#ded2c2] dark:border-white/[0.08] bg-[#241f18]/[0.02] dark:bg-white/[0.02] overflow-hidden">
                        <button onClick={() => toggleExpand(ci.id)} className="w-full px-4 py-3 flex items-center justify-between text-left">
                            <div className="flex items-center gap-3">
                                {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#241f18]/45 dark:text-white/30 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-[#241f18]/45 dark:text-white/30 shrink-0" />}
                                <div>
                                    <p className="text-[12px] text-[#241f18]/70 dark:text-white/70 font-medium">{ci.section}</p>
                                    <p className="text-[10px] text-[#241f18]/45 dark:text-white/30 mt-0.5">Time limit: {ci.timeLimit}</p>
                                </div>
                            </div>
                        </button>
                        {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-4 pb-4 space-y-3 border-t border-[#ded2c2]/60 dark:border-white/[0.06] pt-3">
                                <div className="rounded-lg bg-[#241f18]/[0.03] dark:bg-white/[0.03] p-3">
                                    <p className="text-[11px] text-[#241f18]/60 dark:text-white/60">{ci.briefing}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#241f18]/45 dark:text-white/30 uppercase tracking-wider font-medium mb-1.5">Expectations</p>
                                    {ci.expectations.map((e, i) => (
                                        <p key={i} className="text-[11px] text-[#241f18]/55 dark:text-white/50 pl-3 border-l border-[#ded2c2] dark:border-white/10 mb-1">{e}</p>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-[10px] text-emerald-400/80 font-medium mb-1">✅ Do</p>
                                        {ci.doList.map((d, i) => (
                                            <p key={i} className="text-[10px] text-[#241f18]/45 dark:text-white/40 mb-0.5">{d}</p>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-red-400/80 font-medium mb-1">❌ Don&apos;t</p>
                                        {ci.dontList.map((d, i) => (
                                            <p key={i} className="text-[10px] text-[#241f18]/45 dark:text-white/40 mb-0.5">{d}</p>
                                        ))}
                                    </div>
                                </div>
                                <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3">
                                    <p className="text-[10px] text-blue-400/80 font-medium mb-1">📋 How You&apos;ll Be Evaluated</p>
                                    <p className="text-[11px] text-[#241f18]/55 dark:text-white/50">{ci.evaluationPreview}</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
