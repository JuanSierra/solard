import { useState } from "react";
import type { Project } from "../types";
import { Icon } from "./Icon";

interface LabModalProps {
  project: Project;
  onClose: () => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddDirective: (title: string) => void;
}

export function LabModal({
  project,
  onClose,
  onToggleTask,
  onDeleteTask,
  onAddDirective,
}: LabModalProps) {
  const [draft, setDraft] = useState("");
  const doneCount = project.tasks.filter((task) => task.status === "done").length;

  const submit = () => {
    const value = draft.trim();
    if (!value) return;
    onAddDirective(value);
    setDraft("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-slate-900/30 backdrop-blur-sm animate-fade-in"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl bg-surface-container-lowest rounded-xl shadow-xl border border-emerald-900/15 overflow-hidden flex flex-col max-h-[92vh] animate-modal-in relative">
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />

        <div className="p-space-lg bg-surface-container-low flex items-center justify-between border-b border-surface-container-highest">
          <div className="flex items-center gap-space-md">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center font-label-specs text-xs text-emerald-800 font-bold shadow-xs">
              <Icon name="science" className="text-[22px]" />
            </div>
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-label-specs text-xs text-emerald-700 font-semibold">
                  {project.code}
                </span>
                <span className="w-1 h-1 rounded-full bg-outline" />
                <span className="font-label-specs text-[11px] uppercase tracking-wider text-on-surface-variant font-mono">
                  {project.tag} sandbox
                </span>
                <span className="w-1 h-1 rounded-full bg-outline" />
                <span className="font-label-specs text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono uppercase border border-emerald-200 font-semibold">
                  LAB EXPERIMENT
                </span>
              </div>
              <h3 className="font-headline-sm text-xl text-primary tracking-tight font-bold mt-0.5">
                {project.title}
              </h3>
            </div>
          </div>
          <button
            className="w-8 h-8 rounded bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-surface-container-highest shadow-xs"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        <div className="px-space-lg py-space-sm bg-surface-container-lowest border-b border-surface-container flex flex-wrap items-center justify-between gap-space-sm font-label-specs text-xs">
          <div className="flex items-center gap-space-lg text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="text-outline">RUN HYPOTHESIS:</span>
              <span className="text-primary font-mono font-medium">
                {project.hypothesis || "Deterministic heuristic exploration"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-outline">COMPLETED:</span>
              <span className="text-emerald-700 font-mono font-bold">
                {doneCount} / {project.tasks.length} Checkpoints
              </span>
            </div>
          </div>
          <div className="text-outline font-mono text-[11px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>SANDBOX PROTOCOL</span>
          </div>
        </div>

        <div className="p-space-lg overflow-y-auto flex-1 flex flex-col gap-space-md bg-surface-container-low/40">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest border border-surface-container-highest focus-within:border-emerald-500 shadow-xs transition-colors">
            <Icon name="add_circle" className="text-[18px] text-emerald-600 ml-1" />
            <input
              className="flex-1 bg-transparent text-primary text-body-md placeholder:text-outline focus:outline-none font-body-md"
              placeholder="Add experiment step, hypothesis checkpoint, or telemetry probe..."
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submit();
              }}
            />
            <button
              className="px-space-sm py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-label-specs text-xs font-semibold border border-emerald-200 transition-colors shadow-xs"
              onClick={submit}
              type="button"
            >
              + Insert Directive
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {project.tasks.map((task, index) => {
              const isCompleted = task.status === "done";
              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg flex items-start gap-3 transition-all duration-150 border ${
                    isCompleted
                      ? "bg-emerald-50/50 border-emerald-200/80 opacity-85"
                      : "bg-surface-container-lowest hover:bg-slate-50 border-surface-container-highest shadow-xs"
                  }`}
                >
                  <button
                    type="button"
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      isCompleted
                        ? "bg-emerald-600 text-surface-container-lowest border-emerald-600"
                        : "border-slate-300 hover:border-emerald-600 text-transparent hover:text-emerald-400 bg-surface-container-lowest"
                    }`}
                    onClick={() => onToggleTask(task.id)}
                    aria-label="Toggle directive"
                  >
                    <Icon name="check" className="text-[16px] font-bold" />
                  </button>

                  <div className="flex-1 flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {task.tag || "EXP"}
                      </span>
                      <span className="font-mono text-[10px] text-outline">
                        STEP 0{index + 1}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-outline/40" />
                      <span className="font-mono text-[10px] text-emerald-700 font-semibold">
                        {isCompleted ? "VERIFIED" : "ACTIVE PROBE"}
                      </span>
                    </div>

                    <p
                      className={`font-body-md text-sm leading-normal mt-0.5 ${
                        isCompleted ? "line-through text-outline" : "text-primary font-medium"
                      }`}
                    >
                      {task.title}
                    </p>

                    {task.note && (
                      <div className="flex items-center gap-1.5 text-xs font-mono text-outline mt-1 pl-2 border-l border-emerald-600/30">
                        <Icon name="sticky_note_2" className="text-[13px] text-emerald-700" />
                        <span>{task.note}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="text-outline hover:text-error transition-colors p-1"
                    title="Remove directive"
                    onClick={() => onDeleteTask(task.id)}
                  >
                    <Icon name="delete" className="text-[16px]" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-space-lg py-space-sm bg-surface-container-low flex items-center justify-between font-label-specs text-xs text-outline border-t border-surface-container-highest">
          <div className="flex items-center gap-space-xs font-mono text-emerald-800 font-medium">
            <Icon name="verified" className="text-[15px]" />
            <span>AUTONOMOUS EXPERIMENT LOG ACTIVE</span>
          </div>
          <button
            className="px-space-md py-1.5 rounded bg-emerald-700 text-surface-container-lowest font-label-ui text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-xs"
            onClick={onClose}
            type="button"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
