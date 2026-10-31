import { cn } from "@/lib/utils";
import type { BranchStatus, OverallStatus } from "./mockData";

const styles: Record<string, string> = {
  success: "bg-success text-background dark:text-foreground",
  partial: "bg-partial text-background dark:text-foreground",
  failed: "bg-failed text-background dark:text-foreground",
  skipped: "bg-skipped text-background dark:text-foreground",
};

export function StatusPill({ status }: { status: BranchStatus | OverallStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", styles[status])}>
      {status}
    </span>
  );
}
