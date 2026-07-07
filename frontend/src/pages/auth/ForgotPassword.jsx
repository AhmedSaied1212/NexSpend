import React, { useState, useMemo } from 'react'
import FormField from '@/components/ui/FormField';
import { Loader, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import authServices from '@/services/authServices';
import { useNavigate } from 'react-router-dom';

const validateEmail    = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address.';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false });
  const navigate = useNavigate();
  const errors = useMemo(() => ({
    email:    validateEmail(email),
  }), [email]);

  const isFormValid = Object.values(errors).every((e) => e === '');

  const handleSendReset = async () => {
    setTouched({ email: true });
    if (!isFormValid) return;

    setIsLoading(true)
    try {
      const data = await authServices.forgotPassword(email);
      if(!data) return;
      if(data.success) {
        navigate("/verification-send", {
          state: {
            email,
            purpose: "forgot"
          },
        });

      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const touch = (field) => setTouched((p) => ({ ...p, [field]: true }));

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSendReset(); };

  const inputBase = 'p-3 w-full text-sm rounded-xl outline-none ring-2 duration-200 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500';

  const ringFor = (field) => {
    if (!touched[field]) return 'ring-slate-200 dark:ring-slate-700 focus:ring-blue-400';
    return errors[field]
      ? 'ring-red-400 focus:ring-red-500'
      : 'ring-green-400 focus:ring-green-500';
  };

  return (
    <div className='flex items-center justify-center h-screen w-full bg-slate-50'>
      <div className='p-6 max-w-[450px] p-6 shadow-lg bg-white border rounded-lg'>
        <div className='flex flex-col items-center justify-center w-full mb-6 gap-3'>
          <h1 className='text-2xl text-black font-bold'>Nex<span className='text-blue-600'>Spend</span></h1>
          <p className='text-xs text-slate-500'>forgot your password? Don't worry type your email and we will send you a reset link to your email to reset your password</p>
        </div>
        <div>
          <FormField
            label="Email address"
            icon={Mail}
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
        </div>
        <button disabled={!email || isLoading} onClick={handleSendReset} className={`w-full bg-blue-500 p-3 rounded-lg flex items-center justify-center text-white mt-2 border border-blue-700 ${!email || isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-blue-700 duration-500"}`}>{isLoading ? <Loader className='animate-spin'/> : "Send"}</button>
      </div>
    </div>
  )
}

export default ForgotPassword