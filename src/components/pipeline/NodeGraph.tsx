import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRANCHES, type Branch, type BranchStatus } from "./mockData";

export type NodeState = "idle" | "loading" | BranchStatus;

interface Props {
  states: Record<Branch, NodeState>;
  pulseKey: number;
  pulsing: boolean;
}

const dot: Record<NodeState, string> = {
  idle: "bg-input",
  loading: "bg-input",
  success: "bg-success",
  failed: "bg-failed",
  skipped: "bg-skipped",
};

// SVG coordinates (viewBox 0 0 900 260)
const ROOT = { x: 450, y: 70 };
const SPLIT_Y = 130;
const XS = [150, 450, 750];
const LEAF_Y = 200;

export function NodeGraph({ states, pulseKey, pulsing }: Props) {
  return (
    <div className="relative rounded-lg border border-border bg-card p-6">
      <div className="relative mx-auto aspect-[900/300] w-full max-w-4xl">
        <svg viewBox="0 0 900 300" className="absolute inset-0 h-full w-full" aria-hidden>
          <line x1={ROOT.x} y1={ROOT.y} x2={ROOT.x} y2={SPLIT_Y} className="stroke-border" strokeWidth={2} />
          <line x1={XS[0]} y1={SPLIT_Y} x2={XS[2]} y2={SPLIT_Y} className="stroke-border" strokeWidth={2} />
          {XS.map((x) => (
            <line key={x} x1={x} y1={SPLIT_Y} x2={x} y2={LEAF_Y} className="stroke-border" strokeWidth={2} />
          ))}
          <AnimatePresence>
            {pulsing &&
              XS.map((x) => (
                <motion.circle
                  key={`${pulseKey}-${x}`}
                  r={7}
                  className="fill-primary"
                  initial={{ cx: ROOT.x, cy: ROOT.y }}
                  animate={{ cx: [ROOT.x, ROOT.x, x, x], cy: [ROOT.y, SPLIT_Y, SPLIT_Y, LEAF_Y] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, times: [0, 0.3, 0.7, 1], ease: "easeInOut" }}
                />
              ))}
          </AnimatePresence>
        </svg>

        <Node x={ROOT.x} y={30} root label="Stripe Webhook" sub="payment_intent.succeeded" />
        {BRANCHES.map((b, i) => (
          <Node key={b.key} x={XS[i]} y={LEAF_Y} label={b.label} state={states[b.key]} />
        ))}
      </div>
    </div>
  );
}

function Node({
  x, y, label, sub, root, state,
}: { x: number; y: number; label: string; sub?: string; root?: boolean; state?: NodeState }) {
  return (
    <div
      className={cn(
        "absolute flex -translate-x-1/2 items-center gap-3 rounded-lg border bg-card px-4 py-3",
        root ? "border-2 border-primary" : "border-border",
      )}
      style={{ left: `${(x / 900) * 100}%`, top: `${(y / 300) * 100}%`, minWidth: 160 }}
    >
      {state && (
        <span className="flex h-4 w-4 items-center justify-center">
          {state === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <span className={cn("h-3 w-3 rounded-full transition-colors", dot[state])} />
          )}
        </span>
      )}
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">
          {sub ?? (state === "idle" ? "waiting" : state === "loading" ? "delivering..." : state)}
        </div>
      </div>
    </div>
  );
}
