import { createClient } from "@supabase/supabase-js";

// Global Supabase client instance used across the frontend (Auth, DB, Realtime)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project-id.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummykey";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
