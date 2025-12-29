import { createClient } from '@supabase/supabase-js';

// Supabase configuration constants
export const SUPABASE_URL = 'https://nhmrdnczfxomarpncyot.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obXJkbmN6ZnhvbWFycG5jeW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjkxMDAsImV4cCI6MjA2MzQwNTEwMH0.-dSIBlkOHATZ6IXr_dQZIY6GEI98UeoP7JJHyFH1880';

// Create and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Create a function to generate headers with authentication token for raw REST API calls
export function getAuthHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${token}`
  };
}
