import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Boxes, Command, GitBranch, Sparkle, Zap } from "lucide-react";
import heroOrb from "@/assets/hero-orb.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MOSS — AI chat workspace for serious thinking" },
      { name: "description", content: "Multi-model AI chat with projects, artifacts, and prompt libraries. Built for people who ship." },
      { property: "og:title", content: "MOSS — AI chat workspace for serious thinking" },
      { property: "og:description", content: "Multi-model AI chat with projects, artifacts, and prompt libraries. Built for people who ship." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Zap, title: "Stream at the speed of thought", body: "Token-by-token streaming from frontier models — Gemini, GPT and beyond — routed through one gateway." },
  { icon: Boxes, title: "Projects, not chats", body: "Group conversations into projects with shared context, so each thread starts where the last one left off." },
  { icon: GitBranch, title: "Branch any answer", body: "Fork a conversation to explore a tangent without losing the main thread. Merge what's useful back in." },
  { icon: Command, title: "Prompt library, first-class", body: "Save, tag and re-run your best prompts with keyboard-first ergonomics." },
  { icon: Sparkle, title: "Artifacts panel", body: "Code, diagrams and documents render beside the chat — editable, exportable, always in reach." },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Ambient mesh background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: "var(--gradient-mesh)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[500px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, oklch(0.78 0.16 165 / 0.15), transparent 60%)",
        }}
      />

      {/* Nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-jade to-jade-glow shadow-glow">
            <span className="font-display text-lg font-semibold text-primary-foreground">E</span>
          </div>
          <span className="font-display text-xl">Emergent</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#models" className="hover:text-foreground transition-colors">Models</a>
          <a href="#preview" className="hover:text-foreground transition-colors">Preview</a>
        </nav>
        <Link
          to="/chat"
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:shadow-glow"
        >
          Open workspace
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-mono uppercase tracking-widest text-jade backdrop-blur"
            >
              <span className="size-1.5 rounded-full bg-jade animate-pulse" />
              Live · multi-model gateway
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-6 font-display text-5xl leading-[1.05] tracking-tight md:text-7xl"
            >
              An AI workspace
              <br />
              that <span className="italic text-gradient-jade">emerges</span> with you.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              Chat, code, research and ship — inside one focused workspace. Route to any frontier
              model, keep every thread organised, and never lose a good prompt again.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/chat"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
              >
                Start a conversation
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-6 py-3 text-sm font-medium text-foreground backdrop-blur hover:bg-surface"
              >
                See what's inside
              </a>
            </motion.div>

            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                {["G", "O", "A"].map((l, i) => (
                  <div key={i} className="grid size-7 place-items-center rounded-full border border-border bg-surface font-mono text-[10px]">
                    {l}
                  </div>
                ))}
              </div>
              <span>Routed to Gemini · GPT · Claude via one gateway</span>
            </div>
          </div>

          {/* Floating 3D orb */}
          <div className="relative mx-auto aspect-square w-full max-w-xl">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 blur-3xl"
              style={{ background: "var(--gradient-radial-jade)", animation: "pulse-glow 6s ease-in-out infinite" }}
            />
            <motion.img
              src={heroOrb}
              alt="Emergent — an iridescent chrome-jade sculpture representing emergent intelligence"
              width={1280}
              height={1280}
              className="relative size-full rounded-3xl object-cover shadow-elevated"
              style={{ boxShadow: "var(--shadow-elevated)", animation: "orb-float 8s ease-in-out infinite" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <div className="absolute -bottom-4 -left-4 rounded-2xl border border-border bg-surface/80 p-3 backdrop-blur shadow-elevated">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Active model</p>
              <p className="mt-1 text-sm font-medium">Gemini 2.5 Flash</p>
            </div>
            <div className="absolute -top-4 -right-4 rounded-2xl border border-border bg-surface/80 p-3 backdrop-blur shadow-elevated">
              <p className="font-mono text-[10px] uppercase tracking-widest text-jade">◇ Streaming</p>
              <p className="mt-1 text-sm font-medium">148 tok / s</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-jade">The workspace</p>
          <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">
            Everything a serious chat needs.
            <br />
            <span className="italic text-muted-foreground">Nothing it doesn't.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative bg-surface/40 p-8 backdrop-blur transition-colors hover:bg-surface"
            >
              <div className="grid size-11 place-items-center rounded-xl bg-accent text-jade">
                <f.icon className="size-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 text-lg font-medium">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
          <div className="relative flex flex-col justify-between bg-gradient-to-br from-jade/20 to-transparent p-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-jade">Open workspace</p>
              <p className="mt-4 font-display text-2xl leading-tight">Every feature — live now, in your browser.</p>
            </div>
            <Link
              to="/chat"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow"
            >
              Launch chat <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Model strip */}
      <section id="models" className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl border border-border bg-surface/40 p-10 backdrop-blur md:p-14">
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-jade">One gateway</p>
              <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight">
                Every frontier model.
                <br />Swap mid-conversation.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Emergent routes through the Lovable AI Gateway — Gemini, GPT, and more. No juggling
                API keys, no context loss when you switch.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                ["Gemini 2.5 Pro", "Google"],
                ["Gemini 2.5 Flash", "Google"],
                ["GPT-5", "OpenAI"],
                ["GPT-5 Mini", "OpenAI"],
                ["Gemini 3 Flash", "Google · preview"],
                ["GPT-5.5", "OpenAI"],
              ].map(([name, org]) => (
                <div key={name} className="rounded-xl border border-border bg-background/60 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{org}</p>
                  <p className="mt-2 text-sm font-medium">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="preview" className="mx-auto max-w-4xl px-6 py-32 text-center">
        <h2 className="font-display text-5xl leading-tight tracking-tight md:text-6xl">
          Ready when you are.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-muted-foreground">
          No account. No setup. Open the workspace and start a conversation.
        </p>
        <Link
          to="/chat"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
        >
          Open Emergent <ArrowRight className="size-4" />
        </Link>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground md:flex-row">
          <p>© Emergent · An AI chat workspace</p>
          <p className="font-mono uppercase tracking-widest">Built on Lovable</p>
        </div>
      </footer>
    </div>
  );
}
