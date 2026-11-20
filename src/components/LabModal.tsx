import { useState } from "react";
import type { LabProject } from "../types";
import { Icon } from "./Icon";

interface LabModalProps {
  project: LabProject;
  onClose: () => void;
  onDeleteDraft: (draftId: string) => void;
  onAddDraft: (title: string) => void;
  onPromote: () => void;
}

export function LabModal({
  project,
  onClose,
  onDeleteDraft,
  onAddDraft,
  onPromote,
}: LabModalProps) {
  const [draftTitle, setDraftTitle] = useState("");
  const hasDrafts = project.drafts.length > 0;

  const submit = () => {
    const value = draftTitle.trim();
    if (!value) return;
    onAddDraft(value);
    setDraftTitle("");
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
                  LAB DRAFT
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
              <span className="text-primary font-mono font-medium">{project.hypothesis}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-outline">DRAFTS:</span>
              <span className="text-emerald-700 font-mono font-bold">
                {project.drafts.length} entries
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
              placeholder="Add a draft task for this experiment..."
              type="text"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submit();
              }}
            />
            <button
              className="px-space-sm py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-label-specs text-xs font-semibold border border-emerald-200 transition-colors shadow-xs"
              onClick={submit}
              type="button"
            >
              + Add Draft
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {project.drafts.map((draft, index) => (
              <div
                key={draft.id}
                className="p-3 rounded-lg flex items-start gap-3 bg-surface-container-lowest hover:bg-slate-50 border border-surface-container-highest shadow-xs transition-colors"
              >
                <div className="mt-0.5 w-5 h-5 rounded flex items-center justify-center border border-emerald-200 bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="flex-1 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant uppercase font-bold">
                      {draft.tag || "DRAFT"}
                    </span>
                    <span className="font-mono text-[10px] text-outline">
                      DRAFT 0{index + 1}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-outline/40" />
                    <span className="font-mono text-[10px] text-emerald-700 font-semibold">
                      NOT PROMOTED
                    </span>
                  </div>

                  <p className="font-body-md text-sm text-primary font-medium leading-normal mt-0.5">
                    {draft.title}
                  </p>

                  {draft.note && (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-outline mt-1 pl-2 border-l border-emerald-600/30">
                      <Icon name="sticky_note_2" className="text-[13px] text-emerald-700" />
                      <span>{draft.note}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="text-outline hover:text-error transition-colors p-1"
                  title="Remove draft"
                  onClick={() => onDeleteDraft(draft.id)}
                >
                  <Icon name="delete" className="text-[16px]" />
                </button>
              </div>
            ))}

            {!hasDrafts && (
              <div className="p-6 rounded-lg border border-dashed border-surface-container-highest bg-surface-container-lowest text-center">
                <p className="font-label-specs text-xs text-outline font-mono">
                  NO DRAFTS YET — ADD THE FIRST TASK DRAFT ABOVE
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="px-space-lg py-space-sm bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm font-label-specs text-xs text-outline border-t border-surface-container-highest">
          <div className="flex items-center gap-space-xs font-mono text-emerald-800 font-medium">
            <Icon name="edit_note" className="text-[15px]" />
            <span>DRAFT LIST — PROMOTE TO WORK WHEN READY</span>
          </div>
          <div className="flex items-center gap-space-sm">
            <button
              className="flex items-center gap-1.5 px-space-md py-1.5 rounded bg-primary text-surface-container-lowest font-label-ui text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary"
              onClick={onPromote}
              disabled={!hasDrafts}
              type="button"
            >
              <Icon name="upgrade" className="text-[15px]" />
              Promote to Work
            </button>
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
    </div>
  );
}
