import type { Filter } from "../types";
import { Icon } from "./Icon";

interface HeaderProps {
  filter: Filter;
  total: number;
  onFilterChange: (filter: Filter) => void;
  onNewProject: () => void;
}

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All Disciplines" },
  { value: "engine", label: "Engine" },
  { value: "interface", label: "Interface" },
  { value: "ai", label: "Neural" },
];

export function Header({ filter, total, onFilterChange, onNewProject }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-surface-container-lowest/95 backdrop-blur-md border-b border-surface-container-highest px-gutter-mobile sm:px-gutter shadow-xs">
      <div className="h-14 w-full flex items-center justify-between">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs">
            <div className="w-4 h-4 bg-primary rounded flex items-center justify-center shadow-xs">
              <span className="w-1.5 h-1.5 bg-surface-container-lowest rounded-xs" />
            </div>
            <span className="font-headline-sm text-lg text-primary tracking-tight font-bold">
              SOLARD
            </span>
            <span className="font-label-specs text-[10px] text-on-surface-variant bg-surface-container px-space-xs py-0.5 rounded border border-surface-variant/60 ml-1">
              v2.4
            </span>
          </div>
          <div className="h-4 w-px bg-surface-container-highest hidden sm:block" />
          <div className="hidden sm:flex items-center gap-space-xs">
            <span className="font-headline-sm text-sm text-primary font-semibold tracking-tight">
              Studio Matrix
            </span>
            <span className="font-label-specs text-[10px] bg-surface-container-low text-outline px-space-xs py-0.5 rounded border border-surface-variant/60">
              DUAL-VIEW
            </span>
          </div>
          <div className="hidden xl:flex items-center gap-space-xs ml-2">
            <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded bg-surface-container-low font-label-specs text-[10px] text-on-surface-variant border border-surface-variant/40">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              PROD: ACTIVE
            </span>
            <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded bg-surface-container-low font-label-specs text-[10px] text-on-surface-variant border border-surface-variant/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              CLUSTER 99.98%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-sm sm:gap-space-md">
          <div className="hidden md:flex items-center bg-surface-container-low p-0.5 rounded border border-surface-variant/60 shadow-xs">
            {filters.map((item) => {
              const active = filter === item.value;
              return (
                <button
                  key={item.value}
                  className={`px-space-sm py-1 rounded font-label-ui text-xs transition-all ${
                    active
                      ? "bg-surface-container-lowest text-primary font-semibold shadow-xs"
                      : "text-on-surface-variant hover:text-primary font-medium"
                  }`}
                  onClick={() => onFilterChange(item.value)}
                  type="button"
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="h-4 w-px bg-surface-container-highest hidden md:block" />
          <div className="hidden lg:flex items-center gap-space-xs font-label-specs text-[11px] text-on-surface-variant">
            <span className="text-outline">TOTAL:</span>
            <span className="text-primary font-semibold font-mono">{total} LOADED</span>
          </div>
          <button
            className="flex items-center gap-1.5 px-space-md py-1.5 rounded bg-primary text-surface-container-lowest hover:bg-slate-800 font-label-ui text-xs transition-all shadow-sm font-semibold"
            onClick={onNewProject}
            type="button"
          >
            <Icon name="add" className="text-[16px]" />
            <span>New Project</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container border border-surface-container-highest flex items-center justify-center cursor-pointer hover:border-outline transition-colors text-primary shadow-xs">
            <Icon name="person" className="text-[18px]" />
          </div>
        </div>
      </div>
    </header>
  );
}
