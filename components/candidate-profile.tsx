"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    X,
    MapPin,
    Code2,
    Zap,
    Cpu,
    Circle,
    Eye,
    GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CandidateProfileProps {
    candidate: any
    onClose: () => void
    analysis?: any
    onAutoContact?: () => void
}

function getAvatar(candidate: any) {
    if (candidate.avatarUrl) return candidate.avatarUrl
    if (candidate.avatar) return candidate.avatar

    const seed = encodeURIComponent(candidate.username || candidate.name || "student")
    return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=1f2937,111827,0f172a&fontFamily=IBM%20Plex%20Mono`
}

function getStudentProfile(candidate: any) {
    return candidate.studentProfile || {
        universityHandle: `${candidate.username || "student"}@university.edu`,
        university: "University of Sydney",
        degree: "B.S. Computer Science",
        expectedGraduation: "2027",
        gpa: "3.75/4.0",
        campus: "Sydney, NSW",
        bio: `${candidate.name} is a student builder focused on systems, applied AI, and research-backed software projects.`,
        coursework: [
            { label: "CS", value: 35, color: "#f97316" },
            { label: "Math", value: 25, color: "#fb923c" },
            { label: "AI", value: 20, color: "#fdba74" },
            { label: "Systems", value: 20, color: "#fff7ed" },
        ],
        metrics: {
            vamScore: 88,
            projects: 12,
            hackathons: 4,
            publications: 1,
        },
        skillsChart: [
            { name: "Rust", value: 86 },
            { name: "Python", value: 82 },
            { name: "ML", value: 74 },
            { name: "Data Structures", value: 91 },
            { name: "Systems", value: 79 },
        ],
        signals: {
            internshipOffers: 2,
            researchContributions: 5,
            certifications: 1,
        },
        technicalSkills: [
            {
                name: "Compiler and Parser Engineering",
                tags: ["Rust", "Parsing", "IR"],
                indicators: [
                    "Built parser and semantic analysis projects for coursework",
                    "Contributed to compiler frontend experiments and language tooling",
                ],
            },
            {
                name: "Algorithms and Data Structures",
                tags: ["Graphs", "DP", "Complexity"],
                indicators: [
                    "Strong performance in advanced algorithms modules",
                    "Applies complexity tradeoffs in project writeups",
                ],
            },
        ],
        academicInterests: [
            {
                name: "Programming Languages",
                tags: ["Type Systems", "Static Analysis"],
                indicators: [
                    "Interested in parser generators, compiler correctness, and developer tooling",
                    "Tracks language implementation papers and open-source PL projects",
                ],
            },
            {
                name: "Systems Research",
                tags: ["OS", "Performance"],
                indicators: [
                    "Explores low-level performance and kernel-facing abstractions",
                    "Connects systems coursework to practical profiling tasks",
                ],
            },
        ],
    }
}

export function CandidateProfile({ candidate, onClose, analysis, onAutoContact }: CandidateProfileProps) {
    const [activeTab, setActiveTab] = useState<"technical" | "domain">("technical")

    if (!candidate) return null

    const profile = getStudentProfile(candidate)
    const activeSkills = activeTab === "technical" ? profile.technicalSkills : profile.academicInterests

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed inset-y-0 right-0 w-[600px] bg-[#f7f3ec] dark:bg-[#0A0A0A] border-l border-black/10 dark:border-l-0 shadow-2xl z-[100] flex flex-col font-mono text-xs text-[#241f18] dark:text-white overflow-hidden"
        >
            {/* Header Nav */}
            <div className="flex items-center justify-between px-6 py-3 shrink-0">
                <div className="text-[#241f18]/60 dark:text-white/40 text-[9px] uppercase tracking-widest">Student Profile</div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[#241f18]/60 dark:text-white/40 hover:text-[#241f18] dark:hover:text-white"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                {/* Identity Banner */}
                <div className="px-8 pb-6">
                    <div className="flex gap-5 items-start">
                        <div className="w-16 h-16 rounded bg-black/5 dark:bg-white/10 shrink-0 overflow-hidden">
                            <img
                                src={getAvatar(candidate)}
                                className="w-full h-full object-cover grayscale opacity-80"
                                alt={`${candidate.name} profile`}
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h1 className="text-2xl font-normal text-[#241f18] dark:text-white tracking-tight">{candidate.name}</h1>
                            <div className="flex flex-wrap items-center gap-3 text-[#241f18]/60 dark:text-white/40">
                                <span className="hover:text-orange-500 transition-colors flex items-center gap-1">
                                    <Zap className="w-3 h-3" /> @{profile.universityHandle}
                                </span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {profile.campus}</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase tracking-wider text-[#241f18] dark:text-white bg-black/[0.03] dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 shrink-0" onClick={onAutoContact}>
                            Auto-Contact
                        </Button>
                    </div>
                </div>

                {/* Coursework Bar */}
                <div className="px-8 pb-6 space-y-2">
                    <div className="text-[10px] uppercase tracking-wider text-[#241f18]/60 dark:text-white/40">Coursework / Subjects</div>
                    <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-black/10 dark:bg-white/10">
                        {profile.coursework.map((item: any) => (
                            <div key={item.label} style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-4 text-[10px] text-[#241f18]/60 dark:text-white/40 font-medium">
                        {profile.coursework.map((item: any) => (
                            <div key={item.label} className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                {item.label} {item.value}%
                            </div>
                        ))}
                    </div>
                </div>

                {/* About */}
                <div className="px-8 pb-8">
                    <div className="text-[10px] uppercase tracking-widest text-[#241f18]/55 dark:text-white/20 mb-3">About</div>
                    <p className="text-sm text-[#241f18]/75 dark:text-white/70 leading-relaxed">{profile.bio}</p>
                </div>

                {/* University */}
                <div className="px-8 pb-8">
                    <div className="text-[10px] uppercase tracking-widest text-[#241f18]/55 dark:text-white/20 mb-4">University</div>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-black/[0.03] dark:bg-white/5 rounded">
                        <div className="col-span-2 flex items-center gap-3">
                            <GraduationCap className="w-5 h-5 text-orange-500" />
                            <div>
                                <div className="text-sm text-[#241f18] dark:text-white">{profile.university}</div>
                                <div className="text-[10px] uppercase tracking-wider text-[#241f18]/55 dark:text-white/30">{profile.degree}</div>
                            </div>
                        </div>
                        <div>
                            <div className="text-[9px] uppercase tracking-wider text-[#241f18]/55 dark:text-white/20">Expected Graduation</div>
                            <div className="text-lg font-light text-[#241f18] dark:text-white">{profile.expectedGraduation}</div>
                        </div>
                        <div>
                            <div className="text-[9px] uppercase tracking-wider text-[#241f18]/55 dark:text-white/20">GPA</div>
                            <div className="text-lg font-light text-[#241f18] dark:text-white">{profile.gpa}</div>
                        </div>
                    </div>
                </div>

                {/* Insights - Stats */}
                <div className="px-8 pb-8">
                    <div className="text-[10px] uppercase tracking-widest text-[#241f18]/55 dark:text-white/20 mb-4">Insights</div>
                    <div className="text-[9px] uppercase tracking-wider text-[#241f18]/55 dark:text-white/20 mb-3">Student Metrics</div>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-4 h-4 text-orange-500" />
                            <div>
                                <div className="text-xl font-light text-[#241f18] dark:text-white">{profile.metrics.vamScore}</div>
                                <div className="text-[9px] uppercase tracking-wider text-[#241f18]/55 dark:text-white/30">VAM Score</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Code2 className="w-4 h-4 text-blue-500" />
                            <div>
                                <div className="text-xl font-light text-[#241f18] dark:text-white">{profile.metrics.projects}</div>
                                <div className="text-[9px] uppercase tracking-wider text-[#241f18]/55 dark:text-white/30">Projects</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Circle className="w-4 h-4 text-emerald-500" />
                            <div>
                                <div className="text-xl font-light text-[#241f18] dark:text-white">{profile.metrics.hackathons}</div>
                                <div className="text-[9px] uppercase tracking-wider text-[#241f18]/55 dark:text-white/30">Hackathons</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Eye className="w-4 h-4 text-purple-500" />
                            <div>
                                <div className="text-xl font-light text-[#241f18] dark:text-white">{profile.metrics.publications}</div>
                                <div className="text-[9px] uppercase tracking-wider text-[#241f18]/55 dark:text-white/30">Publications</div>
                            </div>
                        </div>
                    </div>

                    {/* Skills Chart */}
                    <div className="text-[9px] uppercase tracking-wider text-[#241f18]/55 dark:text-white/20 mb-2">Skills Chart</div>
                    <div className="space-y-2">
                        {profile.skillsChart.map((skill: any) => (
                            <div key={skill.name} className="flex items-center justify-between group hover:bg-black/5 dark:hover:bg-white/5 -mx-2 px-2 py-1 rounded transition-colors">
                                <span className="text-xs text-[#241f18]/70 dark:text-white/60 group-hover:text-[#241f18]/85 dark:group-hover:text-white/80">{skill.name}</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-1 w-24 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500" style={{ width: `${skill.value}%` }} />
                                    </div>
                                    <span className="text-xs text-[#241f18]/60 dark:text-white/40 w-8 text-right">{skill.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Signals */}
                <div className="px-8 pb-8 bg-[#f7f3ec] dark:bg-[#0A0A0A]">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span className="text-[10px] uppercase tracking-widest text-[#241f18]/60 dark:text-white/40">Signals</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 bg-black/[0.03] dark:bg-white/5 rounded">
                            <div className="text-2xl font-light text-[#241f18] dark:text-white">{profile.signals.internshipOffers}</div>
                            <div className="text-[10px] uppercase tracking-wider text-[#241f18]/55 dark:text-white/30">Internship Offers</div>
                        </div>
                        <div className="p-4 bg-black/[0.03] dark:bg-white/5 rounded">
                            <div className="text-2xl font-light text-[#241f18] dark:text-white">{profile.signals.researchContributions}</div>
                            <div className="text-[10px] uppercase tracking-wider text-[#241f18]/55 dark:text-white/30">Research Contributions</div>
                        </div>
                        <div className="p-4 bg-black/[0.03] dark:bg-white/5 rounded">
                            <div className="text-2xl font-light text-[#241f18] dark:text-white">{profile.signals.certifications}</div>
                            <div className="text-[10px] uppercase tracking-wider text-[#241f18]/55 dark:text-white/30">Certifications</div>
                        </div>
                    </div>
                </div>

                {/* Skills & Interests */}
                <div className="px-8 pb-12">
                    <div className="flex mb-4">
                        <button
                            onClick={() => setActiveTab("technical")}
                            className={cn(
                                "flex-1 py-3 text-[10px] font-medium tracking-widest uppercase transition-colors",
                                activeTab === "technical" ? "text-orange-500" : "text-[#241f18]/55 hover:text-[#241f18] dark:text-white/30 dark:hover:text-white"
                            )}
                        >
                            Technical Skills ({profile.technicalSkills.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("domain")}
                            className={cn(
                                "flex-1 py-3 text-[10px] font-medium tracking-widest uppercase transition-colors",
                                activeTab === "domain" ? "text-orange-500" : "text-[#241f18]/55 hover:text-[#241f18] dark:text-white/30 dark:hover:text-white"
                            )}
                        >
                            Academic Interests ({profile.academicInterests.length})
                        </button>
                    </div>

                    <div className="space-y-8">
                        {activeSkills.map((skill: any, i: number) => (
                            <div key={i} className="space-y-4">
                                <div className="flex items-center justify-between group cursor-pointer">
                                    <span className="text-[#241f18] dark:text-white font-medium group-hover:text-orange-500 transition-colors">{skill.name}</span>
                                    <div className="flex flex-wrap justify-end gap-1">
                                        {skill.tags.map((tag: string) => (
                                            <span key={tag} className="px-1.5 py-0.5 text-[10px] text-[#241f18]/60 dark:text-white/40 rounded uppercase">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="pl-4 space-y-2">
                                    <div className="text-[9px] uppercase tracking-wider text-[#241f18]/55 dark:text-white/20 mb-1">Indicators</div>
                                    {skill.indicators.map((indicator: string) => (
                                        <p key={indicator} className="text-[#241f18]/65 dark:text-white/50 text-xs">- {indicator}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
