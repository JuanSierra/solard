import { useEffect, useRef, useState } from "react";
import type { Project } from "../types";
import { Icon } from "./Icon";
import { TrackCard } from "./TrackCard";

interface TrackSectionProps {
  domain: "work" | "lab";
  projects: Project[];
  totalCount: number;
  onOpen: (project: Project) => void;
  onAdd: () => void;
  onDropProject?: (projectId: string) => void;
}

export function TrackSection({
  domain,
  projects,
  totalCount,
  onOpen,
  onAdd,
  onDropProject,
}: TrackSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const isLab = domain === "lab";
  const acceptsDrop = Boolean(onDropProject);

  const scrollBy = (delta: number) => {
    trackRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) return;

      const atStart = track.scrollLeft <= 0 && event.deltaY < 0;
      const atEnd = track.scrollLeft >= maxScroll && event.deltaY > 0;
      if (atStart || atEnd) return;

      event.preventDefault();
      track.scrollLeft = Math.max(0, Math.min(maxScroll, track.scrollLeft + event.deltaY));
    };

    track.addEventListener("wheel", handleWheel, { passive: false });
    return () => track.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      className={`flex flex-col min-w-0 rounded-xl p-space-sm shadow-xs overflow-hidden transition-colors ${
        isLab
          ? "bg-surface-container-low/75 border border-emerald-900/10 relative"
          : `bg-surface-container-low/75 border ${
              isDropTarget
                ? "border-emerald-400 bg-emerald-50/40"
                : "border-surface-container-highest"
            }`
      }`}
      onDragOver={
        acceptsDrop
          ? (event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              setIsDropTarget(true);
            }
          : undefined
      }
      onDragLeave={
        acceptsDrop
          ? (event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setIsDropTarget(false);
              }
            }
          : undefined
      }
      onDrop={
        acceptsDrop
          ? (event) => {
              event.preventDefault();
              setIsDropTarget(false);
              const projectId = event.dataTransfer.getData("text/plain");
              if (projectId) onDropProject?.(projectId);
            }
          : undefined
      }
    >
      {isLab && (
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-100 rounded-full blur-2xl pointer-events-none opacity-60" />
      )}

      <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container px-1 relative z-10">
        <div className="flex items-center gap-space-xs">
          <div className={`w-2.5 h-2.5 rounded-sm shadow-xs ${isLab ? "bg-emerald-600" : "bg-blue-600"}`} />
          <h2 className="font-headline-sm text-xs uppercase tracking-wider text-primary font-bold">
            {isLab ? "LAB" : "WORK"}
          </h2>
          <span
            className={`font-label-specs text-[10px] px-space-xs py-0.5 rounded font-mono ${
              isLab
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium"
                : "bg-surface-container-lowest text-blue-700 border border-surface-variant/40"
            }`}
          >
            [{String(totalCount).padStart(2, "0")} PROJECTS]
          </span>
          {isLab ? (
            <span className="text-[9px] uppercase tracking-widest text-emerald-700 font-mono bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded hidden sm:inline ml-1 font-semibold">
              EXPERIMENTAL
            </span>
          ) : (
            <span
              className={`text-[10px] font-mono hidden sm:inline ml-1 ${
                isDropTarget ? "text-emerald-700 font-semibold" : "text-outline"
              }`}
            >
              {isDropTarget ? "DROP TO PROMOTE → BACKLOG" : "PRODUCTION PIPELINE"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 relative z-10">
          <button
            className="w-6 h-6 rounded bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-surface-variant/40"
            onClick={() => scrollBy(-320)}
            title="Scroll Left"
            type="button"
          >
            <Icon name="chevron_left" className="text-[16px]" />
          </button>
          <button
            className="w-6 h-6 rounded bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-surface-variant/40"
            onClick={() => scrollBy(320)}
            title="Scroll Right"
            type="button"
          >
            <Icon name="chevron_right" className="text-[16px]" />
          </button>
          <div className="h-3 w-px bg-surface-container-highest mx-0.5" />
          <button
            className={`flex items-center gap-1 px-2 py-0.5 rounded font-label-ui text-[11px] font-semibold transition-colors border shadow-xs ${
              isLab
                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
                : "bg-surface-container-lowest hover:bg-surface-container text-primary border-surface-variant/50"
            }`}
            onClick={onAdd}
            type="button"
          >
            <Icon name={isLab ? "science" : "add"} className="text-[12px]" />
            <span>{isLab ? "+ New Lab" : "+ Add"}</span>
          </button>
        </div>
      </div>

      <div className="relative w-full z-10">
        <div
          ref={trackRef}
          className="hide-scrollbar flex items-stretch gap-space-sm overflow-x-auto py-1 px-1 scroll-smooth"
        >
          {projects.map((project) => (
            <TrackCard key={project.id} project={project} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </div>
  );
}
