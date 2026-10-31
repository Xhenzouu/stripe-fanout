import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar, type View } from "@/components/pipeline/Sidebar";
import { ControlPanel } from "@/components/pipeline/ControlPanel";
import { NodeGraph, type NodeState } from "@/components/pipeline/NodeGraph";
import { AuditTable } from "@/components/pipeline/AuditTable";
import { AuditDrawer } from "@/components/pipeline/AuditDrawer";
import { StatusPill } from "@/components/pipeline/StatusPill";
import { auditLogData, mockProcessRun, type AuditRow, type Branch, type Toggles } from "@/components/pipeline/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stripe Fan-Out Pipeline Simulator" },
      { name: "description", content: "Visualize a Stripe webhook fanning out to Slack, Airtable and Resend with independent branch failures." },
      { property: "og:title", content: "Stripe Fan-Out Pipeline Simulator" },
      { property: "og:description", content: "Simulate parallel webhook delivery and inspect the audit log." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

const idle: Record<Branch, NodeState> = { slack: "idle", airtable: "idle", resend: "idle" };

function App() {
  const [dark, setDark] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState<View>("simulator");
  const [toggles, setToggles] = useState<Toggles>({ slack: false, airtable: false, resend: false });
  const [states, setStates] = useState(idle);
  const [running, setRunning] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const [rows, setRows] = useState<AuditRow[]>(auditLogData);
  const [last, setLast] = useState<AuditRow | null>(null);
  const [selected, setSelected] = useState<AuditRow | null>(null);

  const process = () => {
    setRunning(true);
    setLast(null);
    setStates(idle);
    setPulseKey((k) => k + 1);
    const result = mockProcessRun(toggles);
    setTimeout(() => setStates({ slack: "loading", airtable: "loading", resend: "loading" }), 1100);
    setTimeout(() => {
      setStates({ slack: result.slack_status, airtable: result.airtable_status, resend: result.resend_status });
      setRows((r) => [result, ...r]);
      setLast(result);
      setRunning(false);
    }, 2000);
  };

  return (
    <div className={cn("flex min-h-screen bg-background font-sans text-foreground", dark && "dark")}>
      <Sidebar view={view} onView={setView} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main className="flex-1 overflow-x-hidden">
        <header className="flex items-center justify-between border-b border-border px-8 py-5">
          <h1 className="font-serif text-2xl">
            {view === "simulator" ? "Stripe Fan-Out Pipeline" : "Audit Log"}
          </h1>
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle theme"
            className="rounded-md border border-border bg-card p-2 text-muted-foreground hover:text-foreground"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </header>
        <div className="space-y-6 p-8">
          {view === "simulator" ? (
            <>
              <ControlPanel
                toggles={toggles}
                onToggle={(b) => setToggles((t) => ({ ...t, [b]: !t[b] }))}
                onProcess={process}
                running={running}
              />
              <NodeGraph states={states} pulseKey={pulseKey} pulsing={running} />
              {last && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  Last run <span className="font-mono text-foreground">{last.stripe_event_id}</span>
                  <StatusPill status={last.overall_status} />
                  <button onClick={() => setView("audit")} className="text-primary hover:underline">View in audit log</button>
                </div>
              )}
            </>
          ) : (
            <AuditTable rows={rows} onSelect={setSelected} />
          )}
        </div>
      </main>
      <div className={cn(dark && "dark", "font-sans text-foreground")}>
        <AuditDrawer row={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  );
}
