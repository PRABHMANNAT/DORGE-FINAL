"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, Activity, TrendingUp, AlertTriangle, MessageSquare, Users, ArrowRightLeft, Map,
    ArrowUp, ArrowDown, Minus, ChevronRight, ChevronDown, Zap, Search, Filter, MoreHorizontal
} from "lucide-react"
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    BarChart, Bar, Cell, LineChart, Line, PieChart, Pie, Legend
} from "recharts"
import {
    DEMO_PERFORMANCE_SUMMARIES,
    DEMO_PROMOTION_CASE,
    DEMO_UNDERPERFORMANCE_ALERTS,
    DEMO_COACHING,
    DEMO_PEER_REPORT,
    DEMO_MOBILITY,
    DEMO_CAPABILITY_MAP,
} from "@/lib/pm-performance-data"
import { Button } from "@/components/ui/button"

type Tab = 'performance' | 'promotion' | 'underperformance' | 'coaching' | 'peers' | 'mobility' | 'capability'

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'performance', label: 'Performance', icon: Activity },
    { key: 'promotion', label: 'Promotion', icon: TrendingUp },
    { key: 'underperformance', label: 'Alerts', icon: AlertTriangle },
    { key: 'coaching', label: 'Coaching', icon: MessageSquare },
    { key: 'peers', label: 'Peers', icon: Users },
    { key: 'mobility', label: 'Mobility', icon: ArrowRightLeft },
    { key: 'capability', label: 'Skills', icon: Map },
]

