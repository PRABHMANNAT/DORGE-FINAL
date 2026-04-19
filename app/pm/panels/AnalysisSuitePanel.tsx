"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, BarChart3, Brain, MessageSquare, Trophy, ShieldAlert,
    ChevronDown, ChevronRight,
} from "lucide-react"
import {
    DEMO_DECISION_TRACE, DECISION_QUALITY_CONFIG,
    DEMO_COMMUNICATION_SCORE,
    DEMO_BENCHMARK, RECOMMENDATION_CONFIG,
    DEMO_CHEAT_REPORT, SIGNAL_SEVERITY_CONFIG, RISK_CONFIG,
} from "@/lib/pm-analysis-data"

type Tab = 'decision' | 'communication' | 'benchmark' | 'cheat'

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'decision', label: 'Decision Trace', icon: Brain },
    { key: 'communication', label: 'Communication', icon: MessageSquare },
    { key: 'benchmark', label: 'Benchmark', icon: Trophy },
    { key: 'cheat', label: 'Cheat Detect', icon: ShieldAlert },
]

export default function AnalysisSuitePanel({ onClose }: { onClose: () => void }) {
    const [tab, setTab] = useState<Tab>('decision')

    return (
        <div className="h-full flex flex-col bg-[#fffaf2] dark:bg-[#0A0A0A]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#ded2c2]/60 dark:border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-[#241f18] dark:text-white">Analysis Suite</h2>
                        <p className="text-[11px] text-[#241f18]/45 dark:text-white/40 uppercase tracking-wider">Decisions · Communication · Benchmarks</p>
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
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${tab === t.key ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'text-[#241f18]/45 dark:text-white/40 hover:text-[#241f18]/60 dark:hover:text-white/60 hover:bg-[#241f18]/[0.04] dark:hover:bg-white/[0.04]'
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
                    <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                        {tab === 'decision' && <DecisionTab />}
                        {tab === 'communication' && <CommunicationTab />}
                        {tab === 'benchmark' && <BenchmarkTab />}
                        {tab === 'cheat' && <CheatTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

/* ─── Decision Trace Tab ────────────────────────────────────────────────────── */
function DecisionTab() {
    const d = DEMO_DECISION_TRACE

    return (
        <div className="space-y-5">
            <div>
                <h3 className="text-sm font-semibold text-[#241f18] dark:text-white">{d.candidateName} — Decision Trace</h3>
                <p className="text-[11px] text-[#241f18]/45 dark:text-white/40 mt-0.5">{d.taskTitle}</p>
            </div>

            {/* Score overview */}
            <div className="grid grid-cols-4 gap-2">
                {[
                    { label: 'Overall', value: d.overallScore },
                    { label: 'Framing', value: d.framingQuality },
                    { label: 'Trade-offs', value: d.tradeoffArticulation },
                    { label: 'Decomposition', value: d.problemDecomposition },
                ].map(s => (
                    <div key={s.label} className="rounded-lg border border-[#ded2c2] dark:border-white/[0.08] bg-[#241f18]/[0.02] dark:bg-white/[0.02] p-2.5 text-center">
                        <p className="text-[16px] font-bold text-[#241f18]/80 dark:text-white/80">{s.value}</p>
                        <p className="text-[9px] text-[#241f18]/45 dark:text-white/30">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Steps */}
            <div className="space-y-2">
                {d.steps.map((step, i) => {
                    const qc = DECISION_QUALITY_CONFIG[step.quality]
                    return (
                        <div key={step.id} className="rounded-xl border border-[#ded2c2] dark:border-white/[0.08] bg-[#241f18]/[0.02] dark:bg-white/[0.02] p-3">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="w-5 h-5 rounded-full bg-[#241f18]/[0.08] dark:bg-white/[0.08] flex items-center justify-center text-[10px] font-bold text-[#241f18]/60 dark:text-white/60">{i + 1}</span>
                                <span className="text-[11px] text-[#241f18]/70 dark:text-white/70 font-medium flex-1">{step.step}</span>
                                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${qc.color}`}>{qc.label}</span>
                            </div>
                            <p className="text-[10px] text-[#241f18]/55 dark:text-white/50 mb-1.5">{step.description}</p>
                            <p className="text-[10px] text-[#241f18]/45 dark:text-white/30 italic">{step.reasoning}</p>
                        </div>
                    )
                })}
            </div>

            {/* Strengths / Weaknesses */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <p className="text-[10px] text-emerald-400 font-medium mb-1.5">✅ Strengths</p>
                    {d.strengths.map((s, i) => <p key={i} className="text-[10px] text-[#241f18]/45 dark:text-white/40 mb-0.5">{s}</p>)}
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                    <p className="text-[10px] text-amber-400 font-medium mb-1.5">⚠️ Weaknesses</p>
                    {d.weaknesses.map((w, i) => <p key={i} className="text-[10px] text-[#241f18]/45 dark:text-white/40 mb-0.5">{w}</p>)}
                </div>
            </div>
        </div>
    )
}

/* ─── Communication Tab ─────────────────────────────────────────────────────── */
function CommunicationTab() {
    const c = DEMO_COMMUNICATION_SCORE
    const quoteColors: Record<string, string> = { strong: 'border-emerald-500/30 bg-emerald-500/5', adequate: 'border-amber-500/20 bg-amber-500/5', weak: 'border-red-500/20 bg-red-500/5' }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-[#241f18] dark:text-white">{c.candidateName} — Communication</h3>
                    <p className="text-[11px] text-[#241f18]/45 dark:text-white/40 mt-0.5">Overall: {c.overallScore}/100</p>
                </div>
                <div className="w-14 h-14 rounded-full border-2 border-rose-500/30 flex items-center justify-center">
                    <span className="text-[18px] font-bold text-rose-400">{c.overallScore}</span>
                </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-2">
                {c.dimensions.map(dim => (
                    <div key={dim.dimension} className="rounded-lg border border-[#ded2c2] dark:border-white/[0.08] bg-[#241f18]/[0.02] dark:bg-white/[0.02] p-3">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] text-[#241f18]/70 dark:text-white/70 font-medium">{dim.icon} {dim.dimension}</span>
                            <span className="text-[11px] text-[#241f18]/60 dark:text-white/60 font-mono font-bold">{dim.score}/{dim.maxScore}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#241f18]/[0.06] dark:bg-white/[0.06] overflow-hidden mb-2">
                            <div className="h-full rounded-full bg-gradient-to-r from-rose-500/60 to-rose-500/20" style={{ width: `${dim.score}%` }} />
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {dim.examples.map((ex, i) => <span key={i} className="text-[9px] text-[#241f18]/45 dark:text-white/30 bg-[#241f18]/[0.04] dark:bg-white/[0.04] px-1.5 py-0.5 rounded">{ex}</span>)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sample Quotes */}
            <div>
                <p className="text-[10px] text-[#241f18]/45 dark:text-white/30 uppercase tracking-wider font-medium mb-2">Sample Quotes</p>
                {c.sampleQuotes.map((sq, i) => (
                    <div key={i} className={`rounded-lg border p-3 mb-2 ${quoteColors[sq.rating]}`}>
                        <p className="text-[11px] text-[#241f18]/60 dark:text-white/60 italic">&ldquo;{sq.quote}&rdquo;</p>
                        <p className="text-[9px] text-[#241f18]/45 dark:text-white/30 mt-1">{sq.context} — {sq.rating}</p>
                    </div>
                ))}
            </div>

            {/* Strengths / Areas */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <p className="text-[10px] text-emerald-400 font-medium mb-1.5">✅ Strengths</p>
                    {c.topStrengths.map((s, i) => <p key={i} className="text-[10px] text-[#241f18]/45 dark:text-white/40 mb-0.5">{s}</p>)}
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                    <p className="text-[10px] text-amber-400 font-medium mb-1.5">📈 Improve</p>
                    {c.areasForImprovement.map((a, i) => <p key={i} className="text-[10px] text-[#241f18]/45 dark:text-white/40 mb-0.5">{a}</p>)}
                </div>
            </div>
        </div>
    )
}

/* ─── Benchmark Tab ─────────────────────────────────────────────────────────── */
function BenchmarkTab() {
    const b = DEMO_BENCHMARK
    const rc = RECOMMENDATION_CONFIG[b.recommendation]

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-[#241f18] dark:text-white">{b.candidateName} — Work Benchmark</h3>
                    <p className="text-[11px] text-[#241f18]/45 dark:text-white/40 mt-0.5">{b.taskTitle}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${rc.color}`}>
                    <span>{rc.icon}</span>
                    <span className="text-[10px] font-medium">{rc.label}</span>
                </div>
            </div>

            {/* Overall Percentile */}
            <div className="rounded-xl border border-[#ded2c2] dark:border-white/[0.08] bg-[#241f18]/[0.02] dark:bg-white/[0.02] p-4 text-center">
                <p className="text-[10px] text-[#241f18]/45 dark:text-white/30 uppercase tracking-wider mb-1">Overall Percentile</p>
                <p className="text-[32px] font-bold text-[#241f18]/80 dark:text-white/80">P{b.overallPercentile}</p>
                <div className="h-2 rounded-full bg-[#241f18]/[0.06] dark:bg-white/[0.06] overflow-hidden mt-2 mx-8">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500/60 to-emerald-500/20" style={{ width: `${b.overallPercentile}%` }} />
                </div>
            </div>

            {/* Metrics */}
            <div className="space-y-2">
                {b.metrics.map(m => {
                    const position = ((m.candidateScore - m.p25) / (m.p90 - m.p25)) * 100
                    return (
                        <div key={m.metric} className="rounded-lg border border-[#ded2c2] dark:border-white/[0.08] bg-[#241f18]/[0.02] dark:bg-white/[0.02] p-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] text-[#241f18]/70 dark:text-white/70 font-medium">{m.metric}</span>
                                <span className="text-[11px] text-[#241f18]/60 dark:text-white/60 font-mono font-bold">{m.candidateScore}{m.unit}</span>
                            </div>
                            <div className="relative h-2 rounded-full bg-[#241f18]/[0.06] dark:bg-white/[0.06] mb-1.5">
                                {/* Percentile markers */}
                                <div className="absolute top-0 h-full w-px bg-[#241f18]/10 dark:bg-white/10" style={{ left: '0%' }} />
                                <div className="absolute top-0 h-full w-px bg-[#241f18]/10 dark:bg-white/10" style={{ left: '38%' }} />
                                <div className="absolute top-0 h-full w-px bg-[#241f18]/10 dark:bg-white/10" style={{ left: '77%' }} />
                                <div className="absolute top-0 h-full w-px bg-[#241f18]/10 dark:bg-white/10" style={{ left: '100%' }} />
                                {/* Candidate marker */}
                                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-400 border-2 border-[#0A0A0A]" style={{ left: `${Math.min(Math.max(position, 0), 100)}%` }} />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[8px] text-[#241f18]/45 dark:text-white/20">P25</span>
                                <span className="text-[8px] text-[#241f18]/45 dark:text-white/20">P50</span>
                                <span className="text-[8px] text-[#241f18]/45 dark:text-white/20">P75</span>
                                <span className="text-[8px] text-[#241f18]/45 dark:text-white/20">P90</span>
                            </div>
                            <p className="text-[9px] text-[#241f18]/45 dark:text-white/30 mt-1">{m.interpretation}</p>
                        </div>
                    )
                })}
            </div>

            {/* Comparison */}
            <div>
                <p className="text-[10px] text-[#241f18]/45 dark:text-white/30 uppercase tracking-wider font-medium mb-2">vs Previous Candidates</p>
                <div className="space-y-1">
                    {b.comparisons.map((c, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="text-[10px] text-[#241f18]/55 dark:text-white/50 w-28 truncate">{c.name}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-[#241f18]/[0.06] dark:bg-white/[0.06] overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${c.score}%`, backgroundColor: c.hired ? '#34D399' : c.name === b.candidateName ? '#F472B6' : '#EF4444' }} />
                            </div>
                            <span className="text-[9px] text-[#241f18]/45 dark:text-white/30 font-mono w-6">{c.score}</span>
                            <span className="text-[9px]">{c.hired ? '✅' : c.name === b.candidateName ? '🔵' : '❌'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ─── Cheat Detection Tab ───────────────────────────────────────────────────── */
function CheatTab() {
    const r = DEMO_CHEAT_REPORT
    const risk = RISK_CONFIG[r.overallRisk]

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-[#241f18] dark:text-white">{r.candidateName} — Cheat Detection</h3>
                    <p className="text-[11px] text-[#241f18]/45 dark:text-white/40 mt-0.5">{r.taskTitle}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-1 rounded ${risk.color}`}>{risk.label}</span>
            </div>

            {/* Risk gauges */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#ded2c2] dark:border-white/[0.08] bg-[#241f18]/[0.02] dark:bg-white/[0.02] p-3 text-center">
                    <p className="text-[10px] text-[#241f18]/45 dark:text-white/30 mb-1">Overall Confidence</p>
                    <p className="text-[24px] font-bold text-[#241f18]/80 dark:text-white/80">{r.overallConfidence}%</p>
                    <div className="h-1.5 rounded-full bg-[#241f18]/[0.06] dark:bg-white/[0.06] overflow-hidden mt-1">
                        <div className="h-full rounded-full bg-amber-500/50" style={{ width: `${r.overallConfidence}%` }} />
                    </div>
                </div>
                <div className="rounded-xl border border-[#ded2c2] dark:border-white/[0.08] bg-[#241f18]/[0.02] dark:bg-white/[0.02] p-3 text-center">
                    <p className="text-[10px] text-[#241f18]/45 dark:text-white/30 mb-1">AI Usage Probability</p>
                    <p className="text-[24px] font-bold text-amber-400">{r.aiUsageProbability}%</p>
                    <div className="h-1.5 rounded-full bg-[#241f18]/[0.06] dark:bg-white/[0.06] overflow-hidden mt-1">
                        <div className="h-full rounded-full bg-red-500/50" style={{ width: `${r.aiUsageProbability}%` }} />
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-[#ded2c2] dark:border-white/[0.08] bg-[#241f18]/[0.02] dark:bg-white/[0.02] p-3">
                <p className="text-[11px] text-[#241f18]/55 dark:text-white/50">{r.summary}</p>
            </div>

            {/* Signals */}
            <div>
                <p className="text-[10px] text-[#241f18]/45 dark:text-white/30 uppercase tracking-wider font-medium mb-2">Detection Signals</p>
                {r.signals.map(sig => {
                    const sev = SIGNAL_SEVERITY_CONFIG[sig.severity]
                    return (
                        <div key={sig.id} className={`rounded-xl border p-3 mb-2 ${sev.color}`}>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[11px]">{sev.icon}</span>
                                <span className="text-[11px] text-[#241f18]/70 dark:text-white/70 font-medium flex-1">{sig.description}</span>
                                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${sev.color}`}>{sev.label}</span>
                            </div>
                            <p className="text-[10px] text-[#241f18]/45 dark:text-white/40 mb-1.5">{sig.evidence}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] text-[#241f18]/45 dark:text-white/30">Confidence: {sig.confidence}%</span>
                                <span className="text-[9px] text-[#241f18]/45 dark:text-white/20">{sig.signalType}</span>
                            </div>
                            <div className="rounded-lg bg-[#241f18]/[0.03] dark:bg-white/[0.03] p-2 mt-2">
                                <p className="text-[9px] text-blue-400/60 font-medium mb-0.5">💡 Recommendation</p>
                                <p className="text-[9px] text-[#241f18]/45 dark:text-white/40">{sig.recommendation}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
