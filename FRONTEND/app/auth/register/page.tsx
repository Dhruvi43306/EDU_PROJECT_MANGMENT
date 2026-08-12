"use client";

import { GraduationCap, Lock, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const REGISTER_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Users/register`

const STATS = [
  { value: "412+", label: "Active Projects" },
  { value: "50+", label: "Institutions" },
  { value: "2.8K+", label: "Students" },
  { value: "15K+", label: "Evaluations" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    roleId:4
  });

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
      try {
          const res = await fetch(REGISTER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        const result = await res.json();
        
        console.log("Status:", res.status);
        console.log("Response:", result);

        if (res.ok) {
            alert(result.message);
            localStorage.setItem("userId", result.userId.toString());
            router.push("/auth/otp");
        } else {
            alert(JSON.stringify(result, null, 4));
        }
    } catch (err) {
        console.error(err);
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
              Create your account
            </h2>
            <p className="text-[14px] text-slate-500 font-medium mt-2 mb-8">
              Join thousands of students and faculty
            </p>

            <form className="space-y-5" onSubmit={handleRegister}>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider block">
                  Full name
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="h-[18px] w-[18px]" />
                  </span>
                  <input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="h-12 w-full rounded-xl bg-slate-50 border border-slate-200 pl-11 pr-4 text-[14px] text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider block">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="h-[18px] w-[18px]" />
                  </span>
                  <input
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    placeholder="johndoe123"
                    className="h-12 w-full rounded-xl bg-slate-50 border border-slate-200 pl-11 pr-4 text-[14px] text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                  />
                </div>
              </div>

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
                  />
                </div>
              </div>

              {/* Responsive Row for Phone and Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider block">
                    Phone number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone className="h-[18px] w-[18px]" />
                    </span>
                    <input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      type="tel"
                      placeholder="+91 0000000000"
                      className="h-12 w-full rounded-xl bg-slate-50 border border-slate-200 pl-11 pr-4 text-[14px] text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider block">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="h-12 w-full rounded-xl bg-slate-50 border border-slate-200 px-4 text-[14px] text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all cursor-pointer font-medium appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="h-[18px] w-[18px]" />
                  </span>
                  <input
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    type="password"
                    placeholder="Min. 8 characters"
                    className="h-12 w-full rounded-xl bg-slate-50 border border-slate-200 pl-11 pr-4 text-[14px] text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 text-[13.5px] text-slate-600 cursor-pointer pt-1">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 accent-indigo-600" />
                <span className="leading-tight select-none">
                  I agree to the{" "}
                  <span className="text-indigo-600 font-semibold hover:underline">Terms of Service</span>
                  {" "}and{" "}
                  <span className="text-indigo-600 font-semibold hover:underline">Privacy Policy</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-indigo-600 text-[15px] font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-7">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
                or continue with
              </span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="h-12 rounded-xl border border-slate-200 bg-white text-[14px] font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-[0.98]"
              >
                Google
              </button>
              <button
                type="button"
                className="h-12 rounded-xl border border-slate-200 bg-white text-[14px] font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-[0.98]"
              >
                Microsoft
              </button>
            </div>
          </div>

          <p className="text-center text-[14px] text-slate-500 mt-8 font-medium">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-indigo-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}