"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, Microscope, FileSearch, Box, Video, Play,
    ChevronDown, ChevronRight, Clock, ExternalLink,
    Zap, Shield, Activity, Award, TrendingUp, Radar
} from "lucide-react"
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar,
    BarChart, Bar, Cell
} from "recharts"
import {
    DEMO_PROOF_ITEMS, VERDICT_CONFIG,
    DEMO_SANDBOXES, SANDBOX_STATUS_CONFIG,
    DEMO_ASYNC_INTERVIEW,
    DEMO_REPLAY,
} from "@/lib/pm-proof-data"
import { Button } from "@/components/ui/button"

type Tab = 'proof' | 'sandbox' | 'async' | 'replay'

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'proof', label: 'Proof Check', icon: FileSearch },
    { key: 'sandbox', label: 'Sandboxes', icon: Box },
    { key: 'async', label: 'Async Interview', icon: Video },
    { key: 'replay', label: 'Replay', icon: Play },
]

// ─── Verification Velocity Chart Data (Mock) ─────────────────────────────────
const VELOCITY_DATA = [
    { time: "09:00", velocity: 45, accuracy: 88 },
    { time: "10:00", velocity: 52, accuracy: 91 },
    { time: "11:00", velocity: 48, accuracy: 89 },
    { time: "12:00", velocity: 65, accuracy: 94 },
    { time: "13:00", velocity: 78, accuracy: 96 },
    { time: "14:00", velocity: 72, accuracy: 93 },
    { time: "15:00", velocity: 85, accuracy: 98 },
]

// ─── Skill Radar Data (Mock) ─────────────────────────────────────────────────
const SKILL_DATA = [
    { subject: 'System Design', A: 120, fullMark: 150 },
    { subject: 'Algorithm', A: 98, fullMark: 150 },
    { subject: 'Database', A: 86, fullMark: 150 },
    { subject: 'Security', A: 99, fullMark: 150 },
    { subject: 'DevOps', A: 85, fullMark: 150 },
    { subject: 'Testing', A: 65, fullMark: 150 },
]

