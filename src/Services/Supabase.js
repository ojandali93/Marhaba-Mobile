import { createClient } from '@supabase/supabase-js';
import Config from 'react-native-config';

// Pull environment variables safely
const supabaseUrl = Config.SUPABASE_URL;
const supabaseAnonKey = Config.SUPABASE_ANON_KEY;

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);