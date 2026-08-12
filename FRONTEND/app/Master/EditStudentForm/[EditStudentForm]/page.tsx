"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  User,
  BookOpen,
  Building,
  Award,
  BarChart2,
  CheckCircle2,
  Save,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";

const STU_PROJECT_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/StudentProject`;
const STATUS_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/StatusMaster`;

interface FormDataType {
  studentName: string;
  projectTitle: string;
  departmentName: string;
  cpi: string;
  statusName: string;
  overallGrade: string;
}

interface StatusType {
  statusId: number;
  statusName: string;
}

interface StudentProjectType {
  studentId?: number;
  StudentId?: number;
  studentName?: string;
  projectTitle?: string;
  departmentName?: string;
  cpi?: number;
  statusId?: number;
  statusName?: string;
  overallGrade?: string;
}

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams<{ EditStudentForm: string }>();
  const studentId = Number(params.EditStudentForm);

  console.log("URL Params:", params);
  console.log("Student ID:", studentId);

  const [formData, setFormData] = useState<FormDataType>({
    studentName: "",
    projectTitle: "",
    departmentName: "",
    cpi: "",
    statusName: "",
    overallGrade: "",
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusList, setStatusList] = useState<StatusType[]>([]);
  const [error, setError] = useState("");

  const fetchStudentProject = async () => {
    try {
      const response = await fetch(`${STU_PROJECT_URL}/${studentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      console.log("StudentProject Status:", response.status);

      if (!response.ok) {
        let errorMessage = `StudentProject API failed: ${response.status}`;

        try {
          const errorResult = await response.json();

          console.log("StudentProject Error Response:", errorResult);

          errorMessage =
            errorResult?.message ??
            errorResult?.Message ??
            errorResult?.error ??
            errorResult?.title ??
            errorMessage;
        } catch {
          // Response is not JSON
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();

      console.log("Student Project API:", result);

      const data: StudentProjectType | null = Array.isArray(result?.data)
        ? (result.data[0] ?? null)
        : (result?.data ?? result ?? null);

      console.log("Selected Student Project:", data);

      if (!data) {
        throw new Error("Student project data not found.");
      }

      setFormData({
        studentName: data.studentName ?? "",
        projectTitle: data.projectTitle ?? "",
        departmentName: data.departmentName ?? "",
        cpi: data.cpi !== undefined && data.cpi !== null ? String(data.cpi) : "",
        statusName: data.statusName ?? "",
        overallGrade: data.overallGrade ?? "",
      });
    } catch (error) {
      console.error("Fetch student project error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load student project."
      );
    }
  };

  const fetchStatuses = async (): Promise<StatusType[]> => {
    try {
      const response = await fetch(STATUS_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      console.log("Status API Status:", response.status);

      if (!response.ok) {
        throw new Error(`Status API failed: ${response.status}`);
      }

      const result = await response.json();

      console.log("Status API Response:", result);

      const rawStatuses = result?.data ?? result ?? [];

      const statuses: StatusType[] = Array.isArray(rawStatuses)
        ? rawStatuses
            .map((status: any) => ({
              statusId: Number(status.statusId ?? status.StatusId ?? 0),
              statusName: status.statusName ?? status.StatusName ?? "",
            }))
            .filter(
              (status: StatusType) => status.statusId > 0 && status.statusName
            )
        : [];

      console.log("Status List:", statuses);

      setStatusList(statuses);

      return statuses;
    } catch (error) {
      console.error("Status fetch error:", error);

      setError("Unable to load statuses.");

      return [];
    }
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([fetchStudentProject(), fetchStatuses()]);
      } finally {
        setLoading(false);
      }
    };

    if (studentId && !Number.isNaN(studentId)) {
      loadPage();
    } else {
      setError("Invalid student ID.");
      setLoading(false);
    }
  }, [studentId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId || Number.isNaN(studentId)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Request",
        text: "Invalid student ID provided.",
        confirmButtonColor: "#4F46E5",
        customClass: { popup: "rounded-2xl" },
      });
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        studentId: studentId,
        studentName: formData.studentName,
        projectTitle: formData.projectTitle,
        departmentName: formData.departmentName,
        cpi: Number(formData.cpi),
        statusName: formData.statusName,
        overallGrade: formData.overallGrade,
      };

      console.log("Student ID:", studentId);
      console.log("Updated Payload:", payload);

      const response = await fetch(`${STU_PROJECT_URL}/updateStudentProject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("PUT Status:", response.status);

      const result = await response.json().catch(() => null);

      console.log("PUT Response:", result);

      if (!response.ok) {
        const errorMessage =
          result?.message ??
          result?.Message ??
          result?.error ??
          result?.Error ??
          result?.title ??
          `Update failed: ${response.status}`;

        throw new Error(errorMessage);
      }

      console.log("Student project updated successfully.");

      await Swal.fire({
        icon: "success",
        title: "Changes Saved",
        text: "Student project details updated successfully!",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "rounded-2xl" },
      });

      router.back();
    } catch (error) {
      console.error("Update student project error:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error instanceof Error
            ? error.message
            : "Unable to update student project.",
        confirmButtonColor: "#4F46E5",
        customClass: { popup: "rounded-2xl" },
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold uppercase tracking-wider">
          Loading student project details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Registry
          </button>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            ID: #{studentId}
          </span>
        </div>

        {/* Card Form Container */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Edit Student Project Record
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Update academic assignment data and system status.
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
              <BookOpen className="h-5 w-5 text-indigo-300" />
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50/70 p-4 flex items-start gap-3 text-rose-700">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-xs font-medium">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Primary Details Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                  General Information
                </h3>

                {/* Student Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-indigo-600" />
                    Student Name
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Project Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                    Project Title
                  </label>
                  <input
                    type="text"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    required
                    placeholder="Enter project title"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Academic & Status Grid */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                  Academic Attributes
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Department */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-indigo-600" />
                      Department
                    </label>
                    <input
                      type="text"
                      name="departmentName"
                      value={formData.departmentName}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Computer Science"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* CPI */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <BarChart2 className="h-3.5 w-3.5 text-indigo-600" />
                      CPI
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      name="cpi"
                      value={formData.cpi}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Status Select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
                      Status Name
                    </label>
                    <select
                      name="statusName"
                      value={formData.statusName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="">Select Status</option>
                      {statusList.map((status) => (
                        <option
                          key={status.statusId}
                          value={status.statusName}
                        >
                          {status.statusName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Evaluation Section */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                  Performance Metrics
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-indigo-600" />
                    Overall Grade
                  </label>
                  <input
                    type="text"
                    name="overallGrade"
                    value={formData.overallGrade}
                    onChange={handleChange}
                    placeholder="Enter overall grade (e.g. A+, B, Distinction)"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}