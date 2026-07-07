import authServices from '@/services/authServices';
import { Eye, EyeOff, Loader, Lock } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FormField from '@/components/ui/FormField';
import PasswordStrength from '@/components/ui/PasswordStrength';

// ─── Validators ───────────────────────────────────────────────────────────────
const validatePassword = (v) => {
  if (v.length < 8)            return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(v))        return 'Must include at least 1 uppercase letter.';
  if (!/[0-9]/.test(v))        return 'Must include at least 1 number.';
  if (!/[^A-Za-z0-9]/.test(v)) return 'Must include at least 1 symbol (e.g. !@#$).';
  return '';
};
const validateConfirm  = (pw, c) => pw === c ? '' : 'Passwords do not match.';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false); 
  const token = searchParams.get("token");
  const [confirm, setConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showConfirm,  setShowConfirm]  = useState(false);
  const navigate = useNavigate();

  const touch = (field) => setTouched((p) => ({ ...p, [field]: true }));

  const errors = useMemo(() => ({
    password: validatePassword(password),
    confirm:  validateConfirm(password, confirm),
  }), [password, confirm]);

  const isFormValid = Object.values(errors).every((e) => e === '');

  const inputBase = 'p-3 w-full text-sm rounded-xl outline-none ring-2 duration-200 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500';
  const ringFor = (field) => {
    if (!touched[field]) return 'ring-slate-200 dark:ring-slate-700 focus:ring-blue-400';
    return errors[field]
      ? 'ring-red-400 focus:ring-red-500'
      : 'ring-green-400 focus:ring-green-500';
  };

  const handleReset = async () => {
    setTouched({ password: true, confirm: true });
    if (!isFormValid) return;
    setIsLoading(true)
    if (!token) {
      toast.error("Invalid token or expired.")
      setIsLoading(false);
      return;
    }
    try {
      const data = await authServices.resetPassword(token , password);
      if(!data) return;
      if(data.success) {
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/30 flex items-center justify-center p-4 antialiased">
      <div className="relative w-full max-w-[500px] bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 text-center transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        
        {/* Top Branding */}
        <div className="flex flex-col items-center gap-1 mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            Security Portal
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-2">
            Nex<span className="text-blue-600">Spend</span>
          </h1>
        </div>

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
            id="reset-submit"
            disabled={isLoading}
            onClick={handleReset}
            className={`mt-5 flex justify-center items-center w-full py-3.5 text-sm rounded-2xl font-semibold tracking-wide text-white shadow-lg transition-all duration-300
              ${isLoading
                ? 'bg-blue-300 dark:bg-blue-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-blue-200 dark:hover:shadow-blue-900/50 hover:shadow-xl cursor-pointer active:scale-[.98]'
              }`}
          >
            {isLoading ? <Loader className="animate-spin" size={18} /> : 'Reset Password'}
          </button>

      </div>
    </div>
  );
};

export default ResetPassword;