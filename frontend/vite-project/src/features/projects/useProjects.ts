import { useState, useEffect, useCallback } from "react";
import { getMyProjects, createProject, deleteProject } from "../../api/projects";
import type { ProjectResponse } from "../../types/ProjectResponse";
import type { DiagramSummaryResponse } from "../../types/DiagramResponse";
export function useProjects() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagramsCache, setDiagramsCache] = useState<
    Record<string, DiagramSummaryResponse[]>
  >({});
  
  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  //When a project is opened, it needs to be updated locally.
  //As every project starts with a null value on diagrams,
  //when is opned, you click "updateProjectDiagrams". In this case,
  //is a callback function that iterates on all projects (adding them up on an
  //list of projects) until it finds the one to be changed(the one which needs
  //diagrams to be added) and adds the diagrams locally in the project(so it has them)
  //after that, it keeps iterating until all projects are added.Then, it sets the projects
  //and now the diagrams of the opened project are loaded, so when opening it again,
  //it doesn't do the fetch again for that project
  // const updateProjectDiagrams = useCallback(
  //   (projectId: string, diagrams: NonNullable<ProjectResponse["Diagrams"]>) => {
  //     setProjects((current) =>
  //       current.map((project) =>
  //         project.id === projectId ? { ...project, Diagrams: diagrams } : project,
  //       ),
  //     );
  //   },
  //   [],
  // );

  //changed, now it updates the local state diagramsCache, instead of modifying the whole project
  //it saves it in 
  const updateProjectDiagrams = useCallback(
    (projectId: string, diagrams: DiagramSummaryResponse[]) => {
      setDiagramsCache((current) => ({ ...current, [projectId]: diagrams }));
    },
    []
  );

  useEffect(() => {
    let active = true;

    getMyProjects()
      .then((data) => {
        if (active) {
          setProjects(data);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Error desconocido");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function addProject(name: string) {
    const newProject = await createProject(name);
    setProjects((prev) => [newProject, ...prev]);
  }

  async function removeProject(projectId: string) {
    await deleteProject(projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }

  return {
    projects,
    loading,
    error,
    addProject,
    removeProject,
    diagramsCache,
    updateProjectDiagrams,
    reload: loadProjects,
  };
}
