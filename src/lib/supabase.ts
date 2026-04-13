/**
 * Supabase Client Configuration
 *
 * Centralized Supabase connection with health check.
 */
import { createClient } from '@supabase/supabase-js'

// Environment variables (trim() handles CRLF issues on Windows)
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

// Create real Supabase client (mock fallback when env vars are missing)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}
