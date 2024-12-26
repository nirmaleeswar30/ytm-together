import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { initializeSocket, disconnectSocket } from '../lib/socket';

interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ user: data.user, session: data.session });
    initializeSocket(data.session?.access_token || '');
  },
  signUp: async (email: string, password: string, username: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: authData.user.id, username }]);
      
      if (profileError) throw profileError;
    }

    set({ user: authData.user, session: authData.session });
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
    disconnectSocket();
  },
  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();
    
    set({ user, session, loading: false });
    
    if (session?.access_token) {
      initializeSocket(session.access_token);
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user || null, session });
      if (session?.access_token) {
        initializeSocket(session.access_token);
      } else {
        disconnectSocket();
      }
    });
  },
}));