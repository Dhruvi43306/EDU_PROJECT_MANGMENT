"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  Bell,
  Settings,
  FolderKanban,
  Award,
  CheckCircle2,
  Clock,
  UserCheck,
  BookOpen,
  GraduationCap,
} from "lucide-react";

const STU_PROJECT_URL =`${process.env.NEXT_PUBLIC_API_URL}/api/StudentProject`;
const EVALUATION_URL =`${process.env.NEXT_PUBLIC_API_URL}/api/Evaluation/getAllEvaluation`;
const TASK_URL =`${process.env.NEXT_PUBLIC_API_URL}/api/Task/getTask`;

interface StudentProjectType {
  StudnetProjectId: number;
  studentId: number;
  projectId: number;
  studentName: string;
  projectTitle: string;
  overallGrade: string | null;
}

interface Evaluation {
  evaluationId: number;
  studentProjectId: number;
  taskId: number;
  studentId?: number;

  TaskName: string;

  marksObtained: number;
  totalMarks: number;

  grade: string;
  feedback: string;

  evaluationDate: string;
  statusName: string;

  facultyName?: string;
}

interface TaskType {
  taskId: number;
  projectId: number;

  taskName: string;
  description?: string;

  priorityId?: number;

  startDate?: string;
  dueDate?: string;

  weekNumber?: number;
}

