"use client";

import { ChevronDown, FileCheck2, Star, X } from "lucide-react";
import Link from "next/link";
import React, { useState, useMemo, useEffect } from "react";

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

interface StatusMaster {
  statusId: number;
  statusName: string;
}

const STU_PROJECT_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/StudentProject`;
const STATUS_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/StatusMaster`;

export default function StudentManagementSystem() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [studentprojects, setStudnentProjects] = useState<StudentProjectType[]>(
    [],
  );
  const [status, setStatus] = useState<StatusMaster[]>([]);

  const getToken = () => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("token");
  };

  const fetchStudentProject = async () => {
    try {
      const token = getToken();

      const response = await fetch(STU_PROJECT_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch student projects: ${response.status}`);
      }

      const result = await response.json();

      const projects: StudentProjectType[] = Array.isArray(result)
        ? result
        : (result?.data ?? []);

      console.log("ALL STUDENT PROJECTS:", projects);

      const coordinatorProjects = projects.filter(
        (student: StudentProjectType) => {
          const statusName = String(student.statusName ?? "")
            .trim()
            .toLowerCase();

          const hasFacultyAssigned =
            student.coordinatorId !== null &&
            student.coordinatorId !== undefined &&
            Number(student.coordinatorId) > 0;

          const isApproved =
            statusName === "approved" || statusName.includes("approved");

          const isAssigned =
            statusName === "assigned" || statusName.includes("assigned");
          return isApproved || isAssigned || hasFacultyAssigned;
        },
      );

      console.log("PROJECT COORDINATOR STUDENTS:", coordinatorProjects);

      setStudnentProjects(coordinatorProjects);
    } catch (err) {
      console.error("Student Project fetch error:", err);

      setStudnentProjects([]);
    }
  };

  const fetchStatuses = async () => {
    try {
      const token = getToken();

      const response = await fetch(STATUS_URL, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",

          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },

        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Status API failed: ${response.status}`);
      }

      const result = await response.json();

      console.log("Status API Response:", result);

      const rawStatuses = Array.isArray(result) ? result : (result?.data ?? []);

      const normalizedStatuses: StatusMaster[] = rawStatuses
        .map((item: any) => ({
          statusId: Number(item.statusId ?? item.StatusId ?? 0),

          statusName: item.statusName ?? item.StatusName ?? "",
        }))
        .filter(
          (item: StatusMaster) =>
            item.statusId > 0 && item.statusName.trim() !== "",
        );

      setStatus(normalizedStatuses);
    } catch (error) {
      console.error("Status fetch error:", error);

      setStatus([]);
    }
  };

  useEffect(() => {
    fetchStudentProject();
    fetchStatuses();
  }, []);

  const getStatusStyles = (statusName: string) => {
    const statusLower = statusName?.toLowerCase() || "";

    if (statusLower.includes("complete")) {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }

    if (statusLower.includes("approved")) {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }
    if (statusLower.includes("assigned")) {
      return "bg-emerald-50 text-emerald-700 border border-emerald-600";
    }

    if (statusLower.includes("progress") || statusLower.includes("start")) {
      return "bg-blue-50 text-blue-700 border border-blue-200";
    }

    if (statusLower.includes("pending") || statusLower.includes("waiting")) {
      return "bg-amber-50 text-amber-700 border border-amber-200";
    }

    if (statusLower.includes("reject")) {
      return "bg-rose-50 text-rose-700 border border-rose-200";
    }

    return "bg-slate-50 text-slate-700 border border-slate-200";
  };

  const filteredStudents = useMemo(() => {
    return studentprojects.filter((student) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        student.studentName?.toLowerCase().includes(search) ||
        student.studentCode?.toLowerCase().includes(search) ||
        student.projectTitle?.toLowerCase().includes(search);

      const currentStatus = student.statusName || "";

      const matchesStatus =
        statusFilter === "All" || currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [studentprojects, searchTerm, statusFilter]);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] p-6 lg:p-10 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}

        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-indigo-500/30 uppercase">
                Coordinator Console
              </span>

              <span className="text-slate-400 text-xs font-mono">
                • Active Session
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight mt-2 bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Welcome back, Project Coordinator
            </h1>

            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Monitor project architectures, validate subsystem milestones, and
              track real-time grading metrics across research tracks.
            </p>
          </div>

          <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 self-start md:self-auto shadow-inner">
            <div className="p-2.5 bg-indigo-500/20 rounded-lg border border-indigo-400/20">
              <svg
                className="w-5 h-5 text-indigo-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_45%)]" />{" "}
            <div className="flex items-center gap-3 ml-auto">
              <div className="h-8 w-[1px] bg-slate-200 mx-1" />

              <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
                <Link href="/auth/userProfile">
                  <div className="h-9 w-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all">
                    U
                  </div>
                </Link>

                <ChevronDown className="h-3 w-3 text-slate-400" />
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                System Status
              </div>

              <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Subsystems Stable
              </div>
            </div>
          </div>
        </header>

        {/* FILTER */}

        <section className="bg-white border border-slate-200/80 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>

            <input
              type="text"
              placeholder="Search by candidate, project, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-2xs placeholder:text-slate-400"
            />
          </div>
          <div className="py-2 text-">
            <Link href="/Master/evaluation">
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold transition">
                <FileCheck2 className="w-3.5 h-3.5" />
                Evaluation
              </button>
            </Link>
          </div>
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:inline">
              Track Status:
            </span>

            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200">
              <button
                onClick={() => setStatusFilter("All")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  statusFilter === "All"
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                All
              </button>

              {status.map((statusItem) => (
                <button
                  key={statusItem.statusId}
                  onClick={() => setStatusFilter(statusItem.statusName)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    statusFilter === statusItem.statusName
                      ? "bg-white text-slate-900 shadow-2xs font-bold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {statusItem.statusName}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* TABLE */}

        <main className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">System ID</th>

                  <th className="py-4 px-6">Candidate Profile</th>

                  <th className="py-4 px-6">Branch</th>

                  <th className="py-4 px-6">Project Subsystem</th>

                  <th className="py-4 px-6">Status State</th>

                  <th className="py-4 px-6 text-center">Over All grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const grade = student.overallGrade || "";
                    const currentStatus = student.statusName || "Not Set";

                    return (
                      <tr
                        key={student.studnetProjectId}
                        className="hover:bg-slate-50/60 transition-colors text-slate-700"
                      >
                        <td className="py-4 px-6 font-mono font-bold text-indigo-600 tracking-tight">
                          {student.studentId}
                        </td>

                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">
                            {student.studentName}
                          </div>

                          <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                            Code: {student.studentCode}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-bold">
                            {student.departmentName}
                          </span>
                        </td>

                        <td
                          className="py-4 px-6 font-medium max-w-[250px] truncate text-slate-500"
                          title={student.projectTitle}
                        >
                          {student.projectTitle}
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${getStatusStyles(
                              currentStatus,
                            )}`}
                          >
                            {currentStatus}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-center">
                          {student.overallGrade || "Not Set"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-slate-500"
                    >
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* ===================================================== */}
      {/* MODAL */}
      {/* ===================================================== */}

      {/* {showGradeModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Set Overall Grade
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  {selectedStudent.studentName}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowGradeModal(false);
                  setSelectedStudent(null);
                  
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div> */}

      {/* <form onSubmit={saveOverallGrade} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Student
                </label>

                <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                  <div className="text-sm font-bold text-slate-900">
                    {selectedStudent.studentName}
                  </div>

                  <div className="text-xs text-slate-400 mt-1">
                    {selectedStudent.projectTitle}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Overall Grade
                </label>

                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                >
                  <option value="">Select Overall Grade</option>

                  {GRADES.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Overall Status
                </label>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                >
                  <option value="">Select Overall Status</option>

                  {status.map((statusItem) => (
                    <option
                      key={statusItem.statusId}
                      value={statusItem.statusName}
                    >
                      {statusItem.statusName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowGradeModal(false);
                    setSelectedStudent(null);
                    setSelectedGrade("");
                    setSelectedStatus("");
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button> */}

      {/* <button
                  type="submit"
                  disabled={savingStatus}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {savingStatus ? "Saving..." : "Save Overall Grade"}
                </button>
              </div>
            </form>
          </div>
        </div> */}
      {/* )} */}
    </div>
  );
}
