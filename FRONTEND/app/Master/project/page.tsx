"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Pencil,
  RefreshCw,
  Trash2,
  AlertCircle,
  ShieldCheck,
  LogOut,
  Layers,
  BookOpen,
  HelpCircle,
  Globe,
  Plus,
  Bell,
  Sparkles,
  Search,
  Filter,
  Target,
  Code2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface ProjectType {
  projectId: number;
  projectcode: String;
  projecttitle: String;
  description: String;
  objectives: String;
  technologystack: string;
  projecttype: String;
  difficultylevel: string;
  startdate: string;
  enddate: string;
  priorityId: number;
}
interface Priority {
  priorityID: number;
  priorityName: string;
}

const PROJECT_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/project`;
const PRIORITY_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/priority`;

export default function ProjectWorkspace() {
  const router = useRouter();
  const [project, setprojects] = useState<ProjectType[]>([]);
  const [priority, setpriority] = useState<Priority[]>([]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(PROJECT_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      console.log(data);
      setprojects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPriority = async () => {
    try {
      const response = await fetch(`${PRIORITY_URL}`);

      if (!response.ok) {
        throw new Error("Failed to fetch priority");
      }

      const data = await response.json();

      console.log(data);

      setpriority(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (projectId: number) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this project?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    try {
      console.log("Deleting Project ID:", projectId);

      const response = await fetch(`${PROJECT_URL}/${projectId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("DELETE Status:", response.status);

      const result = await response.json().catch(() => null);

      console.log("DELETE Response:", result);

      if (!response.ok) {
        const errorMessage =
          result?.message ??
          result?.Message ??
          result?.error ??
          result?.Error ??
          result?.title ??
          `Delete failed: ${response.status}`;

        throw new Error(errorMessage);
      }

      await Swal.fire({
        title: "Deleted!",
        text: "Project deleted successfully!",
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });

      // Refresh project list
      await fetchProjects();
    } catch (error) {
      console.error("Delete project error:", error);

      await Swal.fire({
        title: "Error!",
        text:
          error instanceof Error
            ? error.message
            : "Unable to delete project.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const getPriority = (priorityId: number) => {
    console.log("Project Id :", priorityId, typeof priorityId);

    const data = priority.find(
      (p) => Number(p.priorityID) === Number(priorityId)
    );

    return data ? data.priorityName : "N/A";
  };

  useEffect(() => {
    fetchProjects();
    fetchPriority();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 antialiased font-sans">
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-indigo-500 p-2 rounded-xl text-white shadow-sm shadow-indigo-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-slate-900 tracking-wider uppercase">
                  EduVerify
                </h1>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[9px] font-extrabold uppercase tracking-widest border border-indigo-100">
                  v2.6
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                Academic Workspace Terminal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl border border-transparent hover:border-slate-200 transition">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                AV
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-none">
                  Dr. Alok K. Verma
                </span>
                <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  Principal Coordinator
                </span>
              </div>
            </div>

            <button
              title="Logout Session"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 lg:p-10 w-full max-w-[1600px] mx-auto space-y-6">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />

          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-[11px] font-bold tracking-wide border border-indigo-400/30 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              Project Registry Cluster
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Academic Allocations & Frameworks
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Review current framework track records, monitor project timelines, and manage technical allocations across departments.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <Link href="/Master/AddProject">
              <button className="h-10 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/30 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, tech, objective..."
              className="w-full h-9 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button className="h-9 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition flex items-center gap-1.5 shadow-sm">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter
            </button>
            <button className="h-9 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition flex items-center gap-1.5 shadow-sm">
              <Layers className="w-3.5 h-3.5 text-slate-400" /> Columns
            </button>
          </div>
        </div>
        <div className="w-full bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden text-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[1550px]">
              <thead>
                <tr className="bg-slate-50/75 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                  <th className="w-[10%] px-6 py-4">Project Code</th>
                  <th className="w-[20%] px-6 py-4">Project Title</th>
                  <th className="w-[18%] px-6 py-4"> Description</th>
                  <th className="w-[16%] px-6 py-4">Objective</th>
                  <th className="w-[16%] px-6 py-4">Technology Stack</th>

                  <th className="w-[7%] px-4 py-4 text-center">Difficulty</th>
                  <th className="w-[9%] px-4 py-4">Timeline Scope</th>
                  <th className="w-[7%] px-4 py-4 text-center">Priority</th>
                  <th className="w-[120px] px-6 py-4 text-center">Operations</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white text-xs">
                {project.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-20 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-400 shadow-sm">
                          <AlertCircle className="h-6 w-6 stroke-[1.5]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            No matching projects found
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Try adjusting your search criteria.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  project.map((project, idx) => (
                    <tr
                      key={project.projectId}
                      className={`group hover:bg-indigo-50/30 transition-colors ${
                        idx % 2 === 1 ? "bg-slate-50/30" : ""
                      }`}
                    >
                      <td className="px-6 py-5 align-middle font-mono font-bold text-slate-700">
                        <div className="inline-flex flex-col items-center justify-center rounded-xl bg-slate-100/80 border border-slate-200 px-3 py-1.5 text-center text-[10px] shadow-sm group-hover:bg-white group-hover:border-indigo-200 transition-colors">
                          <span>
                            {project.projectcode
                              .split("-")
                              .slice(0, 2)
                              .join("-")}
                          </span>
                          <span className="block text-indigo-600 font-extrabold mt-0.5 text-[11px]">
                            {project.projectcode.split("-")[2]}
                          </span>
                        </div>
                      </td>

                      {/* Title & Guide */}
                      <td className="px-6 py-5 align-middle">
                        <div className="space-y-1">
                          <div className="font-bold text-slate-900 text-[13px] leading-snug">
                            {project.projecttitle}
                          </div>
                        </div>
                      </td>
                      {/* Description */}
                      <td className="px-6 py-5 align-middle">
                        <p className="text-slate-500 leading-relaxed line-clamp-2">
                          {project.description}
                        </p>
                      </td>

                      {/* Objective */}
                      <td className="px-6 py-5 align-middle">
                        <div className="flex items-start gap-2">
                          <Target className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <p className="text-slate-700 font-medium leading-relaxed text-[11px]">
                            {project.objectives}
                          </p>
                        </div>
                      </td>

                      {/* Technology Stack */}
                      <td className="px-6 py-5 align-middle">
                        <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                          {project.technologystack
                            .split(",")
                            .map((tech, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200/80 shadow-sm"
                              >
                                <Code2 className="w-2.5 h-2.5 text-slate-400" />
                                {tech.trim()}
                              </span>
                            ))}
                        </div>
                      </td>

                      <td className="px-4 py-5 align-middle text-center whitespace-nowrap">
                        <span className="inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide min-w-[76px] shadow-sm">
                          {project.difficultylevel}
                        </span>
                      </td>

                      {/* Timeline Scope */}
                      <td className="px-4 py-5 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                          <div>
                            <div className="font-bold text-slate-700 text-xs">
                              {project.startdate}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">
                              to {project.enddate}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-5 align-middle text-center whitespace-nowrap">
                        <span
                          className={
                            "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide min-w-[76px] shadow-sm"
                          }
                        >
                          {getPriority(project.priorityId)}
                        </span>
                      </td>

                      {/* Operations */}
                      <td className="px-6 py-5 align-middle text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            title="Modify Profile"
                            onClick={() => {
                              router.push(
                                `/Master/EditProjectForm/${project.projectId}`
                              );
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200/60 transition shadow-sm bg-slate-50/50"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>

                          <button
                            title="Deallocate Track Record"
                            onClick={() => handleDelete(project.projectId)}
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200/60 transition shadow-sm bg-slate-50/50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="px-6 py-4 bg-slate-50/40 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500">
              Displaying{" "}
              <span className="font-bold text-slate-700">
                {project.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700">
                {project.length}
              </span>{" "}
              Clusters
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled
                className="p-2 border border-slate-200 rounded-xl text-slate-300 bg-white cursor-not-allowed shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="h-8 w-8 inline-flex items-center justify-center border border-indigo-600 bg-indigo-50 rounded-xl text-xs font-bold text-indigo-600 shadow-sm"
              >
                1
              </button>
              <button
                type="button"
                disabled
                className="p-2 border border-slate-200 rounded-xl text-slate-300 bg-white cursor-not-allowed shadow-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full bg-white border-t border-slate-200/80 mt-auto">
        <div className="max-w-[1600px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-slate-900 font-extrabold uppercase tracking-wider text-[10px]">
              EduVerify Platform
            </span>
            <span className="text-slate-300">|</span>
            <span>&copy; 2026 Academic Systems Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="#"
              className="hover:text-indigo-600 transition flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" /> Documentation
            </a>
            <a
              href="#"
              className="hover:text-indigo-600 transition flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Help Center
            </a>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="hover:text-slate-700 transition">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}