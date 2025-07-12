import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate('/profile');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-white py-12 px-4">
      <div className="w-full max-w-4xl bg-white/60 backdrop-blur-lg border border-purple-200 shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in rounded-3xl" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', border: '1.5px solid rgba(180, 140, 255, 0.25)'}}>
        {/* Left: Form */}
        <div className="flex-1 flex flex-col justify-center px-10 py-14 md:py-20 animate-slide-up">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-purple-800 mb-2 tracking-tight">Login</h2>
            <p className="text-purple-400 text-base mb-10">Welcome! Please log in to your account.</p>
          </div>
          <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-purple-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="input pl-10 bg-purple-50 text-purple-900 placeholder-purple-300 border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-300"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-purple-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200 w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className="input pl-10 pr-10 bg-purple-50 text-purple-900 placeholder-purple-300 border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-300"
                    placeholder="Please enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-200 hover:text-purple-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary py-3 text-lg rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? 'Signing in...' : 'LOGIN'}
            </button>
          </form>
          <div className="mt-10 text-sm text-purple-500 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-700 font-semibold hover:underline">Sign up</Link>
          </div>
        </div>
        {/* Right: Illustration */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 animate-slide-up">
          <img src="/login.png" alt="Login Illustration" className="max-w-lg w-full h-auto drop-shadow-xl" />
        </div>
      </div>
    </div>
  );
};

export default Login; 