// ─── Component ───────────────────────────────────────────────────────────────
export default function ProofEnginePanel({ onClose }: { onClose: () => void }) {
    const [tab, setTab] = useState<Tab>('proof')

    return (
        <div className="h-full flex flex-col bg-[#fffaf2] dark:bg-[#030303] text-[#241f18] dark:text-white selection:bg-cyan-500/30">
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#ded2c2]/60 dark:border-white/[0.06] flex items-center justify-between bg-[#fffaf2]/80 dark:bg-[#030303]/80 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.15)]">
                        <Microscope className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[#241f18] dark:text-white tracking-tight">Proof Engine™</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[11px] text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest font-mono">Verification Protocol Active</p>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-[#241f18]/10 dark:hover:bg-white/10 w-10 h-10">
                    <X className="w-5 h-5 text-[#241f18]/60 dark:text-white/60" />
                </Button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-8 pt-4 pb-2 border-b border-[#ded2c2]/60 dark:border-white/[0.06] flex gap-6 overflow-x-auto">
                {TABS.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`group relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${tab === t.key ? 'text-cyan-400' : 'text-[#241f18]/45 dark:text-white/40 hover:text-[#241f18]/80 dark:hover:text-white/80'
                            }`}
                    >
                        <t.icon className={`w-4 h-4 ${tab === t.key ? 'text-cyan-400' : 'text-[#241f18]/45 dark:text-white/40 group-hover:text-[#241f18]/60 dark:group-hover:text-white/60'}`} />
                        {t.label}
                        {tab === t.key && (
                            <motion.div
                                layoutId="active-tab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-7xl mx-auto"
                    >
                        {tab === 'proof' && <ProofTab />}
                        {tab === 'sandbox' && <SandboxTab />}
                        {tab === 'async' && <AsyncTab />}
                        {tab === 'replay' && <ReplayTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

/* ─── Tabs Implementation ──────────────────────────────────────────────────── */

function ProofTab() {
    const grouped = DEMO_PROOF_ITEMS.reduce((acc, pi) => {
        if (!acc[pi.candidateName]) acc[pi.candidateName] = []
        acc[pi.candidateName].push(pi)
        return acc
    }, {} as Record<string, typeof DEMO_PROOF_ITEMS>)

    return (
        <div className="space-y-8">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 rounded-3xl border border-[#ded2c2]/60 dark:border-white/[0.06] bg-[#fffaf2] dark:bg-[#08080A] p-6 relative overflow-hidden group">
                    {/* Gradient BG */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div>
                            <h3 className="text-sm font-bold text-[#241f18] dark:text-white uppercase tracking-wider">Verification Velocity</h3>
                            <p className="text-xs text-[#241f18]/45 dark:text-white/40 mt-1">Real-time claim validation throughput</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-xs font-bold text-emerald-400">+12.5%</span>
                        </div>
                    </div>

                    <div className="h-[200px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={VELOCITY_DATA}>
                                <defs>
                                    <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" stroke="var(--pm-chart-muted)" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--pm-tooltip-bg)', border: '1px solid var(--pm-tooltip-border)', borderRadius: '8px', backdropFilter: 'blur(8px)' }}
                                    itemStyle={{ color: 'var(--pm-tooltip-text)', fontSize: '12px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="velocity"
                                    stroke="#22d3ee"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorVelocity)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-3xl border border-[#ded2c2]/60 dark:border-white/[0.06] bg-[#fffaf2] dark:bg-[#08080A] p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
                    <div>
                        <h3 className="text-sm font-bold text-[#241f18] dark:text-white uppercase tracking-wider mb-2">Proof Score</h3>
                        <p className="text-xs text-[#241f18]/45 dark:text-white/40">Overall integrity rating</p>
                    </div>
                    <div className="flex items-center justify-center flex-1">
                        <div className="relative flex items-center justify-center w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#241f18]/45 dark:text-white/5" />
                                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="377" strokeDashoffset="37" className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-3xl font-bold text-[#241f18] dark:text-white">92</span>
                                <span className="text-[10px] text-emerald-400 font-bold uppercase">Great</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Candidate Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(grouped).map(([name, items], idx) => (
                    <motion.div
                        key={name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="rounded-3xl border border-[#ded2c2]/60 dark:border-white/[0.06] bg-[#fffaf2] dark:bg-[#08080A] overflow-hidden hover:border-[#ded2c2] dark:hover:border-white/10 transition-colors"
                    >
                        <div className="bg-[#241f18]/[0.02] dark:bg-white/[0.02] border-b border-[#ded2c2]/60 dark:border-white/[0.06] p-4 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-[#241f18] dark:text-white text-sm">{name}</h4>
                                <p className="text-[10px] text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest font-mono">ID: CAND-{4920 + idx}</p>
                            </div>
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                                View Profile <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                        </div>
                        <div className="p-4 space-y-3">
                            {items.map(pi => {
                                const vc = VERDICT_CONFIG[pi.verdict]
                                return (
                                    <div key={pi.id} className="group relative rounded-xl border border-[#ded2c2]/60 dark:border-white/5 bg-[#241f18]/[0.02] dark:bg-white/[0.02] p-3 hover:bg-[#241f18]/[0.04] dark:hover:bg-white/[0.04] transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#241f18]/5 dark:bg-white/5 text-[#241f18]/60 dark:text-white/60 border border-[#ded2c2]/60 dark:border-white/5 truncate max-w-[120px]">
                                                {pi.credential}
                                            </span>
                                            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${vc.color}`}>
                                                {vc.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#ded2c2]/60 dark:border-white/5">
                                            <span className="text-[10px] text-[#241f18]/45 dark:text-white/30">Confidence</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1 rounded-full bg-[#241f18]/10 dark:bg-white/10 overflow-hidden">
                                                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${pi.confidenceScore}%` }} />
                                                </div>
                                                <span className="text-[10px] font-mono text-cyan-400">{pi.confidenceScore}%</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

function SandboxTab() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-xl font-bold text-[#241f18] dark:text-white">Sandbox Environments</h3>
                    <p className="text-sm text-[#241f18]/45 dark:text-white/40 mt-1">Live testing containers for practical assessments.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {DEMO_SANDBOXES.map((sb, i) => {
                    const sc = SANDBOX_STATUS_CONFIG[sb.status]
                    return (
                        <div key={sb.id} className="relative group rounded-2xl border border-[#ded2c2] dark:border-white/[0.08] bg-[#fffaf2] dark:bg-[#0A0A0C] p-6 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                <ExternalLink className="w-4 h-4 text-cyan-400 cursor-pointer" />
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#241f18]/5 dark:bg-white/5 flex items-center justify-center border border-[#ded2c2]/60 dark:border-white/5">
                                    <Box className="w-5 h-5 text-[#241f18]/60 dark:text-white/60 group-hover:text-cyan-400 transition-colors" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#241f18] dark:text-white">{sb.name}</h4>
                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium mt-1 ${sc.color}`}>
                                        {sc.label}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#241f18]/45 dark:text-white/40">Resources</span>
                                    <span className="text-[#241f18]/80 dark:text-white/80 font-mono">{sb.resourceLimits.cpu} / {sb.resourceLimits.memory}</span>
                                </div>
                                <div className="w-full h-px bg-[#241f18]/10 dark:bg-white/10" />
                                <div className="flex flex-wrap gap-1.5">
                                    {sb.stack.map(s => (
                                        <span key={s} className="px-2 py-0.5 rounded-md bg-cyan-950/30 text-cyan-400 border border-cyan-900/30 text-[10px] font-mono">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function AsyncTab() {
    const ai = DEMO_ASYNC_INTERVIEW
    return (
        <div className="grid grid-cols-3 gap-6">
            {/* Left Col: Stats */}
            <div className="space-y-4">
                <div className="rounded-2xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#0A0A0C] p-6 text-center">
                    <div className="text-4xl font-bold text-[#241f18] dark:text-white mb-1">{ai.candidateCount}</div>
                    <div className="text-xs text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest">Candidates</div>
                </div>
                <div className="rounded-2xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#0A0A0C] p-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
                    <div className="text-4xl font-bold text-cyan-400 mb-1">{ai.completionRate}%</div>
                    <div className="text-xs text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest">Completion Rate</div>
                </div>
            </div>

            {/* Right Col: Radar Chart */}
            <div className="col-span-2 rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#0A0A0C] p-6 flex flex-col items-center justify-center relative">
                <h4 className="absolute top-6 left-6 text-sm font-bold text-[#241f18] dark:text-white uppercase tracking-wider">Skill Capability Matrix</h4>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILL_DATA}>
                            <PolarGrid stroke="var(--pm-chart-grid)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--pm-chart-axis)', fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <RechartsRadar
                                name="Candidate Average"
                                dataKey="A"
                                stroke="#22d3ee"
                                strokeWidth={2}
                                fill="#22d3ee"
                                fillOpacity={0.3}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--pm-tooltip-bg)', border: '1px solid var(--pm-tooltip-border)', backdropFilter: 'blur(4px)' }}
                                itemStyle={{ color: 'var(--pm-tooltip-text)' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

function ReplayTab() {
    const r = DEMO_REPLAY
    return (
        <div className="rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#0A0A0C] overflow-hidden">
            <div className="h-64 bg-[#f7f3ec] dark:bg-black relative flex items-center justify-center group cursor-pointer">
                {/* Simulated Video Player */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=2874&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="w-16 h-16 rounded-full bg-[#241f18]/10 dark:bg-white/10 backdrop-blur-sm border border-[#ded2c2] dark:border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-[#241f18] dark:text-white ml-1" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#f7f3ec] dark:from-black to-transparent">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-lg font-bold text-[#241f18] dark:text-white">{r.taskTitle}</h3>
                            <p className="text-xs text-[#241f18]/55 dark:text-white/50">{r.candidateName} • {r.totalDuration}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 grid grid-cols-2 gap-8">
                <div>
                    <h4 className="text-xs font-bold text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest mb-4">Event Timeline</h4>
                    <div className="space-y-4 border-l border-[#ded2c2] dark:border-white/10 pl-4">
                        {r.events.map((ev, i) => (
                            <div key={i} className="relative">
                                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#fffaf2] dark:bg-[#0A0A0C] border border-[#ded2c2] dark:border-white/20" />
                                <span className="text-[10px] text-cyan-400 font-mono block mb-0.5">{ev.timestamp}</span>
                                <p className="text-sm text-[#241f18]/90 dark:text-white/90">{ev.event}</p>
                                <p className="text-xs text-[#241f18]/45 dark:text-white/40 mt-1">{ev.insight}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                        <div className="flex items-center gap-2 mb-3">
                            <Award className="w-4 h-4 text-emerald-400" />
                            <h4 className="text-sm font-bold text-emerald-400">Key Strengths</h4>
                        </div>
                        <ul className="space-y-1">
                            {r.strengthSignals.map((s, i) => (
                                <li key={i} className="text-xs text-[#241f18]/70 dark:text-white/70">• {s}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
