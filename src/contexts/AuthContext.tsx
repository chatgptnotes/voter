import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { UserRole } from '../utils/permissions';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  permissions: string[];
  ward?: string;
  constituency?: string;
  is_super_admin?: boolean;
  organization_id?: string;
  tenant_id?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

interface AuthContextType {
  user: User | null;
  supabase: SupabaseClient;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  isWorker: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check if user has existing session
  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        await loadUserData(session.user.id);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data from database
  const loadUserData = async (userId: string) => {
    console.log('🔍 loadUserData called with userId:', userId);

    try {
      console.log('📤 Querying users table...');
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('📥 Query response:', { userData, error });

      if (error) {
        console.error('❌ Error loading user data:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return;
      }

      if (userData) {
        console.log('✅ User data loaded successfully:', userData.email);
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
          permissions: userData.permissions || [],
          ward: userData.ward,
          constituency: userData.constituency,
          is_super_admin: userData.is_super_admin,
          organization_id: userData.organization_id,
          tenant_id: userData.tenant_id,
          status: userData.status,
        });
      } else {
        console.warn('⚠️ No user data returned for ID:', userId);
      }
    } catch (error) {
      console.error('💥 Exception in loadUserData:', error);
    }
  };

  // Login with email and password
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        await loadUserData(data.user.id);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Super admins have all permissions
    if (user.is_super_admin) return true;

    // Admins have all permissions
    if (user.role === 'admin' || user.role === 'super_admin') return true;

    // Check user's permissions array
    return user.permissions?.includes(permission) || false;
  };

  // Check if user is a field worker
  const isWorker = (): boolean => {
    if (!user) return false;
    return ['ward-coordinator', 'social-media', 'survey-team', 'truth-team', 'volunteer'].includes(user.role);
  };

  const value: AuthContextType = {
    user,
    supabase,
    login,
    logout,
    isLoading,
    hasPermission,
    isWorker
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}