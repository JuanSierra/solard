import type { WorkProject } from "../types";
import { AvatarStack } from "./AvatarStack";
import { Icon } from "./Icon";

interface PipelineCardProps {
  project: WorkProject;
  onOpen: (project: WorkProject) => void;
  onDragStart: (projectId: string) => void;
  onDragEnd: () => void;
}

const priorityDot: Record<WorkProject["priority"], string> = {
  high: "bg-error",
  medium: "bg-blue-600",
  low: "bg-outline",
};

export function PipelineCard({ project, onOpen, onDragStart, onDragEnd }: PipelineCardProps) {
  const done = project.tasks.filter((task) => task.status === "done").length;
  const doing = project.tasks.filter((task) => task.status === "doing").length;
  const todo = project.tasks.filter((task) => task.status === "todo").length;
  const total = project.tasks.length;
  const nextTask =
    project.tasks.find((task) => task.status === "doing") ??
    project.tasks.find((task) => task.status === "todo");

  const share = (count: number) => (total === 0 ? 0 : (count / total) * 100);

  const taskTags = Array.from(new Set(project.tasks.map((task) => task.tag).filter(Boolean)));
  const visibleTags = taskTags.slice(0, 3);
  const extraTags = taskTags.length - visibleTags.length;

  return (
    <div
      className="pipeline-card w-full aspect-square max-h-60 bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-2 cursor-grab active:cursor-grabbing border shadow-xs transition-all duration-150 select-none group border-surface-container-highest hover:border-slate-400 hover:bg-slate-50/50"
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
          <span className={`w-2 h-2 rounded-full ${priorityDot[project.priority]}`} />
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

      <div>
        <span className="font-label-specs text-[10px] text-outline font-mono uppercase block mb-0.5">
          {project.tag}
        </span>
        <h4 className="font-headline-sm text-sm font-bold text-primary line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
          {project.title}
        </h4>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="font-label-specs text-[9px] text-outline font-mono uppercase tracking-wider flex items-center gap-1">
          <Icon name="arrow_forward" className="text-[11px]" />
          Next
        </span>
        <p className="font-body-md text-[11px] leading-snug text-on-surface-variant line-clamp-2">
          {nextTask ? nextTask.title : "All directives complete"}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-1">
        <div className="h-1 w-full rounded-full bg-surface-container-highest overflow-hidden flex">
          <div className="bg-emerald-600" style={{ width: `${share(done)}%` }} />
          <div className="bg-blue-600" style={{ width: `${share(doing)}%` }} />
        </div>
        <div className="flex items-center justify-between font-mono text-[9px] text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-700">{done} done</span>
            <span className="text-outline/60">·</span>
            <span className="text-blue-700">{doing} doing</span>
            <span className="text-outline/60">·</span>
            <span className="text-outline">{todo} todo</span>
          </span>
          <span className="font-bold text-blue-700">{project.progress}%</span>
        </div>
      </div>

      <div className="pt-1.5 border-t border-surface-container flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 min-w-0 overflow-hidden">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[8px] px-1 py-0.5 rounded bg-surface-container-low text-on-surface-variant border border-surface-variant/40 whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
          {extraTags > 0 && (
            <span className="font-mono text-[8px] text-outline whitespace-nowrap">
              +{extraTags}
            </span>
          )}
        </div>
        <AvatarStack colors={project.assignees} />
      </div>
    </div>
  );
}
