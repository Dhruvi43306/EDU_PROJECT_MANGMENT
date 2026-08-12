"use client";

import { GraduationCap, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LOGIN_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Users/login`;
const STATS = [
  { value: "412+", label: "Active Projects" },
  { value: "50+", label: "Institutions" },
  { value: "2.8K+", label: "Students" },
  { value: "15K+", label: "Evaluations" },
];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
    
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
  
      const result = await res.json();
      if (!res.ok) {
        alert(result.message ?? "Login failed");
        return;
      }
      console.log("API Result:", result);
      if (result.success) {
        console.log(result);
        console.log("User =", result.user);
        console.log("RoleId =", result.user.roleId);
        console.log("Type =", typeof result.user.roleId);

        localStorage.setItem("userId", result.user.userId.toString());
        localStorage.setItem("roleId", result.user.roleId.toString());

        if (result.token) {
            localStorage.setItem("token", result.token);
        }

        switch (Number(result.user.roleId)) {
            case 1:
                router.push("/Deshboard/AdminDeshboard");
                break;
            case 4:
                router.push("/Deshboard/StudentDeshboard");
                break;
            case 3:
                router.push("/Deshboard/ProjectCordinate");
                break;
            case 2:
                router.push("/Deshboard/FacultyDeshboard");
                break;
            default:
                alert("Unknown role: " + result.user.roleId);
                break;
        }
      } else {
        alert(result.user.roleId);
      }
    } catch(err){
      console.log(err);
    } finally {
      setLoading(false);
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

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 relative flex flex-col items-center justify-center px-6 py-12 overflow-hidden bg-white lg:bg-transparent">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-purple-100/40 blur-[100px] hidden lg:block" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-100/40 blur-[100px] hidden lg:block" />

        <div className="relative z-10 w-full max-w-md">
          <div className="lg:rounded-3xl lg:bg-white lg:border lg:border-slate-100 lg:shadow-[0_20px_50px_rgba(99,102,241,0.05)] p-8 sm:p-11">
            
            {/* Mobile Adaptive Logo */}
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-6 lg:hidden">
              <GraduationCap className="h-6 w-6 text-white" strokeWidth={2.2} />
            </div>

            <h2 className="text-[28px] font-black text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-[14px] text-slate-500 font-medium mt-2 mb-8">
              Sign in to your EduProject account
            </p>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider block">
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="h-[18px] w-[18px]" />
                  </span>
                  <input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    type="email"
                    placeholder="you@university.edu"
                    className="h-12 w-full rounded-xl bg-slate-50 border border-slate-200 pl-11 pr-4 text-[14px] text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider block">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[13px] font-bold text-indigo-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="h-[18px] w-[18px]" />
                  </span>
                  <input
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    type="password"
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl bg-slate-50 border border-slate-200 pl-11 pr-4 text-[14px] text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 text-[13.5px] text-slate-600 cursor-pointer pt-1">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 accent-indigo-600" />
                <span className="leading-tight select-none">Remember me for 30 days</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-indigo-600 text-[15px] font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-7">
              <div className="h-px flex-1 bg-slate-100" />
              <div className="h-px flex-1 bg-slate-100" />
            </div>
          </div>

          <p className="text-center text-[14px] text-slate-500 mt-8 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-indigo-600 font-bold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}