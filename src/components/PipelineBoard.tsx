import { useState } from "react";
import type { Stage, WorkProject } from "../types";
import { Icon } from "./Icon";
import { PipelineCard } from "./PipelineCard";

interface PipelineBoardProps {
  projects: WorkProject[];
  onOpen: (project: WorkProject) => void;
  onMoveStage: (projectId: string, stage: Stage) => void;
}

const stageColumns: {
  key: Stage;
  label: string;
  count: string;
  dot: string;
}[] = [
  {
    key: "backlog",
    label: "BACKLOG",
    count: "text-outline",
    dot: "bg-slate-400",
  },
  {
    key: "active",
    label: "ACTIVE SPRINTS",
    count: "text-blue-700",
    dot: "bg-blue-600 animate-pulse",
  },
  {
    key: "maint",
    label: "MAINTENANCE",
    count: "text-emerald-800",
    dot: "bg-emerald-600",
  },
];

export function PipelineBoard({ projects, onOpen, onMoveStage }: PipelineBoardProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<Stage | null>(null);

  const handleDrop = (stage: Stage) => {
    if (draggedId) {
      onMoveStage(draggedId, stage);
    }
    setDraggedId(null);
    setOverStage(null);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface-container-low/40 rounded-xl p-space-md border border-surface-container-highest">
      <div className="flex items-center justify-between pb-space-xs mb-space-sm border-b border-surface-container-highest">
        <div className="flex items-center gap-space-sm">
          <span className="font-headline-sm text-xs text-primary uppercase tracking-wider font-semibold">
            Pipeline Distribution
          </span>
          <span className="w-1 h-1 rounded-full bg-outline hidden sm:block" />
          <span className="hidden sm:inline text-xs text-on-surface-variant font-body-sm">
            Drag and reassign project squares across lifecycle phases
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-space-xs font-label-specs text-[11px] text-outline">
          <Icon name="view_week" className="text-[14px]" />
          <span>3 STAGE MATRIX</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md flex-1">
        {stageColumns.map((stage) => {
          const stageProjects = projects.filter((project) => project.pipelineStage === stage.key);
          const isOver = overStage === stage.key;

          return (
            <div
              key={stage.key}
              className="flex flex-col bg-surface-container-lowest rounded-lg p-space-sm border border-surface-container-highest shadow-xs transition-colors"
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setOverStage(stage.key);
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setOverStage((current) => (current === stage.key ? null : current));
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                handleDrop(stage.key);
              }}
            >
              <div className="flex items-center justify-between pb-space-xs mb-space-xs border-b border-surface-container px-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
                  <span
                    className={`font-headline-sm text-xs font-bold tracking-wider uppercase ${
                      stage.key === "active"
                        ? "text-blue-700"
                        : stage.key === "maint"
                          ? "text-emerald-800"
                          : "text-primary"
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
                <span className="font-label-specs text-xs text-outline">
                  [{String(stageProjects.length).padStart(2, "0")}]
                </span>
              </div>

              <div
                className={`pipeline-column flex-1 flex flex-col gap-space-sm min-h-[380px] p-space-xs rounded bg-surface-container-low/30 overflow-y-auto transition-colors ${
                  isOver ? "bg-surface-container" : ""
                }`}
              >
                {stageProjects.map((project) => (
                  <PipelineCard
                    key={project.id}
                    project={project}
                    onOpen={onOpen}
                    onDragStart={(id) => setDraggedId(id)}
                    onDragEnd={() => {
                      setDraggedId(null);
                      setOverStage(null);
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
