import authServices from '@/services/authServices';
import { Check, Loader2, X, ArrowRight } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true); 
  const [success, setSuccess] = useState(false);
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const hasFetched = useRef(false); 

  const handleVerifyEmail = async () => {
    if (!token) {
      setSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      const data = await authServices.verifyEmail(token);
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      toast.error(error?.message || "Verification failed");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      handleVerifyEmail();
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/30 flex items-center justify-center p-4 antialiased">
      <div className="relative w-full max-w-[440px] bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 text-center transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        
        {/* Top Branding */}
        <div className="flex flex-col items-center gap-1 mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            Security Portal
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-2">
            Nex<span className="text-blue-600">Spend</span>
          </h1>
        </div>

        {/* Dynamic Status Icon Area */}
        <div className="flex justify-center my-6 min-h-[64px]">
          {isLoading ? (
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100 shadow-sm animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin stroke-[2]" />
            </div>
          ) : success ? (
            <div className="relative flex items-center justify-center">
              {/* Soft ambient ripple */}
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75 duration-1000" />
              <div className="relative w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
            </div>
          ) : (
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-rose-500/10 animate-pulse" />
              <div className="relative w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center border border-rose-200 shadow-sm">
                <X className="w-8 h-8 stroke-[2.5]" />
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Status Text */}
        <div className="space-y-3 mt-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            {isLoading 
              ? "Verifying your account..." 
              : success 
                ? "Email successfully verified" 
                : "Verification link invalid"
            }
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-[320px] mx-auto">
            {isLoading
              ? "Please wait a moment while we validate your security credentials."
              : success 
                ? "Your account is secure. We are redirecting you to your login panel now." 
                : "This link may have already been used, or the security token has expired."
            }
          </p>
        </div>

        {/* Bottom Interactive Area */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center min-h-[48px]">
          {!isLoading && (
            success ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 animate-pulse">
                <span>Redirecting automatically</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            ) : (
              <button 
                onClick={() => navigate("/login")} 
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-4 py-2.5 rounded-xl transition-all w-full cursor-pointer"
              >
                Return to Login
              </button>
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;