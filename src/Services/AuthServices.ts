import {Session} from '@supabase/supabase-js';
import {supabase} from './Supabase';

export type AuthSession = Session;

export const getSession = async () => {
  return await supabase.auth.getSession();
};

export const onAuthStateChange = (
  callback: (event: string, session: any) => void,
) => {
  supabase.auth.onAuthStateChange(callback);
};
