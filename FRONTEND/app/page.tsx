"use client";

import { useState } from "react";
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle, 
  FolderGit2, 
  ClipboardCheck, 
  MessageSquare, 
  UploadCloud, 
  Bell, 
  Users, 
  Star, 
  ChevronDown, 
  Mail, 
  MapPin, 
  Phone,
  Play,
  Sparkles,
  PieChart,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: FolderGit2,
    title: "Project Tracking",
    desc: "Oversee project progression with visual status indicators, milestones, and real-time sprint details.",
    badge: "Real-time",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: ClipboardCheck,
    title: "Evaluation System",
    desc: "Systematic assessments and grades tables for review, presentation panels, and rigorous delivery criteria.",
    badge: "Automated",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: MessageSquare,
    title: "Weekly Evulate The Task",
    desc: "Review weekly task progress, evaluate completed work, provide feedback, and track student performance throughout the project.",
    badge: "Connected",
    color: "from-indigo-500 to-purple-500"
  },
{
  icon: ClipboardCheck,
  title: "CPI Verification",
  desc: "Students can submit their CPI and academic details, while faculty members review, verify, and approve the submitted information.",
  badge: "Faculty Approval",
  color: "from-sky-500 to-blue-500"
},
  {
    icon: Star,
    title: "Faculty Feedback",
    desc: "Receive remarks, inline reviews, and actionable guidance comments directly on your student deliverables.",
    badge: "Mentorship",
    color: "from-amber-500 to-orange-500"
  },
 {
  icon: Bell,
  title: "Task Progress & Evaluation",
  desc: "Students can view their upcoming tasks and evaluated tasks, while faculty can review completed work and assign grades and feedback.",
  badge: "Track & Grade",
  color: "from-emerald-500 to-teal-500"
},
];

const testimonials = [
  {
    quote: "EduProject transformed how we manage graduation projects. Grading has never been this organized and transparent.",
    author: "Dr. Aris Kumar",
    role: "Department Chair of CSE",
    avatarBg: "bg-gradient-to-tr from-indigo-500 to-purple-500 text-white",
  },
  {
    quote: "As a student, I loved having one clear repository for files, deadlines, and faculty reviews. No more lost email attachments.",
    author: "Sarah Chen",
    role: "Senior Student",
    avatarBg: "bg-gradient-to-tr from-purple-500 to-pink-500 text-white",
  },
  {
    quote: "The interface is incredibly clean. It feels like Linear and Notion, which makes adoption completely seamless for students.",
    author: "Prof. Rajesh Sharma",
    role: "Project Evaluator",
    avatarBg: "bg-gradient-to-tr from-emerald-500 to-teal-500 text-white",
  },
];

