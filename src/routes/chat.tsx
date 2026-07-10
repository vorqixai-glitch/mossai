import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Plus,
  MessageSquare,
  Trash2,
  Sparkles,
  Square,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Workspace · Emergent" },
      { name: "description", content: "Your Emergent AI chat workspace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChatWorkspace,
});

type Msg = { id: string; role: "user" | "assistant"; content: string };
type Thread = { id: string; title: string; messages: Msg[]; updatedAt: number };

const STORAGE_KEY = "emergent.threads.v1";
const MODELS = [
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", org: "Google" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", org: "Google" },
  { id: "google/gemini-3-flash-preview", label: "Gemini 3 Flash", org: "Google · preview" },
  { id: "openai/gpt-5", label: "GPT-5", org: "OpenAI" },
  { id: "openai/gpt-5-mini", label: "GPT-5 Mini", org: "OpenAI" },
];

const SUGGESTIONS = [
  "Explain vector databases like I'm a senior engineer",
  "Draft a launch tweet for a new AI workspace",
  "Refactor this React component to use Suspense",
  "Compare Postgres RLS vs application-level authz",
];

const uid = () => Math.random().toString(36).slice(2, 10);

function loadThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Thread[];
  } catch {
    return [];
  }
}

function saveThreads(threads: Thread[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
}

function ChatWorkspace() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [model, setModel] = useState(MODELS[0].id);
  const [modelOpen, setModelOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loaded = loadThreads();
    setThreads(loaded);
    if (loaded.length) setActiveId(loaded[0].id);
  }, []);

  useEffect(() => {
    if (threads.length) saveThreads(threads);
  }, [threads]);

  const active = threads.find((t) => t.id === activeId) ?? null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, streaming]);

  function newThread(): Thread {
    const t: Thread = { id: uid(), title: "New conversation", messages: [], updatedAt: Date.now() };
    setThreads((prev) => [t, ...prev]);
    setActiveId(t.id);
    return t;
  }

  function deleteThread(id: string) {
    setThreads((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      if (next.length === 0) saveThreads([]);
      return next;
    });
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || streaming) return;

    let thread = active;
    if (!thread) thread = newThread();
    const threadId = thread.id;

    const userMsg: Msg = { id: uid(), role: "user", content };
    const assistantMsg: Msg = { id: uid(), role: "assistant", content: "" };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              title: t.messages.length === 0 ? content.slice(0, 40) : t.title,
              messages: [...t.messages, userMsg, assistantMsg],
              updatedAt: Date.now(),
            }
          : t,
      ),
    );
    setInput("");
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const history = [...(thread.messages ?? []), userMsg].map(({ role, content }) => ({ role, content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, model }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `Request failed: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setThreads((prev) =>
          prev.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  messages: t.messages.map((m) => (m.id === assistantMsg.id ? { ...m, content: acc } : m)),
                }
              : t,
          ),
        );
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                messages: t.messages.map((m) =>
                  m.id === assistantMsg.id ? { ...m, content: m.content || `⚠️ ${msg}` } : m,
                ),
              }
            : t,
        ),
      );
    } finally {
      setStreaming(false);
      abortRef.current = null;
      textareaRef.current?.focus();
    }
  }

  function stop() {
    abortRef.current?.abort();
    setStreaming(false);
  }

  const activeModel = MODELS.find((m) => m.id === model) ?? MODELS[0];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-border bg-surface/60 backdrop-blur md:flex">
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid size-7 place-items-center rounded-md bg-gradient-to-br from-jade to-jade-glow">
              <span className="font-display text-sm text-primary-foreground">E</span>
            </div>
            <span className="font-display text-lg">Emergent</span>
          </Link>
        </div>

        <div className="px-3">
          <button
            onClick={() => newThread()}
            className="flex w-full items-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-surface-elevated"
          >
            <Plus className="size-4 text-jade" />
            New conversation
          </button>
        </div>

        <div className="mt-6 flex-1 overflow-y-auto px-3">
          <p className="px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Threads</p>
          <div className="mt-2 space-y-0.5">
            {threads.length === 0 && (
              <p className="px-2 py-6 text-xs text-muted-foreground">No conversations yet. Start one below.</p>
            )}
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  t.id === activeId
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                <MessageSquare className="size-3.5 shrink-0 opacity-60" />
                <span className="flex-1 truncate">{t.title}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); deleteThread(t.id); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); deleteThread(t.id); } }}
                  className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border p-4">
          <div className="rounded-xl border border-border bg-background/40 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-jade">◇ Live gateway</p>
            <p className="mt-1 text-xs text-muted-foreground">Streaming through Lovable AI</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setModelOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium hover:bg-surface-elevated"
              >
                <span className="size-1.5 rounded-full bg-jade animate-pulse" />
                {activeModel.label}
                <ChevronDown className="size-3.5 opacity-60" />
              </button>
              <AnimatePresence>
                {modelOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-border bg-popover p-1 shadow-elevated"
                    onMouseLeave={() => setModelOpen(false)}
                  >
                    {MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setModel(m.id); setModelOpen(false); }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-accent ${
                          m.id === model ? "text-jade" : "text-foreground"
                        }`}
                      >
                        <span>{m.label}</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{m.org}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {active && (
              <span className="hidden text-xs text-muted-foreground md:inline">/ {active.title}</span>
            )}
          </div>
          <Link to="/" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
            ← Home
          </Link>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {!active || active.messages.length === 0 ? (
            <EmptyState onPick={(s) => send(s)} />
          ) : (
            <div className="mx-auto max-w-3xl px-6 py-10">
              {active.messages.map((m) => (
                <MessageBubble key={m.id} msg={m} streaming={streaming && m.role === "assistant" && m === active.messages[active.messages.length - 1]} />
              ))}
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="shrink-0 border-t border-border bg-background/60 p-4 backdrop-blur">
          <div className="mx-auto max-w-3xl">
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="group relative rounded-2xl border border-border bg-surface transition-all focus-within:border-jade/60 focus-within:shadow-glow"
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Message Emergent…"
                className="min-h-[56px] w-full resize-none bg-transparent px-5 pt-4 pb-14 text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between">
                <p className="pointer-events-auto font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  ⏎ send · ⇧⏎ newline
                </p>
                {streaming ? (
                  <button
                    type="button"
                    onClick={stop}
                    className="pointer-events-auto grid size-9 place-items-center rounded-full bg-destructive text-destructive-foreground"
                  >
                    <Square className="size-3.5" fill="currentColor" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="pointer-events-auto grid size-9 place-items-center rounded-full bg-primary text-primary-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:shadow-glow"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                )}
              </div>
            </form>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Emergent may hallucinate. Verify important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 blur-3xl"
          style={{ background: "var(--gradient-radial-jade)" }}
        />
        <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-jade to-jade-glow shadow-glow">
          <Sparkles className="size-7 text-primary-foreground" strokeWidth={1.5} />
        </div>
      </motion.div>
      <h1 className="mt-8 font-display text-4xl tracking-tight md:text-5xl">
        What are we <span className="italic text-gradient-jade">emerging</span> today?
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Type below, or start with one of these.
      </p>
      <div className="mt-10 grid w-full gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="rounded-xl border border-border bg-surface/60 p-4 text-left text-sm text-muted-foreground transition-all hover:border-jade/40 hover:bg-surface hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ msg, streaming }: { msg: Msg; streaming: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={`group py-6 ${msg.role === "user" ? "" : ""}`}>
      <div className="mb-2 flex items-center gap-2">
        {msg.role === "user" ? (
          <div className="grid size-6 place-items-center rounded-md bg-accent text-[10px] font-mono">YOU</div>
        ) : (
          <div className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-jade to-jade-glow text-[10px] font-mono text-primary-foreground">◇</div>
        )}
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {msg.role === "user" ? "You" : "Emergent"}
        </span>
      </div>
      {msg.role === "user" ? (
        <div className="rounded-2xl bg-surface px-4 py-3 text-sm leading-relaxed">{msg.content}</div>
      ) : (
        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-surface prose-pre:border prose-pre:border-border prose-code:text-jade prose-code:before:content-none prose-code:after:content-none prose-a:text-jade">
          {msg.content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="size-2 animate-pulse rounded-full bg-jade" />
              <span className="text-sm">Thinking…</span>
            </div>
          )}
          {streaming && msg.content && (
            <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 bg-jade" style={{ animation: "cursor-blink 1s infinite" }} />
          )}
          {msg.content && !streaming && (
            <button
              onClick={() => { navigator.clipboard.writeText(msg.content); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
            >
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
