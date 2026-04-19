import React from "react"
import { InfographicArtifact } from "./InfographicArtifact"
import type { ArtifactEnvelope } from "@/lib/llm/schema"

const baseEnvelope: ArtifactEnvelope = {
  narration: "This story renders every supported artifact block type for visual QA.",
  artifact: {
    type: "infographic",
    title: "Artifact block gallery",
    theme: "light",
    blocks: [
      { id: "kpi", kind: "kpi", label: "Median TC", value: "$245k", delta: "+12%", caption: "Market midpoint" },
      { id: "bar", kind: "bar-chart", title: "Salary by region", data: [{ label: "SF", value: 245 }, { label: "NYC", value: 228 }, { label: "Remote", value: 216 }] },
      { id: "donut", kind: "donut", title: "Skill mix", data: [{ label: "ML", value: 35 }, { label: "Systems", value: 28 }, { label: "Data", value: 22 }, { label: "Product", value: 15 }] },
      { id: "line", kind: "line-chart", title: "Demand trend", data: [{ label: "Q1", value: 61 }, { label: "Q2", value: 72 }, { label: "Q3", value: 77 }, { label: "Q4", value: 84 }] },
      { id: "timeline", kind: "timeline", title: "Hiring plan", data: [{ label: "Week 1", value: "Define proof bar" }, { label: "Week 2", value: "Run targeted sourcing" }, { label: "Week 3", value: "Schedule final loops" }] },
      { id: "flow", kind: "flow", title: "Decision flow", nodes: [{ id: "a", label: "Brief" }, { id: "b", label: "Evidence" }, { id: "c", label: "Outreach" }], edges: [{ source: "a", target: "b" }, { source: "b", target: "c" }] },
      { id: "callout", kind: "callout", tone: "insight", text: "Prioritize evidence-backed candidates before widening the search." },
      { id: "table", kind: "table", title: "Shortlist", columns: ["Name", "Fit", "Risk"], rows: [["A. Rivero", "High", "Low"], ["S. Jain", "Med", "Med"]] },
    ],
  },
}

const iconGridEnvelope: ArtifactEnvelope = {
  narration: "This story isolates the icon-grid block.",
  artifact: {
    type: "infographic",
    title: "Icon grid focus",
    theme: "light",
    blocks: [
      { id: "signals", kind: "icon-grid", title: "Signal map", items: [{ label: "Compiler", value: "Strong" }, { label: "OSS", value: "Verified" }, { label: "Research", value: "Emerging" }, { label: "Leadership", value: "Medium" }] },
      { id: "confidence", kind: "kpi", label: "Confidence", value: "88%", delta: "+6%" },
      { id: "note", kind: "callout", tone: "success", text: "The icon grid works best for compact qualitative comparisons." },
    ],
  },
}

export default {
  title: "Artifacts/InfographicArtifact",
  component: InfographicArtifact,
}

export function AllBlocks() {
  return <div style={{ height: 900 }}><InfographicArtifact envelope={baseEnvelope} /></div>
}

export function IconGridOnly() {
  return <div style={{ height: 640 }}><InfographicArtifact envelope={iconGridEnvelope} /></div>
}

export function EmptyState() {
  return <div style={{ height: 640 }}><InfographicArtifact envelope={null} /></div>
}
