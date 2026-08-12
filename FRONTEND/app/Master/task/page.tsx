"use client";
import React, { useState, useEffect } from "react";
import {CheckCircle2,Circle,Plus,AlertCircle,Loader2,Folder,Calendar,Layers,Flag,ListTodo,Check,ClipboardList,
} from "lucide-react";

interface TaskType {
  taskId: number;
  taskName: string;
  priorityId: number;
  projectId: number;
  Description: string;
  startDate: string;
  dueDate: string;
  status?: string;
  UserId?: number;
  evalution?: false;
  priorityName: string;
  projecttitle: string;
  weekNumber: number;
}

interface ProjectType {
  projectId: number;
  projecttitle: string;
}

interface Priority {
  priorityID: number;
  priorityName: string;
}

const TASK_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Task/getTask`;
const ADD_TASK_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Task/addTask`;
const PROJECT_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/project`;
const PRIORITY_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/priority`;

export default function SimpleTaskPortal() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [role, setRole] = useState<"FACULTY" | "STUDENT" | null>(null);
  const [project, setprojects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [priority, setpriority] = useState<Priority[]>([]);
  const [projectId, setProjectId] = useState("");
  const [priorityId, setPriorityId] = useState("1");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    taskId: "",
    taskName: "",
    priorityId: "",
    projectId: "",
    Description: "",
    startDate: "",
    dueDate: "",
    UserId: "",
    evalution: false,
    priorityName: "",
    projecttitle: "",
    weekNumber: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRoleId = localStorage.getItem("roleId");
      if (storedRoleId === "2") {
        setRole("FACULTY");
      } else {
        setRole("STUDENT");
      }
    }

    fetchAllTasks();
    fetchProject();
    fetchPriority();
  }, []);

  const fetchProject = async () => {
    try {
      const response = await fetch(PROJECT_URL, {
        headers: {
          "Content-type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const result = await response.json();
      console.log(result);

      const mappedProjects = result.map((item: any) => ({
        projectId: item.projectId,
        projecttitle: item.projecttitle,
      }));
      setprojects(mappedProjects);
      if (mappedProjects.length > 0) {
        setProjectId(mappedProjects[0].projectId.toString());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(TASK_URL, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch task list");
      }
      const result = await response.json();
      console.log(result);
      setTasks(result);

      const mappedTasks = result.data.map((item: any) => ({
        taskId: item.taskId || item.TaskId,
        taskName: item.taskName || item.TaskName,
        projectId: item.projectId || item.ProjectId,
        Description: item.description || item.Description,
        priorityId: item.priorityId || item.PriorityId,
        startDate: item.startDate || item.StartDate,
        dueDate: item.dueDate || item.DueDate,
        priorityName: item.priorityName || item.PriorityName,
        projecttitle:
          item.projecttitle ?? item.ProjectTitle ?? item.projectTitle,
        weekNumber: item.weekNumber ?? item.WeekNumber ?? 0,
      }));
      setTasks(mappedTasks);
      console.log("MAPPED TASKS:", mappedTasks);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load tasks from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTaskPayload = {
      projectId: parseInt(projectId, 10),
      taskName: form.taskName,
      description: form.Description,
      priorityId: parseInt(form.projectId, 10),
      startDate: form.startDate,
      dueDate: form.dueDate,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(ADD_TASK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(newTaskPayload),
      });
      if (!response.ok) {
        throw new Error("Failed to add new task");
      }
      fetchAllTasks();
      fetchProject();
    } catch (err: any) {
      setError(err.message || "Something went wrong while creating the task.");
    }
  };

  const toggleFacultyComplete = (taskId: number) => {
    setTasks(
      tasks.map((t) => {
        if (t.taskId === taskId) {
          const newStatus =
            t.status === "Completed" ? "In Progress" : "Completed";
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const toggleEvaluate = (taskId: number) => {
    setTasks(
      tasks.map((t) =>
        t.taskId === taskId ? { ...t, evaluated: !t.evalution } : t
      )
    );
  };

  const groupedTasks = tasks.reduce((acc: any, task) => {
    if (!acc[task.projecttitle]) {
      acc[task.projecttitle] = [];
    }

    acc[task.projecttitle].push(task);

    return acc;
  }, {});

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

  const getPriorityBadgeStyle = (priorityName: string) => {
    switch (priorityName?.toLowerCase()) {
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200/60";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 sm:p-6 md:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200/50 shrink-0">
              <ClipboardList className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Project Management Portal
              </h1>
              <p className="text-xs font-medium text-slate-500">
                {role === "FACULTY"
                  ? "Faculty Control & Task Management System"
                  : "Student Task Dashboard"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {role ?? "User"}
            </span>
          </div>
        </div>

        {/* Task Form for Faculty */}
        {role === "FACULTY" && (
          <form
            onSubmit={handleAddTask}
            className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-indigo-600" />
                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Assign New Task
                </h2>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={form.taskName}
                  onChange={(e) =>
                    setForm({ ...form, taskName: e.target.value })
                  }
                  className="w-full h-10 px-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                  Project Name *
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full h-10 px-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                >
                  {project.map((proj) => (
                    <option key={proj.projectId} value={proj.projectId}>
                      {proj.projecttitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                  Priority *
                </label>
                <select
                  value={priorityId}
                  onChange={(e) => setPriorityId(e.target.value)}
                  className="w-full h-10 px-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                >
                  <option value="">Select Priority</option>
                  {priority.map((item) => (
                    <option key={item.priorityID} value={item.priorityID}>
                      {item.priorityName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                  Task Description *
                </label>
                <input
                  type="text"
                  placeholder="Brief explanation of task requirements..."
                  value={form.Description}
                  onChange={(e) =>
                    setForm({ ...form, Description: e.target.value })
                  }
                  className="w-full h-10 px-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                  className="w-full h-10 px-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  className="w-full h-10 px-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Task
              </button>
            </div>
          </form>
        )}

        {/* Task List Table Container */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
            <div>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {role === "FACULTY"
                  ? "Faculty Control Panel"
                  : "Student Assigned Tasks"}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Live synchronization with project system
              </p>
            </div>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full">
              Total: {tasks.length}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-16 text-slate-400 gap-3 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="font-semibold">Retrieving tasks...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-400 font-medium">
              No tasks currently registered.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-bold bg-slate-50/60">
                    <th className="py-3 px-4">Task ID</th>
                    <th className="py-3 px-4">Task Title</th>
                    <th className="py-3 px-4">Task Description</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Start Date</th>
                    <th className="py-3 px-4">End Date</th>
                    <th className="py-3 px-4">Week Number</th>
                    {role === "FACULTY" && (
                      <th className="py-3 px-4 text-right">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {Object.entries(groupedTasks).map(
                    ([projectTitle, projectTasks]) => (
                      <React.Fragment key={projectTitle}>
                        <tr className="bg-indigo-50/50 border-y border-indigo-100/60">
                          <td
                            colSpan={role === "FACULTY" ? 8 : 7}
                            className="py-3 px-4 font-bold text-indigo-900 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <Folder className="w-4 h-4 text-indigo-600 shrink-0" />
                              <span>{projectTitle}</span>
                            </div>
                          </td>
                        </tr>
                        {(projectTasks as TaskType[]).map((task) => (
                          <tr
                            key={task.taskId}
                            className="hover:bg-slate-50/80 transition-colors group"
                          >
                            <td className="py-3.5 px-4 font-mono font-semibold text-slate-400">
                              #{task.taskId}
                            </td>

                            <td className="py-3.5 px-4 font-semibold">
                              <span
                                className={
                                  task.status === "Completed"
                                    ? "line-through text-slate-400"
                                    : "text-slate-800"
                                }
                              >
                                {task.taskName}
                              </span>
                            </td>

                            <td
                              className="py-3.5 px-4 text-slate-500 max-w-xs truncate"
                              title={task.Description}
                            >
                              {task.Description}
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getPriorityBadgeStyle(
                                  task.priorityName
                                )}`}
                              >
                                <Flag className="w-2.5 h-2.5" />
                                {task.priorityName}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-slate-500 font-medium">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {new Date(task.startDate).toLocaleDateString(
                                  "en-GB"
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-slate-500 font-medium">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {new Date(task.dueDate).toLocaleDateString(
                                  "en-GB"
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                Week {task.weekNumber}
                              </span>
                            </td>

                            {role === "FACULTY" && (
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() =>
                                      toggleFacultyComplete(task.taskId)
                                    }
                                    className="p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                    title="Toggle Completion"
                                  >
                                    {task.status === "Completed" ? (
                                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-600 transition-colors" />
                                    )}
                                  </button>

                                  <button
                                    onClick={() => toggleEvaluate(task.taskId)}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                                      task.evalution
                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-600 hover:text-indigo-600"
                                    }`}
                                  >
                                    {task.evalution ? (
                                      <>
                                        <Check className="w-3 h-3" /> Evaluated
                                      </>
                                    ) : (
                                      "Evaluate"
                                    )}
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </React.Fragment>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}