const faqs = [
  {
    q: "How do faculty grade student projects?",
    a: "Faculty can assign marks across highly customized dynamic rubrics (e.g., Implementation, Documentation) and leave notes. Grades are updated instantly in the centralized metrics dashboard.",
  },
  {
    q: "Can we connect GitHub repositories directly?",
    a: "Yes! Students can link their repository URL directly inside the submission module, providing advisors instant access to check commits and code progression.",
  },
  {
    q: "Is there support for multiple academic departments?",
    a: "Absolutely. The system is designed to support college-wide deployments. Administrators can filter, group, and sort projects by individual departments, tracks, and supervisors.",
  },
];

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-slate-800 selection:bg-indigo-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* Header Sticky Glass Navigation */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8 h-20">
          <div className="flex items-center gap-3.5 group cursor-pointer">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5.5 w-5.5 text-white" strokeWidth={2.2} />
            </div>
            <span className="font-black text-xl text-slate-950 tracking-tight">EduProject</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[14.5px] font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-indigo-600 transition-colors">Success Stories</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <button className="h-11 px-5 text-[14.5px] font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 rounded-xl transition-all">
                Sign in
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="h-11 px-5 text-[14.5px] font-bold bg-slate-950 hover:bg-slate-800 text-white rounded-xl shadow-md shadow-slate-950/10 hover:shadow-lg transition-all active:scale-[0.98]">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Premium Workspace Design */}
      <section className="relative pt-20 pb-28 md:py-36 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-[#FBFBFE] to-[#FBFBFE] overflow-hidden">
        {/* Decorative Fluid Mesh Glow Objects */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[140px] pointer-events-none" />

        {/* Floating Ambient Action Indicators for Large Screens */}
        <div className="absolute top-28 left-[10%] hidden xl:flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-indigo-600 border border-slate-100 animate-bounce [animation-duration:5s]">
          <GraduationCap className="h-6 w-6" strokeWidth={2.2} />
        </div>
        <div className="absolute bottom-48 left-[15%] hidden xl:flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-emerald-500 border border-slate-100">
          <CheckCircle className="h-5 w-5" strokeWidth={2.2} />
        </div>
        {/* <div className="absolute top-36 right-[12%] hidden xl:flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-blue-500 border border-slate-100 animate-bounce [animation-duration:6s]">
          <PieChart className="h-6 w-6" strokeWidth={2.2} />
        </div> */}
        {/* <div className="absolute bottom-52 right-[16%] hidden xl:flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-purple-500 border border-slate-100">
          <Users className="h-5 w-5" strokeWidth={2.2} /> */}
        {/* </div> */}

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          {/* Smart Info Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-xs font-bold text-slate-600 tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Next-Gen Academic Hub</span>
          </div>

          {/* Typography Header */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 max-w-5xl mx-auto leading-[1.12] mb-8">
            Smart Project Management <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              for Modern Universities
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed mb-12">
            Streamline project workflows, unify dynamic milestone evaluations, and bridge communication barriers between students and faculty guide panels seamlessly.
          </p>

          {/* Core CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none mb-20">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <button className="w-full h-13 px-8 bg-indigo-600 hover:bg-indigo-700 text-white text-[15.5px] font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/25 tracking-wide transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                Get Started Free <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <button className="w-full h-13 px-7 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl text-[15.5px] font-bold transition-all duration-200 shadow-sm flex items-center justify-center gap-2">
                <Play className="h-3.5 w-3.5 fill-slate-700 text-slate-700" /> Explore Features
              </button>
            </a>
          </div>

          {/* Bottom Trust Row */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-slate-400 text-[13px] font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-500/80" /> Peerless Syncing
            </div>
            <div className="flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-indigo-500/80" /> Real-time Metrics
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-indigo-500/80" /> Institutional Security
            </div>
          </div>
        </div>

        {/* Side Graphical Container Placeholders */}
        <div className="absolute left-0 bottom-0 top-1/4 hidden xl:block w-[15%] opacity-40 blur-[2px] pointer-events-none">
          <div className="relative w-full h-full bg-gradient-to-r from-slate-100 to-transparent rounded-tr-3xl" />
        </div>
        <div className="absolute right-0 bottom-4 top-1/3 hidden xl:block w-[16%] pointer-events-none pr-6">
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xl shadow-slate-900/5 rotate-3 transition-transform hover:rotate-0 duration-500 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-90">
            <Image
              src="/s1.jpeg"
              alt="Dashboard Preview student deliverables"
              width={260}
              height={260}
              className="rounded-xl grayscale-[15%] hover:grayscale-0 transition-all duration-300"
              onError={(e) => {
                // Fallback style if asset does not exist locally yet
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </section>

      {/* Modern High-Impact Metrics Section */}
      <section className="relative z-20 -mt-16 px-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200/70 shadow-[0_20px_50px_rgba(99,102,241,0.04)] p-5 sm:p-7 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-95">
          {[
            { value: "5000+", label: "Active Students", icon: Users, color: "bg-blue-50 text-blue-600 border-blue-100/50" },
            { value: "300+", label: "Faculty Guides", icon: UserCheck, color: "bg-purple-50 text-purple-600 border-purple-100/50" },
            { value: "1200+", label: "Completed Projects", icon: FolderGit2, color: "bg-pink-50 text-pink-600 border-pink-100/50" },
            { value: "98%", label: "Success Rate", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600 border-emerald-100/50" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50/50 border border-slate-100 text-center transition-all duration-300 hover:bg-white hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <div className={`p-3 rounded-xl border ${stat.color} mb-3.5 shadow-sm`}>
                <stat.icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <p className="text-3xl font-black text-slate-950 tracking-tight mb-0.5">{stat.value}</p>
              <p className="text-[13px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Matrix Workspaces */}
      <section id="features" className="py-24 lg:py-32 max-w-7xl mx-auto px-6 sm:px-8 scroll-mt-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md uppercase tracking-widest">Workspace Core</div>
          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl leading-tight">
            Everything you need to track, evaluate, and scale
          </h2>
          <p className="text-slate-500 font-medium text-[16px] max-w-2xl mx-auto leading-relaxed">
            A comprehensive tool suite structured into clear responsive workspaces, intuitive project tracking panels, and automated evaluation tables.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i} 
                className="bg-white border border-slate-200/80 p-8 rounded-2xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-500" />
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-800 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-600/20 transition-all duration-300">
                    <Icon className="h-5.5 w-5.5" strokeWidth={2} />
                  </div>
                  <span className="text-[11.5px] font-bold text-slate-400 border border-slate-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-slate-50/30">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="font-extrabold text-lg text-slate-950 mb-2.5 group-hover:text-indigo-600 transition-colors">{feat.title}</h3>
                <p className="text-[14px] text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Review Testimonial Strip */}
      <section id="testimonials" className="bg-slate-950 text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-950/40 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <div className="inline-block text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-md uppercase tracking-widest">Testimonials</div>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              Trusted by leading departments
            </h2>
            <p className="text-slate-400 font-medium text-[16px]">
              Discover how EduProject unifies complex academic milestones between student teams and evaluation boards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((test, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.07] p-8 rounded-2xl flex flex-col justify-between hover:bg-white/[0.05] transition-all duration-300 group">
                <p className="text-slate-300 font-medium italic text-[14.5px] leading-relaxed mb-8 group-hover:text-white transition-colors">
                  &ldquo;{test.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3.5 border-t border-white/5 pt-5">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-xs tracking-wider shadow-inner ${test.avatarBg}`}>
                    {test.author.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div>
                    <h4 className="font-bold text-[14.5px] text-white">{test.author}</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Styled Accordion FAQ Section */}
      <section id="faq" className="py-24 lg:py-32 max-w-4xl mx-auto px-6 scroll-mt-10">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md uppercase tracking-widest">Support Hub</div>
          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 font-medium">
            Find rapid clarity regarding platform workflows, implementations, and roles.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className={`border rounded-2xl bg-white transition-all duration-300 ${isOpen ? 'border-indigo-200 shadow-md shadow-indigo-600/[0.02]' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-extrabold text-[16px] text-slate-900 transition-colors"
                >
                  <span>{faq.q}</span>
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 transition-all ${isOpen ? 'bg-indigo-50 text-indigo-600 rotate-180 border-indigo-100' : 'text-slate-400'}`}>
                    <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
                  <div className="overflow-hidden">
                    <div className="p-6 pt-0 border-t border-slate-100 text-[14.5px] text-slate-500 font-medium leading-relaxed bg-slate-50/40">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dynamic Engagement / Institutional Demo Request */}
      <section id="contact" className="bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-white py-20 lg:py-28 relative overflow-hidden scroll-mt-10">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to streamline your university projects?
            </h2>
            <p className="text-slate-400 text-base sm:text-lg font-medium max-w-xl leading-relaxed">
              Connect with our onboarding team to establish full department data integration, repository hooks, and structured user matrices.
            </p>
            
            <div className="space-y-4 pt-4 text-[14.5px] font-medium text-slate-300">
              <div className="flex items-center gap-3.5 group">
                <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Science and Technology Integration Hub, Academic Suite 40</span>
              </div>
              <div className="flex items-center gap-3.5 group">
                <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+1 (555) 304-2041</span>
              </div>
              <div className="flex items-center gap-3.5 group">
                <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Mail className="h-4 w-4" />
                </div>
                <span>support@eduproject.edu</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-8 rounded-3xl space-y-5 shadow-2xl shadow-black/40">
              <h3 className="font-extrabold text-xl tracking-tight">Request an Institutional Demo</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">Submit your university or department email domain to schedule an administrative walkthrough platform review.</p>
              
              {subscribed ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center text-[14px] font-bold text-emerald-400">
                  ✓ Request recorded! Our systems coordinator will reach out shortly.
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }} className="space-y-3.5">
                  <div className="space-y-1">
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="dean@university.edu"
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium transition-all"
                    />
                  </div>
                  <button type="submit" className="w-full bg-white hover:bg-slate-100 text-slate-950 font-black h-12 rounded-xl text-[14.5px] transition-all shadow-md active:scale-[0.99]">
                    Schedule Walkthrough
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Minimal SaaS Footnote Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-12 text-slate-500 text-[13px] font-medium">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <span className="font-extrabold text-[15px] text-white tracking-tight">EduProject</span>
          </div>
          <p>© {new Date().getFullYear()} EduProject Inc. All rights reserved. Configured for higher learning institutions.</p>
          <div className="flex gap-5 font-bold">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}