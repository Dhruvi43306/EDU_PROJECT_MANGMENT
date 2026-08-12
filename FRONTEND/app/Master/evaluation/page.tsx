"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  ClipboardCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  TrendingUp,
  FileSpreadsheet,
  MessageSquarePlus,
  Award,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  CalendarRange,
  Medal,
} from "lucide-react";

const STU_PROJECT_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/StudentProject`;
const EVALUATION_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Evaluation/getAllEvaluation`;
const NEXT_EVALUATION_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Evaluation/nextTask`;
const ADD_EVALUATION_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Evaluation/addEvaluation`;
const STATUS_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/StatusMaster`;

interface StudentProject {
  studentProjectId: number;
  studentId: number;
  studentName: string;
  studentCode: string;
  projectId: number;
  projectTitle: string;
  enrollmentNo: string;
  semester: number;
  batch: number;
  academicYear: number;
  cpi: number;
  departmentName: string;
  statusName: string;
  coordinatorId: number | null;
  coordinator: string | null;
  approvedDate: string | null;
  assignedDate: string | null;
  overallGrade: string;
}

interface Evaluation {
  evaluationId: number;
  studentProjectId: number;
  taskId: number;
  studentId?: number;
  studentName: string;
  projectName: string;
  TaskName: string;
  weekNumber: number;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  feedback: string;
  evaluationDate: string;
  statusId: number;
  statusName: string;
}

interface NextEvaluationTask {
  taskId: number;
  projectId: number;
  taskName: string;
  description: string;
  priorityId: number;
  startDate: string;
  dueDate: string;
  actualHours: number | null;
  studentProjectId: number;
  weekNumber?: number;
}

interface DashboardRow {
  student: StudentProject;
  displayEvaluation: Evaluation | null;
  nextTask: NextEvaluationTask | null;
  currentWeek: number;
  remainingTasks: number;
  currentTask: string;
  marks: string;
  grade: string;
  feedback: string;
  evaluationDate: string;
  displayStatus: string;
  displayOverallGrade: string;
  actuallyCompleted: boolean;
}

interface StatusMaster {
  statusId: number;
  statusName: string;
}
const calculateGrade = (marks: number | string): string => {
  const numericValue = typeof marks === "number" ? marks : Number(marks);

  if (Number.isNaN(numericValue) || numericValue < 0) {
    return "N/A";
  }

  if (numericValue >= 90) return "O";
  if (numericValue >= 80) return "A+";
  if (numericValue >= 70) return "A";
  if (numericValue >= 60) return "B+";
  if (numericValue >= 50) return "B";
  if (numericValue >= 40) return "C";

  return "F";
};

export default function AcademicEvaluationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [studentProjects, setStudentProjects] = useState<StudentProject[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [nextTasks, setNextTasks] = useState<Record<number, NextEvaluationTask | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProject | null>(null,);
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);
  const [nextTask, setNextTask] = useState<NextEvaluationTask | null>(null);
  const [formMarks, setFormMarks] = useState("");
  const [formGrade, setFormGrade] = useState("Auto");
  const [formFeedback, setFormFeedback] = useState("");
  const [statuses, setStatuses] = useState<StatusMaster[]>([]);
  const [formStatusId, setFormStatusId] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const fetchStatuses = async (): Promise<StatusMaster[]> => {
    try {
      const response = await fetch(STATUS_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Status API failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("Status API Response:", result);
      const rawStatuses = result?.data ?? result ?? [];
      const normalizedStatuses: StatusMaster[] = rawStatuses
        .map((status: any) => ({
          statusId: Number(status.statusId ?? status.StatusId ?? 0),
          statusName: status.statusName ?? status.StatusName ?? "",
        }))
        .filter(
          (status: StatusMaster) => status.statusId > 0 && status.statusName,
        );

      console.log("Normalized statuses:", normalizedStatuses);
      setStatuses(normalizedStatuses);

      return normalizedStatuses;
    } catch (error) {
      console.error("Status fetch error:", error);
      setError("Unable to load statuses.");
      return [];
    }
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(STU_PROJECT_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`StudentProject API failed: ${response.status}`);
      }

      const result = await response.json();

      console.log("StudentProject API Response:", result);

      const rawStudentProjects = result?.data ?? result ?? [];

      if (!Array.isArray(rawStudentProjects)) {
        throw new Error("StudentProject API did not return an array.");
      }

      const studentProjectsData: StudentProject[] = rawStudentProjects
        .map((sp: any) => ({
          ...sp,

          studentProjectId: Number(
            sp.studentProjectId ?? sp.StudentProjectId ?? sp.studnetProjectId,
          ),

          studentId: Number(sp.studentId ?? sp.StudentId ?? 0),
          studentName: sp.studentName ?? sp.StudentName ?? "",
          studentCode: sp.studentCode ?? sp.StudentCode ?? "",
          projectId: Number(sp.projectId ?? sp.ProjectId ?? 0),
          projectTitle: sp.projectTitle ?? sp.ProjectTitle ?? "",
          statusName: sp.statusName ?? sp.StatusName ?? "",
          coordinatorId: sp.coordinatorId ?? sp.CoordinatorId ?? null,
          coordinator: sp.coordinator ?? sp.Coordinator ?? null,
          approvedDate: sp.approvedDate ?? sp.ApprovedDate ?? null,
          assignedDate: sp.assignedDate ?? sp.AssignedDate ?? null,
          overallGrade: String(sp.overallGrade ??sp.OverallGrade ??sp.overallgrade ??"",).trim(),
        }))
        .filter((sp) => Number.isInteger(sp.studentProjectId) && sp.studentProjectId > 0,);

      console.log("NORMALIZED STUDENT PROJECTS:", studentProjectsData);

      setStudentProjects(studentProjectsData);

      const evaluationResponse = await fetch(EVALUATION_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!evaluationResponse.ok) {
        throw new Error(`Evaluation API failed: ${evaluationResponse.status}`);
      }

    const evaluationResult = await evaluationResponse.json();
    console.log("Evaluation API Response:", evaluationResult);
    const evaluationsData = evaluationResult?.data ?? evaluationResult ?? [];

      if (!Array.isArray(evaluationsData)) {
        throw new Error("Evaluation API did not return an array.");
      }

        console.log("Evaluations:", evaluationsData);
        const studentProjectMap = new Map<number, StudentProject>();
        studentProjectsData.forEach((sp: StudentProject) => {
        const id = sp.studentProjectId ?? (sp as any).StudentProjectId ?? (sp as any).studnetProjectId;

        if (id != null) {
          studentProjectMap.set(Number(id), sp);
        }
      });

      console.log("StudentProject Map:", studentProjectMap);

      const finalEvaluations: Evaluation[] = evaluationsData.map((ev: any) => {
        const studentProjectId = ev.studentProjectId ?? ev.StudentProjectId ?? ev.studnetProjectId;
        const studentProject = studentProjectMap.get(Number(studentProjectId));

        return {
          ...ev,

          evaluationId: ev.evaluationId ?? ev.EvaluationId ?? 0,
          studentProjectId:studentProjectId != null ? Number(studentProjectId) : 0,
          taskId: ev.taskId ?? ev.TaskId ?? 0,  
          weekNumber: ev.weekNumber ?? 0, 
          studentId: ev.studentId ?? ev.StudentId, 
          studentName: ev.StudentName,

          projectName: studentProject?.projectTitle ?? "Unknown Project",
          TaskName: ev.taskName ?? "",
          marksObtained: Number(ev.marksObtained ?? ev.MarksObtained ?? ev.marks ?? 0,),
          totalMarks: Number(ev.totalMarks ?? 100),
          grade: ev.grade ?? "N/A",
          feedback: ev.feedback ?? "",
          evaluationDate: ev.evaluationDate ?? "",
          statusId: ev.statusId ?? ev.StatusId ?? 0,
          statusName: ev.statusName ?? ev.StatusName ?? "",
        };
      });
      setEvaluations(finalEvaluations);
      const nextTaskMap: Record<number, NextEvaluationTask | null> = {};
      await Promise.all(
        studentProjectsData.map(async (project: StudentProject) => {
          const studentProjectId = Number(project.studentProjectId);
          if (!studentProjectId) {
            return;
          }

          try {
            const response = await fetch(
              `${NEXT_EVALUATION_URL}/${studentProjectId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
                cache: "no-store",
              },
            );

            if (!response.ok) {
              console.error(
                `Next task failed for ${studentProjectId}:`,
                response.status,
              );

              nextTaskMap[studentProjectId] = null;
              return;
            }
            const result = await response.json();
            if (result?.data) {
              const task = result.data;

              nextTaskMap[studentProjectId] = {
              taskId: Number(task.taskId ?? task.TaskId ?? 0),
              projectId: Number(task.projectId ?? task.ProjectId ?? 0),
              taskName: task.taskName ?? task.TaskName ?? "",
              description: task.description ?? task.Description ?? "",
              priorityId: Number(task.priorityId ?? task.PriorityId ?? 0),
              startDate: task.startDate ?? task.StartDate ?? "",
              dueDate: task.dueDate ?? task.DueDate ?? "",
              actualHours: task.actualHours ?? task.ActualHours ?? null,

                studentProjectId: Number(
                  task.studentProjectId ??
                    task.StudentProjectId ??
                    studentProjectId,
                ),

                weekNumber: Number(task.weekNumber ?? task.WeekNumber ?? 0),
              };

              console.log(
                `NEXT TASK FOUND FOR ${studentProjectId}:`,
                nextTaskMap[studentProjectId],
              );

              return;
            }
            if (result?.completed === true || result?.Completed === true) {
              console.log(`ALL TASKS COMPLETED FOR ${studentProjectId}`);

              nextTaskMap[studentProjectId] = null;
              return;
            }

            nextTaskMap[studentProjectId] = null;
          } catch (err) {
            console.error(`Next task error for ${studentProjectId}:`, err);
            nextTaskMap[studentProjectId] = null;
          }
        }),
      );

      setNextTasks(nextTaskMap);
    } catch (error) {
      console.error("Dashboard loading error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load evaluation dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    fetchStatuses();
  }, []);
  const dashboardRows = useMemo<DashboardRow[]>(() => {
    return studentProjects.map((student) => {
      const projectEvaluations = evaluations
        .filter(
          (evaluation) =>
            Number(evaluation.studentProjectId) ===
            Number(student.studentProjectId),
        )
        .sort((a, b) => {
          const weekDifference = Number(b.weekNumber) - Number(a.weekNumber);

          if (weekDifference !== 0) {
            return weekDifference;
          }

          return (
            new Date(b.evaluationDate).getTime() -
            new Date(a.evaluationDate).getTime()
          );
        });
      const task = nextTasks[student.studentProjectId] ?? null;
      const displayEvaluation = projectEvaluations[0] ?? null;
      const hasEvaluations = projectEvaluations.length > 0;

      const backendCompleted =
        student.statusName?.trim().toLowerCase() === "completed";

      const actuallyCompleted = backendCompleted && !task && hasEvaluations;
      const isPending = !!task;

      let displayStatus = "Pending";

      if (actuallyCompleted) {
        displayStatus = "Completed";
      } else if (isPending) {
        displayStatus = "Pending";
      }

      const currentWeek = displayEvaluation
        ? Number(displayEvaluation.weekNumber ?? 1)
        : task
          ? Number(task.weekNumber ?? 1)
          : 1;

      const currentTask = displayEvaluation
        ? displayEvaluation.TaskName
        : task
          ? task.taskName
          : actuallyCompleted
            ? "All tasks evaluated"
            : "No task available";

      const overallGrade = actuallyCompleted
        ? student.overallGrade || "N/A"
        : "N/A";

      const remainingTasks = task ? 1 : 0;

      let marks = "Pending";
      let grade = "N/A";
      let feedback = "No evaluation submitted yet.";
      let evaluationDate = "";
      if (displayEvaluation) {
        marks = `${displayEvaluation.marksObtained}/${displayEvaluation.totalMarks}`;

        grade = displayEvaluation.grade || calculateGrade(displayEvaluation.marksObtained);

        feedback = displayEvaluation.feedback || "No feedback.";

        evaluationDate = displayEvaluation.evaluationDate;
      }

      console.log("DASHBOARD ROW:", {
        studentProjectId: student.studentProjectId,
        student: student.studentName,
        backendStatus: student.statusName,
        evaluationCount: projectEvaluations.length,
        evaluations: projectEvaluations.map((e) => ({
          evaluationId: e.evaluationId,
          taskId: e.taskId,
          taskName: e.TaskName,
          week: e.weekNumber,
        })),

        nextTask: task,
        actuallyCompleted,
        displayStatus,
        currentWeek,
        currentTask,
        overallGrade,
      });

      return {
        student: {
          ...student,
          overallGrade,
        },

        displayEvaluation,
        nextTask: task,
        currentWeek,
        remainingTasks,
        currentTask,
        marks,
        grade,
        feedback,
        evaluationDate,
        displayStatus,
        displayOverallGrade: overallGrade,
        actuallyCompleted,
      };
    });
  }, [studentProjects, evaluations, nextTasks]);

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return dashboardRows.filter((row) => {
      const matchesSearch =
        !query ||
        row.student.studentName.toLowerCase().includes(query) ||
        row.student.projectTitle.toLowerCase().includes(query) ||
        row.currentTask.toLowerCase().includes(query);

      const displayStatus = row.displayStatus || "Pending";

      const normalizeStatus = (status: string) =>
        status.trim().toLowerCase().replace(/\s+/g, "");

      const matchesStatus =
        statusFilter === "All" ||
        normalizeStatus(displayStatus) === normalizeStatus(statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [dashboardRows, searchQuery, statusFilter]);

  const totalEvaluated = evaluations.length;

  const avgScore =
    totalEvaluated > 0
      ? Math.round(
          evaluations.reduce((total, evaluation) => {
            return total + Number(evaluation.marksObtained || 0);
          }, 0) / totalEvaluated,
        )
      : 0;

  const topGradeCount = evaluations.filter(
    (evaluation) => evaluation.grade === "A+" || evaluation.grade === "A",
  ).length;
  const pendingCount = dashboardRows.filter(
    (row) => row.displayStatus.toLowerCase() === "pending",
  ).length;
  const completedCount = dashboardRows.filter(
    (row) => row.displayStatus.toLowerCase() === "completed",
  ).length;
  const handleOpenEvaluate = async (row: DashboardRow) => {
    try {
      const studentProjectId = Number(row.student.studentProjectId);

      if (!Number.isInteger(studentProjectId) || studentProjectId <= 0) {
        console.error("Invalid StudentProjectId:", studentProjectId);
        alert("Invalid student project.");
        return;
      }

      let task: NextEvaluationTask | null = row.nextTask ?? null;
      if (!task) {
        const response = await fetch(
          `${NEXT_EVALUATION_URL}/${studentProjectId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          },
        );

        const result = await response.json().catch(() => null);

        console.log("NEXT TASK API STATUS:", response.status);
        console.log("NEXT TASK API RESPONSE:", result);

        if (result?.data) {
          const apiTask = result.data;

          task = {
          taskId: Number(apiTask.taskId ?? apiTask.TaskId ?? 0),
          projectId: Number(apiTask.projectId ?? apiTask.ProjectId ?? 0),
          taskName: apiTask.taskName ?? apiTask.TaskName ?? "",
          description: apiTask.description ?? apiTask.Description ?? "",
          priorityId: Number(apiTask.priorityId ?? apiTask.PriorityId ?? 0),
          startDate: apiTask.startDate ?? apiTask.StartDate ?? "",
          dueDate: apiTask.dueDate ?? apiTask.DueDate ?? "",
          actualHours: apiTask.actualHours ?? apiTask.ActualHours ?? null,
          studentProjectId: Number(
              apiTask.studentProjectId ??
                apiTask.StudentProjectId ??
                studentProjectId,
            ),

            weekNumber: Number(apiTask.weekNumber ?? apiTask.WeekNumber ?? 0),
          };
        } else {
          if (result?.completed === true || result?.Completed === true) {
            alert("All tasks have already been evaluated.");
            return;
          }

          if (response.status === 404) {
            alert("No pending task is available for evaluation.");
            return;
          }

          if (!response.ok) {
            throw new Error(
              result?.message ??
                result?.Message ??
                "Unable to load next evaluation task.",
            );
          }

          alert(
            result?.message ??
              result?.Message ??
              "No pending task is available for evaluation.",
          );

          return;
        }
      }

      if (!task || !task.taskId) {
        alert("No task is available for evaluation.");
        return;
      }

      console.log("FINAL TASK TO EVALUATE:", task);
      setNextTask(task);
      setSelectedEval({
        evaluationId: 0,
        studentProjectId: studentProjectId,
        taskId: Number(task.taskId),
        studentId: row.student.studentId,
        studentName: row.student.studentName,
        projectName: row.student.projectTitle,
        TaskName: task.taskName,
        weekNumber: Number(task.weekNumber ?? 0),
        marksObtained: 0,
        totalMarks: 100,
        grade: "N/A",
        feedback: "",
        evaluationDate: "",
        statusId: 0,
        statusName: "Pending",
      });

      setSelectedStudent(row.student);
      setFormMarks("");
      setFormGrade("Auto");
      setFormFeedback("");
      if (completedStatus) {
        setFormStatusId(completedStatus.statusId);
      }
      setShowEvaluateModal(true);
    } catch (error) {
      console.error("Next evaluation task error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to load next evaluation task.",
      );
    }
  };

  const handleEvaluateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEval || !nextTask) {
      alert("Evaluation information is missing.");
      return;
    }

    if (!formStatusId || formStatusId <= 0) {
      alert("Evaluation status is not loaded.");
      return;
    }

    if (!formMarks.trim()) {
      alert("Please enter marks.");
      return;
    }

    const marks = Number(formMarks);

    if (Number.isNaN(marks) || marks < 0 || marks > 100) {
      alert("Marks must be between 0 and 100.");
      return;
    }

    try {
      setSaving(true);

      const storedUserId = localStorage.getItem("userId");
      const userId = Number(storedUserId);
      const grade = formGrade === "Auto" ? calculateGrade(marks) : formGrade;
      const payload = {
        studentProjectId: Number(selectedEval.studentProjectId),
        studentId: Number(selectedEval.studentId),
        taskId: Number(selectedEval.taskId),
        evaluatedByUserId: userId,
        marksObtained: Number(marks),
        totalMarks: 100,
        grade: grade,
        feedback: formFeedback.trim(),
        evaluationDate: new Date().toISOString(),
        statusId: completedStatus?.statusId,
        createdBy: userId,
        // weekNumber: Number(nextTask.weekNumber)
      };

      const response = await fetch(ADD_EVALUATION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const rawResponse = await response.text();

      let result: any = null;

      if (rawResponse) {
        try {
          result = JSON.parse(rawResponse);
        } catch {
          result = {
            message: rawResponse,
          };
        }
      }

      if (!response.ok) {
        const backendMessage =
          result?.message ??
          result?.Message ??
          result?.error ??
          result?.Error ??
          result?.title ??
          result?.detail ??
          rawResponse ??
          `Evaluation failed with HTTP ${response.status}`;

        throw new Error(
          `Evaluation API failed (${response.status}): ${backendMessage}`,
        );
      }

      console.log("Evaluation successfully added:", result);

      alert(
        `Week ${
          nextTask.weekNumber ?? selectedEval.weekNumber
        } evaluated successfully.`,
      );

      setShowEvaluateModal(false);
      setSelectedEval(null);
      setSelectedStudent(null);
      setNextTask(null);

      setFormMarks("");
      setFormGrade("Auto");
      setFormFeedback("");

      await loadDashboard();
    } catch (err) {
    alert(err instanceof Error ? err.message : "Unable to save evaluation.");
    } finally {
      setSaving(false);
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );

      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <AlertCircle className="w-3.5 h-3.5" />
            In Progress
          </span>
        );
    }
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "O":
      case "A+":

      case "A":
        return (
          <span className="inline-flex items-center gap-1 font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 border border-emerald-300">
            <Medal className="w-3 h-3 text-emerald-600" />
            {grade}
          </span>
        );

      case "B+":
      case "B":
        return (
          <span className="inline-flex items-center font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-indigo-100/80 text-indigo-800 border border-indigo-300">
            {grade}
          </span>
        );

      case "C":
        return (
          <span className="inline-flex items-center font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-amber-100/80 text-amber-800 border border-amber-300">
            {grade}
          </span>
        );

      case "D":

      case "F":
        return (
          <span className="inline-flex items-center font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-rose-100/80 text-rose-800 border border-rose-300">
            {grade}
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center font-mono font-medium text-xs px-2 py-0.5 rounded-md bg-zinc-100 text-slate-400 border border-zinc-200">
            N/A
          </span>
        );
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) {
      return "-";
    }

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }
    return parsed.toLocaleDateString("en-IN");
  };
  const completedStatus = statuses.find(
    (s) => s.statusName.toLowerCase() === "completed",
  );

  useEffect(() => {
    if (completedStatus) {
      setFormStatusId(completedStatus.statusId);
    }
  }, [completedStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-100/70 to-zinc-50 text-slate-800 antialiased font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-indigo-100/40 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-50/50 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-zinc-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600/95">
              <ClipboardCheck className="w-4 h-4" />
              Academic Progress Matrix
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Evaluations Hub
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Evaluate student project tasks sequentially by week and track
              project completion.
            </p>
          </div>
        </header>

        {error && (
          <div className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">

          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Average Score
                </p>

                <p className="text-2xl font-black text-slate-900">
                  {avgScore}%
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-indigo-500" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  A / A+ Grades
                </p>

                <p className="text-2xl font-black text-slate-900">
                  {topGradeCount}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Award className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Pending
                </p>

                <p className="text-2xl font-black text-slate-900">
                  {pendingCount}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* COMPLETED */}

          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Completed Projects
                </p>

                <p className="text-2xl font-black text-slate-900">
                  {completedCount}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-zinc-50/50 rounded-xl border border-zinc-200/70 shadow-xs mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by student, project, or task..."
              className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="w-full bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-5">Student</th>

                  <th className="py-3.5 px-5">Project</th>

                  <th className="py-3.5 px-5">Week</th>

                  <th className="py-3.5 px-5">Current Task</th>

                  <th className="py-3.5 px-5">Marks</th>

                  <th className="py-3.5 px-5">Grade</th>

                  {/* <th className="py-3.5 px-5">Overall Grade</th> */}

                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Evaluation</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100 text-sm">
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-20 text-center text-slate-400"
                    >
                      Loading student projects...
                    </td>
                  </tr>
                ) : filteredRows.length > 0 ? (
                  filteredRows.map((row, index) => (
                    <tr
                      key={row.student.studentProjectId}
                      className={`hover:bg-indigo-50/20 ${
                        index % 2 === 0 ? "bg-white" : "bg-stone-50/30"
                      }`}
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                            {row.student.studentName?.charAt(0)?.toUpperCase()}
                          </div>

                          <div>
                            <div className="font-semibold text-slate-900">
                              {row.student.studentName}
                            </div>

                            <div className="text-[11px] text-slate-400">
                              {row.student.studentCode}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className="font-medium text-slate-700">
                          {row.student.projectTitle}
                        </span>
                      </td>

                      

                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                          <CalendarRange className="w-3 h-3" />W
                          {row.currentWeek}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <div
                          className="max-w-[220px] truncate text-slate-600 text-xs font-medium"
                          title={row.currentTask}
                        >
                          {row.currentTask}
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`font-mono font-bold text-xs px-2 py-1 rounded-lg border ${
                            row.marks === "Pending"
                              ? "border-amber-200 text-amber-700 bg-amber-50"
                              : "border-zinc-200 text-slate-800 bg-zinc-50"
                          }`}
                        >
                          {row.marks}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        {getGradeBadge(row.grade)}
                      </td>
                      {/* <td className="py-3.5 px-5">{getGradeBadge(row.displayOverallGrade || "N/A")}</td> */}
                      <td className="py-3.5 px-5">
                        {getStatusBadge(row.displayStatus)}
                      </td>
                      <td className="py-3.5 px-5">
                        {row.actuallyCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            All Evaluated
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenEvaluate(row)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                            Evaluate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-20 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center">
                        <FileSpreadsheet className="w-10 h-10 mb-3" />

                        <h3 className="text-lg font-bold text-slate-800">
                          No records found
                        </h3>

                        <p className="text-sm mt-1">
                          No student project matches your filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3.5 bg-zinc-50/80 border-t border-zinc-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing{" "}
              <span className="font-bold text-slate-800">
                {filteredRows.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-800">
                {dashboardRows.length}
              </span>{" "}
              student projects
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 bg-white text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 font-bold">
                1
              </button>

              <button
                disabled
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 bg-white text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEvaluateModal && selectedEval && nextTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-indigo-50/50 border-b border-indigo-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <FileCheck2 className="w-4 h-4" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Evaluate Week {nextTask.weekNumber}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {selectedEval.studentName}

                    {" — "}

                    {selectedEval.projectName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowEvaluateModal(false)}
                className="p-1.5 hover:bg-zinc-200/50 rounded-xl text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleEvaluateSubmit} className="p-5 space-y-5">
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                  Current Task
                </p>

                <h4 className="mt-1 text-sm font-bold text-slate-900">
                  {nextTask.taskName}
                </h4>

                {nextTask.description && (
                  <p className="mt-2 text-xs text-slate-600 whitespace-normal">
                    {nextTask.description}
                  </p>
                )}

                <div className="mt-3 flex gap-3 text-[11px] text-slate-500">
                  <span>Start: {formatDate(nextTask.startDate)}</span>

                  <span>Due: {formatDate(nextTask.dueDate)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Score /100
                  </label>

                  <input
                    required
                    type="number"
                    min={0}
                    max={100}
                    value={formMarks}
                    onChange={(e) => setFormMarks(e.target.value)}
                    placeholder="Enter score"
                    className="w-full h-10 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Grade
                  </label>

                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
                  >
                    <option value="Auto">
                      Auto (
                      {formMarks ? calculateGrade(Number(formMarks)) : "N/A"})
                    </option>

                    <option value="O">O</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="F">F</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Evaluation Status
                </label>
                 <select
                  value={formStatusId}
                  onChange={(e) => setFormStatusId(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                >
                  <option value={0}>Select Status</option>

                  {statuses.map((s) => (
                    <option key={s.statusId} value={s.statusId}>
                      {s.statusName}
                    </option>
                  ))}
                </select> 
              </div>

              {/* FEEDBACK */}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Evaluation Remarks
                </label>

                <textarea
                  rows={4}
                  value={formFeedback}
                  onChange={(e) => setFormFeedback(e.target.value)}
                  placeholder="Enter technical feedback..."
                  className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                />
              </div>

              {/* BUTTONS */}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEvaluateModal(false)}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-slate-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Submit Evaluation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