const StudentProjectEvaluationPage = () => {
  const params = useParams<{
    studentId?: string;
    id?: string;
  }>();

  const rawStudentId =
    params?.studentId ?? params?.id;

  const studentId = Number(rawStudentId);

  console.log("URL Params:", params);
  console.log("Raw Student ID:", rawStudentId);
  console.log("Student ID:", studentId);

  const [studentprojects, setStudentProjects] =
    useState<StudentProjectType[]>([]);

  const [evaluations, setEvaluations] =
    useState<Evaluation[]>([]);

  const [tasks, setTasks] =
    useState<TaskType[]>([]);

  const [loadingProject, setLoadingProject] =
    useState(true);

  const [loadingEvaluation, setLoadingEvaluation] =
    useState(true);

  const [loadingTasks, setLoadingTasks] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // FETCH STUDENT PROJECT
  // =========================================================

  const fetchStudentProject = async () => {
    try {
      setLoadingProject(true);
      setError("");

      if (
        !rawStudentId ||
        Number.isNaN(studentId) ||
        studentId <= 0
      ) {
        setError("Invalid student ID.");
        setStudentProjects([]);
        return;
      }

      const token =
        localStorage.getItem("token");

      if (!token) {
        console.error(
          "JWT token not found in localStorage",
        );

        setError("Login token not found.");
        setStudentProjects([]);

        return;
      }

      const response = await fetch(
        `${STU_PROJECT_URL}/${studentId}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          cache: "no-store",
        },
      );

      console.log(
        "Student Project API Status:",
        response.status,
      );

      const responseText =
        await response.text();

      let result: any = null;

      try {
        result = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        result = null;
      }

      console.log(
        "Student Project API Response:",
        result,
      );

      if (!response.ok) {
        throw new Error(
          result?.Message ||
            result?.message ||
            `Student project API failed: ${response.status}`,
        );
      }

      const rawData =
        result?.Data ??
        result?.data ??
        result;

      const projectData: any[] =
        Array.isArray(rawData)
          ? rawData
          : rawData
            ? [rawData]
            : [];

      console.log(
        "Student Project Array:",
        projectData,
      );

      const normalizedProjects: StudentProjectType[] =
        projectData.map(
          (item: any) => ({
            StudnetProjectId: Number(
              item?.StudnetProjectId ??
                item?.studnetProjectId ??
                item?.StudentProjectId ??
                item?.studentProjectId ??
                0,
            ),

            studentId: Number(
              item?.studentId ??
                item?.StudentId ??
                studentId,
            ),

            // IMPORTANT:
            // Get ProjectId from StudentProject API.
            projectId: Number(
              item?.projectId ??
                item?.ProjectId ??
                item?.projectID ??
                item?.ProjectID ??
                0,
            ),

            studentName:
              item?.studentName ??
              item?.StudentName ??
              "",

            projectTitle:
              item?.projectTitle ??
              item?.ProjectTitle ??
              item?.projectName ??
              item?.ProjectName ??
              "",

            overallGrade:
              item?.overallGrade ??
              item?.OverallGrade ??
              null,
          }),
        );

      console.log(
        "Required Student Project Data:",
        normalizedProjects,
      );

      setStudentProjects(
        normalizedProjects,
      );
    } catch (err) {
      console.error(
        "fetchStudentProject error:",
        err,
      );

      setStudentProjects([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load project.",
      );
    } finally {
      setLoadingProject(false);
    }
  };

  // =========================================================
  // FETCH EVALUATIONS
  // =========================================================

  const fetchEvaluation = async () => {
    try {
      setLoadingEvaluation(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        console.error(
          "JWT token not found",
        );

        setEvaluations([]);

        return;
      }

      const response = await fetch(
        EVALUATION_URL,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          cache: "no-store",
        },
      );

      console.log(
        "Evaluation API Status:",
        response.status,
      );

      const responseText =
        await response.text();

      let result: any = null;

      try {
        result = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        result = null;
      }

      console.log(
        "Evaluation API Response:",
        result,
      );

      if (!response.ok) {
        throw new Error(
          result?.Message ||
            result?.message ||
            `Evaluation API failed: ${response.status}`,
        );
      }

      const rawData =
        result?.Data ??
        result?.data ??
        result;

      const evaluationData: any[] =
        Array.isArray(rawData)
          ? rawData
          : rawData
            ? [rawData]
            : [];

      console.log(
        "Evaluation Array:",
        evaluationData,
      );

      const normalizedEvaluations: Evaluation[] =
        evaluationData.map(
          (item: any) => ({
            evaluationId: Number(
              item?.evaluationId ??
                item?.EvaluationId ??
                0,
            ),

            studentProjectId: Number(
              item?.studentProjectId ??
                item?.StudentProjectId ??
                item?.studnetProjectId ??
                item?.StudnetProjectId ??
                0,
            ),

            taskId: Number(
              item?.taskId ??
                item?.TaskId ??
                0,
            ),

            studentId:
              item?.studentId != null ||
              item?.StudentId != null
                ? Number(
                    item?.studentId ??
                      item?.StudentId,
                  )
                : undefined,

            TaskName:
              item?.taskName ??
              item?.TaskName ??
              "",

            marksObtained: Number(
              item?.marksObtained ??
                item?.MarksObtained ??
                0,
            ),

            totalMarks: Number(
              item?.totalMarks ??
                item?.TotalMarks ??
                0,
            ),

            grade:
              item?.grade ??
              item?.Grade ??
              "",

            feedback:
              item?.feedback ??
              item?.Feedback ??
              "",

            evaluationDate:
              item?.evaluationDate ??
              item?.EvaluationDate ??
              "",

            statusName:
              item?.statusName ??
              item?.StatusName ??
              "",

            facultyName:
              item?.facultyName ??
              item?.FacultyName,
          }),
        );

      console.log(
        "Required Evaluation Data:",
        normalizedEvaluations,
      );

      setEvaluations(
        normalizedEvaluations,
      );
    } catch (err) {
      console.error(
        "fetchEvaluation error:",
        err,
      );

      setEvaluations([]);
    } finally {
      setLoadingEvaluation(false);
    }
  };

  // =========================================================
  // FETCH ALL TASKS
  // =========================================================

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        console.error(
          "JWT token not found",
        );

        setTasks([]);

        return;
      }

      const response = await fetch(
        TASK_URL,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          cache: "no-store",
        },
      );

      console.log(
        "Task API Status:",
        response.status,
      );

      const responseText =
        await response.text();

      let result: any = null;

      try {
        result = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        result = null;
      }

      console.log(
        "Task API Response:",
        result,
      );

      if (!response.ok) {
        throw new Error(
          result?.Message ||
            result?.message ||
            result?.error ||
            `Task API failed: ${response.status}`,
        );
      }

      const rawData =
        result?.Data ??
        result?.data ??
        result;

      const taskData: any[] =
        Array.isArray(rawData)
          ? rawData
          : rawData
            ? [rawData]
            : [];

      const normalizedTasks: TaskType[] =
        taskData.map(
          (item: any) => ({
            taskId: Number(
              item?.taskId ??
                item?.TaskId ??
                0,
            ),

            projectId: Number(
              item?.projectId ??
                item?.ProjectId ??
                0,
            ),

            taskName:
              item?.taskName ??
              item?.TaskName ??
              "",

            description:
              item?.description ??
              item?.Description ??
              "",

            priorityId:
              item?.priorityId ??
              item?.PriorityId,

            startDate:
              item?.startDate ??
              item?.StartDate ??
              "",

            dueDate:
              item?.dueDate ??
              item?.DueDate ??
              "",

            weekNumber: Number(
              item?.weekNumber ??
                item?.WeekNumber ??
                0,
            ),
          }),
        );

      console.log(
        "All Normalized Tasks:",
        normalizedTasks,
      );

      setTasks(normalizedTasks);
    } catch (err) {
      console.error(
        "fetchTasks error:",
        err,
      );

      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    if (
      !rawStudentId ||
      Number.isNaN(studentId) ||
      studentId <= 0
    ) {
      setLoadingProject(false);
      setLoadingEvaluation(false);
      setLoadingTasks(false);

      setError("Invalid student ID.");

      return;
    }

    fetchStudentProject();
    fetchEvaluation();
    fetchTasks();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  // =========================================================
  // CURRENT PROJECT
  // =========================================================

  const currentProject =
    studentprojects.length > 0
      ? studentprojects[0]
      : null;

  console.log(
    "Current Project:",
    currentProject,
  );

  // =========================================================
  // EVALUATED + PENDING TASKS
  // =========================================================

  const evaluatedTasks = useMemo(() => {
    if (!currentProject) {
      return [];
    }

    // -------------------------------------------------------
    // STEP 1:
    // Get evaluations belonging to current student project
    // -------------------------------------------------------

    const projectEvaluations =
      evaluations.filter(
        (evaluation) => {
          // First priority:
          // Match by StudentProjectId
          if (
            evaluation.studentProjectId > 0 &&
            currentProject.StudnetProjectId > 0
          ) {
            return (
              evaluation.studentProjectId ===
              currentProject.StudnetProjectId
            );
          }

          // Fallback:
          // Match by StudentId
          if (
            evaluation.studentId != null &&
            currentProject.studentId > 0
          ) {
            return (
              evaluation.studentId ===
              currentProject.studentId
            );
          }

          return false;
        },
      );

    console.log(
      "Current Project Evaluations:",
      projectEvaluations,
    );

    // -------------------------------------------------------
    // STEP 2:
    // Get only tasks belonging to current project
    // -------------------------------------------------------

    const projectTasks =
      tasks.filter(
        (task) =>
          Number(task.projectId) ===
          Number(currentProject.projectId),
      );

    console.log(
      "Current Project Tasks:",
      projectTasks,
    );

    // -------------------------------------------------------
    // STEP 3:
    // Get all evaluated task IDs
    // -------------------------------------------------------

    const evaluatedTaskIds =
      new Set<number>(
        projectEvaluations
          .filter(
            (evaluation) =>
              Number(evaluation.taskId) > 0,
          )
          .map(
            (evaluation) =>
              Number(evaluation.taskId),
          ),
      );

    console.log(
      "Evaluated Task IDs:",
      Array.from(evaluatedTaskIds),
    );

    // -------------------------------------------------------
    // STEP 4:
    // Create remaining pending tasks
    // -------------------------------------------------------

    const pendingTasks: Evaluation[] =
      projectTasks
        .filter(
          (task) =>
            !evaluatedTaskIds.has(
              Number(task.taskId),
            ),
        )
        .map(
          (task): Evaluation => ({
            evaluationId: 0,

            studentProjectId:
              currentProject.StudnetProjectId,

            taskId: task.taskId,

            studentId:
              currentProject.studentId,

            TaskName:
              task.taskName,

            marksObtained: 0,

            totalMarks: 0,

            grade: "",

            feedback: "",

            evaluationDate: "",

            statusName: "Pending",

            facultyName: "",
          }),
        );

    console.log(
      "Remaining Pending Tasks:",
      pendingTasks,
    );

    // -------------------------------------------------------
    // STEP 5:
    // Existing evaluations remain Evaluated
    // -------------------------------------------------------

    const evaluatedTaskList =
      projectEvaluations.map(
        (evaluation) => ({
          ...evaluation,

          statusName:
            evaluation.statusName ||
            "Evaluated",
        }),
      );

    // -------------------------------------------------------
    // STEP 6:
    // Combine evaluated + pending tasks
    // -------------------------------------------------------

    const combinedTasks = [
      ...evaluatedTaskList,
      ...pendingTasks,
    ];

    // -------------------------------------------------------
    // STEP 7:
    // Sort by TaskId
    // -------------------------------------------------------

    combinedTasks.sort(
      (a, b) =>
        Number(a.taskId) -
        Number(b.taskId),
    );

    console.log(
      "FINAL TASK LIST:",
      combinedTasks,
    );

    return combinedTasks;
  }, [
    evaluations,
    tasks,
    currentProject,
  ]);

  // =========================================================
  // TOTAL MARKS OBTAINED
  // =========================================================

  const totalMarksObtained =
    useMemo(() => {
      return evaluatedTasks.reduce(
        (total, evaluation) =>
          total +
          Number(
            evaluation.marksObtained || 0,
          ),
        0,
      );
    }, [evaluatedTasks]);

  // =========================================================
  // TOTAL MARKS
  // =========================================================

  const totalMarks =
    useMemo(() => {
      return evaluatedTasks.reduce(
        (total, evaluation) =>
          total +
          Number(
            evaluation.totalMarks || 0,
          ),
        0,
      );
    }, [evaluatedTasks]);

  // =========================================================
  // TOTAL SCORE
  // =========================================================

  const totalScore =
    totalMarks > 0
      ? Math.round(
          (totalMarksObtained /
            totalMarks) *
            100,
        )
      : 0;

  return (
    <div>
      {/* HEADER */}

      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <GraduationCap className="h-6 w-6 text-white" strokeWidth={2.2} />
            </div>

          <div>
            <h1 className="text-sm font-extrabold text-slate-900">
              EDU Project
            </h1>

            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Student Dashboard Portal
            </p>
          </div>
        </div>

        
      </header>

      {/* HERO */}

      <div className="relative h-48 bg-gradient-to-r from-blue-950 via-indigo-900 to-violet-800 overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_50%)]" />

        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 pb-16 relative z-10">
        <div className="space-y-6">

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 font-bold text-xs px-3 py-1 rounded-full border border-blue-200/60 mb-3">
                  <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
                  Active Project Evaluation
                </span>

                {loadingProject ? (
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-400 tracking-tight">
                    Loading project...
                  </h2>
                ) : currentProject ? (
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {currentProject.projectTitle}
                  </h2>
                ) : (
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-400 tracking-tight">
                    No Project Assigned
                  </h2>
                )}

                <p className="text-sm font-medium text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Review your project tasks, evaluation marks, grades and
                  faculty feedback.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 self-start md:self-auto">
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Overall Grade
                  </span>

                  <span className="text-xs font-semibold text-slate-600">
                    Score: {totalScore}/100
                  </span>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-emerald-500/20">
                  {currentProject?.overallGrade ||
                    (evaluatedTasks.length > 0
                      ? evaluatedTasks[
                          evaluatedTasks.length - 1
                        ]?.grade || "-"
                      : "-")}
                </div>
              </div>
            </div>
            {currentProject && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="flex items-center gap-3 bg-[#fcfdfe] border border-slate-200/70 p-3.5 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 font-bold shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Student Name
                    </span>

                    <span className="text-sm font-extrabold text-slate-800">
                      {currentProject.studentName} (
                      {currentProject.studentId})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#fcfdfe] border border-slate-200/70 p-3.5 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 font-bold shadow-xs">
                    <Award className="w-4 h-4" />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Evaluation Status
                    </span>

                    <span className="text-sm font-extrabold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

                      {evaluatedTasks.some(
                        (task) =>
                          task.statusName
                            ?.toLowerCase()
                            .includes("pending"),
                      )
                        ? "In Progress"
                        : evaluatedTasks.length > 0
                          ? "Evaluated"
                          : "In Progress"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>


          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Task-by-Task Evaluations & Feedback
                </h3>

                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Detailed review breakdown provided by respective faculty
                  members
                </p>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200/60">
                {
                  evaluatedTasks.filter(
                    (task) =>
                      task.statusName
                        ?.toLowerCase()
                        .includes("evaluat") ||
                      task.statusName
                        ?.toLowerCase()
                        .includes("complete"),
                  ).length
                }{" "}
                Modules Evaluated
              </span>
            </div>

            {(loadingEvaluation ||
              loadingTasks) && (
              <div className="py-12 text-center text-sm font-semibold text-slate-400">
                Loading evaluations...
              </div>
            )}

            {!loadingEvaluation &&
              !loadingTasks &&
              error && (
                <div className="py-12 text-center text-sm font-semibold text-rose-500">
                  {error}
                </div>
              )}

            {!loadingEvaluation &&
              !loadingTasks &&
              !error &&
              evaluatedTasks.length === 0 && (
                <div className="py-12 text-center">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />

                  <p className="text-sm font-bold text-slate-500">
                    No evaluated tasks yet.
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Your evaluated tasks will appear here after faculty
                    evaluation.
                  </p>
                </div>
              )}

            {!loadingEvaluation &&
              !loadingTasks &&
              evaluatedTasks.length > 0 && (
                <div className="space-y-4">
                  {evaluatedTasks.map(
                    (task, index) => {
                      const isEvaluated =
                        task.statusName
                          ?.toLowerCase()
                          .includes("complete") ||
                        task.statusName
                          ?.toLowerCase()
                          .includes("evaluat");

                      return (
                        <div
                          key={
                            task.evaluationId ||
                            task.taskId ||
                            index
                          }
                          className="p-5 rounded-2xl border border-slate-200/70 bg-[#fcfdfe] hover:border-slate-300 transition-all duration-200 space-y-4 shadow-2xs"
                        >
                          {/* TASK HEADER */}

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                                {String(
                                  index + 1,
                                ).padStart(2, "0")}
                              </div>

                              <h4 className="font-extrabold text-slate-900 text-base">
                                {task.TaskName}
                              </h4>
                            </div>

                            <div className="flex items-center gap-3 self-start sm:self-auto">
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                                  isEvaluated
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                                    : "bg-amber-50 text-amber-700 border border-amber-200/50"
                                }`}
                              >
                                {isEvaluated ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5" />
                                )}

                                {task.statusName ||
                                  "Pending"}
                              </span>

                              <span
                                className={`px-3 py-1 rounded-xl text-xs font-black shadow-2xs ${
                                  !task.grade
                                    ? "bg-slate-100 text-slate-500"
                                    : "bg-blue-600 text-white"
                                }`}
                              >
                                Grade:{" "}
                                {task.grade ||
                                  "-"}
                              </span>
                            </div>
                          </div>

                          {/* MARKS */}

                          <div className="flex items-center justify-between bg-blue-50/60 border border-blue-100 p-3 rounded-xl">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Marks Obtained
                            </span>

                            <span className="text-sm font-black text-blue-700">
                              {task.marksObtained}
                              {" / "}
                              {task.totalMarks}
                            </span>
                          </div>

                          {/* FEEDBACK */}

                          <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                              Faculty Feedback
                            </span>

                            <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                              &ldquo;
                              {task.feedback ||
                                "No feedback provided."}
                              &rdquo;
                            </p>
                          </div>

                          {/* FACULTY META */}

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-1 gap-2">
                            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                              <UserCheck className="w-4 h-4 text-blue-600" />

                              Evaluated by Faculty:

                              <span className="text-blue-600 font-bold">
                                {task.facultyName ||
                                  "Faculty"}
                              </span>
                            </div>

                            <div className="text-slate-400 font-medium">
                              Date:{" "}
                              {task.evaluationDate
                                ? new Date(
                                    task.evaluationDate,
                                  ).toLocaleDateString()
                                : "-"}
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentProjectEvaluationPage;