import authServices from '@/services/authServices';
import { Check, Loader2, Mail } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from "react-router-dom";

const VerificationSend = () => {
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const email = state?.email;

  // 1. Guard route and restore active countdown on mount
  useEffect(() => {
    if (!state?.email) {
      navigate("/register");
      return;
    }

    // Check if there is an active timer from a previous refresh
    const targetTime = localStorage.getItem('timer_target_time');
    if (targetTime) {
      const remaining = Math.round((Number(targetTime) - Date.now()) / 1000);
      if (remaining > 0) {
        setTimeLeft(remaining);
        runCountdown(Number(targetTime));
      } else {
        localStorage.removeItem('timer_target_time');
      }
    }

    // Cleanup running intervals on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state, navigate]);

  // 2. Core countdown function
  const runCountdown = (targetTimestamp) => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const remaining = Math.round((targetTimestamp - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setTimeLeft(0);
        localStorage.removeItem('timer_target_time');
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
  };

  // 3. Trigger timer setup on successful API call
  const startTimer = () => {
    const durationInSeconds = 60;
    const targetTimestamp = Date.now() + durationInSeconds * 1000;

    localStorage.setItem('timer_target_time', targetTimestamp.toString());
    setTimeLeft(durationInSeconds);
    runCountdown(targetTimestamp);
  };

  const handleResend = async () => {
    // Extra safeguards
    if (timeLeft > 0 || isLoading) return;

    setIsLoading(true);
    try {
      const data = state.purpose === "register" ? await authServices.resendVerification(email) : await authServices.resendForgot(email)
      if(!data) return;
      if (data.success) {
        startTimer(); // Starts persistent 60s countdown
      }
      console.log(data)
    } catch (error) {
      console.log(error.message)
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const isTimerActive = timeLeft > 0;
  // Disable if either loading an API call OR the timer is running
  const isButtonDisabled = isLoading || isTimerActive;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/30 flex items-center justify-center p-4 antialiased">
      <div className="relative w-full max-w-[440px] bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 text-center transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        
        {/* Top Branding */}
        <div className="flex flex-col items-center gap-1 mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            Registration
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-2">
            Nex<span className="text-blue-600">Spend</span>
          </h1>
        </div>

        {/* Modern Success/Mail Icon Area */}
        <div className="flex justify-center my-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping opacity-75 duration-1000" />
            <div className="relative w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100 shadow-sm">
              <Mail className="w-7 h-7 stroke-[2]" />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-sm">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
             Verify your email
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-[340px] mx-auto">
            {state.purpose === "register" ? "We've sent a secure verification link to your inbox. Please check your email to activate your account." : "We've sent a secure reset link to your inbox. Please check your email to reset your password."}
          </p>

          {/* Dynamic Email Display Tag */}
          {email && (
            <div className="inline-block bg-slate-100/80 border border-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg select-all">
              {email}
            </div>
          )}
        </div>

        {/* Interactive Bottom Area */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center justify-center w-full">
          <div className="text-xs text-slate-400 flex flex-col items-center gap-2">
            <span>Didn't receive the email? Check your spam folder or</span>
            
            <button 
              onClick={handleResend} 
              disabled={isButtonDisabled} 
              className={`text-blue-600 font-semibold mt-1 hover:underline bg-transparent border-none p-0 flex items-center justify-center gap-2 transition-opacity ${
                isButtonDisabled ? "cursor-not-allowed opacity-60 no-underline" : "cursor-pointer"
              }`}
            >
              {isLoading ? (
                <Loader2 className='animate-spin text-blue-500 w-4 h-4'/>
              ) : isTimerActive ? (
                <span>Resend available in {timeLeft}s</span>
              ) : (
                <span>click here to resend</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VerificationSend;