import { useState, useEffect, useCallback } from "react";
import { getMyProjects, createProject, deleteProject } from "../../api/projects";
import type { ProjectResponse } from "../../types/ProjectResponse";

export function useProjects() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    reload: loadProjects,
  };
}
