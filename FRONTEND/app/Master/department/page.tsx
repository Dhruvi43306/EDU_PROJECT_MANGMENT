"use client";
import React, { useState, useEffect } from "react";
import {Plus,Search,Edit2,Trash2,Building2,X,RefreshCw,ShieldCheck,
} from "lucide-react";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/department`;

const DEPARTMENT_OPTIONS = [
  "Computer Engineering",
  "Information Technology",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Electronics & Communication",
];

// Frontend-only color configurations
const DEPARTMENT_COLORS: Record<
  string,
  {
    border: string;
    bg: string;
    text: string;
    tag: string;
  }
> = {
  "Computer Engineering": {
    border: "border-blue-200 hover:border-blue-400",
    bg: "bg-blue-50/30",
    text: "text-blue-900",
    tag: "bg-blue-100 text-blue-800",
  },

  "Information Technology": {
    border: "border-emerald-200 hover:border-emerald-400",
    bg: "bg-emerald-50/30",
    text: "text-emerald-900",
    tag: "bg-emerald-100 text-emerald-800",
  },

  "Mechanical Engineering": {
    border: "border-purple-200 hover:border-purple-400",
    bg: "bg-purple-50/30",
    text: "text-purple-900",
    tag: "bg-purple-100 text-purple-800",
  },

  "Civil Engineering": {
    border: "border-amber-200 hover:border-amber-400",
    bg: "bg-amber-50/30",
    text: "text-amber-900",
    tag: "bg-amber-100 text-amber-800",
  },

  "Electrical Engineering": {
    border: "border-pink-200 hover:border-pink-400",
    bg: "bg-pink-50/30",
    text: "text-pink-900",
    tag: "bg-pink-100 text-pink-800",
  },

  "Electronics & Communication": {
    border: "border-cyan-200 hover:border-cyan-400",
    bg: "bg-cyan-50/30",
    text: "text-cyan-900",
    tag: "bg-cyan-100 text-cyan-800",
  },

  default: {
    border: "border-slate-200 hover:border-slate-400",
    bg: "bg-slate-50/30",
    text: "text-slate-900",
    tag: "bg-slate-100 text-slate-800",
  },
};

interface Department {
  departmentId?: number;
  departmentid?: number;

  departmentCode?: string;
  departmentcode?: string;

  departmentName?: string;
  departmentname?: string;

  description?: string;
}

interface DepartmentApiResponse {
  success: boolean;
  message: string;
  data: Department[];
}

export default function DepartmentMasterPage() {
  const [departmentsList, setDepartmentsList] = useState<Department[]>([]);

  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    departmentid: "",
    departmentcode: "",
    departmentname: "",
    description: "",
  });

  const getDepartment = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Department API Error:", errorText);

        throw new Error(
          `Failed to load departments. Status: ${response.status}`,
        );
      }

      const result: DepartmentApiResponse = await response.json();

      console.log("Department API Response:", result);
      console.log("Department Data:", result.data);
      setDepartmentsList(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Fetch Department Error:", err);
      setDepartmentsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
     
      const payload = {
        DepartmentId: editId ? Number(editId) : 0,
        DepartmentCode: formData.departmentcode,
        DepartmentName: formData.departmentname,
        Description: formData.description,
      };

      console.log("Department Payload:", payload);

      let result: Response;

      if (editId) {
        // UPDATE
        result = await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        // ADD
        result = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      const responseText = await result.text();

      let data: any = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = null;
        }
      }

      console.log("Save Department Response:", data);

      if (result.ok) {
        setIsModalOpen(false);
        setEditId(null);
        setIsEditing(false);

        setFormData({
          departmentid: "",
          departmentcode: "",
          departmentname: "",
          description: "",
        });

        await getDepartment();
      } else {
        alert(
          data?.message ||
            data?.Message ||
            "Operation failed. Please check the backend.",
        );
      }
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Something went wrong while saving department.");
    }
  };

  const deleteDepartment = async (id: number) => {
    if (
      typeof window !== "undefined" &&
      window.confirm(
        "Are you sure you want to permanently delete this department entry?",
      )
    ) {
      try {
        const result = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseText = await result.text();

        let data: any = null;

        if (responseText) {
          try {
            data = JSON.parse(responseText);
          } catch {
            data = null;
          }
        }

        console.log("Delete Department Response:", data);

        if (result.ok) {
          await getDepartment();
        } else {
          alert(
            data?.message ||
              data?.Message ||
              "Could not complete target data destruction step.",
          );
        }
      } catch (err) {
        console.error("Deletion lifecycle failure:", err);
        alert("Something went wrong while deleting department.");
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    getDepartment();
  }, []);

  const triggerReload = () => {
    getDepartment();
  };

  const openModal = (dept: Department | null = null) => {
    if (dept) {
      const id = dept.departmentId || dept.departmentid || 0;

      const code = dept.departmentCode || dept.departmentcode || "";

      const name = dept.departmentName || dept.departmentname || "";

      setFormData({
        departmentid: String(id),
        departmentcode: code,
        departmentname: name,
        description: dept.description || "",
      });

      setEditId(id);
      setIsEditing(true);
    } else {
      setFormData({
        departmentid: "",
        departmentcode: "",
        departmentname: "",
        description: "",
      });

      setEditId(null);
      setIsEditing(false);
    }

    setIsModalOpen(true);
  };

  const uniqueDeptCodes = Array.from(
    new Set(
      departmentsList
        .map((d) => d.departmentName || d.departmentname || "")
        .filter(Boolean),
    ),
  );

  const filteredDepartments = departmentsList
    .filter((d) => {
      const name = (d.departmentName || d.departmentname || "").toLowerCase();

      const code = (d.departmentCode || d.departmentcode || "").toLowerCase();

      const desc = (d.description || "").toLowerCase();

      const query = search.toLowerCase();

      const matchesSearch =
        name.includes(query) || code.includes(query) || desc.includes(query);

      if (filterGroup !== "all") {
        const currentName = d.departmentName || d.departmentname || "";

        return matchesSearch && currentName === filterGroup;
      }

      return matchesSearch;
    })
    .sort((a, b) => {
      const nameA = a.departmentName || a.departmentname || "";

      const nameB = b.departmentName || b.departmentname || "";

      const codeA = a.departmentCode || a.departmentcode || "";

      const codeB = b.departmentCode || b.departmentcode || "";

      if (sortBy === "name") {
        return nameA.localeCompare(nameB);
      }

      if (sortBy === "code") {
        return codeA.localeCompare(codeB);
      }

      return 0;
    });
  

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 relative overflow-hidden font-sans antialiased selection:bg-blue-500/20 selection:text-blue-600">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-400/20 to-indigo-400/15 blur-[120px] pointer-events-none" />

      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-400/10 to-emerald-400/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 relative z-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6 transition-all duration-300">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-blue-600 mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
              EduProject System Configuration
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 bg-clip-text text-transparent">
              Department Master
            </h1>

            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Configure and modify persistent structural academic department
              indexes
            </p>
          </div>

          <button
            onClick={() => openModal(null)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group self-start md:self-auto"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            Add Department
          </button>
        </header>

        <section className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />

            <input
              type="text"
              placeholder="Search code, name, or descriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50/50 border border-slate-200/60 focus:border-blue-500 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-slate-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer font-medium hover:border-slate-300"
            >
              <option value="all">All Departments</option>

              {uniqueDeptCodes.map((code) => (
                <option key={code} value={code}>
                  {code} Division
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300"
            >
              <option value="name">Sort by Name (A-Z)</option>

              <option value="code">Sort by Code (A-Z)</option>
            </select>

            <button
              onClick={triggerReload}
              className="p-1.5 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-500 hover:text-slate-700 transition-all bg-white hover:bg-slate-50 active:scale-95"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </section>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="border border-slate-100 bg-white rounded-2xl p-4 space-y-3 animate-pulse h-40 shadow-sm"
              />
            ))}
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="border border-dashed border-slate-300 bg-white/40 backdrop-blur-sm rounded-3xl p-10 text-center flex flex-col items-center justify-center max-w-sm mx-auto mt-6 shadow-sm">
            <Building2 className="w-7 h-7 text-blue-500 mb-2 animate-bounce" />

            <h3 className="text-md font-bold text-slate-900 mb-1">
              No Departments Located
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map((dept, index) => {
              const currentId = dept.departmentId || dept.departmentid || 0;

              const currentName =
                dept.departmentName || dept.departmentname || "";

              const colorConfig =
                DEPARTMENT_COLORS[currentName] || DEPARTMENT_COLORS["default"];

              return (
                <div
                  key={currentId || index}
                  className={`group relative border rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] flex flex-col justify-between overflow-hidden bg-white ${colorConfig.border} ${colorConfig.bg}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono opacity-45 font-medium group-hover:opacity-70 transition-opacity">
                        ID: #{currentId}
                      </span>

                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${colorConfig.tag}`}
                      >
                        Division Setup
                      </span>
                    </div>

                    <h3
                      className={`text-md font-bold tracking-tight mb-1.5 leading-snug transition-colors duration-300 ${colorConfig.text}`}
                    >
                      {currentName}
                    </h3>

                    <p className="text-xs leading-relaxed font-normal mb-3 line-clamp-2 transition-colors duration-300 text-slate-600">
                      {dept.description || (
                        <span className="italic opacity-50">
                          No structural dynamic context description provided.
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-950/5 mt-auto bg-transparent">
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => openModal(dept)}
                        className="p-1.5 hover:bg-black/5 active:scale-90 rounded-lg transition-all text-slate-600 hover:text-blue-600"
                        title="Edit Module Profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteDepartment(currentId)}
                        className="p-1.5 hover:bg-black/5 active:scale-90 rounded-lg transition-all text-slate-400 hover:text-rose-600"
                        title="Delete Profile Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto font-sans">
            <div
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
              onClick={() => setIsModalOpen(false)}
            />

            <form
              id="department-form"
              onSubmit={handleSubmit}
              className="relative bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50">
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                    {isEditing
                      ? "✏️ Edit Department Profile"
                      : "✨ Create Department Node"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-xl active:scale-95 transition-transform"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                <div className="grid grid-cols-3 gap-3"></div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    DeptName *
                  </label>

                  <select
                    required
                    value={formData.departmentname}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departmentname: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 focus:border-blue-500 rounded-xl text-xs bg-slate-50/50 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer text-slate-800"
                  >
                    <option value="" disabled>
                      Select Department
                    </option>

                    {DEPARTMENT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Description
                  </label>

                  <textarea
                    rows={2}
                    placeholder="Context notes..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 focus:border-blue-500 rounded-xl text-xs resize-none bg-slate-50/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/80 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-200 hover:bg-white text-slate-600 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  {isEditing ? "Save Changes" : "Create Node"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
