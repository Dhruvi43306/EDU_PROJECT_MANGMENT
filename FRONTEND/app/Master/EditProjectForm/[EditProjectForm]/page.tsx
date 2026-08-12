"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const PROJECT_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/project`;
const PRIORITY_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/priority`;

interface ProjectType {
  projectId: number;
  projectCode: string;
  projecttitle: string;
  description: string;
  objectives: string;
  technologystack: string;
  projecttype: string;
  difficultyLevel: string;
  startdate: string | null;
  enddate: string | null;
  priorityId?: number;
  priorityName?: string;
  userId?: number;
}

interface PriorityType {
  PriorityId: number;
  PriorityName: string;
}

export default function EditProjectForm() {
  const router = useRouter();
  const params = useParams();
  const rawProjectId = params?.projectId ?? params?.EditProjectForm;
  const projectId = Number(
    Array.isArray(rawProjectId) ? rawProjectId[0] : rawProjectId
  );

  const [project, setProject] = useState<ProjectType | null>(null);
  const [priorities, setPriorities] = useState<PriorityType[]>([]);

  const [formData, setFormData] = useState({
    projecttitle: "",
    description: "",
    objectives: "",
    technologystack: "",
    projecttype: "",
    difficultylevel: "Medium",
    startdate: "",
    enddate: "",
    priority: "Medium",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Status banners replacing standard alerts
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchProjectById = async () => {
    if (!Number.isInteger(projectId) || projectId <= 0) {
      console.error("Invalid ProjectId:", projectId);
      return;
    }

    try {
      console.log("Fetching ProjectId:", projectId);

      const response = await fetch(`${PROJECT_URL}/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      console.log("Project API Status:", response.status);

      const responseText = await response.text();

      console.log("Project API Raw Response:", responseText);

      if (!response.ok) {
        throw new Error(responseText || "Failed to fetch project.");
      }

      let result: any = null;

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          throw new Error("Invalid JSON response from project API.");
        }
      }

      console.log("Project API Response:", result);

      const projectData: ProjectType | null =
        result?.data ?? result?.Data ?? result ?? null;

      console.log("Selected Project:", projectData);

      if (!projectData || Number(projectData.projectId) <= 0) {
        throw new Error(`ProjectId ${projectId} not found.`);
      }

      setProject(projectData);

      const formattedStartDate = projectData.startdate
        ? String(projectData.startdate).substring(0, 10)
        : "";

      const formattedEndDate = projectData.enddate
        ? String(projectData.enddate).substring(0, 10)
        : "";

      setFormData({
        projecttitle: projectData.projecttitle ?? "",
        description: projectData.description ?? "",
        objectives: projectData.objectives ?? "",
        technologystack: projectData.technologystack ?? "",
        projecttype: projectData.projecttype ?? "",
        difficultylevel: projectData.difficultyLevel ?? "Medium",
        startdate: formattedStartDate,
        enddate: formattedEndDate,
        priority: projectData.priorityName ?? "Medium",
      });

      console.log("Form Data Loaded Successfully");
    } catch (error) {
      console.error("Error while fetching project:", error);
      setStatusMessage({
        type: "error",
        text: "Could not load project information.",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const fetchPriorities = async () => {
    try {
      const response = await fetch(PRIORITY_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      console.log("Priority API Status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch priorities.");
      }

      const result = await response.json();

      console.log("Priority API Response:", result);

      const priorityData = Array.isArray(result)
        ? result
        : result?.data ?? result?.Data ?? [];

      console.log("Priority List:", priorityData);

      setPriorities(Array.isArray(priorityData) ? priorityData : []);
    } catch (error) {
      console.error("Error while fetching priorities:", error);
    }
  };

  useEffect(() => {
    if (!Number.isInteger(projectId) || projectId <= 0) {
      console.error("ProjectId is invalid:", projectId);
      setIsFetching(false);
      return;
    }

    fetchProjectById();
    fetchPriorities();
  }, [projectId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!Number.isInteger(projectId) || projectId <= 0) {
      setStatusMessage({ type: "error", text: "Invalid Project ID." });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const payload = {
        projectId: projectId,
        projectCode: project?.projectCode ?? "",
        projectTitle: formData.projecttitle,
        description: formData.description,
        objectives: formData.objectives,
        technologyStack: formData.technologystack,
        projectType: formData.projecttype || "",
        difficultyLevel: formData.difficultylevel,
        startDate: formData.startdate || null,
        endDate: formData.enddate || null,
        userId: Number(project?.userId) || 0,
      };

      const response = await fetch(`${PROJECT_URL}/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      console.log("Update Raw Response:", responseText);

      let result: any = null;

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          result = responseText;
        }
      }

      console.log("Update Project Response:", result);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.Message ||
            result?.error ||
            "Failed to update project."
        );
      }

      // Display in-app notification banner
      setStatusMessage({
        type: "success",
        text:
          result?.message ||
          result?.Message ||
          "Project updated successfully. Redirecting...",
      });

      setTimeout(() => {
        router.push("/Master/project");
      }, 1000);
    } catch (error) {
      console.error("Error while updating project:", error);

      setStatusMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong while updating project.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-rose-500/10 border border-rose-500/20 backdrop-blur-xl rounded-3xl flex items-center space-x-4 text-rose-600 shadow-xl shadow-rose-500/5">
        <div className="p-3 bg-rose-500/10 rounded-2xl">
          <svg
            className="w-6 h-6 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <span className="font-semibold text-sm">
          Invalid or missing Project ID parameter.
        </span>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto my-16 p-16 bg-white/70 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-200/50 flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute w-8 h-8 bg-blue-500/10 rounded-full blur-md"></div>
        </div>
        <div className="text-center">
          <p className="text-slate-800 font-semibold text-base">
            Loading Project Workspace
          </p>
          <p className="text-slate-400 text-xs mt-0.5">
            Fetching latest specifications from server...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/80 overflow-hidden transition-all duration-300">
      {/* Top Banner Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

      {/* Header with Glassmorphic Design */}
      <div className="bg-slate-900 px-8 py-8 text-white relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold tracking-wide backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Real-Time Sync Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Edit Project Specs
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg leading-relaxed">
              Update project details, core stack architecture, and target execution dates.
            </p>
          </div>

          <div className="self-start sm:self-auto inline-flex items-center space-x-2.5 px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md text-xs shadow-inner">
            <span className="text-slate-400 font-medium">PROJECT ID</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="font-mono font-bold text-blue-400 text-sm">
              #{projectId}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Status Notification Banner */}
      {statusMessage && (
        <div
          className={`mx-8 mt-6 p-4 rounded-2xl border text-sm font-medium flex items-center justify-between transition-all duration-300 shadow-lg ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-900 shadow-emerald-500/5"
              : "bg-rose-500/10 border-rose-500/20 text-rose-900 shadow-rose-500/5"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-xl ${
                statusMessage.type === "success"
                  ? "bg-emerald-500/20 text-emerald-600"
                  : "bg-rose-500/20 text-rose-600"
              }`}
            >
              {statusMessage.type === "success" ? (
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <span className="font-medium text-slate-800">{statusMessage.text}</span>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Project Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="projecttitle"
            value={formData.projecttitle}
            onChange={handleChange}
            placeholder="e.g. E-Commerce Platform Redesign"
            className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all duration-200 outline-none font-medium shadow-sm"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of the project..."
            className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all duration-200 outline-none resize-none font-medium shadow-sm"
          />
        </div>

        {/* Objectives */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Objective
          </label>
          <textarea
            name="objectives"
            rows={2}
            value={formData.objectives}
            onChange={handleChange}
            placeholder="Key goals and outcomes..."
            className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all duration-200 outline-none resize-none font-medium shadow-sm"
          />
        </div>

        {/* Two Columns: Stack & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Technology Stack
            </label>
            <input
              type="text"
              name="technologystack"
              value={formData.technologystack}
              onChange={handleChange}
              placeholder="e.g. Next.js, React, Node.js, PostgreSQL"
              className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all duration-200 outline-none font-medium shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Project Type
            </label>
            <input
              type="text"
              name="projecttype"
              value={formData.projecttype}
              onChange={handleChange}
              placeholder="e.g. Web Application"
              className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all duration-200 outline-none font-medium shadow-sm"
            />
          </div>
        </div>

        {/* Selection & Timeline Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Difficulty Level
            </label>
            <div className="relative">
              <select
                name="difficultylevel"
                value={formData.difficultylevel}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all duration-200 outline-none appearance-none cursor-pointer font-medium shadow-sm"
              >
                <option value="Easy font-medium">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Start Date
            </label>
            <input
              type="date"
              name="startdate"
              value={formData.startdate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all duration-200 outline-none font-medium cursor-pointer shadow-sm"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              End Date
            </label>
            <input
              type="date"
              name="enddate"
              value={formData.enddate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all duration-200 outline-none font-medium cursor-pointer shadow-sm"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.push("/Master/project")}
            className="px-6 py-3 text-sm font-semibold text-slate-600 bg-slate-100/80 hover:bg-slate-200 hover:text-slate-900 rounded-2xl active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center px-7 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 transition-all duration-200 cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}