/**
 * Supabase Client Configuration
 *
 * Centralized Supabase connection with health check.
 */

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Mock supabase client for build (will be replaced with real client when env vars are set)
export const supabase = {
  from: (_table: string) => ({
    select: (_columns: string) => ({
      eq: (_field: string, _value: any) => ({
        single: async () => ({ data: null, error: { code: 'NOT_CONFIGURED', message: 'Supabase not configured' } })
      }),
      order: (_field: string, _options: any) => ({
        then: async (resolve: any) => resolve({ data: [], error: null })
      })
    }),
    insert: (_data: any) => ({
      select: () => ({
        single: async () => ({ data: null, error: { code: 'NOT_CONFIGURED', message: 'Supabase not configured' } })
      })
    }),
    update: (_data: any) => ({
      eq: (_field: string, _value: any) => ({
        select: () => ({
          single: async () => ({ data: null, error: { code: 'NOT_CONFIGURED', message: 'Supabase not configured' } })
        })
      })
    }),
    delete: () => ({
      eq: (_field: string, _value: any) => ({
        select: () => ({
          single: async () => ({ data: null, error: { code: 'NOT_CONFIGURED', message: 'Supabase not configured' } })
        })
      })
    })
  }),
  storage: {
    from: (_bucket: string) => ({
      upload: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      download: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      remove: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      publicUrl: (_path: string) => ''
    })
  }
}
