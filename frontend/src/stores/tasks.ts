import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { tasksApi } from '../services/api';
import type { Task } from '../types/task';

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const taskById = computed(() => (id: number) => {
    return tasks.value.find(task => task.id === id);
  });

  const tasksByProjectId = computed(() => (projectId: number) => {
    return tasks.value.filter(task => task.projectId === projectId);
  });

  const fetchTasks = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      tasks.value = await tasksApi.getAll();
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch tasks';
      console.error('Error fetching tasks:', err);
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (task: Omit<Task, 'id' | 'updatedAt'>) => {
    loading.value = true;
    error.value = null;
    
    try {
      const newTask = await tasksApi.create(task);
      tasks.value.push(newTask);
      return newTask;
    } catch (err: any) {
      error.value = err.message || 'Failed to create task';
      console.error('Error creating task:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateTask = async (id: number, task: Partial<Task>) => {
    loading.value = true;
    error.value = null;
    
    try {
      const updatedTask = await tasksApi.update(id, task);
      const index = tasks.value.findIndex(t => t.id === id);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }
      return updatedTask;
    } catch (err: any) {
      error.value = err.message || 'Failed to update task';
      console.error('Error updating task:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteTask = async (id: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      await tasksApi.delete(id);
      tasks.value = tasks.value.filter(task => task.id !== id);
    } catch (err: any) {
      error.value = err.message || 'Failed to delete task';
      console.error('Error deleting task:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    tasks,
    loading,
    error,
    taskById,
    tasksByProjectId,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
});