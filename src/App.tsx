import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  Discipline,
  Filter,
  ModalState,
  Project,
  Stage,
  Task,
  TaskStatus,
} from "./types";
import { initialProjects } from "./data";
import { Header } from "./components/Header";
import { TrackSection } from "./components/TrackSection";
import { PipelineBoard } from "./components/PipelineBoard";
import { WorkModal } from "./components/WorkModal";
import { LabModal } from "./components/LabModal";
import { CreateProjectModal } from "./components/CreateProjectModal";

function computeProgress(tasks: Task[], fallback: number) {
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

export default function App() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState<Filter>("all");
  const [modal, setModal] = useState<ModalState>(null);

  const workProjects = useMemo(
    () => projects.filter((project) => project.domain === "work"),
    [projects],
  );
  const labProjects = useMemo(
    () => projects.filter((project) => project.domain === "lab"),
    [projects],
  );

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
      updateProject(projectId, (project) =>
        project.pipelineStage === stage ? project : { ...project, pipelineStage: stage },
      );
    },
    [updateProject],
  );

  const setTaskStatus = useCallback(
    (projectId: string, taskId: string, status: TaskStatus) => {
      updateProject(projectId, (project) => {
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
        const tasks: Task[] = [
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

  const addDirective = useCallback(
    (projectId: string, title: string) => {
      updateProject(projectId, (project) => {
        const tasks: Task[] = [
          ...project.tasks,
          {
            id: `t-lab-${Date.now()}`,
            title,
            status: "todo",
            tag: "DIRECTIVE",
            note: "Experimental telemetry captured",
          },
        ];
        return { ...project, tasks, progress: computeProgress(tasks, project.progress) };
      });
    },
    [updateProject],
  );

  const deleteTask = useCallback(
    (projectId: string, taskId: string) => {
      updateProject(projectId, (project) => {
        const tasks = project.tasks.filter((task) => task.id !== taskId);
        return { ...project, tasks, progress: computeProgress(tasks, project.progress) };
      });
    },
    [updateProject],
  );

  const createProject = useCallback(
    (input: {
      title: string;
      code: string;
      domain: "work" | "lab";
      tag: Discipline;
      stage: Stage;
    }) => {
      const project: Project = {
        id: `prj-${Date.now()}`,
        code: input.code,
        title: input.title,
        tag: input.tag,
        domain: input.domain,
        pipelineStage: input.stage,
        priority: "high",
        progress: 0,
        hypothesis:
          input.domain === "lab" ? "Hypothetical runtime validation" : undefined,
        assignees: input.domain === "lab" ? ["#059669", "#0f172a"] : ["#2563eb", "#64748b"],
        tasks: [
          {
            id: `t-${Date.now()}`,
            title:
              input.domain === "lab"
                ? "Initialize experimental matrix"
                : "Initialize architecture repo",
            status: "todo",
            tag: "INIT",
          },
        ],
      };

      setProjects((previous) => [project, ...previous]);
      setModal(null);
    },
    [],
  );

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
              projects={visibleProjects.filter((project) => project.domain === "work")}
              totalCount={workProjects.length}
              onOpen={openProject}
              onAdd={() => setModal({ kind: "create", scope: "work" })}
            />
            <TrackSection
              domain="lab"
              projects={visibleProjects.filter((project) => project.domain === "lab")}
              totalCount={labProjects.length}
              onOpen={openProject}
              onAdd={() => setModal({ kind: "create", scope: "lab" })}
            />
          </div>

          <PipelineBoard
            projects={visibleProjects}
            onOpen={openProject}
            onMoveStage={moveStage}
          />
        </div>
      </main>

      {modal?.kind === "work" && activeProject && (
        <WorkModal
          project={activeProject}
          onClose={() => setModal(null)}
          onCycleTask={(taskId) => cycleTask(activeProject.id, taskId)}
          onMoveTask={(taskId, status) => setTaskStatus(activeProject.id, taskId, status)}
          onAddTask={(title) => addTask(activeProject.id, title)}
        />
      )}

      {modal?.kind === "lab" && activeProject && (
        <LabModal
          project={activeProject}
          onClose={() => setModal(null)}
          onToggleTask={(taskId) =>
            setTaskStatus(
              activeProject.id,
              taskId,
              activeProject.tasks.find((task) => task.id === taskId)?.status === "done"
                ? "todo"
                : "done",
            )
          }
          onDeleteTask={(taskId) => deleteTask(activeProject.id, taskId)}
          onAddDirective={(title) => addDirective(activeProject.id, title)}
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
