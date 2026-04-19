export type SessionPhase = "initial" | "followup"

export type SearchIntent = "new_search" | "add_filter" | "narrow_filter" | "reset" | "remove_filter"

export type ConversationRole = "user" | "assistant"

export interface ConversationTurn {
    role: ConversationRole
    content: string
    intent: SearchIntent | null
    timestamp: number
}

export interface ActiveQuery {
    roles: string[]
    skills: string[]
    locations: string[]
    experience: string | null
    other: Record<string, string[]>
}

export interface CandidateLike {
    id: string
    name?: string
    username?: string
    github?: string
    roleType?: string
    bio?: string
    resumeText?: string
    linkedinText?: string
    extracurricularText?: string
    topRepos?: Array<{ name?: string; description?: string; language?: string }>
    extendedSkills?: {
        technical?: Array<{ name?: string; tags?: string[]; indicators?: string[] }>
        domain?: Array<{ name?: string; tags?: string[]; indicators?: string[] }>
    }
    recentInterests?: {
        tags?: string[]
        recentFocus?: string
        categories?: Array<{ name?: string; items?: string[] }>
    }
    studentProfile?: {
        university?: string
        degree?: string
        campus?: string
        bio?: string
        coursework?: Array<{ label?: string }>
        skillsChart?: Array<{ name?: string }>
        technicalSkills?: Array<{ name?: string; tags?: string[]; indicators?: string[] }>
        academicInterests?: Array<{ name?: string; tags?: string[]; indicators?: string[] }>
    }
    stats?: {
        commits?: number
    }
}

export interface ChatSearchState<Candidate extends CandidateLike = CandidateLike> {
    sessionPhase: SessionPhase
    conversationHistory: ConversationTurn[]
    activeQuery: ActiveQuery
    candidateSet: Candidate[]
    lastIntent: SearchIntent | null
}

export interface ClassifiedIntent {
    intent: SearchIntent
    extractedQuery: ActiveQuery
    explanation: string
}

export interface ConversationUpdate<Candidate extends CandidateLike = CandidateLike> {
    state: ChatSearchState<Candidate>
    intent: SearchIntent
    updatedQuery: ActiveQuery
    candidates: Candidate[]
    explanation: string
    scrollBehavior: "append" | "stable" | "top"
}

export interface ActiveFilterChip {
    id: string
    group: "roles" | "skills" | "locations" | "experience"
    value: string
    label: string
}

const SKILL_PATTERNS: Array<{ value: string; patterns: RegExp[] }> = [
    { value: "Rust", patterns: [/\brust\b/i] },
    { value: "Python", patterns: [/\bpython\b/i] },
    { value: "Go", patterns: [/\bgo\b/i, /\bgolang\b/i] },
    { value: "Java", patterns: [/\bjava\b/i] },
    { value: "JavaScript", patterns: [/\bjavascript\b/i, /\bjs\b/i] },
    { value: "TypeScript", patterns: [/\btypescript\b/i, /\bts\b/i] },
    { value: "React", patterns: [/\breact\b/i] },
    { value: "Kernel", patterns: [/\bkernel\b/i] },
    { value: "Compiler", patterns: [/\bcompiler\b/i, /\bcompilers\b/i] },
    { value: "Parser", patterns: [/\bparser\b/i, /\bparsing\b/i] },
    { value: "Security", patterns: [/\bsecurity\b/i, /\bsafety\b/i] },
    { value: "Machine Learning", patterns: [/\bmachine learning\b/i, /\bml\b/i] },
    { value: "Data Structures", patterns: [/\bdata structures?\b/i] },
    { value: "Systems", patterns: [/\bsystems?\b/i] },
]

const ROLE_PATTERNS: Array<{ value: string; patterns: RegExp[] }> = [
    { value: "engineer", patterns: [/\bengineers?\b/i, /\bdevelopers?\b/i, /\bdevs?\b/i, /\bprogrammers?\b/i] },
    { value: "designer", patterns: [/\bdesigners?\b/i] },
    { value: "pm", patterns: [/\bpm\b/i, /\bproduct managers?\b/i] },
    { value: "founder", patterns: [/\bfounders?\b/i] },
    { value: "researcher", patterns: [/\bresearchers?\b/i] },
    { value: "student", patterns: [/\bstudents?\b/i] },
]

