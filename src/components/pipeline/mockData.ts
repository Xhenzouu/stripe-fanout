export type BranchStatus = "success" | "failed" | "skipped";
export type OverallStatus = "success" | "partial" | "failed" | "skipped";
export type Branch = "slack" | "airtable" | "resend";
export type Toggles = Record<Branch, boolean>;

export interface AuditRow {
  stripe_event_id: string;
  event_type: string;
  amount_cents: number;
  slack_status: BranchStatus;
  airtable_status: BranchStatus;
  resend_status: BranchStatus;
  slack_error?: string;
  airtable_error?: string;
  resend_error?: string;
  overall_status: OverallStatus;
  retry_count: number;
  created_at: string;
}

export const BRANCHES: { key: Branch; label: string }[] = [
  { key: "slack", label: "Slack" },
  { key: "airtable", label: "Airtable" },
  { key: "resend", label: "Resend" },
];

const ERRORS: Record<Branch, string> = {
  slack: "404 - channel_not_found",
  airtable: "429 - Rate limit exceeded",
  resend: "422 - Invalid 'to' field",
};

export function computeOverall(s: BranchStatus[]): OverallStatus {
  if (s.every((x) => x === "skipped")) return "skipped";
  if (s.every((x) => x === "success")) return "success";
  if (s.every((x) => x === "failed")) return "failed";
  return "partial";
}

export const auditLogData: AuditRow[] = [
  {
    stripe_event_id: "evt_1Q8xA2LkdIwHu7ix",
    event_type: "payment_intent.succeeded",
    amount_cents: 249900,
    slack_status: "success",
    airtable_status: "success",
    resend_status: "success",
    overall_status: "success",
    retry_count: 0,
    created_at: "2026-10-31T14:02:11Z",
  },
  {
    stripe_event_id: "evt_1Q8xB7LkdIwHu9mq",
    event_type: "payment_intent.succeeded",
    amount_cents: 89000,
    slack_status: "success",
    airtable_status: "success",
    resend_status: "failed",
    resend_error: ERRORS.resend,
    overall_status: "partial",
    retry_count: 1,
    created_at: "2026-10-31T15:18:44Z",
  },
  {
    stripe_event_id: "evt_1Q8xC3LkdIwHu2zt",
    event_type: "payment_intent.succeeded",
    amount_cents: 1200000,
    slack_status: "failed",
    airtable_status: "failed",
    resend_status: "failed",
    slack_error: ERRORS.slack,
    airtable_error: ERRORS.airtable,
    resend_error: ERRORS.resend,
    overall_status: "failed",
    retry_count: 3,
    created_at: "2026-10-31T17:40:02Z",
  },
  {
    stripe_event_id: "evt_1Q8xD9LkdIwHu4pa",
    event_type: "product.created",
    amount_cents: 0,
    slack_status: "skipped",
    airtable_status: "skipped",
    resend_status: "skipped",
    overall_status: "skipped",
    retry_count: 0,
    created_at: "2026-10-31T19:05:37Z",
  },
];

export function mockProcessRun(toggles: Toggles): AuditRow {
  const id = "evt_" + Math.random().toString(36).slice(2, 18);
  const st = (b: Branch): BranchStatus => (toggles[b] ? "failed" : "success");
  const row: AuditRow = {
    stripe_event_id: id,
    event_type: "payment_intent.succeeded",
    amount_cents: Math.round(1000 + Math.random() * 500000),
    slack_status: st("slack"),
    airtable_status: st("airtable"),
    resend_status: st("resend"),
    overall_status: "success",
    retry_count: 0,
    created_at: new Date().toISOString(),
  };
  for (const b of ["slack", "airtable", "resend"] as Branch[]) {
    if (toggles[b]) row[`${b}_error`] = ERRORS[b];
  }
  row.overall_status = computeOverall([row.slack_status, row.airtable_status, row.resend_status]);
  return row;
}

export const formatAmount = (c: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(c / 100);
