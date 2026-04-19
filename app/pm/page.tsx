"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUp,
  Bot,
  Clock3,
  Network,
  PanelRight,
  RefreshCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { InfographicArtifact, type ArtifactVersion } from "@/components/artifact/InfographicArtifact"
import SystemAutonomyWidget from "@/app/pm/components/SystemAutonomyWidget"
import { useConversation, type PMConversationMessage } from "./useConversation"

const QUICK_PROMPTS = [
  "Map the ML engineer market",
  "Compare senior Rust signals",
  "Build an outreach strategy",
  "Show proof gaps for candidates",
]

const ARISTOTLE = "Aristotle"

type ContextTab = "focus" | "graph" | "autopilot"

export default function PMPage() {
  const {
    messages,
    input,
    setInput,
    isThinking,
    provider,
    activeArtifact,
    activeArtifactId,
    artifactMessages,
    setActiveArtifactId,
    submit,
    sendPrompt,
    drill,
    reset,
  } = useConversation()

  const [contextOpen, setContextOpen] = useState(false)
  const [contextTab, setContextTab] = useState<ContextTab>("focus")
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  const versions = useMemo<ArtifactVersion[]>(() => {
    return artifactMessages
      .filter((message) => message.artifact)
      .slice()
      .reverse()
      .map((message) => ({
        id: message.id,
        title: message.artifact?.artifact.title || "Artifact",
        createdAt: message.createdAt,
        envelope: message.artifact!,
      }))
  }, [artifactMessages])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length, isThinking])

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const command = event.metaKey || event.ctrlKey
      if (!command) return

      if (event.key.toLowerCase() === "k") {
        event.preventDefault()
        inputRef.current?.focus()
      }

      if (event.key === "Enter") {
        event.preventDefault()
        submit()
      }
    }

    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [submit])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submit()
  }

  const servedArtifacts = artifactMessages.length

  return (
    <main className="pm-command-surface relative flex-1 overflow-hidden bg-[var(--pm-bg)] text-[var(--pm-text)] font-mono selection:bg-[var(--pm-focus)]">
      <div className="pm-grid absolute inset-0 pointer-events-none" />

      <div className="relative z-10 grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(340px,420px)_minmax(0,1fr)]">
        <ConversationColumn
          messages={messages}
          input={input}
          setInput={setInput}
          inputRef={inputRef}
          isThinking={isThinking}
          activeArtifactId={activeArtifactId}
          onSubmit={handleSubmit}
          onSelectArtifact={setActiveArtifactId}
          onReset={reset}
          onQuickPrompt={sendPrompt}
          endRef={endRef}
        />

        <section className="relative min-h-0 overflow-hidden">
          <header className="absolute left-0 right-0 top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--pm-border)] bg-[var(--pm-panel)] px-5 py-4 backdrop-blur-xl lg:px-7">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--pm-subtle)]">Artifact Canvas</span>
                <StatusPill provider={provider} />
              </div>
              <h1 className="mt-1 truncate text-xl font-light tracking-tight text-[var(--pm-text)]">
                {activeArtifact?.artifact.title || "Ask Aristotle for an infographic"}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setContextOpen((open) => !open)}
                className="artifact-toolbar-btn"
                aria-expanded={contextOpen}
                aria-controls="pm-context-drawer"
              >
                <PanelRight className="h-4 w-4" />
                Context
              </button>
              <button type="button" onClick={reset} className="artifact-toolbar-btn">
                <RefreshCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </header>

          <div className="absolute inset-0 pt-[92px]">
            <InfographicArtifact
              envelope={activeArtifact}
              versions={versions}
              activeVersionId={activeArtifactId}
              onVersionSelect={setActiveArtifactId}
              onDrill={drill}
              className="h-full"
            />
          </div>

          <AnimatePresence>
            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 flex items-center justify-center bg-[var(--pm-bg)]/72 backdrop-blur-md"
              >
                <ThinkingCard providerName={provider.name} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {contextOpen && (
              <motion.aside
                id="pm-context-drawer"
                initial={{ x: 420, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 420, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-0 right-0 top-0 z-50 flex w-full max-w-[420px] flex-col border-l border-[var(--pm-border)] bg-[var(--pm-card)] shadow-2xl shadow-[#241f18]/10 backdrop-blur-2xl dark:shadow-black/50"
              >
                <div className="flex items-center justify-between border-b border-[var(--pm-border)] px-5 py-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--pm-subtle)]">PM Widgets</div>
                    <div className="mt-1 text-lg font-light text-[var(--pm-text)]">Context drawer</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setContextOpen(false)}
                    className="rounded-full bg-[var(--pm-chip)] p-2 text-[var(--pm-muted)] transition hover:text-[var(--pm-text)]"
                    aria-label="Close context drawer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex gap-2 border-b border-[var(--pm-border)] px-5 py-3">
                  {([
                    ["focus", "Focus"],
                    ["graph", "Graph"],
                    ["autopilot", "Autopilot"],
                  ] as const).map(([tab, label]) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setContextTab(tab)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] transition",
                        contextTab === tab
                          ? "bg-[var(--pm-accent)] text-white shadow-[0_0_20px_var(--pm-accent-glow)]"
                          : "bg-[var(--pm-chip)] text-[var(--pm-muted)] hover:text-[var(--pm-text)]"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                  {contextTab === "focus" && <ActiveFocus servedArtifacts={servedArtifacts} />}
                  {contextTab === "graph" && <KnowledgeGraph />}
                  {contextTab === "autopilot" && <SystemAutonomyWidget />}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </section>
      </div>

      <style jsx global>{`
        .pm-command-surface {
          --pm-bg: #f7f3ec;
          --pm-panel: rgba(250, 247, 241, 0.78);
          --pm-card: rgba(255, 250, 242, 0.94);
          --pm-text: #241f18;
          --pm-text-soft: rgba(36, 31, 24, 0.82);
          --pm-muted: rgba(36, 31, 24, 0.58);
          --pm-subtle: rgba(36, 31, 24, 0.38);
          --pm-border: rgba(116, 96, 72, 0.2);
          --pm-input: rgba(255, 252, 247, 0.94);
          --pm-chip: rgba(36, 31, 24, 0.055);
          --pm-chip-hover: rgba(226, 97, 18, 0.1);
          --pm-placeholder: rgba(36, 31, 24, 0.34);
          --pm-accent: #df5f12;
          --pm-accent-hover: #c94f0b;
          --pm-accent-glow: rgba(223, 95, 18, 0.28);
          --pm-focus: rgba(223, 95, 18, 0.34);
          --pm-loader: #1f2937;
          --pm-tooltip-bg: rgba(255, 250, 242, 0.96);
        }

        .dark .pm-command-surface {
          --pm-bg: #050505;
          --pm-panel: rgba(5, 5, 5, 0.7);
          --pm-card: rgba(10, 10, 10, 0.92);
          --pm-text: #ffffff;
          --pm-text-soft: rgba(255, 255, 255, 0.82);
          --pm-muted: rgba(255, 255, 255, 0.5);
          --pm-subtle: rgba(255, 255, 255, 0.28);
          --pm-border: rgba(255, 255, 255, 0.06);
          --pm-input: #0a0a0a;
          --pm-chip: rgba(255, 255, 255, 0.05);
          --pm-chip-hover: rgba(255, 107, 0, 0.1);
          --pm-placeholder: rgba(255, 255, 255, 0.2);
          --pm-accent: #ff6b00;
          --pm-accent-hover: #ff7f22;
          --pm-accent-glow: rgba(255, 107, 0, 0.34);
          --pm-focus: rgba(255, 107, 0, 0.4);
          --pm-loader: #ffffff;
          --pm-tooltip-bg: rgba(0, 0, 0, 0.8);
        }

        .pm-grid {
          background-image:
            linear-gradient(rgba(36, 31, 24, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(36, 31, 24, 0.035) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .dark .pm-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }

        .artifact-toolbar-btn {
          display: inline-flex;
          height: 2.25rem;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          border-radius: 999px;
          border: 1px solid var(--pm-border);
          background: var(--pm-chip);
          padding: 0 0.85rem;
          color: var(--pm-muted);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 180ms ease, background 180ms ease, border-color 180ms ease, transform 180ms ease;
        }

        .artifact-toolbar-btn:hover {
          color: var(--pm-text);
          background: var(--pm-chip-hover);
          border-color: var(--pm-focus);
          transform: translateY(-1px);
        }
      `}</style>
    </main>
  )
}

function ConversationColumn({
  messages,
  input,
  setInput,
  inputRef,
  isThinking,
  activeArtifactId,
  onSubmit,
  onSelectArtifact,
  onReset,
  onQuickPrompt,
  endRef,
}: {
  messages: PMConversationMessage[]
  input: string
  setInput: (value: string) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  isThinking: boolean
  activeArtifactId: string | null
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onSelectArtifact: (id: string) => void
  onReset: () => void
  onQuickPrompt: (prompt: string) => void
  endRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <section className="relative flex min-h-0 flex-col border-b border-[var(--pm-border)] bg-[var(--pm-panel)] px-5 py-6 backdrop-blur-sm lg:border-b-0 lg:border-r">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-36 items-start justify-start sm:w-40 lg:w-36 xl:w-40">
          <Image src="/ibm-logo-light.svg" alt="IBM" width={180} height={70} className="h-auto w-full object-contain dark:hidden" priority />
          <Image src="/ibm-logo-dark.svg" alt="IBM" width={180} height={70} className="hidden h-auto w-full object-contain dark:block" priority />
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-full bg-[var(--pm-chip)] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[var(--pm-muted)] transition hover:bg-[var(--pm-chip-hover)] hover:text-[var(--pm-text)]"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mt-7 flex items-center gap-3 border-b border-[var(--pm-border)] pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--pm-chip)] text-[var(--pm-accent)]">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--pm-subtle)]">Command Center</div>
          <h2 className="mt-1 text-xl font-light tracking-tight text-[var(--pm-text)]">Ask Aristotle</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-5 pr-1">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[420px] flex-col justify-center gap-6">
            <div>
              <div className="h-px w-16 bg-[var(--pm-accent)]/70 shadow-[0_0_18px_var(--pm-accent-glow)]" />
              <p className="mt-5 text-2xl font-light leading-tight tracking-tight text-[var(--pm-text-soft)]">
                Turn command-center questions into interactive hiring artifacts.
              </p>
              <p className="mt-4 text-sm leading-6 text-[var(--pm-muted)]">
                Aristotle replies in the conversation and builds a visual artifact on the canvas.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onQuickPrompt(prompt)}
                  className="rounded-full bg-[var(--pm-chip)] px-3 py-1.5 text-left text-[11px] text-[var(--pm-muted)] transition hover:bg-[var(--pm-chip-hover)] hover:text-[var(--pm-text)]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                selected={message.id === activeArtifactId}
                onSelectArtifact={onSelectArtifact}
              />
            ))}
            {isThinking && <ThinkingBubble />}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="mt-auto w-full space-y-3 border-t border-[var(--pm-border)] pt-4">
        <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-[var(--pm-subtle)]">
          <span>Ctrl+K focus</span>
          <span>Ctrl+Enter send</span>
        </div>
        <div className="relative group">
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask Aristotle to map hiring, market, proof, or strategy..."
            className="w-full rounded-2xl bg-[var(--pm-input)] px-5 py-4 pr-14 text-base font-light text-[var(--pm-text)] shadow-xl outline-none transition-all placeholder:text-[var(--pm-placeholder)] focus:ring-1 focus:ring-[var(--pm-focus)]"
            aria-label="Command Center prompt"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isThinking}
              className={cn(
                "h-10 w-10 rounded-lg transition-all duration-200",
                input.trim() && !isThinking
                  ? "bg-[var(--pm-accent)] text-white shadow-[0_0_28px_var(--pm-accent-glow)] hover:bg-[var(--pm-accent-hover)]"
                  : "bg-[var(--pm-chip)] text-[var(--pm-placeholder)] hover:bg-[var(--pm-chip-hover)]"
              )}
              aria-label="Send prompt"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </form>
    </section>
  )
}

