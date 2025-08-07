import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { projectsApi } from '../services/api';
import type { Project } from '../types/project';

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const projectById = computed(() => (id: number) => {
    return projects.value.find(project => project.id === id);
  });

  const fetchProjects = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      projects.value = await projectsApi.getAll();
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch projects';
      console.error('Error fetching projects:', err);
    } finally {
      loading.value = false;
    }
  };

  const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true;
    error.value = null;
    
    try {
      const newProject = await projectsApi.create(project);
      projects.value.push(newProject);
      return newProject;
    } catch (err: any) {
      error.value = err.message || 'Failed to create project';
      console.error('Error creating project:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateProject = async (id: number, project: Partial<Project>) => {
    loading.value = true;
    error.value = null;
    
    try {
      const updatedProject = await projectsApi.update(id, project);
      const index = projects.value.findIndex(p => p.id === id);
      if (index !== -1) {
        projects.value[index] = updatedProject;
      }
      return updatedProject;
    } catch (err: any) {
      error.value = err.message || 'Failed to update project';
      console.error('Error updating project:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteProject = async (id: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      await projectsApi.delete(id);
      projects.value = projects.value.filter(project => project.id !== id);
    } catch (err: any) {
      error.value = err.message || 'Failed to delete project';
      console.error('Error deleting project:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    projects,
    loading,
    error,
    projectById,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  };
});