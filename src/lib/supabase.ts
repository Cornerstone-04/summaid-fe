import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/utils/constants';

// Create a single Supabase client for use throughout your app
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);