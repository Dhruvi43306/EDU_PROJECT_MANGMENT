"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  FolderPlus,
  FileText,
  Target,
  Code2,
  BarChart3,
  Calendar,
  AlertCircle,
  Send,
  Sparkles,
  ChevronDown,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { fromTheme } from "tailwind-merge";

const PROJECT_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/project`;

interface Priority {
  priorityID: number;
  priorityName: string;
}

export default function ProjectForm() {
  const router = useRouter();
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projecttitle: "",
    description: "",
    objectives: "",
    technologystack: "",
    projecttype: "",
    difficultylevel: "Medium",
    startdate: "",
    enddate: "",
    priorityId: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
     const updateddata = { ...prev, [name]: value };
        if(name === "startdate" && prev.enddate && new Date(value) >= new Date(value)){
          updateddata.enddate = ""
        }
        return updateddata;
    });
    
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if(formData.startdate && formData.enddate){
      const startDate = new Date(formData.startdate);
      const endDate = new Date(formData.enddate);
      if(startDate  >= endDate){
        Swal.fire(
          { icon: "warning",
             title: "Invalid Project Dates",
              text: "Start date must be earlier than the end date.", 
              confirmButtonColor: "#4F46E5", });
           return;
      }
    }
    setIsSubmitting(true);

    const payload = {
      projecttitle: formData.projecttitle,
      description: formData.description,
      objectives: formData.objectives,
      technologystack: formData.technologystack,
      projecttype: formData.projecttype,
      difficultylevel: formData.difficultylevel,
      startdate: formData.startdate,
      enddate: formData.enddate,
      priorityId: Number(formData.priorityId),
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(PROJECT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Failed to Create Project",
          text: text || "An unexpected error occurred on the server.",
          confirmButtonColor: "#4F46E5",
          customClass: {
            popup: "rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white",
          },
        });
        setIsSubmitting(false);
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Project Published!",
        text: "Your new project workspace has been created successfully.",
        timer: 1800,
        showConfirmButton: false,
        timerProgressBar: true,
        customClass: {
          popup: "rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white",
        },
      });

      // Immediate navigation to project list page
      setTimeout(() => {
        router.push("/Master/project");
      }, 1500);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Unable to connect to the backend service. Please try again later.",
        confirmButtonColor: "#4F46E5",
      });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/priority`)
      .then((res) => res.json())
      .then((data) => setPriorities(data))
      .catch((err) => console.error("Error fetching priorities:", err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto my-8 sm:my-12 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Project Management Studio</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                Create New Project
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
                Fill in the details below to initialize tech stacks, set timelines, and publish your project scope.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/Master/project")}
              className="self-start sm:self-auto inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-2xl shadow-sm hover:shadow transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </button>
          </div>
        </div>

        {/* Main Form Area */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="projecttitle"
                  required
                  value={formData.projecttitle}
                  onChange={handleChange}
                  placeholder="e.g. Next.js Enterprise Analytics Dashboard"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium transition-all outline-none shadow-sm"
                />
                <FolderPlus className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 absolute left-3.5 top-4 transition-colors" />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Description
              </label>
              <div className="relative group">
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Briefly describe the overall scope and architecture of this project..."
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium transition-all outline-none resize-none shadow-sm"
                />
                <FileText className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 absolute left-3.5 top-4 transition-colors" />
              </div>
            </div>

            {/* Objective */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Objective
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleChange}
                  placeholder="e.g. Optimize platform latency by 40% and automate reporting"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium transition-all outline-none shadow-sm"
                />
                <Target className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 absolute left-3.5 top-4 transition-colors" />
              </div>
            </div>

            {/* Tech Stack */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Technology Stack
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="technologystack"
                  value={formData.technologystack}
                  onChange={handleChange}
                  placeholder="e.g. Next.js 14, Tailwind CSS, TypeScript, PostgreSQL, Prisma"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium transition-all outline-none shadow-sm"
                />
                <Code2 className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 absolute left-3.5 top-4 transition-colors" />
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Start Date
              </label>
              <div className="relative group">
                <input
                  type="datetime-local"
                  name="startdate"
                  value={formData.startdate}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 text-slate-900 dark:text-white text-sm font-medium transition-all outline-none cursor-pointer shadow-sm"
                />
                <Calendar className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 absolute left-3.5 top-4 transition-colors" />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                End Date
              </label>
              <div className="relative group">
                <input
                  type="datetime-local"
                  name="enddate"
                  value={formData.enddate}
                  onChange={handleChange}
                  min={formData.startdate || undefined}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 text-slate-900 dark:text-white text-sm font-medium transition-all outline-none cursor-pointer shadow-sm"
                />
                <Calendar className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 absolute left-3.5 top-4 transition-colors" />
              </div>
            </div>

            {/* Project Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Project Type
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="projecttype"
                  value={formData.projecttype}
                  onChange={handleChange}
                  placeholder="e.g. Web Application, Mobile App"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium transition-all outline-none shadow-sm"
                />
                <Layers className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 absolute left-3.5 top-4 transition-colors" />
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Difficulty Level
              </label>
              <div className="relative group">
                <select
                  name="difficultylevel"
                  value={formData.difficultylevel}
                  onChange={handleChange}
                  className="w-full pl-11 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 text-slate-900 dark:text-white text-sm font-medium transition-all outline-none appearance-none cursor-pointer shadow-sm"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Expert">Expert</option>
                </select>
                <BarChart3 className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 absolute left-3.5 top-4 transition-colors pointer-events-none" />
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-4.5 pointer-events-none" />
              </div>
            </div>

            {/* Priority Selection */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Priority Assignment
              </label>
              <div className="relative group">
                <select
                  name="priorityId"
                  value={formData.priorityId}
                  onChange={handleChange}
                  className="w-full pl-11 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 text-slate-900 dark:text-white text-sm font-medium transition-all outline-none appearance-none cursor-pointer shadow-sm"
                >
                  <option value="">Select Priority Level</option>
                  {priorities.map((p) => (
                    <option key={p.priorityID} value={p.priorityID}>
                      {p.priorityName}
                    </option>
                  ))}
                </select>
                <AlertCircle className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 absolute left-3.5 top-4 transition-colors pointer-events-none" />
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-4.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/Master/project")}
              className="px-6 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-2xl transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold py-3.5 px-8 rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition duration-200 cursor-pointer text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing Project...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Save & Publish Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}