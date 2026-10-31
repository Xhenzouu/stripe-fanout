import { Play } from "lucide-react";
import { BRANCHES, type Branch, type Toggles } from "./mockData";

interface Props {
  toggles: Toggles;
  onToggle: (b: Branch) => void;
  onProcess: () => void;
  running: boolean;
}

export function ControlPanel({ toggles, onToggle, onProcess, running }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border bg-card p-4">
      <button
        onClick={onProcess}
        disabled={running}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <Play className="h-4 w-4" />
        {running ? "Processing..." : "Process Payment"}
      </button>
      <div className="flex flex-wrap gap-5">
        {BRANCHES.map(({ key, label }) => (
          <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
            <button
              role="switch"
              aria-checked={toggles[key]}
              onClick={() => onToggle(key)}
              disabled={running}
              className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${toggles[key] ? "justify-end bg-failed" : "justify-start bg-input"}`}
            >
              <span className="h-4 w-4 rounded-full bg-foreground" />
            </button>
            Force {label} Fail
          </label>
        ))}
      </div>
    </div>
  );
}
