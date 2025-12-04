import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://uvrlgupucgpjudyxyrfi.supabase.co';
const supabaseKey = 'sb_publishable_xH3IlAyj2LXhh7FX4Uh2sg_ZLSWQi4J';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };
