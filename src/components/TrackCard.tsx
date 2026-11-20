import { useState } from "react";
import type { Project } from "../types";
import { AvatarStack } from "./AvatarStack";
import { ProgressRing } from "./ProgressRing";
import { Icon } from "./Icon";

interface TrackCardProps {
  project: Project;
  onOpen: (project: Project) => void;
}

const priorityDot: Record<Project["priority"], string> = {
  high: "bg-error",
  medium: "bg-blue-600",
  low: "bg-outline",
};

export function TrackCard({ project, onOpen }: TrackCardProps) {
  const [dragging, setDragging] = useState(false);
  const isLab = project.domain === "lab";
  const itemCount = isLab ? project.drafts.length : project.tasks.length;

  return (
    <div
      className={`project-card flex-shrink-0 w-56 h-56 sm:w-60 sm:h-60 rounded-xl p-space-md flex flex-col justify-between cursor-pointer transition-all duration-200 relative group select-none shadow-xs hover:shadow-md hover:-translate-y-0.5 border ${
        isLab
          ? "bg-surface-container-lowest hover:bg-emerald-50/25 border-emerald-900/15 hover:border-emerald-500"
          : "bg-surface-container-lowest hover:bg-slate-50 border-surface-container-highest hover:border-slate-400"
      } ${dragging ? "opacity-50" : ""}`}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      title={isLab ? "Drag onto WORK to promote this project" : undefined}
      draggable={isLab}
      onDragStart={
        isLab
          ? (event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", project.id);
              setDragging(true);
            }
          : undefined
      }
      onDragEnd={isLab ? () => setDragging(false) : undefined}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(project);
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLab ? "bg-emerald-600 ring-2 ring-emerald-100" : priorityDot[project.priority]
              }`}
            />
            <span
              className={`font-label-specs text-xs font-mono tracking-tight font-bold ${
                isLab ? "text-emerald-800" : "text-primary"
              }`}
            >
              {project.code}
            </span>
            <span
              className={`font-mono text-[9px] px-1 py-0.5 rounded font-bold ${
                isLab
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-surface-container-low text-blue-700 border border-surface-variant/40"
              }`}
            >
              {isLab ? "LAB" : "PROD"}
            </span>
          </div>
          <span className="font-label-specs text-outline uppercase tracking-wider text-[10px] mt-0.5">
            {isLab ? `${project.tag} • sandbox` : project.tag}
          </span>
        </div>

        {isLab ? (
          <div className="flex items-center gap-1">
            <span className="font-label-specs text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-semibold">
              {project.drafts.length} DRAFTS
            </span>
            <Icon
              name="drag_indicator"
              className="text-[12px] text-emerald-700/60 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        ) : (
          <ProgressRing progress={project.progress} tone="blue" />
        )}
      </div>

      <div className="my-auto py-1">
        {isLab ? (
          <span className="font-label-specs text-[10px] text-emerald-700 uppercase font-mono mb-1 tracking-wide flex items-center gap-1 font-semibold">
            <Icon name="biotech" className="text-[12px]" />
            <span>HYPOTHESIS RUN</span>
          </span>
        ) : (
          <span className="font-label-specs text-[10px] text-outline uppercase font-mono block mb-1 tracking-wide">
            {project.pipelineStage.toUpperCase()} PIPELINE
          </span>
        )}
        <h4
          className={`font-headline-sm text-sm text-primary font-bold tracking-tight line-clamp-2 leading-snug transition-colors ${
            isLab ? "group-hover:text-emerald-900" : "group-hover:text-blue-700"
          }`}
        >
          {project.title}
        </h4>
      </div>

      <div
        className={`flex items-center justify-between pt-2 border-t ${
          isLab ? "border-emerald-900/10" : "border-surface-container"
        }`}
      >
        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-specs text-xs">
          <Icon
            name={isLab ? "format_list_bulleted" : "view_kanban"}
            className={`text-[14px] ${isLab ? "text-emerald-700" : "text-outline"}`}
          />
          <span className={`text-[11px] ${isLab ? "text-emerald-800 font-medium" : "font-medium"}`}>
            {itemCount} {isLab ? "drafts" : "tasks"}
          </span>
        </div>
        <AvatarStack colors={project.assignees} />
      </div>
    </div>
  );
}
