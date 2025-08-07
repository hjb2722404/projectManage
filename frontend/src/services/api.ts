// API service for handling requests to backend

// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Clear all Supabase auth data from storage
export const clearAuthData = () => {
  // Clear localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.includes('supabase') || key.includes('auth')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear sessionStorage
  Object.keys(sessionStorage).forEach(key => {
    if (key.includes('supabase') || key.includes('auth')) {
      sessionStorage.removeItem(key);
    }
  });
  
  console.log('Cleared all Supabase auth data from storage');
};

// Handle API errors
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Handle authentication errors
    if (response.status === 401) {
      // Clear auth data on authentication error
      clearAuthData();
      console.warn('Authentication error. Cleared auth data.');
      throw new Error('认证失败，请重新登录');
    }
    
    // Handle forbidden access
    if (response.status === 403) {
      throw new Error('访问被拒绝，权限不足');
    }
    
    // Handle not found
    if (response.status === 404) {
      throw new Error('请求的资源未找到');
    }
    
    // Handle server errors
    if (response.status >= 500) {
      throw new Error('服务器内部错误，请稍后再试');
    }
    
    throw new Error(errorData.message || `请求失败: ${response.statusText}`);
  }
  return response;
};

// Projects API
export const projectsApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      await handleApiError(response);
      return response.json();
    } catch (error) {
      console.error('获取项目列表失败:', error);
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`);
      await handleApiError(response);
      return response.json();
    } catch (error) {
      console.error('获取项目详情失败:', error);
      throw error;
    }
  },

  create: async (project: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      
      await handleApiError(response);
      return response.json();
    } catch (error) {
      console.error('创建项目失败:', error);
      throw error;
    }
  },

  update: async (id: number, project: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      
      await handleApiError(response);
      return response.json();
    } catch (error) {
      console.error('更新项目失败:', error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
      });
      
      await handleApiError(response);
      return response;
    } catch (error) {
      console.error('删除项目失败:', error);
      throw error;
    }
  },
};

// Tasks API
export const tasksApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      await handleApiError(response);
      return response.json();
    } catch (error) {
      console.error('获取任务列表失败:', error);
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
      await handleApiError(response);
      return response.json();
    } catch (error) {
      console.error('获取任务详情失败:', error);
      throw error;
    }
  },

  create: async (task: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      
      await handleApiError(response);
      return response.json();
    } catch (error) {
      console.error('创建任务失败:', error);
      throw error;
    }
  },

  update: async (id: number, task: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      
      await handleApiError(response);
      return response.json();
    } catch (error) {
      console.error('更新任务失败:', error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      
      await handleApiError(response);
      return response;
    } catch (error) {
      console.error('删除任务失败:', error);
      throw error;
    }
  },
};