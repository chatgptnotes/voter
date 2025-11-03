import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { UserRole } from '../utils/permissions';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a dummy client if environment variables are missing (for development)
let supabaseClient: SupabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not configured. Using mock authentication.');
  // Create a dummy client that won't connect but won't crash the app
  supabaseClient = null as any;
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;

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
    // First check localStorage for existing session
    const storedUser = localStorage.getItem('user');
    const authToken = localStorage.getItem('auth_token');

    if (storedUser && authToken === 'authenticated') {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Restored user from localStorage:', userData.email);
        setUser(userData);
        setIsLoading(false);
        return; // Skip Supabase check if we have a local user
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }

    // If no local session, check Supabase
    checkSession();

    // Only listen for auth state changes if Supabase is configured
    if (supabase) {
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
    }
  }, []);

  // Check if user has existing session
  const checkSession = async () => {
    try {
      // If Supabase is not configured, skip session check
      if (!supabase) {
        console.warn('Supabase not configured, skipping session check');
        setIsLoading(false);
        return;
      }

      // Add a timeout for the session check
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Session check timeout')), 5000)
      );

      const sessionPromise = supabase.auth.getSession();

      try {
        const { data: { session } } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;

        if (session?.user) {
          await loadUserData(session.user.id);
        }
      } catch (timeoutError) {
        console.warn('Session check timed out, proceeding without session');
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

    if (!supabase) {
      console.warn('Supabase not configured, cannot load user data');
      return;
    }

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
        const user = {
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
        };
        setUser(user);

        // Store in localStorage for persistence
        localStorage.setItem('auth_token', 'authenticated');
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        console.warn('⚠️ No user data returned for ID:', userId);
      }
    } catch (error) {
      console.error('💥 Exception in loadUserData:', error);
    }
  };

  // Login with email and password
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 Login attempt for:', email);
    setIsLoading(true);

    // Try Supabase authentication first if configured
    if (supabase) {
      try {
        console.log('Attempting Supabase authentication...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Supabase login error:', error.message);

          // If Supabase fails, try mock authentication as fallback
          const mockUsers = [
            {
              email: 'superadmin@pulseofpeople.com',
              password: 'password',
              role: 'super_admin',
              name: 'Super Admin',
              is_super_admin: true,
              permissions: ['view_all', 'edit_all', 'manage_users', 'export_data', 'verify_submissions', 'manage_organizations', 'view_all_data', 'manage_system_settings', 'view_audit_logs', 'manage_billing']
            },
            {
              email: 'admin@bettroi.com',
              password: 'password',
              role: 'admin',
              name: 'John Doe',
              is_super_admin: false,
              permissions: ['view_all', 'edit_all', 'manage_users', 'export_data', 'verify_submissions', 'edit_settings', 'manage_billing']
            },
            {
              email: 'user@bettroi.com',
              password: 'password',
              role: 'user',
              name: 'Sam User',
              is_super_admin: false,
              permissions: ['view_dashboard', 'view_analytics', 'view_reports', 'view_surveys']
            },
          ];

          const mockUser = mockUsers.find(u => u.email === email && u.password === password);
          if (mockUser) {
            console.log('Using fallback mock authentication');
            setUser({
              id: `mock-${mockUser.email}`,
              name: mockUser.name,
              email: mockUser.email,
              role: mockUser.role as UserRole,
              permissions: mockUser.permissions,
              is_super_admin: mockUser.is_super_admin,
            });

            localStorage.setItem('auth_token', 'authenticated');
            localStorage.setItem('user', JSON.stringify({
              id: `mock-${mockUser.email}`,
              name: mockUser.name,
              email: mockUser.email,
              role: mockUser.role,
              permissions: mockUser.permissions,
              is_super_admin: mockUser.is_super_admin,
            }));

            setIsLoading(false);
            return true;
          }

          setIsLoading(false);
          return false;
        }

        if (data.user) {
          console.log('✅ Supabase authentication successful!');
          console.log('User ID:', data.user.id);
          console.log('User email:', data.user.email);

          // Try to load user data from users table
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('email', data.user.email)
              .single();

            if (userError) {
              console.error('Error fetching user data:', userError);
              // Create basic user from auth data
              const basicUser = {
                id: data.user.id,
                name: data.user.email?.split('@')[0] || 'User',
                email: data.user.email || '',
                role: 'user' as UserRole,
                permissions: ['view_dashboard', 'view_analytics', 'view_reports'],
                is_super_admin: false,
              };
              setUser(basicUser);
              localStorage.setItem('auth_token', 'authenticated');
              localStorage.setItem('user', JSON.stringify(basicUser));
            } else if (userData) {
              console.log('User data from database:', userData);
              const user = {
                id: userData.id || data.user.id,
                name: userData.name || data.user.email?.split('@')[0] || 'User',
                email: userData.email || data.user.email || '',
                role: userData.role || 'user',
                permissions: userData.permissions || ['view_dashboard', 'view_analytics', 'view_reports'],
                is_super_admin: userData.is_super_admin || false,
                ward: userData.ward,
                constituency: userData.constituency,
                organization_id: userData.organization_id,
                tenant_id: userData.tenant_id,
                status: userData.status,
              };
              setUser(user);
              localStorage.setItem('auth_token', 'authenticated');
              localStorage.setItem('user', JSON.stringify(user));
            }
          } catch (error) {
            console.error('Exception loading user data:', error);
            // Create basic user from auth data
            const basicUser = {
              id: data.user.id,
              name: data.user.email?.split('@')[0] || 'User',
              email: data.user.email || '',
              role: 'user' as UserRole,
              permissions: ['view_dashboard', 'view_analytics', 'view_reports'],
              is_super_admin: false,
            };
            setUser(basicUser);
            localStorage.setItem('auth_token', 'authenticated');
            localStorage.setItem('user', JSON.stringify(basicUser));
          }

          setIsLoading(false);
          return true;
        }
      } catch (error) {
        console.error('Supabase connection error:', error);
        setIsLoading(false);
        return false;
      }
    }

    // No Supabase configured
    console.warn('Supabase not configured');
    setIsLoading(false);
    return false;
  };

  // Logout
  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
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
    supabase: supabase || {} as SupabaseClient,  // Provide a dummy object if null
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