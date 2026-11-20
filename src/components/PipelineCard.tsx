import type { WorkProject } from "../types";
import { Icon } from "./Icon";

interface PipelineCardProps {
  project: WorkProject;
  onOpen: (project: WorkProject) => void;
  onDragStart: (projectId: string) => void;
  onDragEnd: () => void;
}

export function PipelineCard({ project, onOpen, onDragStart, onDragEnd }: PipelineCardProps) {
  return (
    <div
      className="pipeline-card w-full aspect-square max-h-60 bg-surface-container-lowest rounded-lg p-space-sm flex flex-col justify-between cursor-grab active:cursor-grabbing border shadow-xs transition-all duration-150 select-none group border-surface-container-highest hover:border-slate-400 hover:bg-slate-50/50"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        onDragStart(project.id);
      }}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(project)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="font-label-specs text-xs font-mono font-bold text-primary">
            {project.code}
          </span>
          <span className="font-mono text-[9px] px-1 py-0.5 rounded font-bold bg-surface-container-low text-on-surface-variant border border-surface-variant/40">
            WORK
          </span>
        </div>
        <span className="material-symbols-outlined text-[15px] text-outline opacity-40 group-hover:opacity-100 transition-opacity">
          drag_indicator
        </span>
      </div>

      <div className="my-auto py-1">
        <span className="font-label-specs text-[10px] text-outline font-mono uppercase block mb-0.5">
          {project.tag}
        </span>
        <h4 className="font-headline-sm text-sm font-bold text-primary line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
          {project.title}
        </h4>
      </div>

      <div className="pt-1.5 border-t border-surface-container flex items-center justify-between text-xs font-mono text-on-surface-variant">
        <span className="text-[10px] text-outline flex items-center gap-1">
          <Icon name="check_box" className="text-[13px]" />
          <span>{project.tasks.length} items</span>
        </span>
        <span className="text-[10px] font-bold text-blue-700">{project.progress}%</span>
      </div>
    </div>
  );
}
