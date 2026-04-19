import { describe, expect, it } from "vitest"
import {
    applyFollowupPrompt,
    applyManualReset,
    classifyIntent,
    completeInitialSearch,
    createInitialSearchState,
    type CandidateLike,
} from "../search-state"

const candidates: CandidateLike[] = [
    {
        id: "rust-sydney",
        name: "Rhea Rust",
        roleType: "engineer",
        bio: "Senior Rust compiler developer",
        stats: { commits: 2400 },
        studentProfile: {
            campus: "Sydney, NSW",
            skillsChart: [{ name: "Rust" }, { name: "Compiler" }],
            technicalSkills: [{ name: "Rust systems", tags: ["Rust"], indicators: ["Compiler work"] }],
        },
    },
    {
        id: "python-toronto",
        name: "Pia Python",
        roleType: "engineer",
        bio: "Senior Python backend developer",
        stats: { commits: 1800 },
        studentProfile: {
            campus: "Toronto, ON",
            skillsChart: [{ name: "Python" }],
            technicalSkills: [{ name: "Python services", tags: ["Python"], indicators: ["API work"] }],
        },
    },
    {
        id: "rust-python-sydney",
        name: "Sam Systems",
        roleType: "engineer",
        bio: "Senior Rust and Python systems developer",
        stats: { commits: 3200 },
        studentProfile: {
            campus: "Sydney, NSW",
            skillsChart: [{ name: "Rust" }, { name: "Python" }, { name: "Systems" }],
            technicalSkills: [{ name: "Systems research", tags: ["Rust", "Python"], indicators: ["Kernel projects"] }],
        },
    },
    {
        id: "go-singapore",
        name: "Gita Go",
        roleType: "engineer",
        bio: "Go platform engineer",
        stats: { commits: 900 },
        studentProfile: {
            campus: "Singapore",
            skillsChart: [{ name: "Go" }],
            technicalSkills: [{ name: "Go services", tags: ["Go"], indicators: ["Distributed systems"] }],
        },
    },
]

describe("classifyIntent", () => {
    const followupState = {
        ...createInitialSearchState(),
        sessionPhase: "followup" as const,
    }

    it("detects new_search prompts", () => {
        expect(classifyIntent("Senior Rust Developer", followupState).intent).toBe("new_search")
        expect(classifyIntent("find me React engineers", followupState).intent).toBe("new_search")
        expect(classifyIntent("new search: Go platform engineer", followupState).intent).toBe("new_search")
    })

    it("detects add_filter prompts", () => {
        expect(classifyIntent("filter me Python developer as well", followupState).intent).toBe("add_filter")
        expect(classifyIntent("also include Go devs", followupState).intent).toBe("add_filter")
        expect(classifyIntent("add Java", followupState).intent).toBe("add_filter")
    })

    it("detects narrow_filter prompts", () => {
        expect(classifyIntent("candidates from New South Wales", followupState).intent).toBe("narrow_filter")
        expect(classifyIntent("only with 5+ years", followupState).intent).toBe("narrow_filter")
        expect(classifyIntent("based in Sydney", followupState).intent).toBe("narrow_filter")
    })

    it("detects reset prompts", () => {
        expect(classifyIntent("show me all candidates", followupState).intent).toBe("reset")
        expect(classifyIntent("clear filters", followupState).intent).toBe("reset")
        expect(classifyIntent("reset", followupState).intent).toBe("reset")
    })

    it("detects remove_filter prompts", () => {
        expect(classifyIntent("remove Python", followupState).intent).toBe("remove_filter")
        expect(classifyIntent("drop the NSW filter", followupState).intent).toBe("remove_filter")
    })

    it("handles ambiguous follow-ups predictably", () => {
        expect(classifyIntent("Python", followupState).intent).toBe("add_filter")
        expect(classifyIntent("5+ years", followupState).intent).toBe("narrow_filter")
        expect(classifyIntent("more academic projects", followupState).intent).toBe("narrow_filter")
    })
})

describe("session phase transitions", () => {
    it("moves from initial to followup after the first successful search", () => {
        const initial = createInitialSearchState<CandidateLike>()
        const update = completeInitialSearch(initial, "Senior Rust Developer", candidates, 1)

        expect(initial.sessionPhase).toBe("initial")
        expect(update.state.sessionPhase).toBe("followup")
        expect(update.state.lastIntent).toBe("new_search")
        expect(update.state.candidateSet.map((candidate) => candidate.id)).toEqual(["rust-sydney", "rust-python-sydney"])
    })

    it("manual reset returns to initial and clears state", () => {
        const initial = createInitialSearchState<CandidateLike>()
        const searched = completeInitialSearch(initial, "Senior Rust Developer", candidates, 1).state
        const reset = applyManualReset<CandidateLike>()

        expect(searched.sessionPhase).toBe("followup")
        expect(reset.sessionPhase).toBe("initial")
        expect(reset.activeQuery).toEqual({ roles: [], skills: [], locations: [], experience: null, other: {} })
        expect(reset.candidateSet).toEqual([])
    })
})

describe("four-turn follow-up flow", () => {
    it("keeps state in sync across new search, add, reset, and narrow", () => {
        let state = createInitialSearchState<CandidateLike>()

        const turn1 = completeInitialSearch(state, "Senior Rust Developer", candidates, 1)
        state = turn1.state
        expect(state.sessionPhase).toBe("followup")
        expect(state.activeQuery.skills).toContain("Rust")
        expect(state.candidateSet.map((candidate) => candidate.id)).toEqual(["rust-sydney", "rust-python-sydney"])

        const turn2 = applyFollowupPrompt("filter me Python developer as well", state, candidates, 2)
        state = turn2.state
        expect(turn2.intent).toBe("add_filter")
        expect(state.activeQuery.skills).toEqual(["Rust", "Python"])
        expect(state.candidateSet.map((candidate) => candidate.id)).toEqual(["rust-sydney", "rust-python-sydney", "python-toronto"])

        const turn3 = applyFollowupPrompt("show me all candidates", state, candidates, 3)
        state = turn3.state
        expect(turn3.intent).toBe("reset")
        expect(state.activeQuery).toEqual({ roles: [], skills: [], locations: [], experience: null, other: {} })
        expect(state.candidateSet).toHaveLength(4)

        const turn4 = applyFollowupPrompt("candidates from New South Wales", state, candidates, 4)
        state = turn4.state
        expect(turn4.intent).toBe("narrow_filter")
        expect(state.activeQuery.locations).toEqual(["New South Wales"])
        expect(state.candidateSet.map((candidate) => candidate.id)).toEqual(["rust-sydney", "rust-python-sydney"])
    })
})