const LOCATION_PATTERNS: Array<{ value: string; patterns: RegExp[] }> = [
    { value: "New South Wales", patterns: [/\bnew south wales\b/i, /\bnsw\b/i] },
    { value: "Sydney", patterns: [/\bsydney\b/i] },
    { value: "San Francisco", patterns: [/\bsan francisco\b/i, /\bbay area\b/i] },
    { value: "Toronto", patterns: [/\btoronto\b/i] },
    { value: "Waterloo", patterns: [/\bwaterloo\b/i] },
    { value: "Pittsburgh", patterns: [/\bpittsburgh\b/i] },
    { value: "Singapore", patterns: [/\bsingapore\b/i] },
    { value: "Berkeley", patterns: [/\bberkeley\b/i] },
    { value: "Ontario", patterns: [/\bontario\b/i] },
    { value: "California", patterns: [/\bcalifornia\b/i, /\bca\b/i] },
]

export function createEmptyActiveQuery(): ActiveQuery {
    return {
        roles: [],
        skills: [],
        locations: [],
        experience: null,
        other: {},
    }
}

export function createInitialSearchState<Candidate extends CandidateLike = CandidateLike>(): ChatSearchState<Candidate> {
    return {
        sessionPhase: "initial",
        conversationHistory: [],
        activeQuery: createEmptyActiveQuery(),
        candidateSet: [],
        lastIntent: null,
    }
}

export function extractQuery(message: string): ActiveQuery {
    const query = createEmptyActiveQuery()
    const text = message.trim()

    query.skills = collectMatches(text, SKILL_PATTERNS)
    query.roles = collectMatches(text, ROLE_PATTERNS)
    query.locations = collectMatches(text, LOCATION_PATTERNS)

    const yearsMatch = text.match(/\b(\d+)\+?\s*(?:years|yrs|yoe)\b/i)
    if (yearsMatch) query.experience = `${yearsMatch[1]}+ years`
    else if (/\bsenior\b|\bsr\.?\b/i.test(text)) query.experience = "senior"
    else if (/\bjunior\b|\bentry[- ]level\b|\bgraduate\b/i.test(text)) query.experience = "junior"
    else if (/\bstaff\b|\bprincipal\b/i.test(text)) query.experience = "staff"

    return query
}

export function classifyIntent(message: string, state: Pick<ChatSearchState, "sessionPhase" | "activeQuery" | "candidateSet">): ClassifiedIntent {
    const text = message.trim()
    const lower = text.toLowerCase()
    const extractedQuery = extractQuery(text)

    if (/\b(show me all candidates|show all candidates|clear filters|reset|reset filters|all candidates|show all)\b/i.test(text)) {
        return { intent: "reset", extractedQuery, explanation: "Clear filters and show all candidates." }
    }

    if (/\b(remove|drop|without|exclude|clear)\b/i.test(text) && hasAnyExtractedValue(extractedQuery)) {
        return { intent: "remove_filter", extractedQuery, explanation: "Remove named filter from the active query." }
    }

    if (/^\s*(new search|start over|start a new|fresh search)\b/i.test(text) || /\b(start over with|new search:)\b/i.test(text)) {
        return { intent: "new_search", extractedQuery, explanation: "Start a fresh search from the new prompt." }
    }

    if (/\b(also|as well|include|add|plus|or)\b/i.test(text)) {
        return { intent: "add_filter", extractedQuery, explanation: "Add a parallel role or skill to the existing search." }
    }

    if (/\b(only|from|based in|located in|candidates from|filter by|with \d+\+?\s*(?:years|yrs|yoe))\b/i.test(text)) {
        return { intent: "narrow_filter", extractedQuery, explanation: "Narrow the current candidate set." }
    }

    if (/^\s*(find me|search for|looking for|look for)\b/i.test(text)) {
        return { intent: "new_search", extractedQuery, explanation: "Explicit request for a fresh candidate search." }
    }

    if (extractedQuery.roles.length > 0 && (extractedQuery.skills.length > 0 || extractedQuery.experience)) {
        return { intent: "new_search", extractedQuery, explanation: "Role plus skill phrase is treated as a fresh search." }
    }

    if (extractedQuery.locations.length > 0 || extractedQuery.experience) {
        return { intent: "narrow_filter", extractedQuery, explanation: "Location or experience phrase narrows the current set." }
    }

    if (extractedQuery.skills.length > 0 || extractedQuery.roles.length > 0) {
        return { intent: "add_filter", extractedQuery, explanation: "Ambiguous skill or role phrase is added as a follow-up filter." }
    }

    if (lower.length > 0) {
        return { intent: "narrow_filter", extractedQuery, explanation: "Ambiguous follow-up treated as a narrowing refinement." }
    }

    return { intent: "reset", extractedQuery, explanation: "Empty prompt resets to all candidates." }
}

