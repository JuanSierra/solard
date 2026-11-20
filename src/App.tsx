import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  Filter,
  LabProject,
  ModalState,
  NewProjectInput,
  Project,
  Stage,
  TaskStatus,
  WorkProject,
  WorkTask,
} from "./types";
import { isLabProject, isWorkProject } from "./types";
import { initialProjects } from "./data";
import { Header } from "./components/Header";
import { TrackSection } from "./components/TrackSection";
import { PipelineBoard } from "./components/PipelineBoard";
import { WorkModal } from "./components/WorkModal";
import { LabModal } from "./components/LabModal";
import { CreateProjectModal } from "./components/CreateProjectModal";

function computeProgress(tasks: WorkTask[], fallback: number) {
  if (tasks.length === 0) return fallback;
  const done = tasks.filter((task) => task.status === "done").length;
  const doing = tasks.filter((task) => task.status === "doing").length;
  return Math.round(((done + doing * 0.5) / tasks.length) * 100);
}

function nextStatus(status: TaskStatus): TaskStatus {
  if (status === "todo") return "doing";
  if (status === "doing") return "done";
  return "todo";
}

function promoteToWork(project: LabProject): WorkProject {
  const tasks: WorkTask[] = project.drafts.map((draft) => ({
    id: draft.id,
    title: draft.title,
    status: "todo",
    tag: draft.tag,
  }));

  return {
    id: project.id,
    code: project.code,
    title: project.title,
    tag: project.tag,
    priority: project.priority,
    assignees: project.assignees,
    domain: "work",
    pipelineStage: "backlog",
    progress: computeProgress(tasks, 0),
    tasks,
  };
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState<Filter>("all");
  const [modal, setModal] = useState<ModalState>(null);

  const workProjects = useMemo(() => projects.filter(isWorkProject), [projects]);
  const labProjects = useMemo(() => projects.filter(isLabProject), [projects]);

  const visibleProjects = useMemo(
    () => projects.filter((project) => filter === "all" || project.tag === filter),
    [projects, filter],
  );

  const activeProject = useMemo(() => {
    if (!modal || (modal.kind !== "work" && modal.kind !== "lab")) return null;
    return projects.find((project) => project.id === modal.projectId) ?? null;
  }, [modal, projects]);

  const updateProject = useCallback((projectId: string, updater: (project: Project) => Project) => {
    setProjects((previous) =>
      previous.map((project) => (project.id === projectId ? updater(project) : project)),
    );
  }, []);

  const openProject = useCallback((project: Project) => {
    setModal({ kind: project.domain, projectId: project.id });
  }, []);

  const moveStage = useCallback(
    (projectId: string, stage: Stage) => {
      updateProject(projectId, (project) => {
        if (!isWorkProject(project) || project.pipelineStage === stage) return project;
        return { ...project, pipelineStage: stage };
      });
    },
    [updateProject],
  );

  const setTaskStatus = useCallback(
    (projectId: string, taskId: string, status: TaskStatus) => {
      updateProject(projectId, (project) => {
        if (!isWorkProject(project)) return project;
        const tasks = project.tasks.map((task) =>
          task.id === taskId ? { ...task, status } : task,
        );
        return { ...project, tasks, progress: computeProgress(tasks, project.progress) };
      });
    },
    [updateProject],
  );

  const cycleTask = useCallback(
    (projectId: string, taskId: string) => {
      updateProject(projectId, (project) => {
        if (!isWorkProject(project)) return project;
        const target = project.tasks.find((task) => task.id === taskId);
        if (!target) return project;
        const tasks = project.tasks.map((task) =>
          task.id === taskId ? { ...task, status: nextStatus(task.status) } : task,
        );
        return { ...project, tasks, progress: computeProgress(tasks, project.progress) };
      });
    },
    [updateProject],
  );

  const addTask = useCallback(
    (projectId: string, title: string) => {
      updateProject(projectId, (project) => {
        if (!isWorkProject(project)) return project;
        const tasks: WorkTask[] = [
          ...project.tasks,
          {
            id: `t-${Date.now()}`,
            title,
            status: "todo",
            tag: project.code.split("-")[0] || "PROD",
          },
        ];
        return { ...project, tasks, progress: computeProgress(tasks, project.progress) };
      });
    },
    [updateProject],
  );

  const addDraft = useCallback(
    (projectId: string, title: string) => {
      updateProject(projectId, (project) => {
        if (!isLabProject(project)) return project;
        return {
          ...project,
          drafts: [
            ...project.drafts,
            { id: `d-${Date.now()}`, title, tag: "DRAFT" },
          ],
        };
      });
    },
    [updateProject],
  );

  const deleteDraft = useCallback(
    (projectId: string, draftId: string) => {
      updateProject(projectId, (project) => {
        if (!isLabProject(project)) return project;
        return {
          ...project,
          drafts: project.drafts.filter((draft) => draft.id !== draftId),
        };
      });
    },
    [updateProject],
  );

  const promoteLab = useCallback((projectId: string) => {
    setProjects((previous) =>
      previous.map((project) =>
        project.id === projectId && isLabProject(project)
          ? promoteToWork(project)
          : project,
      ),
    );
    setModal((current) => (current?.kind === "lab" ? null : current));
  }, []);

  const createProject = useCallback((input: NewProjectInput) => {
    const id = `prj-${Date.now()}`;

    if (input.domain === "work") {
      const tasks: WorkTask[] = [
        {
          id: `t-${Date.now()}`,
          title: "Initialize architecture repo",
          status: "todo",
          tag: "INIT",
        },
      ];
      const project: WorkProject = {
        id,
        code: input.code,
        title: input.title,
        tag: input.tag,
        priority: "high",
        assignees: ["#2563eb", "#64748b"],
        domain: "work",
        pipelineStage: input.stage,
        progress: computeProgress(tasks, 0),
        tasks,
      };
      setProjects((previous) => [project, ...previous]);
    } else {
      const project: LabProject = {
        id,
        code: input.code,
        title: input.title,
        tag: input.tag,
        priority: "high",
        assignees: ["#059669", "#0f172a"],
        domain: "lab",
        hypothesis: "Hypothetical runtime validation",
        drafts: [
          {
            id: `d-${Date.now()}`,
            title: "Initialize experimental matrix",
            tag: "INIT",
          },
        ],
      };
      setProjects((previous) => [project, ...previous]);
    }

    setModal(null);
  }, []);

  useEffect(() => {
    if (!modal) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal]);

  return (
    <div className="min-h-screen flex flex-col bg-surface font-body-md text-on-surface antialiased">
      <Header
        filter={filter}
        total={projects.length}
        onFilterChange={setFilter}
        onNewProject={() => setModal({ kind: "create", scope: "work" })}
      />

      <main className="w-full flex-1 flex flex-col bg-surface">
        <div className="p-gutter-mobile sm:p-gutter flex-1 flex flex-col gap-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
            <TrackSection
              domain="work"
              projects={visibleProjects.filter(isWorkProject)}
              totalCount={workProjects.length}
              onOpen={openProject}
              onAdd={() => setModal({ kind: "create", scope: "work" })}
              onDropProject={promoteLab}
            />
            <TrackSection
              domain="lab"
              projects={visibleProjects.filter(isLabProject)}
              totalCount={labProjects.length}
              onOpen={openProject}
              onAdd={() => setModal({ kind: "create", scope: "lab" })}
            />
          </div>

          <PipelineBoard
            projects={visibleProjects.filter(isWorkProject)}
            onOpen={openProject}
            onMoveStage={moveStage}
          />
        </div>
      </main>

      {modal?.kind === "work" && activeProject && isWorkProject(activeProject) && (
        <WorkModal
          project={activeProject}
          onClose={() => setModal(null)}
          onCycleTask={(taskId) => cycleTask(activeProject.id, taskId)}
          onMoveTask={(taskId, status) => setTaskStatus(activeProject.id, taskId, status)}
          onAddTask={(title) => addTask(activeProject.id, title)}
        />
      )}

      {modal?.kind === "lab" && activeProject && isLabProject(activeProject) && (
        <LabModal
          project={activeProject}
          onClose={() => setModal(null)}
          onDeleteDraft={(draftId) => deleteDraft(activeProject.id, draftId)}
          onAddDraft={(title) => addDraft(activeProject.id, title)}
          onPromote={() => promoteLab(activeProject.id)}
        />
      )}

      {modal?.kind === "create" && (
        <CreateProjectModal
          scope={modal.scope}
          onClose={() => setModal(null)}
          onCreate={createProject}
        />
      )}
    </div>
  );
}
