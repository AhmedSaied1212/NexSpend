import { Eye, EyeOff, Loader2, Lock, Mail, Wallet } from 'lucide-react';
import React, { useContext, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authServices from '../services/authServices';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import FormField from '@/components/ui/FormField';

// ─── Validators ───────────────────────────────────────────────────────────────
const validateEmail    = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address.';
const validatePassword = (v) => v.trim().length > 0 ? '' : 'Password is required.';

// ─── Page ──────────────────────────────────────────────────────────────────────
const Login = () => {
  const [email,        setEmail]       = useState('');
  const [password,     setPassword]    = useState('');
  const [isLoading,    setIsLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched,      setTouched]     = useState({ email: false, password: false });

  const { setUser, fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const touch = (field) => setTouched((p) => ({ ...p, [field]: true }));

  const errors = useMemo(() => ({
    email:    validateEmail(email),
    password: validatePassword(password),
  }), [email, password]);

  const isFormValid = Object.values(errors).every((e) => e === '');

  const handleLogin = async () => {
    setTouched({ email: true, password: true });
    if (!isFormValid) return;
    setIsLoading(true);
    try {
      const data = await authServices.login({ email, password });
      if (data?.success) {
        await fetchUser();
        navigate('/');
      } else {
        setUser(null);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleLogin(); };

  const inputBase = 'p-3 w-full text-sm rounded-xl outline-none ring-2 duration-200 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500';
  const ringFor = (field) => {
    if (!touched[field]) return 'ring-slate-200 dark:ring-slate-700 focus:ring-blue-400';
    return errors[field]
      ? 'ring-red-400 focus:ring-red-500'
      : 'ring-green-400 focus:ring-green-500';
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="w-full max-w-[500px] mx-4">

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-100/60 dark:shadow-slate-950/80 rounded-3xl p-8 flex flex-col">

          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-7">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
              <Wallet size={32} className="text-white" />
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-lg font-bold tracking-widest uppercase">
              NEXSPEND
            </span>
          </div>

          <h1 className="text-center text-2xl font-bold text-slate-800 dark:text-slate-100">
            Welcome back
          </h1>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-7">
            Sign in to manage your finances
          </p>

          {/* Email */}
          <FormField
            label="Email address"
            icon={Mail}
            error={errors.email}
            touched={touched.email}
          >
            <input
              id="login-email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); touch('email'); }}
              onBlur={() => touch('email')}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="you@example.com"
              className={`${inputBase} ${ringFor('email')}`}
            />
          </FormField>

          {/* Password */}
          <FormField
            label="Password"
            icon={Lock}
            error={errors.password}
            touched={touched.password}
          >
            <div className="relative">
              <input
                id="login-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); touch('password'); }}
                onBlur={() => touch('password')}
                onKeyDown={handleKeyDown}
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                className={`${inputBase} pr-11 ${ringFor('password')}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </FormField>

          {/* Submit */}
          <button
            id="login-submit"
            disabled={isLoading}
            onClick={handleLogin}
            className={`mt-4 flex justify-center items-center w-full py-3.5 text-sm rounded-2xl font-semibold tracking-wide text-white shadow-lg transition-all duration-300
              ${isLoading
                ? 'bg-blue-300 dark:bg-blue-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-blue-200 dark:hover:shadow-blue-900/50 hover:shadow-xl cursor-pointer active:scale-[.98]'
              }`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Sign in'}
          </button>

          <p className="text-sm text-center mt-5 text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link className="text-blue-600 dark:text-blue-400 hover:underline font-semibold" to="/register">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;