export function completeInitialSearch<Candidate extends CandidateLike>(
    state: ChatSearchState<Candidate>,
    message: string,
    candidatePool: Candidate[],
    timestamp = Date.now()
): ConversationUpdate<Candidate> {
    const updatedQuery = extractQuery(message)
    const candidates = withFallback(applyQueryToCandidates(candidatePool, updatedQuery), candidatePool)
    const nextState = appendTurn({
        ...state,
        sessionPhase: "followup",
        activeQuery: updatedQuery,
        candidateSet: candidates,
        lastIntent: "new_search",
    }, message, "new_search", timestamp)

    return {
        state: nextState,
        intent: "new_search",
        updatedQuery,
        candidates,
        explanation: `Found ${candidates.length} candidates`,
        scrollBehavior: "top",
    }
}

export function applyFollowupPrompt<Candidate extends CandidateLike>(
    message: string,
    state: ChatSearchState<Candidate>,
    candidatePool: Candidate[],
    timestamp = Date.now()
): ConversationUpdate<Candidate> {
    const classified = classifyIntent(message, state)
    const currentSet = state.candidateSet.length > 0 ? state.candidateSet : candidatePool
    let updatedQuery = state.activeQuery
    let candidates: Candidate[] = currentSet
    let scrollBehavior: ConversationUpdate<Candidate>["scrollBehavior"] = "stable"

    if (classified.intent === "new_search") {
        updatedQuery = classified.extractedQuery
        candidates = withFallback(applyQueryToCandidates(candidatePool, updatedQuery), candidatePool)
        scrollBehavior = "top"
    } else if (classified.intent === "add_filter") {
        updatedQuery = mergeQueries(state.activeQuery, classified.extractedQuery)
        const expandedPool = withFallback(applyQueryToCandidates(candidatePool, updatedQuery), candidatePool)
        candidates = appendMissingCandidates(currentSet, expandedPool)
        scrollBehavior = "append"
    } else if (classified.intent === "narrow_filter") {
        updatedQuery = mergeQueries(state.activeQuery, classified.extractedQuery)
        candidates = applyQueryToCandidates(currentSet, updatedQuery)
        scrollBehavior = "stable"
    } else if (classified.intent === "reset") {
        updatedQuery = createEmptyActiveQuery()
        candidates = candidatePool
        scrollBehavior = "top"
    } else if (classified.intent === "remove_filter") {
        updatedQuery = removeQueryValues(state.activeQuery, classified.extractedQuery)
        candidates = isEmptyQuery(updatedQuery) ? candidatePool : withFallback(applyQueryToCandidates(candidatePool, updatedQuery), candidatePool)
        scrollBehavior = "stable"
    }

    const nextState = appendTurn({
        ...state,
        sessionPhase: "followup",
        activeQuery: updatedQuery,
        candidateSet: candidates,
        lastIntent: classified.intent,
    }, message, classified.intent, timestamp)

    return {
        state: nextState,
        intent: classified.intent,
        updatedQuery,
        candidates,
        explanation: formatStatusLine(classified.intent, classified.extractedQuery, candidates.length),
        scrollBehavior,
    }
}

export function applyManualReset<Candidate extends CandidateLike>(): ChatSearchState<Candidate> {
    return createInitialSearchState<Candidate>()
}

