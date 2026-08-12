"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Eye,
  X,
  GraduationCap,
  Layers,
  CheckCircle,
  Clock,
  ShieldCheck,
  HelpCircle,
  BookOpen,
  LogOut,
  Globe,
  FolderGit2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const DEPT_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Department`;
const PROJECT_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/project`;
const STU_PROJECT_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/StudentProject`;

interface StudentProjectType {
  StudnetProjectId: number;
  studentId: number;
  studentName: string;
  studentCode: string;
  projectId: number;
  projectTitle: string;
  enrollmentno: string;
  semester: number;
  batch: number;
  academicyear: number;
  cpi: number;
  departmentId: number;
  departmentName: string;
  statusId: number;
  statusName: string;
  coordinator: string;
  coordinatorId: number | null;
  approvedBy: string;
  approvedByUserId: number | null;
  approvedDate: string | null;
  assignedDate: string | null;
}

interface ProjectType {
  projectId: number;
  projecttitle: string;
  projectcode: string;
}

interface DepartmentType {
  departmentId: number;
  departmentName: string;
}
export default function FocusedStudentWorkspace() {
  const router = useRouter();

  const [studentprojects, setStudnentProjects] = useState<StudentProjectType[]>(
    [],
  );
  
  const [selectedStudent, setSelectedStudent] =
    useState<StudentProjectType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAssignPopover, setShowAssignPopover] = useState(false);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [departments, setDepartmentsList] = useState<DepartmentType[]>([]);
  const [form, setForm] = useState({
    ProjectId: 0,
    DepartmentId: 0,
    Enrollmentno: "",
    Semester: "",
    Academicyear: "2026",
    cpi: "",
  });

  const fetchStudentProject = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setStudnentProjects([]);
      router.replace("/auth/login");
      return;
    }

    const response = await fetch(STU_PROJECT_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("roleId");
      localStorage.removeItem("role");
      localStorage.removeItem("userName");
      localStorage.removeItem("studentId");
      localStorage.removeItem("studentProjectId");

      setStudnentProjects([]);

      router.replace("/auth/login");
      return;
    }

    if (!response.ok) {
      const errorText = await response.text();

      console.error("API Error:", errorText);

      throw new Error(
        `Failed to fetch student projects: ${response.status}`,
      );
    }

    const result = await response.json();

    setStudnentProjects(result?.data ?? []);
  } catch (err) {
    console.error("fetchStudentProject error:", err);

    setStudnentProjects([]);
  }
};

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      ProjectId: Number(form.ProjectId),
      Enrollmentno: form.Enrollmentno.trim(),
      Semester: Number(form.Semester),
      Academicyear: Number(form.Academicyear),
      cpi: Number(form.cpi),
      DepartmentId: Number(form.DepartmentId),
    };

   

    

    try {
      const response = await fetch(`${STU_PROJECT_URL}/Apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let result: any = null;

      try {
        result = responseText ? JSON.parse(responseText) : null;
      } catch {
        result = null;
      }

      if (!response.ok) {
        const backendMessage =
          result?.message ||
          result?.Message ||
          result?.error ||
          result?.title ||
          responseText ||
          `Request failed with status ${response.status}`;

        Swal.fire({
          icon: "error",
          title: "Application Failed",
          text: backendMessage,
          confirmButtonColor: "#4f46e5",
          customClass: {
            popup: "rounded-2xl font-sans",
          },
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Project Applied Successfully!",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-2xl font-sans",
        },
      });

      await fetchStudentProject();
      setShowAssignPopover(false);
      setForm({
        ProjectId: 0,
        DepartmentId: 0,
        Enrollmentno: "",
        Semester: "",
        Academicyear: "2026",
        cpi: "",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err instanceof Error
            ? err.message
            : "Something went wrong while applying for project.",
        confirmButtonColor: "#4f46e5",
        customClass: {
          popup: "rounded-2xl font-sans",
        },
      });
    }
  };
  const handleLogout = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("roleId");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");

    localStorage.removeItem("studentId");
    localStorage.removeItem("studentProjectId");

    router.replace("/auth/login");
  } catch (error) {
    console.error("Logout error:", error);

    router.replace("/auth/login");
  }
};

  const fetchDepartment = async () => {
    try {
      const response = await fetch(DEPT_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to load departments");
      const result = await response.json();
      setDepartmentsList(result.data ?? []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(PROJECT_URL);
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  
  const filteredStudents = studentprojects.filter((s) =>
    (s.studentName ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    setStudnentProjects([]);
    router.replace("/auth/login");
    return;
  }

  fetchStudentProject();
  fetchProjects();
  fetchDepartment();
}, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-indigo-500 p-2.5 rounded-xl text-white shadow-md shadow-indigo-100">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 tracking-wider uppercase">
                EduVerify
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                Faculty Control Panel
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-500">
            <a
              href="#"
              className="text-indigo-600 border-b-2 border-indigo-600 py-5 transition-colors font-bold"
            >
              Allocations
            </a>
            <a
              href="/Master/project"
              className="hover:text-slate-900 transition-colors py-5"
            >
              Project
            </a>
            <a
              href="/Master/task"
              className="hover:text-slate-900 transition-colors py-5"
            >
              Project task
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/userProfile"
              className="flex items-center gap-2 group p-1 rounded-xl hover:bg-slate-100/80 transition-all"
            >
              <div className="h-9 w-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all shadow-xs">
                U
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-y-0.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50/80 border border-transparent hover:border-rose-100 rounded-xl transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-6 lg:p-10 w-full">
        <div className="max-w-[1600px] mx-auto space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs relative">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Search allocations or projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="relative w-full sm:w-auto flex justify-end">
              <button
                onClick={() => setShowAssignPopover(!showAssignPopover)}
                className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100 cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                Student Form
              </button>

              {/* Assignment Form Popover */}
              {showAssignPopover && (
                <div className="absolute right-0 top-14 w-88 bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      Allocation Console
                    </h4>
                    <button
                      onClick={() => setShowAssignPopover(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Enrollment No.
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 20230104001"
                          value={form.Enrollmentno}
                          onChange={(e) =>
                            setForm({ ...form, Enrollmentno: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Academic Year
                        </label>
                        <select
                          value={form.Academicyear}
                          onChange={(e) =>
                            setForm({ ...form, Academicyear: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:border-indigo-500 focus:bg-white outline-none transition-all cursor-pointer"
                        >
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                          <option value="2028">2028</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Department
                      </label>
                      <select
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-white focus:border-indigo-500 outline-none transition-all cursor-pointer"
                        value={form.DepartmentId}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            DepartmentId: Number(e.target.value),
                          })
                        }
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option
                            key={dept.departmentId}
                            value={dept.departmentId}
                          >
                            {dept.departmentName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Project
                      </label>
                      <select
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-white focus:border-indigo-500 outline-none transition-all cursor-pointer"
                        value={form.ProjectId}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            ProjectId: Number(e.target.value),
                          })
                        }
                      >
                        <option value="">Select Project</option>
                        {projects.map((p) => (
                          <option key={p.projectId} value={p.projectId}>
                            {p.projecttitle}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Current CPI Score
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          max="10"
                          step="0.01"
                          placeholder="e.g. 8.75"
                          value={form.cpi}
                          onChange={(e) =>
                            setForm({ ...form, cpi: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Semester Track
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 1"
                          value={form.Semester}
                          onChange={(e) =>
                            setForm({ ...form, Semester: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Commit Assignment Plan
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Table Component */}
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6"> Enrollment</th>
                    <th className="py-4 px-6">Candidate Profile</th>
                    <th className="py-4 px-6">Assigned Project</th>
                    <th className="py-4 px-6">Academic Year</th>
                    <th className="py-4 px-6">Current CPI</th>
                    <th className="py-4 px-6">Semester</th>
                    <th className="py-4 px-6">Dept</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center">Operational Flags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((stu,index) => {
                      const numericCpi = Number(stu.cpi);
                      const cpiTheme =
                        numericCpi >= 9.0
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200/80 font-black"
                          : numericCpi >= 7.5
                            ? "text-slate-800 bg-slate-100 border-slate-200/80 font-bold"
                            : "text-amber-700 bg-amber-50 border-amber-200/80 font-semibold";

                      return (
                        <tr
                          key={stu.studentId}
                          className="hover:bg-slate-50/80 transition-colors text-slate-700"
                        >
                          <td className="py-4 px-6 font-mono tracking-tight">
                            <span className="font-bold text-indigo-600 block">
                          {index + 1}
                          </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {stu.enrollmentno}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900">
                            {stu.studentName}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 font-medium text-slate-800">
                              <FolderGit2 className="w-4 h-4 text-indigo-500 shrink-0" />
                              <span className="truncate max-w-[180px]">
                                {stu.projectTitle}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-semibold text-slate-600">
                            {stu.academicyear}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-md border font-mono text-[11px] tracking-tight ${cpiTheme}`}
                            >
                              {stu.cpi}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-semibold text-slate-700">
                            {stu.semester}
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-block px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md text-[10px] font-bold">
                              {stu.departmentName}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold">
                              {stu.statusName || "Active"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex gap-1.5 justify-center items-center">
                                <button
                                  onClick={() => {
                                    router.push(
                                      `/Master/student/${stu.studentId}`
                                    );
                                  }}
                                  className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                                  title="View Details"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                               
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-12 text-center text-slate-400 font-medium"
                      >
                        No matching allocation data clusters discovered in
                        current schema bounds.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 font-bold tracking-wide uppercase">
              <span>
                Aggregated Metrics: {filteredStudents.length} Tracks Displayed
              </span>
              <span>Stable Core</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200/80 mt-auto">
        <div className="max-w-[1600px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-slate-900 font-bold uppercase tracking-wider text-[10px]">
              EduVerify Engine
            </span>
            <span className="text-slate-300">|</span>
            <span>&copy; 2026 Academic Systems Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="#"
              className="hover:text-slate-900 transition flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Docs
            </a>
            <a
              href="#"
              className="hover:text-slate-900 transition flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Support
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

      {/* Student Inspector Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl w-full max-w-sm shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Allocation Inspector
              </h3>
            </div>

            <div className="space-y-3 text-xs border-y border-slate-100 py-4 my-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">
                  System Token:
                </span>
                <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {selectedStudent.studentId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">
                  Enrollment No:
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {selectedStudent.enrollmentno}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">
                  Academic Year:
                </span>
                <span className="font-semibold text-slate-800">
                  {selectedStudent.academicyear}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">
                  Student Name:
                </span>
                <span className="font-bold text-slate-900">
                  {selectedStudent.studentName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">
                  Performance Track:
                </span>
                <span className="font-mono font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                  {selectedStudent.cpi} CPI
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">
                  Batch Horizon:
                </span>
                <span className="font-medium text-slate-800">
                  {selectedStudent.batch}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">
                  Semester/Dept:
                </span>
                <span className="font-bold text-slate-800">
                  Sem {selectedStudent.semester}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full mt-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              Dismiss Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
