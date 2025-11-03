import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        console.log('Login form submitted for:', credentials.email);

        // Add a timeout to prevent infinite loading
        const loginTimeout = new Promise<boolean>((resolve) => {
          setTimeout(() => {
            console.warn('Login timeout reached');
            resolve(false);
          }, 10000); // 10 second timeout
        });

        // Race between login and timeout
        const success = await Promise.race([
          login(credentials.email, credentials.password),
          loginTimeout
        ]);

        if (success) {
          console.log('Login successful, navigating to dashboard...');
          // Store auth token for ProtectedRoute
          localStorage.setItem('auth_token', 'authenticated');
          navigate('/dashboard');
        } else {
          setError('Invalid email or password. Please check your credentials.');
        }
      } else {
        // Sign up flow (for demo, just redirect to login)
        setError('Sign up functionality coming soon. Please use existing credentials to login.');
        setIsLogin(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during authentication');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Logo size="medium" variant="stacked" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-blue-200">
              {isLogin ? 'Access your Pulse of People dashboard' : 'Join Pulse of People platform'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field (Sign Up Only) */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={credentials.name}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Demo Credentials Hint */}
            {isLogin && (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-100 text-xs font-bold mb-2">🔐 Test Accounts (All roles):</p>

                <div className="space-y-2">
                  <div className="bg-purple-600/20 rounded px-2 py-1">
                    <p className="text-purple-200 text-xs font-semibold">Super Admin (Platform)</p>
                    <p className="text-purple-300 text-xs">superadmin@pulseofpeople.com / password</p>
                  </div>

                  <div className="bg-indigo-600/20 rounded px-2 py-1">
                    <p className="text-indigo-200 text-xs font-semibold">Admin (Organization)</p>
                    <p className="text-indigo-300 text-xs">admin@bettroi.com / password</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-blue-200 text-xs">manager@bettroi.com</p>
                      <p className="text-blue-200 text-xs">analyst@bettroi.com</p>
                      <p className="text-blue-200 text-xs">user@bettroi.com</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs">viewer@bettroi.com</p>
                      <p className="text-blue-200 text-xs">volunteer@bettroi.com</p>
                      <p className="text-blue-200 text-xs">coordinator@bettroi.com</p>
                    </div>
                  </div>

                  <p className="text-blue-300 text-xs mt-2 italic">All passwords: "password"</p>
                </div>
              </div>
            )}


            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle Login/Sign Up */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setCredentials({ email: '', password: '', name: '' });
              }}
              className="text-blue-200 hover:text-white text-sm transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"
              }
            </button>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center text-blue-200 hover:text-white text-sm transition-colors mx-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </button>
          </div>

          {/* Admin Login Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/admin/login')}
              className="text-purple-200 hover:text-white text-xs transition-colors"
            >
              Demo Requests Admin →
            </button>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full animate-bounce"></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-indigo-500/10 rounded-full animate-ping"></div>
    </div>
  );
}