export function removeFilterChip<Candidate extends CandidateLike>(
    state: ChatSearchState<Candidate>,
    chip: ActiveFilterChip,
    candidatePool: Candidate[],
    timestamp = Date.now()
): ConversationUpdate<Candidate> {
    const removalQuery = createEmptyActiveQuery()
    if (chip.group === "roles") removalQuery.roles = [chip.value]
    if (chip.group === "skills") removalQuery.skills = [chip.value]
    if (chip.group === "locations") removalQuery.locations = [chip.value]
    if (chip.group === "experience") removalQuery.experience = chip.value

    const updatedQuery = removeQueryValues(state.activeQuery, removalQuery)
    const candidates = isEmptyQuery(updatedQuery) ? candidatePool : withFallback(applyQueryToCandidates(candidatePool, updatedQuery), candidatePool)
    const nextState = appendTurn({
        ...state,
        sessionPhase: "followup",
        activeQuery: updatedQuery,
        candidateSet: candidates,
        lastIntent: "remove_filter",
    }, `remove ${chip.value}`, "remove_filter", timestamp)

    return {
        state: nextState,
        intent: "remove_filter",
        updatedQuery,
        candidates,
        explanation: `Removed ${chip.value} - ${candidates.length} candidates`,
        scrollBehavior: "stable",
    }
}

export function getActiveFilterChips(activeQuery: ActiveQuery): ActiveFilterChip[] {
    return [
        ...activeQuery.roles.map((value) => ({ id: `role:${value}`, group: "roles" as const, value, label: `Role: ${value}` })),
        ...activeQuery.skills.map((value) => ({ id: `skill:${value}`, group: "skills" as const, value, label: `Skill: ${value}` })),
        ...activeQuery.locations.map((value) => ({ id: `location:${value}`, group: "locations" as const, value, label: `Location: ${value}` })),
        ...(activeQuery.experience
            ? [{ id: `experience:${activeQuery.experience}`, group: "experience" as const, value: activeQuery.experience, label: `Experience: ${activeQuery.experience}` }]
            : []),
    ]
}

export function applyQueryToCandidates<Candidate extends CandidateLike>(candidatePool: Candidate[], query: ActiveQuery): Candidate[] {
    if (isEmptyQuery(query)) return candidatePool

    return candidatePool.filter((candidate) => {
        const text = getCandidateText(candidate)
        const roleMatch = query.roles.length === 0 || query.roles.some((role) => candidateMatchesRole(candidate, text, role))
        const skillMatch = query.skills.length === 0 || query.skills.some((skill) => text.includes(skill.toLowerCase()))
        const locationMatch = query.locations.length === 0 || query.locations.some((location) => candidateMatchesLocation(text, location))
        const experienceMatch = !query.experience || candidateMatchesExperience(candidate, query.experience)

        return roleMatch && skillMatch && locationMatch && experienceMatch
    })
}

function collectMatches(text: string, definitions: Array<{ value: string; patterns: RegExp[] }>) {
    return definitions
        .filter((definition) => definition.patterns.some((pattern) => pattern.test(text)))
        .map((definition) => definition.value)
}

function hasAnyExtractedValue(query: ActiveQuery) {
    return query.roles.length > 0 || query.skills.length > 0 || query.locations.length > 0 || Boolean(query.experience)
}

function appendTurn<Candidate extends CandidateLike>(
    state: ChatSearchState<Candidate>,
    content: string,
    intent: SearchIntent,
    timestamp: number
): ChatSearchState<Candidate> {
    return {
        ...state,
        conversationHistory: [
            ...state.conversationHistory,
            { role: "user", content, intent, timestamp },
        ],
    }
}

function mergeQueries(a: ActiveQuery, b: ActiveQuery): ActiveQuery {
    return {
        roles: unique([...a.roles, ...b.roles]),
        skills: unique([...a.skills, ...b.skills]),
        locations: unique([...a.locations, ...b.locations]),
        experience: b.experience || a.experience,
        other: { ...a.other, ...b.other },
    }
}

function removeQueryValues(base: ActiveQuery, removal: ActiveQuery): ActiveQuery {
    return {
        roles: base.roles.filter((value) => !containsNormalized(removal.roles, value)),
        skills: base.skills.filter((value) => !containsNormalized(removal.skills, value)),
        locations: base.locations.filter((value) => !containsNormalized(removal.locations, value)),
        experience: removal.experience && normalized(removal.experience) === normalized(base.experience || "") ? null : base.experience,
        other: base.other,
    }
}

function formatStatusLine(intent: SearchIntent, query: ActiveQuery, candidateCount: number) {
    const subject = getQuerySubject(query)

    if (intent === "add_filter") return `Added ${subject || "filter"} - ${candidateCount} candidates`
    if (intent === "narrow_filter") return `Filtered by ${subject || "refinement"} - ${candidateCount} candidates`
    if (intent === "reset") return `Showing all candidates - ${candidateCount} candidates`
    if (intent === "remove_filter") return `Removed ${subject || "filter"} - ${candidateCount} candidates`
    return `Started new search - ${candidateCount} candidates`
}

