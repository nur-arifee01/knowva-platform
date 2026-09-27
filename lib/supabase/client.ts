import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iewdobuvoauyajpsgsoh.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlld2RvYnV2b2F1eWFqcHNnc29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTA5MTcsImV4cCI6MjEwNTU2NjkxN30.tcCnXyLPKsSIxPyIBCoFGVzB-Z8lHHr1-zOB0DqmvTM';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

