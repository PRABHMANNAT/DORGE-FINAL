import { ARTIFACT_JSON_SCHEMA } from "./schema"
import { FORGE_COMMAND_CENTER_SYSTEM_PROMPT } from "./systemPrompt"

export type LLMRole = "system" | "user" | "assistant"
export type LLMMessage = { role: LLMRole; content: string }

export type GenerateOptions = {
  temperature?: number
  model?: string
  signal?: AbortSignal
}

export type ProviderResult = {
  provider: string
  text: string
}

export type Provider = {
  name: string
  call: (messages: LLMMessage[], opts?: GenerateOptions) => Promise<string>
}

export class ProviderError extends Error {
  retriable: boolean
  status?: number
  provider?: string

  constructor(message: string, options: { retriable?: boolean; status?: number; provider?: string } = {}) {
    super(message)
    this.name = "ProviderError"
    this.retriable = options.retriable ?? true
    this.status = options.status
    this.provider = options.provider
  }
}

function isMissingKey(key?: string) {
  return !key || key.trim().length < 8
}

async function readJsonResponse(res: Response, provider: string) {
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    const retriable = res.status === 401 || res.status === 403 || res.status === 408 || res.status === 409 || res.status === 429 || res.status >= 500
    throw new ProviderError(`${provider} failed with ${res.status}: ${body.slice(0, 240)}`, { retriable, status: res.status, provider })
  }
  return res.json()
}

export function openAIProvider(apiKey: string | undefined, label = "OpenAI"): Provider {
  return {
    name: label,
    async call(messages, opts = {}) {
      if (isMissingKey(apiKey)) throw new ProviderError(`${label} key is not configured`, { retriable: true, provider: label })

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: opts.model || process.env.OPENAI_MODEL || "gpt-4o",
          temperature: opts.temperature ?? 0.35,
          messages: [{ role: "system", content: FORGE_COMMAND_CENTER_SYSTEM_PROMPT }, ...messages],
          response_format: { type: "json_schema", json_schema: { name: "ArtifactEnvelope", strict: false, schema: ARTIFACT_JSON_SCHEMA } },
        }),
        signal: opts.signal,
      })

      const json = await readJsonResponse(res, label)
      const content = json?.choices?.[0]?.message?.content
      if (!content) throw new ProviderError(`${label} returned no content`, { retriable: true, provider: label })
      return content
    },
  }
}

export function groqProvider(apiKey: string | undefined, label = "Groq"): Provider {
  return {
    name: label,
    async call(messages, opts = {}) {
      if (isMissingKey(apiKey)) throw new ProviderError(`${label} key is not configured`, { retriable: true, provider: label })

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: opts.model || process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          temperature: opts.temperature ?? 0.35,
          messages: [{ role: "system", content: `${FORGE_COMMAND_CENTER_SYSTEM_PROMPT}\nReturn JSON only. Do not wrap it in markdown fences.` }, ...messages],
          response_format: { type: "json_object" },
        }),
        signal: opts.signal,
      })

      const json = await readJsonResponse(res, label)
      const content = json?.choices?.[0]?.message?.content
      if (!content) throw new ProviderError(`${label} returned no content`, { retriable: true, provider: label })
      return content
    },
  }
}

export function buildProviders(env: NodeJS.ProcessEnv = process.env): Provider[] {
  return [
    openAIProvider(env.OPENAI_API_KEY_PRIMARY || env.OPENAI_API_KEY, "OpenAI primary"),
    groqProvider(env.GROQ_API_KEY_1, "Groq 1"),
    groqProvider(env.GROQ_API_KEY_2, "Groq 2"),
    groqProvider(env.GROQ_API_KEY_3, "Groq 3"),
    openAIProvider(env.OPENAI_API_KEY_SECONDARY, "OpenAI secondary"),
  ]
}

export function isRetriable(error: unknown) {
  if (error instanceof ProviderError) return error.retriable
  return true
}

export async function generate(messages: LLMMessage[], opts: GenerateOptions = {}, providers: Provider[] = buildProviders()): Promise<ProviderResult> {
  let lastErr: unknown

  for (const provider of providers) {
    try {
      const text = await provider.call(messages, opts)
      console.info(`[pm-chat] served_by=${provider.name}`)
      return { provider: provider.name, text }
    } catch (error) {
      lastErr = error
      console.warn(`[pm-chat] provider_failed=${provider.name} retriable=${isRetriable(error)}`)
      if (!isRetriable(error)) throw error
    }
  }

  throw lastErr instanceof Error ? lastErr : new ProviderError("All providers failed", { retriable: false })
}
