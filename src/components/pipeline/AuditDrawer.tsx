import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { StatusPill } from "./StatusPill";
import { BRANCHES, type AuditRow } from "./mockData";

export function AuditDrawer({ row, onClose }: { row: AuditRow | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {row && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-foreground/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-[450px] max-w-full flex-col gap-6 overflow-y-auto border-l border-border bg-card p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h2 className="break-all font-serif text-xl">{row.stripe_event_id}</h2>
                <StatusPill status={row.overall_status} />
              </div>
              <button onClick={onClose} aria-label="Close" className="rounded-md p-1.5 text-muted-foreground hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>

            <section className="space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Branch breakdown</h3>
              {BRANCHES.map(({ key, label }) => {
                const err = row[`${key}_error` as const];
                return (
                  <div key={key} className="rounded-md border border-border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{label}</span>
                      <StatusPill status={row[`${key}_status` as const]} />
                    </div>
                    {err && <p className="mt-2 font-mono text-xs text-failed">{err}</p>}
                  </div>
                );
              })}
            </section>

            <section className="space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Raw Audit Row</h3>
              <pre className="overflow-x-auto rounded-md border border-border bg-background p-4 font-mono text-xs leading-relaxed">
                {JSON.stringify(
                  {
                    stripe_event_id: row.stripe_event_id,
                    amount_cents: row.amount_cents,
                    slack_status: row.slack_status,
                    airtable_status: row.airtable_status,
                    resend_status: row.resend_status,
                    overall_status: row.overall_status,
                    retry_count: row.retry_count,
                  },
                  null,
                  2,
                )}
              </pre>
            </section>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
