'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getSupabase, isCloudEnabled } from '@/lib/supabase';
import { enableCloudSync, fullSync } from '@/utils/cloudSync';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  return (
    context || {
      user: null,
      isCloudEnabled: false,
      signOut: async () => {},
    }
  );
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isCloudEnabled) return;
    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  // Whenever a user is present, mirror local mutations and run a two-way sync.
  useEffect(() => {
    if (user) {
      enableCloudSync(user.id);
      fullSync(user.id);
    } else {
      enableCloudSync(null);
    }
  }, [user]);

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isCloudEnabled, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
