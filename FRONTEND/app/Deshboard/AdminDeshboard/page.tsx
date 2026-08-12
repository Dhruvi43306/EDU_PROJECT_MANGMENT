"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  GraduationCap,
  Building2,
  FileCheck2,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowUpRight,
  Clock,
  ChevronDown,
  Layers,
  Trash2,
  Eye,
  Pencil,
  X,
  UserPlus,
  Radio,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";

const AddFacuty_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Users/AddFaculty`;
const STU_PROJECT_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/StudentProject`;
const User_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Users`;

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

interface Users {
  userId: number;
  FullName: string;
  RoleName: string;
  roleId: number;
}

export default function PremiumAdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();

  const [studentList, setStudentList] = useState<StudentProjectType[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [usersList, setUsersList] = useState<Users[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const [users, setUsers] = useState({
    UserName: "",
    FullName: "",
    Gender: "",
    Age: "",
    email: "",
    RoleId: "",
    DepartmentId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUsers((prev) => ({ ...prev, [name]: value }));
  };

  const fetchStudentProject = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(STU_PROJECT_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch student projects");

      const result = await response.json();
      setStudentList(result.data ?? []);
    } catch (err) {
      console.error("Fetch StudentProject Error:", err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(User_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || "Failed to fetch users.");

      const usersData = result?.data ?? result;
      if (Array.isArray(usersData)) {
        setUsersList(usersData);
      } else {
        setUsersList([]);
      }
    } catch (err) {
      console.error("Fetch Users Error:", err);
      setUsersList([]);
    }
  }, []);

  // Real-time auto-polling setup
  useEffect(() => {
    fetchStudentProject();
    fetchUsers();

    const interval = setInterval(() => {
      fetchStudentProject();
      fetchUsers();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchStudentProject, fetchUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      UserName: users.UserName,
      FullName: users.FullName,
      Gender: users.Gender,
      Age: users.Age,
      email: users.email,
      RoleId: Number(users.RoleId),
      DepartmentId: Number(users.DepartmentId),
    };

    try {
      const response = await fetch(AddFacuty_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: text || "Could not register user",
          customClass: { popup: "rounded-2xl" },
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User Registered Successfully",
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: "rounded-2xl" },
      });

      setShowAddModal(false);
      setUsers({
        UserName: "",
        FullName: "",
        Gender: "",
        Age: "",
        email: "",
        RoleId: "",
        DepartmentId: "",
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong while submitting the form.",
        customClass: { popup: "rounded-2xl" },
      });
    }
  };

  const handleDelete = async (studentId: number) => {
    if (!studentId) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Request",
        text: "Invalid Student ID.",
        customClass: { popup: "rounded-2xl" },
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this student's project record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
      customClass: { popup: "rounded-2xl" },
    });

    if (!result.isConfirmed) return;

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

      const resData = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          resData?.message ??
          resData?.Message ??
          resData?.error ??
          `Delete failed: ${response.status}`;
        throw new Error(errorMessage);
      }

      Swal.fire({
        title: "Deleted!",
        text: "Student project deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "rounded-2xl" },
      });

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
        customClass: { popup: "rounded-2xl" },
      });
    }
  };

  const filteredData = studentList.filter((item) => {
    const matchesSearch =
      item.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.enrollmentno?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      deptFilter === "All" || item.departmentName === deptFilter;
    const matchesStatus =
      statusFilter === "All" || item.statusName === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "Pending Review":
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      default:
        return "bg-indigo-50 text-indigo-700 border-indigo-200/60";
    }
  };

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `w-full group h-10 px-3.5 rounded-xl text-xs font-semibold flex items-center transition-all duration-200 relative ${
      sidebarCollapsed ? "justify-center" : "justify-start"
    } ${
      isActive
        ? "text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm shadow-indigo-100"
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
    }`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-indigo-500 selection:text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-slate-200/60 flex flex-col justify-between relative h-screen transition-all duration-300 ease-in-out z-40 shrink-0 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div>
          <div className="h-16 flex items-center px-5 border-b border-slate-100 gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200/50 shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-slate-900 text-sm">
                  NexusEdu
                </span>
                <span className="text-[10px] font-semibold text-indigo-600 tracking-wider uppercase">
                  Enterprise
                </span>
              </div>
            )}
          </div>

          <nav className="p-4 space-y-1.5">
            <Link
              href="/Deshboard/FacultyDeshboard"
              className={getLinkClass("/Deshboard/FacultyDeshboard")}
              title={sidebarCollapsed ? "Faculty Dashboard" : ""}
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
              title={sidebarCollapsed ? "Project Coordinator" : ""}
            >
              <GraduationCap
                className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                  sidebarCollapsed ? "" : "mr-3"
                }`}
              />
              {!sidebarCollapsed && <span>Project Coordinator</span>}
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
              className={getLinkClass("/Master/project")}
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
              href="/Master/evaluations"
              className={getLinkClass("/Master/evaluations")}
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

        <div className="p-4 border-t border-slate-100 space-y-1.5">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full h-8 rounded-lg bg-slate-50 border border-slate-200/60 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students, identifiers, or project titles..."
                className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-700 outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-600 text-[10px] font-bold">
              <Radio className="h-3 w-3 animate-pulse" />
              <span>LIVE SYNC</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 mx-1" />
            <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
              <Link href="/auth/userProfile">
                <div className="h-9 w-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all">
                  {usersList.length > 0 && usersList[0]?.FullName
                    ? usersList[0].FullName.trim().charAt(0).toUpperCase()
                    : "U"}
                </div>
              </Link>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6 flex-1 max-w-[1600px] w-full mx-auto">
          {/* Welcome Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 md:p-8 shadow-md border border-slate-800">
            <div className="absolute top-0 right-1/4 h-56 w-56 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10 blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1.5">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  Good Morning, System Admin
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  Academic Term:{" "}
                  <span className="text-slate-200 font-semibold">
                    Fall 2026
                  </span>{" "}
                  &bull; Institutional Hub:{" "}
                  <span className="text-slate-200 font-semibold">
                    Apex Engineering University
                  </span>
                </p>
              </div>
              <div className="flex gap-4 bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-3 rounded-xl shrink-0 w-full md:w-auto">
                <div className="px-3 py-1 border-r border-white/10">
                  <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                    Sync Integrity
                  </span>
                  <span className="text-sm font-black text-emerald-400">
                    99.98%
                  </span>
                </div>
                <div className="px-3 py-1">
                  <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                    Queue Load
                  </span>
                  <span className="text-sm font-black text-indigo-400">
                    Nominal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {[
              {
                label: "Total Students",
                value: usersList.filter((d) => Number(d.roleId) === 4).length,
                change: "+12.4%",
                up: true,
                icon: GraduationCap,
                color:
                  "from-blue-500/20 to-indigo-500/20 text-indigo-600 border-indigo-500/10",
                dataPoints: [30, 45, 35, 60, 48, 70, 95],
              },
              {
                label: "Total Faculty",
                value: usersList.filter((d) => Number(d.roleId) === 2).length,
                change: "Stable",
                up: true,
                icon: Users,
                color:
                  "from-purple-500/20 to-pink-500/20 text-purple-600 border-purple-500/10",
                dataPoints: [50, 50, 50, 50, 50, 50, 50],
              },
              {
                label: "Total Projects",
                value: studentList.filter((d) => Number(d.projectId)).length,
                change: "+8.2%",
                up: true,
                icon: Layers,
                color:
                  "from-violet-500/20 to-fuchsia-500/20 text-violet-600 border-violet-500/10",
                dataPoints: [40, 48, 55, 62, 70, 78, 84],
              },
              {
                label: "Active Projects",
                value: studentList.length,
                change: "Live Sync",
                up: true,
                icon: FolderKanban,
                color:
                  "from-cyan-500/20 to-blue-500/20 text-blue-600 border-blue-500/10",
                dataPoints: [20, 40, 30, 60, 50, 70, 50],
              },
              {
                label: "Pending Evaluations",
                value: studentList.filter((d) => d.statusName === "Pending").length,
                change: "Action Required",
                up: false,
                icon: Clock,
                color:
                  "from-amber-500/20 to-orange-500/20 text-amber-600 border-amber-500/10",
                dataPoints: [90, 70, 60, 80, 40, 30, 10],
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-8px_rgba(79,70,229,0.12)] hover:border-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[140px] group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {card.label}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight transition-transform group-hover:scale-[1.02] origin-left duration-200">
                        {card.value}
                      </h3>
                    </div>
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border bg-gradient-to-br ${card.color}`}
                    >
                      <Icon className="h-4 w-4 stroke-[2.5]" />
                    </div>
                  </div>

                  <div className="h-7 flex items-end gap-1 pt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    {card.dataPoints.map((val, i) => (
                      <div
                        key={i}
                        style={{ height: `${val}%` }}
                        className="flex-1 min-w-[2px] rounded-t-sm bg-indigo-600/20 group-hover:bg-indigo-600 transition-all duration-300"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 pt-2 border-t border-slate-100/60">
                    <span
                      className={
                        card.up
                          ? "text-emerald-600 flex items-center"
                          : "text-amber-600 flex items-center"
                      }
                    >
                      {card.up ? (
                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                      ) : (
                        <Clock className="h-3 w-3 mr-0.5" />
                      )}
                      {card.change}
                    </span>
                    <span className="font-mono text-[9px] tracking-tight opacity-80">
                      Telemetry OK
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions Automation */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Instant Workspace Automation
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                {
                  title: "Student Evaluation",
                  desc: "Initialize core record",
                  trigger: () => router.push("/Master/evaluation"),
                  color:
                    "hover:border-indigo-500/30 hover:bg-indigo-50/30 text-indigo-600",
                },
                {
                  title: "Add Project Shell",
                  desc: "Construct framework",
                  trigger: () => router.push("/Master/AddProject"),
                  color:
                    "hover:border-blue-500/30 hover:bg-blue-50/30 text-blue-600",
                },
                {
                  title: "Add Users",
                  desc: "Map authority layers",
                  trigger: () => setShowAddModal(true),
                  color:
                    "hover:border-purple-500/30 hover:bg-purple-50/30 text-purple-600",
                },
              ].map((act, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={act.trigger}
                  className={`border border-slate-200/60 bg-white rounded-xl p-3 text-left transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 ${act.color} group cursor-pointer`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-950 transition-colors">
                      {act.title}
                    </span>
                    <Plus className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                    {act.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Table Matrix */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Active Student System Matrix
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  Verified active infrastructure tracking nodes
                </p>
              </div>

            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/40 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-6">Student & Core Info</th>
                    <th className="py-3 px-6">Research Scope Title</th>
                    <th className="py-3 px-6">OverAll Grade</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredData.length > 0 ? (
                    filteredData.map((student) => (
                      <tr
                        key={student.studentId}
                        className="hover:bg-slate-50/40 transition-colors group"
                      >
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200/60 text-indigo-600 font-bold text-[11px] flex items-center justify-center shrink-0">
                              {student.studentName
                                ? student.studentName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                : "ST"}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800">
                                {student.studentName}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 font-medium">
                                {student.enrollmentno} &bull;{" "}
                                {student.departmentName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 max-w-xs">
                          <p className="font-medium text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                            {student.projectTitle}
                          </p>
                        </td>

                        <td className="py-3.5 px-6 font-semibold text-slate-700">
                          {student.overallGrade || "N/A"}
                        </td>
                        <td className="py-3.5 px-6">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusStyle(
                              student.statusName
                            )}`}
                          >
                            {student.statusName || "Active"}
                          </span>
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                router.push(
                                  `/Master/student/${student.studentId}`
                                );
                              }}
                              className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Edit Entry"
                              onClick={() => {
                                router.push(
                                  `/Master/EditStudentForm/${student.studentId}`
                                );
                              }}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Delete Record"
                              onClick={() => handleDelete(student.studentId)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-slate-400 font-medium bg-slate-50/20"
                      >
                        No matching tracking references found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Register New Faculty/User
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Map system access authority layers
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="UserName"
                    required
                    value={users.UserName}
                    onChange={handleChange}
                    placeholder="johndoe"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="FullName"
                    required
                    value={users.FullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={users.email}
                  onChange={handleChange}
                  placeholder="john@university.edu"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Gender
                  </label>
                  <select
                    name="Gender"
                    required
                    value={users.Gender}
                    onChange={handleChange}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="Age"
                    required
                    value={users.Age}
                    onChange={handleChange}
                    placeholder="35"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Role ID
                  </label>
                  <input
                    type="number"
                    name="RoleId"
                    required
                    value={users.RoleId}
                    onChange={handleChange}
                    placeholder="2 (Faculty)"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Department ID
                  </label>
                  <input
                    type="number"
                    name="DepartmentId"
                    required
                    value={users.DepartmentId}
                    onChange={handleChange}
                    placeholder="1"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 h-9 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 h-9 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-sm"
                >
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}