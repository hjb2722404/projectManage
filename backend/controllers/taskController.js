const Task = require('../models/Task');
const supabase = require('../config/supabase');

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    console.log('Fetching all tasks from Supabase');
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Tasks fetched successfully:', data?.length || 0);
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Get a task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching task by ID:', id);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Task fetched successfully:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const {
      name,
      type,
      project_id: projectId,
      description,
      status,
      created_at: createdAt,
      due_date: dueDate,
      planned_completion_date: plannedCompletionDate,
      actual_completion_date: actualCompletionDate,
      progress
    } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: 'Task name is required' });
    }

    console.log('Creating new task:', name);
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          name,
          type: type || 'task',
          project_id: projectId || null,
          description: description || '',
          status: status || 'todo',
          created_at: createdAt || new Date().toISOString(),
          due_date: dueDate || null,
          planned_completion_date: plannedCompletionDate || null,
          actual_completion_date: actualCompletionDate || null,
          progress: progress || 0
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Task created successfully:', data);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      project_id: projectId,
      description,
      status,
      created_at: createdAt,
      due_date: dueDate,
      planned_completion_date: plannedCompletionDate,
      actual_completion_date: actualCompletionDate,
      progress
    } = req.body;

    console.log('Updating task:', id);
    const { data, error } = await supabase
      .from('tasks')
      .update({
        name,
        type,
        project_id: projectId,
        description,
        status,
        created_at: createdAt,
        due_date: dueDate,
        planned_completion_date: plannedCompletionDate,
        actual_completion_date: actualCompletionDate,
        progress,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Task updated successfully:', data);
    res.json(data);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Deleting task:', id);
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Task deleted successfully');
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};