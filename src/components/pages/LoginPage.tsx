'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase';
import { useSupabaseStore } from '@/store/useSupabaseStore';

interface LoginPageProps {
  heading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  buttonText?: string;
  signupText?: string;
  signupUrl?: string;
}

const LoginPage = ({
  heading = "Welcome to Timestack",
  logo = {
    url: "/",
    src: "https://i.ibb.co/C3Lttm0S/logv2.png",
    alt: "Timestack Logo",
    title: "Timestack - Luxury Watch Management",
  },
  buttonText = "Sign In",
  signupText = "Need an account?",
  signupUrl = "#",
}: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setCurrentPage } = useSupabaseStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Check if user has master role
        const { data: { user } } = await supabase.auth.getUser();
        const role = user?.user_metadata?.role;
        
        if (role === 'master') {
          // Master user - can see all data
          setCurrentPage('dashboard');
        } else if (role === 'user') {
          // Regular user - can see their company's data
          setCurrentPage('dashboard');
        } else {
          setError('Invalid user role. Please contact support.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-blue-600 p-1.5">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 bg-white rounded-4xl shadow-timestack overflow-hidden relative flex flex-col min-h-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-6 py-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <a href={logo.url} className="group inline-block">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-16 w-auto transition-transform duration-200 group-hover:scale-105"
                  />
                </a>
                {heading && (
                  <div className="mt-4">
                    <h1 className="text-3xl font-bold text-blue-900">{heading}</h1>
                    <p className="text-blue-700 text-lg mt-2">Luxury Watch Inventory Management</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      buttonText
                    )}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-3">Demo Credentials</p>
                    <div className="bg-blue-50 rounded-xl p-4 text-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Master:</span>
                        <span className="font-mono text-blue-800">master@timestack.com</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Password:</span>
                        <span className="font-mono text-blue-800">master123</span>
                      </div>
                      <div className="border-t border-blue-200 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">User:</span>
                          <span className="font-mono text-blue-800">user@luxurywatch.com</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Password:</span>
                          <span className="font-mono text-blue-800">user123</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-6">
                <div className="text-gray-500 flex justify-center gap-1 text-sm">
                  <p>{signupText}</p>
                  <a
                    href={signupUrl}
                    className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
