import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-jade">404 · lost thread</p>
        <h1 className="mt-6 font-display text-6xl text-foreground">Not in this workspace</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for was never emergent here.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-glow"
          >
            Back to Emergent
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-destructive">Signal lost</p>
        <h1 className="mt-6 font-display text-4xl">Something didn't emerge</h1>
        <p className="mt-3 text-sm text-muted-foreground">Try again or return to the workspace.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:shadow-glow transition-all"
          >
            Retry
          </button>
          <a href="/" className="rounded-full border border-border px-5 py-2 text-sm font-medium hover:bg-surface">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MOSS — AI chat workspace for serious thinking" },
      { name: "description", content: "Multi-model AI chat with projects, artifacts, and prompt libraries. Built for people who ship." },
      { property: "og:title", content: "MOSS — AI chat workspace for serious thinking" },
      { property: "og:description", content: "Multi-model AI chat with projects, artifacts, and prompt libraries. Built for people who ship." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MOSS — AI chat workspace for serious thinking" },
      { name: "twitter:description", content: "Multi-model AI chat with projects, artifacts, and prompt libraries. Built for people who ship." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/413d9dcd-99eb-4612-b978-e4a87f204557/id-preview-1fe8c2bf--42cd5480-fac6-441f-81dc-24da92b6c096.lovable.app-1783669116203.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/413d9dcd-99eb-4612-b978-e4a87f204557/id-preview-1fe8c2bf--42cd5480-fac6-441f-81dc-24da92b6c096.lovable.app-1783669116203.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
