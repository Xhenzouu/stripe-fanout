import { ChevronLeft, ChevronRight, Network, ScrollText, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";

export type View = "simulator" | "audit";

interface Props {
  view: View;
  onView: (v: View) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const links = [
  { key: "simulator" as View, label: "Simulator", icon: Network },
  { key: "audit" as View, label: "Audit Log", icon: ScrollText },
];

export function Sidebar({ view, onView, collapsed, onToggle }: Props) {
  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200",
        collapsed ? "w-16" : "w-[260px]",
      )}
    >
      <div className={cn("flex gap-2 p-4", collapsed ? "flex-col items-center" : "items-center justify-between")}>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Workflow className="h-4 w-4" />
          </div>
          {!collapsed && <span className="font-serif text-lg">FanOut</span>}
        </div>
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {links.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onView(key)}
            title={label}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              collapsed && "justify-center px-0",
              view === key ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {!collapsed && label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
