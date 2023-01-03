import { SupabaseClient, createClient } from '@supabase/supabase-js'

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseSecretKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseClient: SupabaseClient = createClient(supabaseUrl, supabaseSecretKey)

export default supabaseClient
