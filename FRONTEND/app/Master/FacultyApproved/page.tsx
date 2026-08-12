"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import {
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Award,
  GraduationCap,
  FileText,
  RotateCcw,
} from "lucide-react";

const STU_PROJECT_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/StudentProject`;

interface StudentProjectType {
  studentProjectId: number;

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

type ApprovalState = {
  status: "pending" | "approved" | "rejected";

  message: string;
};

function FacultyApprovedContent() {
  const searchParams = useSearchParams();

  const studentProjectIdParam =
    searchParams.get("studentProjectId") ??
    searchParams.get("studnetProjectId");

  const studentProjectId = studentProjectIdParam
    ? Number(studentProjectIdParam)
    : NaN;

  const [studentProject, setStudentProject] =
    useState<StudentProjectType | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [approvalLoading, setApprovalLoading] = useState(false);

  const [approvalState, setApprovalState] = useState<ApprovalState>({
    status: "pending",
    message: "",
  });

  // =========================================================
  // TOKEN
  // =========================================================

  const getToken = (): string | null => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("token");
  };

  // =========================================================
  // NORMALIZE
  // =========================================================

  const normalizeStudentProject = (item: any): StudentProjectType => {
    return {
      studentProjectId: Number(
        item.studentProjectId ??
          item.studnetProjectId ??
          item.StudnetProjectId ??
          0,
      ),

      studentId: Number(item.studentId ?? item.StudentId ?? 0),

      studentName: item.studentName ?? item.StudentName ?? "",

      studentCode: item.studentCode ?? item.StudentCode ?? "",

      projectId: Number(item.projectId ?? item.ProjectId ?? 0),

      projectTitle: item.projectTitle ?? item.ProjectTitle ?? "",

      enrollmentno:
        item.enrollmentno ??
        item.enrollmentNo ??
        item.Enrollmentno ??
        item.EnrollmentNo ??
        "",

      semester: Number(item.semester ?? item.Semester ?? 0),

      batch: Number(item.batch ?? item.Batch ?? 0),

      academicyear: Number(
        item.academicyear ?? item.academicYear ?? item.AcademicYear ?? 0,
      ),

      cpi: Number(item.cpi ?? item.CPI ?? 0),

      departmentId: Number(item.departmentId ?? item.DepartmentId ?? 0),

      departmentName: item.departmentName ?? item.DepartmentName ?? "",

      statusId: Number(item.statusId ?? item.StatusId ?? 0),

      statusName: item.statusName ?? item.StatusName ?? "",

      coordinator: item.coordinator ?? item.Coordinator ?? "",

      coordinatorId: item.coordinatorId ?? item.CoordinatorId ?? null,

      approvedBy: item.approvedBy ?? item.ApprovedBy ?? "",

      approvedByUserId: item.approvedByUserId ?? item.ApprovedByUserId ?? null,

      approvedDate: item.approvedDate ?? item.ApprovedDate ?? null,

      assignedDate: item.assignedDate ?? item.AssignedDate ?? null,
    };
  };

  // =========================================================
  // SET SCREEN STATUS
  // =========================================================

  const setScreenStatus = (project: StudentProjectType) => {
    const currentStatus = project.statusName?.trim() ?? "";

    const lowerStatus = currentStatus.toLowerCase();

    if (lowerStatus === "approved") {
      setApprovalState({
        status: "approved",
        message: `Student project status: ${currentStatus}`,
      });
    } else if (lowerStatus === "rejected") {
      setApprovalState({
        status: "rejected",
        message: `Student project status: ${currentStatus}`,
      });
    } else {
      setApprovalState({
        status: "pending",
        message: "",
      });
    }
  };

  // =========================================================
  // FETCH
  // =========================================================

  const fetchStudentProject = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!Number.isFinite(studentProjectId) || studentProjectId <= 0) {
        setError("Student Project ID is missing or invalid.");
        return;
      }

      const token = getToken();

      if (!token) {
        setError("Login token not found.");
        return;
      }

      const response = await fetch(STU_PROJECT_URL, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ?? `StudentProject API failed: ${response.status}`,
        );
      }

      const rawData = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : [];

      const normalizedData = rawData.map(normalizeStudentProject);

      const selectedProject = normalizedData.find(
        (item: StudentProjectType) =>
          Number(item.studentProjectId) === Number(studentProjectId),
      );

      if (!selectedProject) {
        setError(`Student project ${studentProjectId} was not found.`);
        return;
      }

      setStudentProject(selectedProject);

      setScreenStatus(selectedProject);
    } catch (err) {
      console.error("StudentProject Fetch Error:", err);

      setError(
        err instanceof Error ? err.message : "Unable to load student project.",
      );
    } finally {
      setLoading(false);
    }
  }, [studentProjectId]);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchStudentProject();
  }, [fetchStudentProject]);

  // =========================================================
  // APPROVE
  // =========================================================

  const handleApprove = async () => {
    if (!studentProject) {
      return;
    }

    const parsedCpi = Number(studentProject.cpi);

    if (!Number.isFinite(parsedCpi) || parsedCpi < 0 || parsedCpi > 10) {
      setApprovalState({
        status: "rejected",
        message: "Student CPI is invalid.",
      });

      return;
    }

    if (parsedCpi < 8) {
      setApprovalState({
        status: "rejected",
        message:
          `Clearance Denied. Student CPI ` +
          `(${parsedCpi.toFixed(2)}) is below ` +
          `the mandatory 8.00 threshold.`,
      });

      return;
    }

    try {
      setApprovalLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setApprovalState({
          status: "rejected",
          message: "Login token not found.",
        });

        return;
      }

      const response = await fetch(
        `${STU_PROJECT_URL}/Approve/${studentProject.studentProjectId}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ?? "Failed to approve student project.",
        );
      }

      /*
       * IMPORTANT:
       *
       * Immediately show Approved.
       */

      setStudentProject((previous) =>
        previous
          ? {
              ...previous,
              statusName: "Approved",
            }
          : previous,
      );

      setApprovalState({
        status: "approved",
        message: "Student project approved successfully.",
      });

      /*
       * Fetch latest DB value.
       */
      await fetchStudentProject();
    } catch (err) {
      console.error("Approval Error:", err);

      setApprovalState({
        status: "rejected",
        message:
          err instanceof Error
            ? err.message
            : "Failed to approve student project.",
      });
    } finally {
      setApprovalLoading(false);
    }
  };

  // =========================================================
  // REJECT
  // =========================================================

  const handleReject = async () => {
    if (!studentProject) {
      return;
    }

    try {
      setApprovalLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setApprovalState({
          status: "rejected",
          message: "Login token not found.",
        });

        return;
      }

      const response = await fetch(
        `${STU_PROJECT_URL}/Reject/${studentProject.studentProjectId}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to reject student project.");
      }

      setStudentProject((previous) =>
        previous
          ? {
              ...previous,
              statusName: "Rejected",
            }
          : previous,
      );

      setApprovalState({
        status: "rejected",
        message: "Student project rejected successfully.",
      });

      await fetchStudentProject();
    } catch (err) {
      console.error("Reject Error:", err);

      setApprovalState({
        status: "rejected",
        message:
          err instanceof Error
            ? err.message
            : "Failed to reject student project.",
      });
    } finally {
      setApprovalLoading(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="w-full max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold">Faculty Approval Desk</h2>

              <p className="text-xs text-slate-400 mt-0.5">
                Review candidate details and evaluate project clearance
              </p>
            </div>
          </div>
        </div>

        <div className="p-10 text-center text-sm text-slate-400">
          Loading student project...
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !studentProject) {
    return (
      <div className="w-full max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold">Faculty Approval Desk</h2>

              <p className="text-xs text-slate-400 mt-0.5">
                Review candidate details and evaluate project clearance
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error || "Student project could not be found."}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      {/* HEADER */}

      <div className="bg-slate-900 px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold">Faculty Approval Desk</h2>

            <p className="text-xs text-slate-400 mt-0.5">
              Review candidate details and evaluate project clearance
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* RESULT */}

        {approvalState.status !== "pending" && (
          <div
            className={`p-4 rounded-xl flex items-start gap-3 text-xs font-medium border ${
              approvalState.status === "approved"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            {approvalState.status === "approved" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
            )}

            <div>{approvalState.message}</div>
          </div>
        )}

        {/* STATUS */}

        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-xs font-semibold text-slate-700">
            Current Project Status
          </span>

          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              studentProject.statusName?.toLowerCase() === "approved"
                ? "bg-emerald-100 text-emerald-700"
                : studentProject.statusName?.toLowerCase() === "rejected"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-amber-100 text-amber-700"
            }`}
          >
            {studentProject.statusName || "Pending"}
          </span>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {/* STUDENT */}

          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Student Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-600">
                  Full Name
                </label>

                <input
                  value={studentProject.studentName}
                  readOnly
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">
                  Student Code
                </label>

                <input
                  value={studentProject.studentCode}
                  readOnly
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">
                  Enrollment No
                </label>

                <input
                  value={studentProject.enrollmentno}
                  readOnly
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">
                  Branch
                </label>

                <input
                  value={studentProject.departmentName}
                  readOnly
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">
                  Semester
                </label>

                <input
                  value={`Semester ${studentProject.semester}`}
                  readOnly
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
            </div>

            {/* CPI */}

            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs font-semibold text-slate-700">
                Academic Standing (CPI)
              </span>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={studentProject.cpi}
                  readOnly
                  className="w-20 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center"
                />

                <span className="text-[11px] font-semibold text-slate-400">
                  / 10.0
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* PROJECT */}

          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Project Proposal
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Title
                </label>

                <input
                  value={studentProject.projectTitle}
                  readOnly
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* ACTION */}

          <div className="pt-2">
            {approvalState.status === "pending" ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={approvalLoading}
                  className="h-10 border border-rose-200 hover:bg-rose-50 text-rose-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShieldAlert className="h-4 w-4" />

                  {approvalLoading ? "Processing..." : "Reject Proposal"}
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={approvalLoading}
                  className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Award className="h-4 w-4" />

                  {approvalLoading ? "Processing..." : "Grant Approval"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={fetchStudentProject}
                disabled={approvalLoading}
                className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Refresh Status
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
export default function FacultyApproved() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    Loading...
                </div>
            }
        >
            <FacultyApprovedContent />
        </Suspense>
    );
}