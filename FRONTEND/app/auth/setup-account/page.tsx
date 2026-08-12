 "use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldCheck, Lock, User, Mail, Sparkles } from "lucide-react";
import { Suspense } from "react";
function SetupAccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState({
    fullName: "",
    email: "",
    gender: "",
  });
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!token) return;

    async function verifyToken() {
        try {
            const response = await fetch(
                 `${API_URL}/api/AccountSetup/verify-token?token=${token}`
            );

            console.log("Status:", response.status);

            const text = await response.text();

            console.log("Response:", text);

            if (!response.ok) {
                throw new Error(text);
            }

            const data = JSON.parse(text);

            setFaculty(data);
        }
        catch (err: any) {
            console.error(err);
            alert(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    verifyToken();
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password doesn't match");
      return;
    }

    const response = await fetch(
      "http://localhost:5202/api/AccountSetup/set-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      }
    );

    if (response.ok) {
      alert("Password Created Successfully");

      router.push("/login");
    } else {
      alert("Unable to set password");
    }
  }

  if (loading)
    return (
      <div className="flex flex-col gap-3 justify-center items-center h-screen bg-[#F8FAFC]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 animate-pulse">
          Verifying Security Link...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 relative overflow-hidden font-sans antialiased flex justify-center items-center px-4 selection:bg-blue-500/20 selection:text-blue-600">
      {/* Background Accent Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-400/20 to-indigo-400/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-400/10 to-emerald-400/10 blur-[130px] pointer-events-none" />
      
      <div className="relative bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-200/60 rounded-3xl w-full max-w-[460px] p-6 md:p-8 transition-all duration-300 z-10">
        
        <header className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Authentication Node
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 bg-clip-text text-transparent">
            Faculty Account Setup
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete verification steps by configuring your personal master access password.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Read-Only Profile Details Section */}
          <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-4 space-y-3.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-500" /> Loaded Identity Context
            </div>
            
            <div className="grid grid-cols-1 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={faculty.fullName}
                    disabled
                    className="w-full pl-9 pr-4 py-2 border border-slate-200/80 rounded-xl text-xs bg-slate-200/40 text-slate-600 font-medium cursor-not-allowed select-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={faculty.email}
                      disabled
                      className="w-full pl-9 pr-4 py-2 border border-slate-200/80 rounded-xl text-xs bg-slate-200/40 text-slate-600 font-medium cursor-not-allowed select-none truncate"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Gender</label>
                  <input
                    value={faculty.gender}
                    disabled
                    className="w-full px-3 py-2 border border-slate-200/80 rounded-xl text-xs bg-slate-200/40 text-slate-600 font-medium text-center cursor-not-allowed select-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-200/60" />

          {/* Password Action Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Password *</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200/80 focus:border-blue-500 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Confirm Password *</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200/80 focus:border-blue-500 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
          >
            Set Access Password
          </button>
        </form>

      </div>
    </div>
  );
}

export default function SetupAccount() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SetupAccountContent />
        </Suspense>
    );
}