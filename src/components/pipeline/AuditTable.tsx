import { StatusPill } from "./StatusPill";
import { formatAmount, type AuditRow } from "./mockData";

export function AuditTable({ rows, onSelect }: { rows: AuditRow[]; onSelect: (r: AuditRow) => void }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            {["Event ID", "Amount", "Slack", "Airtable", "Resend", "Overall Status", "Timestamp"].map((h) => (
              <th key={h} className="px-4 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.stripe_event_id}
              onClick={() => onSelect(r)}
              className="cursor-pointer border-b border-border last:border-0 hover:bg-accent/60"
            >
              <td className="px-4 py-3 font-mono text-xs">{r.stripe_event_id}</td>
              <td className="px-4 py-3 tabular-nums">{formatAmount(r.amount_cents)}</td>
              <td className="px-4 py-3"><StatusPill status={r.slack_status} /></td>
              <td className="px-4 py-3"><StatusPill status={r.airtable_status} /></td>
              <td className="px-4 py-3"><StatusPill status={r.resend_status} /></td>
              <td className="px-4 py-3"><StatusPill status={r.overall_status} /></td>
              <td className="px-4 py-3 tabular-nums text-muted-foreground">
                {new Date(r.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
