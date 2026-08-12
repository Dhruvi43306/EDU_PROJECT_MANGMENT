"use client";

import { GraduationCap, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const VERIFY_OTP_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/otp/verifyOtp`;
const RESEND_OTP_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/otp/resendOtp`;

const STATS = [
  { value: "412+", label: "Active Projects" },
  { value: "50+", label: "Institutions" },
  { value: "2.8K+", label: "Students" },
  { value: "15K+", label: "Evaluations" },
];

export default function OtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
        resendOtp();
    }
  }, [timeLeft]);

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      alert("Enter valid OTP");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(VERIFY_OTP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(userId),
          otpCode: otp,
        }),
      });

      const text = await response.text();
      console.log("Raw Response:", text);

      const result = JSON.parse(text);
      console.log(result);
      if (result.success) {
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        router.push("/auth/login");
      } else {
        alert(JSON.stringify(result, null, 4));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const response = await fetch(RESEND_OTP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(userId),
          email: localStorage.getItem("email")
        })
      });
      const text = await response.text();
      console.log("Response:", text);

      const result = JSON.parse(text);
      if (result.success) {
        alert("OTP Sent Again");
        setTimeLeft(60);
      } else {
        alert(JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const digits = Array.from({ length: 6 }, (_, i) => otp[i] ?? "");

  const setDigitAt = (index: number, value: string) => {
    const clean = value.replace(/[^0-9]/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = clean;
    setOtp(nextDigits.join("").slice(0, 6));
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (pasted) {
      e.preventDefault();
      setOtp(pasted);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50/50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* LEFT HERO PANEL — Premium Light Mesh Gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-tr from-[#E8E8FF] via-[#E2D9FC] to-[#F1EAFF]">
        {/* Dynamic ambient glow spots */}
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-200/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-purple-200/50 blur-[140px]" />

        <div className="relative z-10 flex flex-col justify-center px-20 py-12 max-w-2xl mx-auto w-full">
          
          {/* Brand Logo Header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <GraduationCap className="h-6 w-6 text-white" strokeWidth={2.2} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              EduProject
            </span>
          </div>

          {/* Core Value Proposition */}
          <h1 className="text-[44px] leading-[1.15] font-black text-slate-900 tracking-tight drop-shadow-sm">
            Manage student projects
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">with confidence</span>
          </h1>

          <p className="mt-6 text-[16px] text-slate-600 font-medium leading-relaxed max-w-lg">
            A premium platform for colleges and universities to track
            projects, evaluations, submissions, and team collaboration — all
            in one place.
          </p>

          {/* Grid Statistics Segment */}
          <div className="mt-12 grid grid-cols-2 gap-5 max-w-lg">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)]"
              >
                <div className="text-[28px] font-black text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[13.5px] text-slate-500 font-semibold mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Subtle Brand Watermark Logo on Bottom Left */}
        <div className="absolute bottom-8 left-8 h-9 w-9 rounded-full bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20">
          <span className="text-white text-xs font-bold font-serif">N</span>
        </div>
      </div>

      {/* RIGHT OTP PANEL */}
      <div className="flex-1 relative flex flex-col items-center justify-center px-6 py-12 overflow-hidden bg-white lg:bg-transparent">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-purple-100/40 blur-[100px] hidden lg:block" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-100/40 blur-[100px] hidden lg:block" />

        <div className="relative z-10 w-full max-w-md">
          <div className="lg:rounded-3xl lg:bg-white lg:border lg:border-slate-100 lg:shadow-[0_20px_50px_rgba(99,102,241,0.05)] p-8 sm:p-11">
            
            {/* Shield Logo Wrapper */}
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-6">
              <ShieldCheck className="h-6 w-6 text-white" strokeWidth={2.2} />
            </div>

            <h2 className="text-[28px] font-black text-slate-900 tracking-tight">
              Enter verification code
            </h2>
            <p className="text-[14px] text-slate-500 font-medium mt-2 mb-8">
              We sent a 6 digit code to your email
            </p>

            <div className="space-y-6">
              {/* OTP Digital Grid Inputs */}
              <div className="flex justify-between gap-2 sm:gap-3">
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    value={digit}
                    onChange={(e) => setDigitAt(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    inputMode="numeric"
                    maxLength={1}
                    className="h-13 w-full aspect-square rounded-xl bg-slate-50 border border-slate-200 text-center text-[22px] font-black text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                  />
                ))}
              </div>

              {/* Status Alert Message Text */}
              <p className="text-center text-[13.5px] text-slate-500 font-medium">
                {timeLeft > 0
                  ? `Resend OTP in ${timeLeft} sec`
                  : "Sending new OTP..."}
              </p>

              {/* Action Direct Click Submission Trigger Button */}
              <button
                type="button"
                onClick={verifyOtp}
                disabled={loading}
                className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-indigo-600 text-[15px] font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>

          {/* Fallback Resend Dynamic Element Container */}
          <p className="text-center text-[14px] text-slate-500 mt-8 font-medium">
            Didn&apos;t receive the code?{" "}
            <button 
              onClick={resendOtp} 
              className="text-indigo-600 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}