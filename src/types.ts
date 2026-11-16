export type Domain = "work" | "lab";

export type Stage = "backlog" | "active" | "maint";

export type TaskStatus = "todo" | "doing" | "done";

export type Discipline = "engine" | "interface" | "ai";

export type Priority = "high" | "medium" | "low";

export type Filter = "all" | Discipline;

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  tag: string;
  note?: string;
}

export interface Project {
  id: string;
  code: string;
  title: string;
  tag: Discipline;
  domain: Domain;
  pipelineStage: Stage;
  priority: Priority;
  progress: number;
  assignees: string[];
  tasks: Task[];
  hypothesis?: string;
}

export type ModalState =
  | { kind: "work"; projectId: string }
  | { kind: "lab"; projectId: string }
  | { kind: "create"; scope: Domain }
  | null;
