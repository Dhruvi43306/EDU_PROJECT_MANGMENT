"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Users,
  Sparkles,
  GraduationCap,
  FolderKanban,
  LayoutDashboard,
  Building2,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  CheckCircle,
  Search,
  BookOpen,
  CheckCircle2,
  Clock,
  Briefcase,
} from "lucide-react";

const STU_PROJECT_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/StudentProject`;

interface StudentProjectType {
  studnetProjectId: number;
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
  overallGrade: string;
}

export default function UnifiedProjectOS() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [studentList, setStudentList] = useState<StudentProjectType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const pathname = usePathname();
  const router = useRouter();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `group relative flex items-center p-3 rounded-xl text-xs font-bold transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
        : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
    }`;
  };

  const fetchStudentProject = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("JWT token not found");
        return;
      }

      const response = await fetch(STU_PROJECT_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("API Error:", response.status);

        if (response.status === 401) {
          console.error("Unauthorized - token is missing or invalid");
        }

        throw new Error("Failed to fetch student projects");
      }

      const result = await response.json();
      console.log("Student Project API:", result);

      setStudentList(result.data ?? []);
    } catch (err) {
      console.error("Fetch StudentProject Error:", err);
      Swal.fire({
        icon: "error",
        title: "Fetch Failed",
        text: "Could not load student projects. Please check your network or login session.",
        confirmButtonColor: "#4F46E5",
        customClass: {
          popup: "rounded-2xl border border-slate-100",
        },
      });
    }
  };

  const handleDelete = async (studentId: number) => {
    if (!studentId) {
      Swal.fire({
        icon: "warning",
        title: "Invalid ID",
        text: "Invalid Student ID provided.",
        confirmButtonColor: "#4F46E5",
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this student's project entry. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E11D48",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl border border-slate-100",
      },
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${STU_PROJECT_URL}/deleteStudentProject/${studentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json().catch(() => null);

      console.log("Delete Status:", response.status);
      console.log("Delete Response:", result);

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

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Student project deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-2xl border border-slate-100",
        },
      });

      // Remove deleted student's record from UI
      setStudentList((prev) =>
        prev.filter((student) => student.studentId !== studentId)
      );
    } catch (error) {
      console.error("Delete Student Project Error:", error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          error instanceof Error
            ? error.message
            : "Unable to delete student project.",
        confirmButtonColor: "#4F46E5",
      });
    }
  };

  useEffect(() => {
    fetchStudentProject();
  }, []);

  const filteredStudents = studentList.filter(
    (s) =>
      s.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex text-slate-800 font-sans">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-slate-200/80 flex flex-col justify-between relative h-screen sticky top-0 transition-all duration-300 ease-in-out z-40 shrink-0 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div>
          <div className="h-16 flex items-center px-5 border-b border-slate-100 gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200/50 shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-slate-900 text-sm">
                  NexusEdu
                </span>
                <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase">
                  Enterprise OS
                </span>
              </div>
            )}
          </div>

          <nav className="p-3 space-y-1.5">
            <Link
              href="/Deshboard/FacultyDeshboard"
              className={getLinkClass("/Deshboard/FacultyDeshboard")}
              title={sidebarCollapsed ? "Dashboard" : ""}
            >
              <LayoutDashboard
                className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                  sidebarCollapsed ? "" : "mr-3"
                }`}
              />
              {!sidebarCollapsed && <span>Faculty Dashboard</span>}
            </Link>

            <Link
              href="/Deshboard/ProjectCordinate"
              className={getLinkClass("/Deshboard/ProjectCordinate")}
              title={sidebarCollapsed ? "Project Coordinate" : ""}
            >
              <GraduationCap
                className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                  sidebarCollapsed ? "" : "mr-3"
                }`}
              />
              {!sidebarCollapsed && <span>Project Coordinate</span>}
            </Link>

            <Link
              href="/Deshboard/StudentDeshboard"
              className={getLinkClass("/Deshboard/StudentDeshboard")}
              title={sidebarCollapsed ? "Student Dashboard" : ""}
            >
              <Users
                className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                  sidebarCollapsed ? "" : "mr-3"
                }`}
              />
              {!sidebarCollapsed && <span>Student Dashboard</span>}
            </Link>

            <Link
              href="/Master/project"
              className={getLinkClass("/projects")}
              title={sidebarCollapsed ? "Projects" : ""}
            >
              <FolderKanban
                className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                  sidebarCollapsed ? "" : "mr-3"
                }`}
              />
              {!sidebarCollapsed && <span>Projects</span>}
            </Link>

            <Link
              href="/Master/department"
              className={getLinkClass("/Master/department")}
              title={sidebarCollapsed ? "Departments" : ""}
            >
              <Building2
                className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                  sidebarCollapsed ? "" : "mr-3"
                }`}
              />
              {!sidebarCollapsed && <span>Departments</span>}
            </Link>

            <Link
              href="Master/evaluation"
              className={getLinkClass("/evaluations")}
              title={sidebarCollapsed ? "Evaluations" : ""}
            >
              <FileCheck2
                className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                  sidebarCollapsed ? "" : "mr-3"
                }`}
              />
              {!sidebarCollapsed && <span>Evaluations</span>}
            </Link>
          </nav>
        </div>

        {/* Sidebar Toggle Control */}
        <div className="p-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full h-9 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all cursor-pointer"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-x-hidden min-w-0">
        {/* Header Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-30 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">
              Student Project Registry
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Unified OS
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-slate-200" />
            <Link href="/auth/userProfile">
              <div className="flex items-center gap-2.5 cursor-pointer group">
                <div className="h-9 w-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all shadow-sm">
                  U
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </Link>
          </div>
        </header>

        {/* Dashboard Main View */}
        <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  Total Students
                </p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {studentList.length}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <Users className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  Project Coordinates
                </p>
                <p className="text-2xl font-black text-slate-900 mt-1">1</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>

         

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  Completed
                </p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {
                    studentList.filter(
                      (s) => s.statusName?.toLowerCase() === "completed"
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Table Container Header & Search */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Assigned Student Workspaces
                </h3>
              </div>

              {/* Interactive Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter student or project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Student Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4 pl-6">Student Code</th>
                    <th className="p-4">Student Name</th>
                    <th className="p-4">Project Title</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">CPI</th>
                    <th className="p-4">Status Name</th>
                    <th className="p-4 text-center">Overall Grade</th>
                    <th className="p-4 pr-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s) => (
                      <tr
                        key={s.studnetProjectId}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="p-4 pl-6 font-mono font-bold text-indigo-950">
                          {s.studentCode}
                        </td>

                        <td className="p-4 font-bold text-slate-900">
                          {s.studentName}
                        </td>
                        <td className="p-4 font-medium text-slate-700 max-w-xs truncate">
                          {s.projectTitle}
                        </td>
                        <td className="p-4 text-slate-600">
                          {s.departmentName}
                        </td>
                        <td className="p-4 font-mono font-bold text-indigo-600">
                          {s.cpi}
                        </td>
                        <td className="p-4 font-bold text-slate-700">
                          {s.statusName}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              s.overallGrade
                                ? "bg-slate-100 text-slate-800 border border-slate-200"
                                : "text-slate-400 bg-slate-50"
                            }`}
                          >
                            {s.overallGrade || "Not Set"}
                          </span>
                        </td>
                        <td className="p-4 pr-6">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* VIEW DETAILS */}
                            <button
                              type="button"
                              title="View Details"
                              onClick={() => {
                                router.push(`/Master/student/${s.studentId}`);
                              }}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* EDIT */}
                            <button
                              type="button"
                              title="Edit Entry"
                              onClick={() => {
                                router.push(
                                  `/Master/EditStudentForm/${s.studentId}`
                                );
                              }}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            {/* DELETE */}
                            <button
                              type="button"
                              title="Delete Record"
                              onClick={() => handleDelete(s.studentId)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                            {/* STATUS ACTION BADGES */}
                            {(() => {
                              const status = (s.statusName ?? "")
                                .trim()
                                .toLowerCase();

                              if (
                                status === "pending" ||
                                status === "pending approval" ||
                                status === "pendingapproval"
                              ) {
                                return (
                                  <Link
                                    href={`/Master/FacultyApproved?studnetProjectId=${s.studnetProjectId}`}
                                  >
                                    <button
                                      type="button"
                                      className="h-7 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl flex items-center gap-1 transition-all ml-1 shadow-sm shadow-indigo-200 cursor-pointer whitespace-nowrap"
                                    >
                                      <FileCheck2 className="h-3.5 w-3.5" />
                                      Approve
                                    </button>
                                  </Link>
                                );
                              }

                              if (status === "approved") {
                                return (
                                  <Link
                                    href={`/Master/AssignByFaculty?studnetProjectId=${s.studnetProjectId}`}
                                  >
                                    <button
                                      type="button"
                                      className="h-7 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl flex items-center gap-1 transition-all ml-1 shadow-sm shadow-emerald-200 cursor-pointer whitespace-nowrap"
                                    >
                                      <CheckCircle className="h-3.5 w-3.5" />
                                      Assign
                                    </button>
                                  </Link>
                                );
                              }

                              if (status === "assigned") {
                                return (
                                  <span className="h-7 px-3 bg-blue-50 text-blue-700 border border-blue-200/80 text-[11px] font-bold rounded-xl flex items-center gap-1 ml-1 whitespace-nowrap">
                                    <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                                    Assigned
                                  </span>
                                );
                              }

                              if (status === "completed") {
                                return (
                                  <span className="h-7 px-3 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold rounded-xl flex items-center gap-1 ml-1 whitespace-nowrap">
                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                                    Completed
                                  </span>
                                );
                              }

                              return (
                                <span className="h-7 px-3 bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-bold rounded-xl flex items-center gap-1 ml-1 whitespace-nowrap">
                                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                                  In Progress
                                </span>
                              );
                            })()}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-8 text-center text-slate-400 font-medium"
                      >
                        No student projects found matching your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}