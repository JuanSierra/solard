export type Domain = "work" | "lab";

export type Stage = "backlog" | "active" | "maint";

export type TaskStatus = "todo" | "doing" | "done";

export type Discipline = "engine" | "interface" | "ai";

export type Priority = "high" | "medium" | "low";

export type Filter = "all" | Discipline;

export interface WorkTask {
  id: string;
  title: string;
  status: TaskStatus;
  tag: string;
}

export interface LabDraft {
  id: string;
  title: string;
  tag: string;
  note?: string;
}

interface ProjectBase {
  id: string;
  code: string;
  title: string;
  tag: Discipline;
  priority: Priority;
  assignees: string[];
}

export interface WorkProject extends ProjectBase {
  domain: "work";
  pipelineStage: Stage;
  progress: number;
  tasks: WorkTask[];
}

export interface LabProject extends ProjectBase {
  domain: "lab";
  hypothesis: string;
  drafts: LabDraft[];
}

export type Project = WorkProject | LabProject;

export function isWorkProject(project: Project): project is WorkProject {
  return project.domain === "work";
}

export function isLabProject(project: Project): project is LabProject {
  return project.domain === "lab";
}

export type NewProjectInput =
  | {
      title: string;
      code: string;
      domain: "work";
      tag: Discipline;
      stage: Stage;
    }
  | {
      title: string;
      code: string;
      domain: "lab";
      tag: Discipline;
    };

export type ModalState =
  | { kind: "work"; projectId: string }
  | { kind: "lab"; projectId: string }
  | { kind: "create"; scope: Domain }
  | null;
