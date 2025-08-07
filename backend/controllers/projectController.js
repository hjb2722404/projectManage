const Project = require('../models/Project');
const supabase = require('../config/supabase');

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    console.log('Fetching all projects from Supabase');
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Projects fetched successfully:', data?.length || 0);
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

// Get a project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching project by ID:', id);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log('Project fetched successfully:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};

// Create a new project
const createProject = async (req, res) => {
  try {
    const {
      name,
      managers,
      upstream_contacts: upstreamContacts,
      downstream_contacts: downstreamContacts,
      start_date: startDate,
      end_date: endDate
    } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    console.log('Creating new project:', name);
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          name,
          managers: managers || [],
          upstream_contacts: upstreamContacts || [],
          downstream_contacts: downstreamContacts || [],
          start_date: startDate,
          end_date: endDate
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Project created successfully:', data);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      managers,
      upstream_contacts: upstreamContacts,
      downstream_contacts: downstreamContacts,
      start_date: startDate,
      end_date: endDate
    } = req.body;

    console.log('Updating project:', id);
    const { data, error } = await supabase
      .from('projects')
      .update({
        name,
        managers,
        upstream_contacts: upstreamContacts,
        downstream_contacts: downstreamContacts,
        start_date: startDate,
        end_date: endDate,
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
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log('Project updated successfully:', data);
    res.json(data);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Deleting project:', id);
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Project deleted successfully');
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};