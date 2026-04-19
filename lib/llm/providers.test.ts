import { describe, expect, it, vi } from "vitest"
import { generate, isRetriable, ProviderError, type Provider } from "./providers"

function provider(name: string, call: Provider["call"]): Provider {
  return { name, call }
}

describe("LLM provider fallback", () => {
  it("uses the first successful provider after retriable failures", async () => {
    const providers: Provider[] = [
      provider("OpenAI primary", vi.fn(async () => { throw new ProviderError("rate limited", { retriable: true, status: 429 }) })),
      provider("Groq 1", vi.fn(async () => "{\"ok\":true}")),
      provider("Groq 2", vi.fn(async () => "unused")),
    ]

    const result = await generate([{ role: "user", content: "hello" }], {}, providers)

    expect(result).toEqual({ provider: "Groq 1", text: "{\"ok\":true}" })
    expect(providers[0].call).toHaveBeenCalledTimes(1)
    expect(providers[1].call).toHaveBeenCalledTimes(1)
    expect(providers[2].call).not.toHaveBeenCalled()
  })

  it("continues through OpenAI, all Groq keys, then secondary OpenAI", async () => {
    const providers: Provider[] = [
      provider("OpenAI primary", vi.fn(async () => { throw new ProviderError("missing key", { retriable: true }) })),
      provider("Groq 1", vi.fn(async () => { throw new ProviderError("unavailable", { retriable: true, status: 503 }) })),
      provider("Groq 2", vi.fn(async () => { throw new ProviderError("unavailable", { retriable: true, status: 503 }) })),
      provider("Groq 3", vi.fn(async () => { throw new ProviderError("unavailable", { retriable: true, status: 503 }) })),
      provider("OpenAI secondary", vi.fn(async () => "secondary-response")),
    ]

    const result = await generate([{ role: "user", content: "hello" }], {}, providers)

    expect(result.provider).toBe("OpenAI secondary")
    expect(result.text).toBe("secondary-response")
    for (const p of providers) expect(p.call).toHaveBeenCalledTimes(1)
  })

  it("does not fall through for non-retriable errors", async () => {
    const providers: Provider[] = [
      provider("OpenAI primary", vi.fn(async () => { throw new ProviderError("content policy", { retriable: false, status: 400 }) })),
      provider("Groq 1", vi.fn(async () => "should-not-run")),
    ]

    await expect(generate([{ role: "user", content: "hello" }], {}, providers)).rejects.toThrow("content policy")
    expect(providers[1].call).not.toHaveBeenCalled()
  })

  it("marks ProviderError retryability from the error instance", () => {
    expect(isRetriable(new ProviderError("retry", { retriable: true }))).toBe(true)
    expect(isRetriable(new ProviderError("stop", { retriable: false }))).toBe(false)
    expect(isRetriable(new Error("unknown"))).toBe(true)
  })
})