function getQuerySubject(query: ActiveQuery) {
    return [
        ...query.skills,
        ...query.roles,
        ...query.locations,
        query.experience,
    ].filter(Boolean).join(", ")
}

function getCandidateText(candidate: CandidateLike) {
    return [
        candidate.name,
        candidate.username,
        candidate.github,
        candidate.roleType,
        candidate.bio,
        candidate.resumeText,
        candidate.linkedinText,
        candidate.extracurricularText,
        candidate.studentProfile?.university,
        candidate.studentProfile?.degree,
        candidate.studentProfile?.campus,
        candidate.studentProfile?.bio,
        candidate.studentProfile?.coursework?.map((item) => item.label).join(" "),
        candidate.studentProfile?.skillsChart?.map((item) => item.name).join(" "),
        candidate.studentProfile?.technicalSkills?.map((item) => `${item.name} ${item.tags?.join(" ")} ${item.indicators?.join(" ")}`).join(" "),
        candidate.studentProfile?.academicInterests?.map((item) => `${item.name} ${item.tags?.join(" ")} ${item.indicators?.join(" ")}`).join(" "),
        candidate.extendedSkills?.technical?.map((item) => `${item.name} ${item.tags?.join(" ")} ${item.indicators?.join(" ")}`).join(" "),
        candidate.extendedSkills?.domain?.map((item) => `${item.name} ${item.tags?.join(" ")} ${item.indicators?.join(" ")}`).join(" "),
        candidate.recentInterests?.tags?.join(" "),
        candidate.recentInterests?.recentFocus,
        candidate.recentInterests?.categories?.map((category) => `${category.name} ${category.items?.join(" ")}`).join(" "),
        candidate.topRepos?.map((repo) => `${repo.name} ${repo.description} ${repo.language}`).join(" "),
    ].filter(Boolean).join(" ").toLowerCase()
}

function candidateMatchesRole(candidate: CandidateLike, text: string, role: string) {
    if (role === "engineer") return candidate.roleType === "engineer" || /\b(engineer|developer|dev|programmer)\b/i.test(text)
    return candidate.roleType === role || text.includes(role.toLowerCase())
}

function candidateMatchesLocation(text: string, location: string) {
    const value = location.toLowerCase()
    if (value === "new south wales") return text.includes("new south wales") || text.includes("nsw") || text.includes("sydney")
    if (value === "california") return text.includes("california") || text.includes(" ca") || text.includes("berkeley") || text.includes("san francisco")
    if (value === "ontario") return text.includes("ontario") || text.includes("toronto") || text.includes("waterloo")
    return text.includes(value)
}

function candidateMatchesExperience(candidate: CandidateLike, experience: string) {
    const normalizedExperience = experience.toLowerCase()
    const commits = candidate.stats?.commits || 0

    if (/^\d+\+ years$/.test(normalizedExperience)) {
        const years = Number.parseInt(normalizedExperience, 10)
        return commits >= years * 250
    }

    if (normalizedExperience === "senior") return commits >= 1000
    if (normalizedExperience === "staff") return commits >= 2500
    if (normalizedExperience === "junior") return commits < 1000

    return true
}

function appendMissingCandidates<Candidate extends CandidateLike>(current: Candidate[], next: Candidate[]) {
    const seen = new Set(current.map((candidate) => candidate.id))
    return [
        ...current,
        ...next.filter((candidate) => !seen.has(candidate.id)),
    ]
}

function isEmptyQuery(query: ActiveQuery) {
    return query.roles.length === 0
        && query.skills.length === 0
        && query.locations.length === 0
        && !query.experience
        && Object.keys(query.other).length === 0
}

function withFallback<Candidate>(items: Candidate[], fallback: Candidate[]) {
    return items.length > 0 ? items : fallback
}

function unique(values: string[]) {
    const seen = new Set<string>()
    return values.filter((value) => {
        const key = normalized(value)
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })
}

function containsNormalized(values: string[], value: string) {
    const target = normalized(value)
    return values.some((item) => normalized(item) === target)
}

function normalized(value: string) {
    return value.trim().toLowerCase()
}