export default function PerformanceIntelPanel({ onClose }: { onClose: () => void }) {
    const [tab, setTab] = useState<Tab>('performance')

    return (
        <div className="h-full flex flex-col bg-[#fffaf2] dark:bg-[#030303] text-[#241f18] dark:text-white selection:bg-violet-500/30">
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#ded2c2]/60 dark:border-white/[0.06] flex items-center justify-between bg-[#fffaf2]/80 dark:bg-[#030303]/80 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-600/10 border border-violet-500/20 flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.15)]">
                        <Activity className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[#241f18] dark:text-white tracking-tight">Performance Intel</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                            <p className="text-[11px] text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest font-mono">People Analytics Active</p>
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
                        className={`group relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${tab === t.key ? 'text-violet-400' : 'text-[#241f18]/45 dark:text-white/40 hover:text-[#241f18]/80 dark:hover:text-white/80'
                            }`}
                    >
                        <t.icon className={`w-4 h-4 ${tab === t.key ? 'text-violet-400' : 'text-[#241f18]/45 dark:text-white/40 group-hover:text-[#241f18]/60 dark:group-hover:text-white/60'}`} />
                        {t.label}
                        {tab === t.key && (
                            <motion.div
                                layoutId="active-perf-tab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
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
                        {tab === 'performance' && <PerformanceTab />}
                        {tab === 'promotion' && <PromotionTab />}
                        {tab === 'underperformance' && <AlertsTab />}
                        {tab === 'coaching' && <CoachingTab />}
                        {tab === 'peers' && <PeersTab />}
                        {tab === 'mobility' && <MobilityTab />}
                        {tab === 'capability' && <CapabilityTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

/* ─── Components ───────────────────────────────────────────────────────────── */

function PerformanceTab() {
    const [sel, setSel] = useState(0)
    const emp = DEMO_PERFORMANCE_SUMMARIES[sel]

    // Transform signals for Radar
    const radarData = emp.signals.map(s => ({
        subject: s.metric.split('/')[0],
        A: s.value,
        fullMark: s.maxValue
    }))

    // Trend Mock Data for Sparkline
    const trendData = emp.weeklyScores.map((val, i) => ({ name: `W${i}`, value: val }))

    return (
        <div className="space-y-8">
            <div className="flex gap-6">
                {/* Employee List */}
                <div className="w-1/4 space-y-3">
                    {DEMO_PERFORMANCE_SUMMARIES.map((e, i) => (
                        <button
                            key={e.employeeId}
                            onClick={() => setSel(i)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${sel === i
                                ? 'bg-violet-500/10 border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                                : 'bg-[#fffaf2] dark:bg-[#0A0A0C] border-[#ded2c2]/60 dark:border-white/5 hover:bg-[#241f18]/5 dark:hover:bg-white/5'
                                }`}
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#241f18]/10 dark:from-white/10 to-[#241f18]/5 dark:to-white/5 flex items-center justify-center text-sm font-bold text-[#241f18] dark:text-white">
                                {e.avatar}
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-[#241f18] dark:text-white">{e.name}</div>
                                <div className="text-xs text-[#241f18]/45 dark:text-white/40">{e.role}</div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Main Dashboard */}
                <div className="flex-1 space-y-6">
                    {/* Top Row: Score & Radar */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-1 rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#08080A] p-6 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent opacity-50" />
                            <div className="relative z-10 text-center">
                                <div className="text-6xl font-bold text-[#241f18] dark:text-white mb-2">{emp.overallScore}</div>
                                <div className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">Overall Score</div>
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${emp.trend === 'rising' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                    }`}>
                                    {emp.trend === 'rising' ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                                    {emp.trendDelta}% vs last qtr
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#08080A] p-4 relative">
                            <h4 className="absolute top-6 left-6 text-xs font-bold text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest">Performance Dimensions</h4>
                            <div className="w-full h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                        <PolarGrid stroke="var(--pm-chart-grid)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--pm-chart-axis)', fontSize: 10 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar name={emp.name} dataKey="A" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.3} />
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--pm-tooltip-bg)', border: '1px solid var(--pm-tooltip-border)', backdropFilter: 'blur(4px)' }} itemStyle={{ color: 'var(--pm-tooltip-text)' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Trend */}
                    <div className="rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#08080A] p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xs font-bold text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest">12-Week Performance Trend</h4>
                        </div>
                        <div className="h-[150px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--pm-chart-grid)" vertical={false} />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--pm-tooltip-bg)', border: '1px solid var(--pm-tooltip-border)', backdropFilter: 'blur(4px)' }} itemStyle={{ color: 'var(--pm-tooltip-text)' }} />
                                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PromotionTab() {
    const p = DEMO_PROMOTION_CASE

    // Transform for Radar Comparison
    const radarData = p.comparisons.map(c => ({
        subject: c.metric.split(' ')[0],
        Candidate: c.candidate,
        LevelAvg: c.nextLevelAvg,
        fullMark: 100
    }))

    return (
        <div className="grid grid-cols-3 gap-6">
            {/* Left Profile */}
            <div className="space-y-6">
                <div className="rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#08080A] p-8 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-3xl font-bold text-[#241f18] dark:text-white mb-4 shadow-lg shadow-cyan-500/20">
                            {p.name.charAt(0)}
                        </div>
                        <h3 className="text-xl font-bold text-[#241f18] dark:text-white">{p.name}</h3>
                        <p className="text-sm text-[#241f18]/45 dark:text-white/40 mt-1">{p.currentLevel} → {p.targetLevel}</p>
                        <div className="mt-6 inline-flex px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wide">
                            {p.readinessLabel} ({p.readinessScore}%)
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#08080A] p-6">
                    <h4 className="text-xs font-bold text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest mb-4">Evidence</h4>
                    <div className="space-y-4">
                        {p.evidenceAreas.map(e => (
                            <div key={e.area}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-[#241f18]/70 dark:text-white/70">{e.area}</span>
                                    <span className="text-[#241f18] dark:text-white font-mono">{e.score}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#241f18]/5 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${e.score}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Comparison */}
            <div className="col-span-2 space-y-6">
                <div className="rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#08080A] p-6 h-[400px] relative">
                    <h4 className="absolute top-6 left-6 text-xs font-bold text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest">Candidate vs L6 Average</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="var(--pm-chart-grid)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--pm-chart-axis)', fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Candidate" dataKey="Candidate" stroke="#22d3ee" strokeWidth={3} fill="#22d3ee" fillOpacity={0.4} />
                            <Radar name="Level Average" dataKey="LevelAvg" stroke="var(--pm-chart-axis)" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--pm-tooltip-bg)', border: '1px solid var(--pm-tooltip-border)', backdropFilter: 'blur(4px)' }} itemStyle={{ color: 'var(--pm-tooltip-text)' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                <div className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-6 flex gap-4">
                    <Zap className="w-5 h-5 text-violet-400 shrink-0" />
                    <div>
                        <h4 className="text-sm font-bold text-violet-400 mb-1">AI Recommendation</h4>
                        <p className="text-xs text-[#241f18]/70 dark:text-white/70 leading-relaxed">{p.recommendation}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AlertsTab() {
    return (
        <div className="grid grid-cols-2 gap-4">
            {DEMO_UNDERPERFORMANCE_ALERTS.map(alert => (
                <div key={alert.id} className="rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#08080A] p-6 hover:border-red-500/30 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#241f18]/5 dark:bg-white/5 flex items-center justify-center font-bold text-[#241f18]/55 dark:text-white/50">
                                {alert.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-[#241f18] dark:text-white">{alert.name}</h4>
                                <p className="text-xs text-[#241f18]/45 dark:text-white/40">{alert.role}</p>
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${alert.riskLevel === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                            {alert.riskLevel} Risk
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        {alert.signals.map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#241f18]/[0.02] dark:bg-white/[0.02]">
                                <span className="text-xs text-[#241f18]/70 dark:text-white/70">{s.signal}</span>
                                <span className="text-xs font-mono text-[#241f18]/45 dark:text-white/30">{s.dataPoint}</span>
                            </div>
                        ))}
                    </div>

                    <div className="h-[60px] w-full opacity-50 group-hover:opacity-100 transition-opacity">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={alert.weeklyTrend.map((v, i) => ({ val: v, idx: i }))}>
                                <Line type="monotone" dataKey="val" stroke={alert.riskLevel === 'critical' ? '#f87171' : '#fbbf24'} strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ))}
        </div>
    )
}

function CoachingTab() {
    const pieData = [
        { name: 'Feedback', value: 45, fill: '#3b82f6' },
        { name: 'Growth', value: 30, fill: '#8b5cf6' },
        { name: 'Conflict', value: 15, fill: '#ef4444' },
        { name: 'Recognition', value: 10, fill: '#fbbf24' },
    ]

    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
                {DEMO_COACHING.map(c => (
                    <div key={c.id} className="rounded-2xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#08080A] p-6 hover:bg-[#241f18]/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="w-1 h-full min-h-[40px] rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
                                <div>
                                    <h4 className="font-bold text-[#241f18] dark:text-white mb-1 group-hover:text-violet-400 transition-colors">{c.scenario}</h4>
                                    <p className="text-xs text-[#241f18]/45 dark:text-white/40">{c.category} • {c.urgency} priority</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#241f18]/45 dark:text-white/20 group-hover:text-[#241f18]/60 dark:group-hover:text-white/60" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#08080A] p-6 flex flex-col items-center justify-center">
                <h4 className="text-xs font-bold text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest mb-4">Focus Areas</h4>
                <div className="w-[180px] h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(0,0,0,0.5)" />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'var(--pm-tooltip-bg)', border: '1px solid var(--pm-tooltip-border)' }} itemStyle={{ color: 'var(--pm-tooltip-text)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

function PeersTab() {
    const r = DEMO_PEER_REPORT
    const sentimentData = r.themes.map(t => ({
        name: t.theme.split(' ')[0],
        value: t.frequency,
        sentiment: t.sentiment
    }))

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#08080A]">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#241f18] dark:text-white">{r.name} - Peer Feedback 360</h3>
                    <p className="text-sm text-[#241f18]/45 dark:text-white/40 mt-1">{r.feedbackCount} signals across {r.period}</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-[#241f18] dark:text-white">{r.overallSentiment}%</div>
                    <div className="text-xs text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest">Sentiment Score</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#08080A] p-6">
                    <h4 className="text-xs font-bold text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest mb-6">Theme Frequency</h4>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sentimentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--pm-chart-grid)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--pm-chart-axis)" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'var(--pm-chart-cursor)' }} contentStyle={{ backgroundColor: 'var(--pm-tooltip-bg)', border: '1px solid var(--pm-tooltip-border)' }} itemStyle={{ color: 'var(--pm-tooltip-text)' }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {sentimentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.sentiment === 'positive' ? '#34d399' : entry.sentiment === 'negative' ? '#f87171' : '#fbbf24'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-4">
                    {r.verbatims.map((v, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-[#241f18]/[0.03] dark:bg-white/[0.03] border border-[#ded2c2]/60 dark:border-white/5 italic text-sm text-[#241f18]/70 dark:text-white/70">
                            "{v.quote}"
                            <div className="mt-2 text-xs text-[#241f18]/45 dark:text-white/30 not-italic font-mono">— {v.context}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function MobilityTab() {
    return (
        <div className="grid grid-cols-2 gap-6">
            {DEMO_MOBILITY.map(m => {
                const radarData = m.skillOverlap.map(s => ({ subject: s.skill, A: s.current, B: s.required, fullMark: 100 }))
                return (
                    <div key={m.id} className="relative overflow-hidden rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#08080A] p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h4 className="text-[10px] font-bold text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest">Role Fit</h4>
                                <h3 className="text-lg font-bold text-[#241f18] dark:text-white">{m.recommendedRole}</h3>
                            </div>
                            <div className="text-2xl font-bold text-emerald-400">{m.matchScore}%</div>
                        </div>

                        <div className="h-[200px] w-full mb-6 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                    <PolarGrid stroke="var(--pm-chart-grid)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--pm-chart-axis)', fontSize: 9 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Current" dataKey="A" stroke="#22d3ee" strokeWidth={2} fill="#22d3ee" fillOpacity={0.3} />
                                    <Radar name="Required" dataKey="B" stroke="var(--pm-chart-axis)" strokeWidth={1} strokeDasharray="4 4" fill="transparent" />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--pm-tooltip-bg)', border: '1px solid var(--pm-tooltip-border)' }} itemStyle={{ color: 'var(--pm-tooltip-text)' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="pt-4 border-t border-[#ded2c2]/60 dark:border-white/5 flex justify-between text-xs text-[#241f18]/45 dark:text-white/40">
                            <span>Current: {m.currentRole}</span>
                            <span>Timeline: {m.timeline}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function CapabilityTab() {
    const cm = DEMO_CAPABILITY_MAP
    // Prepare data for BarChart sort by proficiency
    const sortedSkills = [...cm.capabilities].sort((a, b) => b.proficiencyAvg - a.proficiencyAvg)

    return (
        <div className="space-y-6">
            <div className="p-6 rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#08080A] flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-[#241f18] dark:text-white mb-1">{cm.teamName} Capability Map</h3>
                    <p className="text-sm text-[#241f18]/45 dark:text-white/40">{cm.headcount} team members assessed</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-xs text-[#241f18]/45 dark:text-white/40">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" /> Core
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#241f18]/45 dark:text-white/40">
                        <span className="w-2 h-2 rounded-full bg-violet-400" /> Emerging
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#08080A] p-6">
                    <h4 className="text-xs font-bold text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest mb-6">Proficiency by Skill</h4>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={sortedSkills} margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--pm-chart-grid)" horizontal={false} />
                                <XAxis type="number" stroke="var(--pm-chart-axis)" fontSize={10} axisLine={false} tickLine={false} domain={[0, 100]} />
                                <YAxis type="category" dataKey="skill" stroke="var(--pm-chart-axis)" fontSize={11} width={120} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'var(--pm-chart-cursor)' }} contentStyle={{ backgroundColor: 'var(--pm-tooltip-bg)', border: '1px solid var(--pm-tooltip-border)' }} />
                                <Bar dataKey="proficiencyAvg" radius={[0, 4, 4, 0]} barSize={20}>
                                    {sortedSkills.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={
                                            entry.category === 'core' ? '#34d399' : entry.category === 'emerging' ? '#8b5cf6' : '#f43f5e'
                                        } />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-3xl border border-[#ded2c2] dark:border-white/10 bg-[#fffaf2] dark:bg-[#08080A] p-6">
                    <h4 className="text-xs font-bold text-[#241f18]/45 dark:text-white/40 uppercase tracking-widest mb-4">Critical Skill Gaps</h4>
                    <div className="space-y-4">
                        {cm.skillGaps.map((g, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-[#241f18]/[0.03] dark:bg-white/[0.03] border border-[#ded2c2]/60 dark:border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-[#241f18]/70 dark:text-white/70">{g.skill}</span>
                                    <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">-{g.gap} FTE</span>
                                </div>
                                <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-[#241f18]/5 dark:bg-white/5">
                                    <div className="h-full bg-emerald-500" style={{ width: `${(g.current / g.needed) * 100}%` }} />
                                    <div className="h-full bg-red-500/50" style={{ width: `${(g.gap / g.needed) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
