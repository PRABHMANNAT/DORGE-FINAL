
"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Sparkles, Play, Code2, Clock,
    BarChart2, Users, ChevronRight,
    MessageSquare, Settings, Save,
    Wand2, Brain
} from "lucide-react"
import { SIMULATION_TEMPLATES, RUBRIC_CRITERIA } from "@/lib/work-sim-data"
import { Button } from "@/components/ui/button"

export default function WorkSimEditor() {
    const [selectedTemplate, setSelectedTemplate] = useState(SIMULATION_TEMPLATES[0])
    const [isGenerating, setIsGenerating] = useState(false)
    const [prompt, setPrompt] = useState(selectedTemplate.description)

    // Load custom template from Architect if available
    React.useEffect(() => {
        const draft = localStorage.getItem("worksim_draft_template")
        if (draft) {
            try {
                const template = JSON.parse(draft)
                // We fake-cast it to match the type or just use it as is
                setSelectedTemplate(template)
                setPrompt(template.description)
                // Optional: clear it so refresh doesn't keep reloading it, 
                // but checking it every mount is fine if we want persistence across nav
                localStorage.removeItem("worksim_draft_template")
            } catch (e) {
                console.error("Failed to load draft template", e)
            }
        }
    }, [])

    const handleGenerate = () => {
        setIsGenerating(true)
        setTimeout(() => {
            setPrompt("Generate a React component that renders a virtualized list of 10,000 items. The component must support dynamic height rows and window resizing. Use `react-window` or custom logic. Provide unit tests using `vitest`.")
            setIsGenerating(false)
        }, 1500)
    }

    return (
        <div className="flex h-full overflow-hidden bg-[#fffaf2] dark:bg-[#0A0A0A]">

            {/* Left: Builder Panel */}
            <div className="w-[450px] border-r border-[#ded2c2] dark:border-white/10 flex flex-col bg-[#241f18]/[0.02] dark:bg-white/[0.02]">
                <div className="p-6 border-b border-[#ded2c2] dark:border-white/10">
                    <h2 className="text-lg font-bold text-[#241f18] dark:text-white flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-blue-400" />
                        Simulation Editor
                    </h2>
                    <p className="text-xs text-[#241f18]/55 dark:text-white/50 mt-1">Design a realistic work sample test.</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Role Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-[#241f18]/60 dark:text-white/60 uppercase tracking-wider">Target Role</label>
                        <div className="grid grid-cols-1 gap-2">
                            {SIMULATION_TEMPLATES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setSelectedTemplate(t)
                                        setPrompt(t.description)
                                    }}
                                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${selectedTemplate.id === t.id
                                        ? "bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/30"
                                        : "bg-[#241f18]/[0.02] dark:bg-white/[0.02] border-[#ded2c2] dark:border-white/10 hover:bg-[#241f18]/[0.04] dark:hover:bg-white/[0.04]"
                                        }`}
                                >
                                    <div>
                                        <div className="text-sm font-medium text-[#241f18] dark:text-white">{t.role}</div>
                                        <div className="text-xs text-[#241f18]/45 dark:text-white/40">{t.difficulty} · {t.duration}</div>
                                    </div>
                                    {selectedTemplate.id === t.id && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* AI Prompt Generator */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-[#241f18]/60 dark:text-white/60 uppercase tracking-wider">Task Prompt</label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="h-6 text-[10px] text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 px-2"
                            >
                                <Sparkles className={`w-3 h-3 mr-1 ${isGenerating ? "animate-spin" : ""}`} />
                                {isGenerating ? "Reasoning..." : "Auto-Generate"}
                            </Button>
                        </div>
                        <div className="relative group">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full h-40 bg-[#241f18]/5 dark:bg-black/40 border border-[#ded2c2] dark:border-white/10 rounded-xl p-4 text-xs text-[#241f18]/80 dark:text-white/80 focus:outline-none focus:border-blue-500/50 resize-none font-mono leading-relaxed"
                            />
                            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded bg-[#241f18]/5 dark:bg-white/5 border border-[#ded2c2]/60 dark:border-white/5">
                                <Brain className="w-3 h-3 text-violet-400" />
                                <span className="text-[10px] text-[#241f18]/45 dark:text-white/40">Powered by Neural Context</span>
                            </div>
                        </div>
                    </div>

                    {/* Rubric Config */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-[#241f18]/60 dark:text-white/60 uppercase tracking-wider">Success Criteria</label>
                        <div className="space-y-2">
                            {RUBRIC_CRITERIA.map((c, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#241f18]/[0.02] dark:bg-white/[0.02] border border-[#ded2c2]/60 dark:border-white/5">
                                    <div className="w-8 h-8 rounded bg-[#241f18]/5 dark:bg-white/5 flex items-center justify-center text-xs font-bold text-emerald-400">
                                        {c.weight}
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-[#241f18]/80 dark:text-white/80">{c.category}</div>
                                        <div className="text-[10px] text-[#241f18]/45 dark:text-white/40">{c.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-[#ded2c2] dark:border-white/10 flex gap-3">
                    <Button className="flex-1 bg-white text-black hover:bg-[#241f18]/90 dark:hover:bg-white/90 font-medium">
                        <Save className="w-4 h-4 mr-2" /> Save Draft
                    </Button>
                    <Button variant="outline" className="px-3 border-[#ded2c2] dark:border-white/10 hover:bg-[#241f18]/5 dark:hover:bg-white/5">
                        <Settings className="w-4 h-4 text-[#241f18]/60 dark:text-white/60" />
                    </Button>
                </div>
            </div>

            {/* Right: Preview Panel */}
            <div className="flex-1 flex flex-col relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
                <div className="p-6 border-b border-[#ded2c2] dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-[#241f18]/5 dark:bg-white/5 border border-[#ded2c2] dark:border-white/10 text-[10px] text-[#241f18]/55 dark:text-white/50 uppercase tracking-wider font-medium">Candidate Preview</span>
                    </div>
                    <Button size="sm" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">
                        <Play className="w-4 h-4 mr-2" /> Test Run
                    </Button>
                </div>

                <div className="flex-1 p-8 flex items-center justify-center">
                    <div className="w-full max-w-2xl bg-[#fffaf2] dark:bg-[#0F0F0F] rounded-2xl border border-[#ded2c2] dark:border-white/10 shadow-2xl overflow-hidden flex flex-col h-[500px]">
                        {/* Fake Browser Header */}
                        <div className="h-10 border-b border-[#ded2c2]/60 dark:border-white/5 bg-[#241f18]/[0.02] dark:bg-white/[0.02] flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                            </div>
                            <div className="flex-1 text-center text-[10px] text-[#241f18]/45 dark:text-white/30 font-mono">forge-ide.internal</div>
                        </div>

                        <div className="flex-1 flex">
                            {/* Fake Chat/Task */}
                            <div className="w-1/3 border-r border-[#ded2c2]/60 dark:border-white/5 p-4 space-y-4">
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-xs font-bold text-[#241f18] dark:text-white">F</div>
                                    <div className="flex-1 bg-[#241f18]/5 dark:bg-white/5 rounded-lg rounded-tl-none p-3 text-[11px] text-[#241f18]/80 dark:text-white/80 leading-relaxed">
                                        Hi! I'm Forge. Here is your task:
                                        <br /><br />
                                        <span className="text-[#241f18] dark:text-white font-medium">{selectedTemplate.title}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Fake Code Editor */}
                            <div className="flex-1 bg-[#fffaf2] dark:bg-[#090909] p-4 font-mono text-[11px]">
                                <div className="flex gap-4 text-[#241f18]/45 dark:text-white/30 mb-4 border-b border-[#ded2c2]/60 dark:border-white/5 pb-2">
                                    <span className="text-[#241f18] dark:text-white border-b border-blue-500 pb-2">App.tsx</span>
                                    <span>utils.ts</span>
                                    <span>styles.css</span>
                                </div>
                                <div className="space-y-1 text-[#241f18]/60 dark:text-white/60">
                                    <div className="flex gap-4"><span className="text-[#241f18]/45 dark:text-white/20 w-4">1</span> <span className="text-purple-400">import</span> React <span className="text-purple-400">from</span> "react";</div>
                                    <div className="flex gap-4"><span className="text-[#241f18]/45 dark:text-white/20 w-4">2</span></div>
                                    <div className="flex gap-4"><span className="text-[#241f18]/45 dark:text-white/20 w-4">3</span> <span className="text-blue-400">export default function</span> App() {"{"}</div>
                                    <div className="flex gap-4"><span className="text-[#241f18]/45 dark:text-white/20 w-4">4</span>   <span className="text-green-400">// TODO: Implement solution</span></div>
                                    <div className="flex gap-4"><span className="text-[#241f18]/45 dark:text-white/20 w-4">5</span>   <span className="text-purple-400">return</span> (</div>
                                    <div className="flex gap-4"><span className="text-[#241f18]/45 dark:text-white/20 w-4">6</span>     &lt;<span className="text-red-400">div</span>&gt;Hello World&lt;/<span className="text-red-400">div</span>&gt;</div>
                                    <div className="flex gap-4"><span className="text-[#241f18]/45 dark:text-white/20 w-4">7</span>   );</div>
                                    <div className="flex gap-4"><span className="text-[#241f18]/45 dark:text-white/20 w-4">8</span> {"}"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
