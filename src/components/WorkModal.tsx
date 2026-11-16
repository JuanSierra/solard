import { useState } from "react";
import type { DragEvent } from "react";
import type { Project, Task, TaskStatus } from "../types";
import { AvatarStack } from "./AvatarStack";
import { Icon } from "./Icon";

interface WorkModalProps {
  project: Project;
  onClose: () => void;
  onCycleTask: (taskId: string) => void;
  onMoveTask: (taskId: string, status: TaskStatus) => void;
  onAddTask: (title: string) => void;
}

const lanes: {
  status: TaskStatus;
  label: string;
  dot: string;
  title: string;
}[] = [
  { status: "todo", label: "To Do", dot: "bg-slate-400", title: "text-on-surface" },
  { status: "doing", label: "Doing", dot: "bg-blue-600 animate-pulse", title: "text-blue-700" },
  { status: "done", label: "Done", dot: "bg-emerald-600", title: "text-emerald-800" },
];

function statusDot(status: TaskStatus) {
  if (status === "done") return "bg-emerald-600";
  if (status === "doing") return "bg-blue-600";
  return "bg-slate-400";
}

export function WorkModal({
  project,
  onClose,
  onCycleTask,
  onMoveTask,
  onAddTask,
}: WorkModalProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [overLane, setOverLane] = useState<TaskStatus | null>(null);

  const handleAddTask = () => {
    const title = window.prompt(
      "Enter production task directive:",
      "Verify buffer serialization",
    );
    if (title && title.trim() !== "") {
      onAddTask(title.trim());
    }
  };

  const handleDrop = (status: TaskStatus) => {
    if (draggedTaskId) {
      onMoveTask(draggedTaskId, status);
    }
    setDraggedTaskId(null);
    setOverLane(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-slate-900/30 backdrop-blur-sm animate-fade-in"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-highest overflow-hidden flex flex-col max-h-[92vh] animate-modal-in">
        <div className="p-space-lg bg-surface-container-low flex items-center justify-between border-b border-surface-container-highest">
          <div className="flex items-center gap-space-md">
            <div className="w-11 h-11 rounded-lg bg-surface-container-lowest border border-surface-container-highest flex items-center justify-center font-label-specs text-xs text-blue-700 font-bold shadow-xs">
              {project.code.split("-")[0] || "PRJ"}
            </div>
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-label-specs text-xs text-blue-700 font-semibold">
                  {project.code}
                </span>
                <span className="w-1 h-1 rounded-full bg-outline" />
                <span className="font-label-specs text-[11px] uppercase tracking-wider text-on-surface-variant font-mono">
                  {project.tag} Core
                </span>
                <span className="w-1 h-1 rounded-full bg-outline" />
                <span className="font-label-specs text-[10px] px-1.5 py-0.5 rounded bg-surface-container border border-surface-variant/40 text-primary font-mono uppercase">
                  WORK STREAM
                </span>
              </div>
              <h3 className="font-headline-sm text-xl text-primary tracking-tight font-bold mt-0.5">
                {project.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-space-sm">
            <button
              className="flex items-center gap-1 px-space-sm py-1.5 rounded bg-surface-container-lowest hover:bg-surface-container text-primary font-label-ui text-xs font-medium transition-colors border border-surface-container-highest shadow-xs"
              onClick={handleAddTask}
              type="button"
            >
              <Icon name="playlist_add" className="text-[15px]" />
              <span>+ Add Task</span>
            </button>
            <button
              className="w-8 h-8 rounded bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-surface-container-highest shadow-xs"
              onClick={onClose}
              type="button"
            >
              <Icon name="close" className="text-[18px]" />
            </button>
          </div>
        </div>

        <div className="px-space-lg py-space-xs bg-surface-container-lowest flex flex-wrap items-center justify-between text-on-surface-variant font-label-specs text-xs border-b border-surface-container">
          <div className="flex items-center gap-space-lg">
            <div className="flex items-center gap-1.5">
              <span className="text-outline">STAGE:</span>
              <span className="text-primary font-semibold uppercase font-mono">
                {project.pipelineStage.toUpperCase()} STAGE
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-outline">COMPLETION:</span>
              <span className="text-blue-700 font-bold font-mono">{project.progress}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-outline">CONTRIBUTORS:</span>
              <AvatarStack colors={project.assignees} size="md" />
            </div>
          </div>
          <div className="text-outline font-mono text-[11px]">
            Click or drag task squares between columns
          </div>
        </div>

        <div className="p-space-lg overflow-y-auto flex-1 bg-surface-container-low/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {lanes.map((lane) => {
              const laneTasks = project.tasks.filter((task) => task.status === lane.status);
              const isOver = overLane === lane.status;

              return (
                <div
                  key={lane.status}
                  className="flex flex-col bg-surface-container-lowest rounded-lg p-space-sm border border-surface-container-highest shadow-xs"
                >
                  <div className="flex items-center justify-between pb-space-xs mb-space-xs border-b border-surface-container">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${lane.dot}`} />
                      <span
                        className={`font-headline-sm text-xs font-bold tracking-wider uppercase ${lane.title}`}
                      >
                        {lane.label}
                      </span>
                    </div>
                    <span className="font-label-specs text-xs text-outline">
                      [{String(laneTasks.length).padStart(2, "0")}]
                    </span>
                  </div>

                  <div
                    className={`work-task-lane flex flex-col gap-space-xs min-h-[220px] p-space-xs rounded bg-surface-container-low/40 transition-colors ${
                      isOver ? "bg-surface-container" : ""
                    }`}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      setOverLane(lane.status);
                    }}
                    onDragLeave={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                        setOverLane((current) => (current === lane.status ? null : current));
                      }
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      handleDrop(lane.status);
                    }}
                  >
                    {laneTasks.map((task) => (
                      <TaskTile
                        key={task.id}
                        task={task}
                        onCycle={() => onCycleTask(task.id)}
                        onDragStart={(event) => {
                          event.dataTransfer.effectAllowed = "move";
                          setDraggedTaskId(task.id);
                        }}
                        onDragEnd={() => {
                          setDraggedTaskId(null);
                          setOverLane(null);
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-space-lg py-space-sm bg-surface-container-low flex items-center justify-between font-label-specs text-xs text-outline border-t border-surface-container-highest">
          <div className="flex items-center gap-space-xs">
            <Icon name="view_kanban" className="text-[14px]" />
            <span className="font-mono">KANBAN EXECUTION PIPELINE</span>
          </div>
          <button
            className="px-space-md py-1.5 rounded bg-primary text-surface-container-lowest hover:bg-slate-800 font-label-ui text-xs font-semibold transition-colors shadow-xs"
            onClick={onClose}
            type="button"
          >
            Close Inspection
          </button>
        </div>
      </div>
    </div>
  );
}

interface TaskTileProps {
  task: Task;
  onCycle: () => void;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

function TaskTile({ task, onCycle, onDragStart, onDragEnd }: TaskTileProps) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      className={`work-task-tile p-space-sm bg-surface-container-lowest hover:bg-slate-50 rounded-lg flex flex-col justify-between cursor-grab active:cursor-grabbing transition-all duration-150 select-none shadow-xs border border-surface-container-highest ${
        dragging ? "opacity-40" : ""
      }`}
      draggable
      onDragStart={(event) => {
        setDragging(true);
        onDragStart(event);
      }}
      onDragEnd={() => {
        setDragging(false);
        onDragEnd();
      }}
      onClick={onCycle}
    >
      <div className="flex items-center justify-between text-on-surface-variant font-label-specs text-xs mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot(task.status)}`} />
          <span className="text-[11px] font-mono font-bold">{task.tag || "CORE"}</span>
        </div>
        <Icon name="drag_indicator" className="text-[14px] text-outline" />
      </div>
      <p className="font-body-md text-body-md text-primary font-medium leading-snug my-1">
        {task.title}
      </p>
      <div className="mt-2 pt-1 flex items-center justify-between text-outline font-label-specs text-[10px] border-t border-surface-container">
        <span className="font-mono">CYCLE STATUS</span>
        <Icon name="arrow_forward" className="text-[13px]" />
      </div>
    </div>
  );
}
