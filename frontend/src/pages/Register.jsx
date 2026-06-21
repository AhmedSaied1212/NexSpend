import { Eye, EyeOff, Loader2, Lock, Mail, User, Wallet } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authServices from '../services/authServices';
import toast from 'react-hot-toast';
import FormField from '@/components/ui/FormField';
import PasswordStrength from '@/components/ui/PasswordStrength';

// ─── Validators ───────────────────────────────────────────────────────────────
const validateName     = (v) => v.trim().length >= 2 ? '' : 'Name must be at least 2 characters.';
const validateEmail    = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address.';
const validatePassword = (v) => {
  if (v.length < 8)            return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(v))        return 'Must include at least 1 uppercase letter.';
  if (!/[0-9]/.test(v))        return 'Must include at least 1 number.';
  if (!/[^A-Za-z0-9]/.test(v)) return 'Must include at least 1 symbol (e.g. !@#$).';
  return '';
};
const validateConfirm  = (pw, c) => pw === c ? '' : 'Passwords do not match.';

// ─── Page ──────────────────────────────────────────────────────────────────────
const Register = () => {
  const [name,         setName]         = useState('');
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [confirm,      setConfirm]      = useState('');
  const [isLoading,    setIsLoading]    = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [touched,      setTouched]      = useState({ name: false, email: false, password: false, confirm: false });

  const navigate = useNavigate();
  const touch = (f) => setTouched((p) => ({ ...p, [f]: true }));

  const errors = useMemo(() => ({
    name:     validateName(name),
    email:    validateEmail(email),
    password: validatePassword(password),
    confirm:  validateConfirm(password, confirm),
  }), [name, email, password, confirm]);

  const isFormValid = Object.values(errors).every((e) => e === '');

  const handleRegister = async () => {
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (!isFormValid) return;
    setIsLoading(true);
    try {
      const data = await authServices.register({ name, email, password });
      if (data?.success) {
        toast.success('Account created! Please sign in.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = 'p-3 w-full text-sm rounded-xl outline-none ring-2 duration-200 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500';
  const ringFor = (field) => {
    if (!touched[field]) return 'ring-slate-200 dark:ring-slate-700 focus:ring-blue-400';
    return errors[field]
      ? 'ring-red-400 focus:ring-red-500'
      : 'ring-green-400 focus:ring-green-500';
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 py-10">
      <div className="w-full max-w-[600px] mx-4">

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-100/60 dark:shadow-slate-950/80 rounded-3xl p-8 flex flex-col">

          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
              <Wallet size={32} className="text-white" />
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-lg font-bold tracking-widest uppercase">
              NexSpend
            </span>
          </div>

          <h1 className="text-center text-2xl font-bold text-slate-800 dark:text-slate-100">
            Create Account
          </h1>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-6">
            Fill in the details below to get started
          </p>

          {/* Full Name */}
          <FormField label="Full Name" icon={User} error={errors.name} touched={touched.name} hint="At least 2 characters">
            <input
              id="register-name"
              value={name}
              onChange={(e) => { setName(e.target.value); touch('name'); }}
              onBlur={() => touch('name')}
              type="text"
              placeholder="John Alex"
              className={`${inputBase} ${ringFor('name')}`}
            />
          </FormField>

          {/* Email */}
          <FormField label="Email Address" icon={Mail} error={errors.email} touched={touched.email}>
            <input
              id="register-email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); touch('email'); }}
              onBlur={() => touch('email')}
              type="text"
              placeholder="you@example.com"
              className={`${inputBase} ${ringFor('email')}`}
            />
          </FormField>

          {/* Password */}
          <FormField label="Password" icon={Lock} error={errors.password} touched={touched.password}>
            <div className="relative">
              <input
                id="register-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); touch('password'); }}
                onBlur={() => touch('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 chars, 1 upper, 1 number, 1 symbol"
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

            {/* Strength indicator segment and rules list */}
            <PasswordStrength password={password} touched={touched.password} />
          </FormField>

          {/* Confirm Password */}
          <FormField label="Confirm Password" icon={Lock} error={errors.confirm} touched={touched.confirm}>
            <div className="relative">
              <input
                id="register-confirm"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); touch('confirm'); }}
                onBlur={() => touch('confirm')}
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                className={`${inputBase} pr-11 ${ringFor('confirm')}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                tabIndex={-1}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </FormField>

          {/* Submit */}
          <button
            id="register-submit"
            disabled={isLoading}
            onClick={handleRegister}
            className={`mt-5 flex justify-center items-center w-full py-3.5 text-sm rounded-2xl font-semibold tracking-wide text-white shadow-lg transition-all duration-300
              ${isLoading
                ? 'bg-blue-300 dark:bg-blue-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-blue-200 dark:hover:shadow-blue-900/50 hover:shadow-xl cursor-pointer active:scale-[.98]'
              }`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
          </button>

          <p className="text-sm text-center mt-5 text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link className="text-blue-600 dark:text-blue-400 hover:underline font-semibold" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;