function MessageBubble({ message, selected, onSelectArtifact }: { message: PMConversationMessage; selected: boolean; onSelectArtifact: (id: string) => void }) {
  const isUser = message.role === "user"
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--pm-chip)] text-[var(--pm-accent)]">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <button
        type="button"
        onClick={() => message.artifact && onSelectArtifact(message.id)}
        disabled={!message.artifact}
        className={cn(
          "max-w-[86%] rounded-2xl border px-4 py-3 text-left text-sm leading-6 transition",
          isUser
            ? "rounded-tr-sm border-[var(--pm-border)] bg-[var(--pm-text)] text-[var(--pm-bg)] dark:bg-white dark:text-black"
            : "rounded-tl-sm border-[var(--pm-border)] bg-[var(--pm-card)] text-[var(--pm-text-soft)]",
          message.artifact && "hover:border-[var(--pm-focus)] hover:bg-[var(--pm-chip-hover)]",
          selected && "border-[var(--pm-accent)] shadow-[0_0_24px_var(--pm-accent-glow)]"
        )}
      >
        <div className="whitespace-pre-wrap font-sans">{message.content}</div>
        <div className={cn("mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em]", isUser ? "opacity-60" : "text-[var(--pm-subtle)]")}>
          <Clock3 className="h-3 w-3" />
          {time}
          {message.artifact && <span>Artifact</span>}
        </div>
      </button>
    </motion.div>
  )
}

