import { useState } from "react";
import type { Discipline, Domain, Stage } from "../types";
import { Icon } from "./Icon";

interface CreateProjectModalProps {
  scope: Domain;
  onClose: () => void;
  onCreate: (project: {
    title: string;
    code: string;
    domain: Domain;
    tag: Discipline;
    stage: Stage;
  }) => void;
}

const domainLabels: Record<Domain, string> = {
  work: "WORK (Production)",
  lab: "LAB (Experimental)",
};

const disciplineLabels: Record<Discipline, string> = {
  engine: "Engine",
  interface: "Interface",
  ai: "Neural",
};

const stageLabels: Record<Stage, string> = {
  backlog: "Backlog",
  active: "Active Sprint",
  maint: "Maintenance",
};

export function CreateProjectModal({ scope, onClose, onCreate }: CreateProjectModalProps) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [domain, setDomain] = useState<Domain>(scope);
  const [discipline, setDiscipline] = useState<Discipline>("engine");
  const [stage, setStage] = useState<Stage>("backlog");

  const submit = () => {
    const prefix = domain === "work" ? "WRK" : "LAB";
    const generatedCode = `${prefix}-${Math.floor(Math.random() * 89 + 10)}`;

    onCreate({
      title: title.trim() || "Obsidian Mesh",
      code: code.trim().toUpperCase() || generatedCode,
      domain,
      tag: discipline,
      stage,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-slate-900/30 backdrop-blur-sm animate-fade-in"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        className="w-full max-w-md bg-surface-container-lowest rounded-xl p-space-lg shadow-xl border border-surface-container-highest flex flex-col gap-space-md animate-modal-in"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="flex items-center justify-between">
          <h4 className="font-headline-sm text-base text-primary font-bold">
            Provision New Project
          </h4>
          <button
            className="text-on-surface-variant hover:text-primary"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="flex flex-col gap-space-xs">
          <label className="font-label-specs text-xs uppercase tracking-wider text-on-surface-variant">
            Project Title
          </label>
          <input
            className="px-space-sm py-2 rounded bg-surface-container-low text-primary font-body-md text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 border border-surface-container-highest"
            placeholder="e.g. Prism Kernel Synapse"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-space-sm">
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-specs text-xs uppercase tracking-wider text-on-surface-variant">
              Code Identifier
            </label>
            <input
              className="px-space-sm py-2 rounded bg-surface-container-low text-primary font-label-specs text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 border border-surface-container-highest"
              placeholder="e.g. PRSM-9"
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-specs text-xs uppercase tracking-wider text-on-surface-variant">
              Domain Area
            </label>
            <select
              className="px-space-sm py-2 rounded bg-surface-container-low text-primary font-label-specs text-xs focus:outline-none border border-surface-container-highest"
              value={domain}
              onChange={(event) => setDomain(event.target.value as Domain)}
            >
              {(Object.keys(domainLabels) as Domain[]).map((value) => (
                <option key={value} value={value}>
                  {domainLabels[value]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-space-sm">
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-specs text-xs uppercase tracking-wider text-on-surface-variant">
              Discipline
            </label>
            <select
              className="px-space-sm py-2 rounded bg-surface-container-low text-primary font-label-specs text-xs focus:outline-none border border-surface-container-highest"
              value={discipline}
              onChange={(event) => setDiscipline(event.target.value as Discipline)}
            >
              {(Object.keys(disciplineLabels) as Discipline[]).map((value) => (
                <option key={value} value={value}>
                  {disciplineLabels[value]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-specs text-xs uppercase tracking-wider text-on-surface-variant">
              Initial Phase
            </label>
            <select
              className="px-space-sm py-2 rounded bg-surface-container-low text-primary font-label-specs text-xs focus:outline-none border border-surface-container-highest"
              value={stage}
              onChange={(event) => setStage(event.target.value as Stage)}
            >
              {(Object.keys(stageLabels) as Stage[]).map((value) => (
                <option key={value} value={value}>
                  {stageLabels[value]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-space-sm pt-space-xs">
          <button
            className="px-space-md py-1.5 rounded text-on-surface-variant hover:text-primary font-label-ui text-xs font-medium"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-space-md py-1.5 rounded bg-primary text-surface-container-lowest font-label-ui text-xs hover:bg-slate-800 font-semibold shadow-xs"
            type="submit"
          >
            Initialize Project
          </button>
        </div>
      </form>
    </div>
  );
}
