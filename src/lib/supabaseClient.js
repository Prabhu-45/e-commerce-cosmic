import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://keujjkinvfjrntzxyayq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldWpqa2ludmZqcm50enh5YXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTQyMjQsImV4cCI6MjA4NTYzMDIyNH0.28C6tlyK4OcmOoGQSAh_WQtFrHzuOzuQ0SnOrRaN3EU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