function ThinkingBubble() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--pm-chip)] text-[var(--pm-accent)]">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-[var(--pm-border)] bg-[var(--pm-card)] px-4 py-3">
        <AristotleWord small />
      </div>
    </motion.div>
  )
}

function StatusPill({ provider }: { provider: { name: string; fallback?: boolean; state: "idle" | "thinking" | "ready" | "error" } }) {
  const color = provider.state === "error" ? "bg-red-500" : provider.state === "thinking" || provider.fallback ? "bg-amber-500" : "bg-emerald-500"
  const label = provider.state === "idle" ? "Aristotle ready" : provider.name

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--pm-border)] bg-[var(--pm-chip)] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[var(--pm-muted)]">
      <span className={cn("h-2 w-2 rounded-full shadow-[0_0_10px_currentColor]", color)} />
      <span>{label}</span>
    </div>
  )
}

function ThinkingCard({ providerName }: { providerName: string }) {
  return (
    <div className="rounded-[2rem] border border-[var(--pm-border)] bg-[var(--pm-card)] px-8 py-7 text-center shadow-2xl shadow-[#241f18]/10 dark:shadow-black/60">
      <div className="mb-4 text-[10px] uppercase tracking-[0.35em] text-[var(--pm-subtle)]">Thinking</div>
      <AristotleWord />
      <div className="mx-auto mt-5 h-px w-40 bg-[var(--pm-accent)]/70 shadow-[0_0_20px_var(--pm-accent-glow)]" />
      <div className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--pm-muted)]">{providerName}</div>
    </div>
  )
}

function AristotleWord({ small = false }: { small?: boolean }) {
  return (
    <motion.div className={cn("flex justify-center gap-[0.08em] font-light tracking-[0.22em] text-[var(--pm-text-soft)]", small ? "text-sm" : "text-4xl lg:text-5xl")} aria-label={ARISTOTLE}>
      {ARISTOTLE.split("").map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          initial={{ opacity: 0, y: 10, filter: "blur(7px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: index * 0.11, duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  )
}

function ActiveFocus({ servedArtifacts }: { servedArtifacts: number }) {
  return (
    <div className="space-y-4">
      <SectionLabel>Active Focus</SectionLabel>
      <div className="rounded-[1.5rem] border border-[var(--pm-border)] bg-[var(--pm-chip)] p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--pm-accent)]/10 text-[var(--pm-accent)]">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-medium text-[var(--pm-text)]">Live hiring brief</div>
            <div className="mt-1 text-xs text-[var(--pm-muted)]">Evidence, market, and outreach synthesis</div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            ["Artifacts", servedArtifacts.toString()],
            ["Signals", "Live"],
            ["Risk", "Med"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--pm-subtle)]">{label}</div>
              <div className="mt-2 text-lg font-light text-[var(--pm-text)]">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KnowledgeGraph() {
  return (
    <div className="space-y-4">
      <SectionLabel>Knowledge Graph</SectionLabel>
      <Link href="/pm/brain" className="group block rounded-[1.5rem] border border-[var(--pm-border)] bg-[var(--pm-chip)] p-5 transition hover:border-emerald-500/40 hover:bg-emerald-500/5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-medium text-[var(--pm-text)] group-hover:text-emerald-700 dark:group-hover:text-emerald-300">Main Knowledge</div>
            <div className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live sync
            </div>
          </div>
        </div>
      </Link>
      <div className="rounded-[1.5rem] border border-[var(--pm-border)] bg-[var(--pm-card)] p-5">
        <div className="mb-4 text-[10px] uppercase tracking-[0.2em] text-[var(--pm-subtle)]">Graph health</div>
        {[
          ["Candidate memory", "94%"],
          ["Role evidence", "81%"],
          ["Market drift", "27%"],
        ].map(([label, value]) => (
          <div key={label} className="mb-3 last:mb-0">
            <div className="mb-1 flex justify-between text-xs text-[var(--pm-muted)]"><span>{label}</span><span>{value}</span></div>
            <div className="h-1.5 rounded-full bg-[var(--pm-chip)]"><div className="h-full rounded-full bg-[var(--pm-accent)]" style={{ width: value }} /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--pm-subtle)]">{children}</div>
}
