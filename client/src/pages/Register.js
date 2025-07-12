import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await registerUser(data.name, data.email, data.password);
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
            <h2 className="text-4xl font-extrabold text-purple-800 mb-2 tracking-tight">Sign Up</h2>
            <p className="text-purple-400 text-base mb-10">Create your account and join our community!</p>
          </div>
          <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-purple-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200 w-5 h-5" />
                  <input
                    id="name"
                    type="text"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                    className="input bg-purple-50 text-purple-900 placeholder-purple-300 pl-10 border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-300"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
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
                    className="input bg-purple-50 text-purple-900 placeholder-purple-300 pl-10 border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-300"
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
                    className="input bg-purple-50 text-purple-900 placeholder-purple-300 pl-10 pr-10 border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-300"
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
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-purple-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                    className="input bg-purple-50 text-purple-900 placeholder-purple-300 pl-10 pr-10 border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-300"
                    placeholder="Please confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-200 hover:text-purple-500"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary py-3 text-lg rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? 'Creating account...' : 'SIGN UP'}
            </button>
          </form>
          <div className="mt-10 text-sm text-purple-500 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-700 font-semibold hover:underline">Sign in</Link>
          </div>
        </div>
        {/* Right: Illustration */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 animate-slide-up">
          <img src="/signup.png" alt="Sign Up Illustration" className="max-w-lg w-full h-auto drop-shadow-xl" />
        </div>
      </div>
    </div>
  );
};

export default Register; 