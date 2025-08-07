const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL || 'your_supabase_url',
  process.env.SUPABASE_KEY || 'your_supabase_key'
);

module.exports = supabase;