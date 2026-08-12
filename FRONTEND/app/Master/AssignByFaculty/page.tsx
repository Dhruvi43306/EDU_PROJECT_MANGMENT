"use client";

import React, { useEffect, useState } from "react";

const STU_PROJECT_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/StudentProject`;
const ASSIGN_COORDINATOR_URL =`${process.env.NEXT_PUBLIC_API_URL}/api/StudentProject/AssignCoordinator`;
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
}

interface Users {
  userId: number;
  FullName: string;
  RoleName: string;
  RoleId: number;
}

export default function FacultyAssignmentForm() {
  const [studentProjectId, setStudentProjectId] = useState<number | null>(null);
  const [studentProject, setStudentProject] =useState<StudentProjectType | null>(null);
  const [facultyList, setFacultyList] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [facultyLoading, setFacultyLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [assignForm, setAssignForm] = useState({
    studentName: "",
    projectName: "",
    facultyId: "",
    assignDate: "",
    RoleId: "",
  });


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const id = params.get("studnetProjectId");

    console.log("URL StudentProjectId:", id);

    if (!id) {
      console.error("studnetProjectId not found in URL");

      alert("Student Project ID not found.");

      setLoading(false);

      return;
    }

    const numericId = Number(id);

    if (Number.isNaN(numericId)) {
      console.error("Invalid Student Project ID:", id);

      alert("Invalid Student Project ID.");

      setLoading(false);

      return;
    }

    setStudentProjectId(numericId);
  }, []);


  const fetchStudentProject = async (id: number) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const res = await fetch(STU_PROJECT_BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      console.log("StudentProject API Status:", res.status);

      const result = await res.json().catch(() => null);

      console.log("StudentProject RAW Response:", result);

      if (!res.ok) {
        throw new Error(
          result?.message ||
            `Failed to fetch student projects. Status: ${res.status}`,
        );
      }
      const projectsData = result?.data ?? result;

      console.log("StudentProject DATA:", projectsData);

      if (!Array.isArray(projectsData)) {
        console.error(
          "Expected StudentProject array but received:",
          projectsData,
        );

        throw new Error("StudentProject API did not return a list.");
      }

      const selectedProject = projectsData.find((item: any) => {
        const currentId =
          item.studnetProjectId ??
          item.studentProjectId ??
          item.StudnetProjectId ??
          item.StudentProjectId;

        console.log("Checking StudentProject ID:", currentId, "against:", id);

        return Number(currentId) === Number(id);
      });

      console.log("SELECTED STUDENT PROJECT:", selectedProject);

      if (!selectedProject) {
        console.error("Student project ID was not found in API result:", id);

        console.log(
          "Available StudentProject IDs:",
          projectsData.map((item: any) => ({
            studnetProjectId:
              item.studnetProjectId ??
              item.studentProjectId ??
              item.StudnetProjectId ??
              item.StudentProjectId,
            studentName: item.studentName ?? item.StudentName,
            projectTitle: item.projectTitle ?? item.ProjectTitle,
          })),
        );

        throw new Error(`Student project with ID ${id} was not found.`);
      }

      const data = selectedProject;

      const normalizedData: StudentProjectType = {
        studnetProjectId: Number(
          data.studnetProjectId ??
            data.studentProjectId ??
            data.StudnetProjectId ??
            data.StudentProjectId ??
            id,
        ),

      studentId: Number(data.studentId ?? data.StudentId ?? 0),
      studentName:data.studentName ??data.StudentName ??data.student?.studentName ??data.student?.StudentName ??"",
      studentCode: data.studentCode ?? data.StudentCode ?? "",
      projectId: Number(data.projectId ?? data.ProjectId ?? 0),
      projectTitle:data.projectTitle ??data.ProjectTitle ??data.project?.projectTitle ??data.project?.ProjectTitle ??"",
      enrollmentno:data.enrollmentno ?? data.Enrollmentno ?? data.EnrollmentNo ?? "",
      semester: Number(data.semester ?? data.Semester ?? 0),
      batch: Number(data.batch ?? data.Batch ?? 0),
      academicyear: Number(data.Academicyear ??data.AcademicYear ??0,),
      cpi: Number(data.cpi ?? data.CPI ?? 0),
      departmentId: Number(data.departmentId ?? data.DepartmentId ?? 0),
      departmentName:data.departmentName ??data.DepartmentName ??data.department?.departmentName ??data.department?.DepartmentName ??"",
      statusId: Number(data.statusId ??  0),
      statusName: data.statusName ?? "",
      coordinator: data.coordinator ?? data.Coordinator ?? "",
      coordinatorId: data.coordinatorId ?? data.CoordinatorId ?? null,
      approvedBy: data.approvedBy ?? data.ApprovedBy ?? "",
      approvedByUserId:data.approvedByUserId ?? data.ApprovedByUserId ?? null,
      approvedDate: data.approvedDate ?? data.ApprovedDate ?? null,
      assignedDate: data.assignedDate ?? data.AssignedDate ?? null,
      };

      setStudentProject(normalizedData);

      setAssignForm({
      studentName: normalizedData.studentName,
      projectName: normalizedData.projectTitle,
      facultyId: "",
      assignDate: normalizedData.assignedDate? normalizedData.assignedDate.substring(0, 10)
          : new Date().toISOString().split("T")[0],
      RoleId: "",
      });
    } catch (err) {
      console.error("Fetch StudentProject Error:", err);
    alert(
        err instanceof Error ? err.message : "Failed to load student project.",
      );
    } finally {
      setLoading(false);
    }
  };


  const fetchUsers = async () => {
  try {
    setFacultyLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(User_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    });

  console.log("Users API Status:", res.status);
  const result = await res.json().catch(() => null);
  console.log("Users RAW Response:", result);
    if (!res.ok) {
      throw new Error(
        result?.message ||
          result?.Message ||
          `Failed to fetch users. Status: ${res.status}`
      );
    }

    const usersData = result?.data ?? result;

    console.log("USERS DATA:", usersData);

    if (!Array.isArray(usersData)) {
      console.error(
        "Users data is not an array:",
        usersData
      );

      setFacultyList([]);

      return;
    }

    const normalizedUsers: Users[] = usersData.map(
      (user: any) => ({
        userId: Number(
          user.userId ??
          user.UserId ??
          0
        ),

        FullName:
          user.fullName ??
          user.FullName ??
          "",

        RoleName:
          user.roleName ??
          user.RoleName ??
          "",

        RoleId: Number(
          user.roleId ??
          user.RoleId ??
          0
        ),
      })
    );

    console.log(
      "NORMALIZED USERS:",
      normalizedUsers
    );


    const facultyUsers =
      normalizedUsers.filter(
        (user) =>
          user.RoleId === 3 ||
          user.RoleName
            .trim()
            .toLowerCase() === "project coordinator"
      );

    console.log(
      "FACULTY USERS:",
      facultyUsers
    );

    setFacultyList(facultyUsers);
  } catch (err) {
    console.error(
      "Fetch Users Error:",
      err
    );

    alert(
      err instanceof Error
        ? err.message
        : "Failed to load faculty users."
    );

    setFacultyList([]);
  } finally {
    setFacultyLoading(false);
  }
};

  useEffect(() => {
    if (studentProjectId === null) {
      return;
    }
    fetchStudentProject(studentProjectId);
    fetchUsers();
  }, [studentProjectId]);


  const handleAssignSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (studentProjectId === null) {
    alert("Student Project ID not found.");
    return;
  }

  if (!studentProject) {
    alert("Student project information not loaded.");
    return;
  }

  if (!assignForm.studentName) {
    alert("Student information not found.");
    return;
  }

  if (!assignForm.projectName) {
    alert("Project information not found.");
    return;
  }

  if (!assignForm.facultyId) {
    alert("Please select a faculty.");
    return;
  }

  if (!assignForm.assignDate) {
    alert("Please select assign date.");
    return;
  }

  const statusText = String(studentProject.statusName ?? "")
    .trim()
    .toLowerCase();

  console.log("Student Status:", statusText);

  if (!statusText.includes("approved")) {
    alert(
      "This student project is not approved yet. Faculty can only be assigned after approval."
    );
    return;
  }

  try {
    setAssigning(true);

    const token = localStorage.getItem("token");

    const coordinatorId = Number(assignForm.facultyId);

    if (!coordinatorId || coordinatorId <= 0) {
      alert("Invalid faculty selected.");
      return;
    }

    // ============================================================
    // BACKEND EXPECTS:
    //
    // PUT /api/StudentProject/AssignCoordinator/{studentProjectId}
    // ?coordinatorId={facultyId}
    // ============================================================

    const requestUrl =
      `${ASSIGN_COORDINATOR_URL}/${studentProjectId}` +
      `?coordinatorId=${coordinatorId}`;

    console.log("====================================");
    console.log("Assign Faculty URL:", requestUrl);
    console.log("StudentProjectId:", studentProjectId);
    console.log("CoordinatorId:", coordinatorId);
    console.log("====================================");

    const res = await fetch(requestUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    });

    const result = await res.json().catch(() => null);

    console.log("Assign Faculty Status:", res.status);
    console.log("Assign Faculty Response:", result);

    if (!res.ok) {
      throw new Error(
        result?.message ||
          result?.Message ||
          `Failed to assign faculty. Status: ${res.status}`
      );
    }

    alert(
      "Faculty assigned by Project Coordinator successfully!"
    );

    const selectedFaculty = facultyList.find(
      (faculty) =>
        Number(faculty.userId) === coordinatorId
    );

    if (selectedFaculty) {
      setStudentProject((prev) =>
        prev
          ? {
              ...prev,
              coordinatorId: selectedFaculty.userId,
              coordinator:
                selectedFaculty.FullName,
                
              assignedDate: new Date().toISOString(),
              statusId: 14,
              statusName: "Assigned",
            }
          : prev
      );
    }

    // Reset only faculty selection
    setAssignForm((prev) => ({
      ...prev,
      facultyId: "",
    }));
  } catch (err) {
    console.error("Assign Faculty Error:", err);

    alert(
      err instanceof Error
        ? err.message
        : "Failed to assign faculty."
    );
  } finally {
    setAssigning(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        {/* Header */}
        <header className="border-b border-slate-200 pb-4">
          <h1 className="text-xl font-bold text-slate-900">
            Assign Project by Faculty
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Fill in the details below to map a project and student to a faculty
            supervisor.
          </p>
        </header>

        {/* Loading Student Project */}
        {loading ? (
          <div className="text-center py-6 text-sm text-slate-500">
            Loading student project...
          </div>
        ) : (
          <>
            {/* Assignment Form */}
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              {/* Student Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Student Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={assignForm.studentName}
                  readOnly
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-50 focus:outline-none"
                  required
                />
              </div>

              {/* Project Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Project Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. Smart Campus Management"
                  value={assignForm.projectName}
                  readOnly
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-50 focus:outline-none"
                  required
                />
              </div>

              {/* Faculty Dropdown */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Select Faculty <span className="text-red-500">*</span>
                </label>

                <select
                  value={assignForm.facultyId}
                  onChange={(e) =>
                    setAssignForm({
                      ...assignForm,
                      facultyId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  required
                  disabled={facultyLoading}
                >
                  <option value="">
                    {facultyLoading
                      ? "Loading Faculty..."
                      : "-- Select Assigned Faculty --"}
                  </option>

                  {facultyList.map((faculty) => (
                    <option key={faculty.userId} value={faculty.userId}>
                      {faculty.FullName}
                    </option>
                  ))}
                </select>

                {!facultyLoading && facultyList.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    No Faculty users found.
                  </p>
                )}
              </div>

              {/* Assign Date */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Assign Date <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  value={assignForm.assignDate}
                  onChange={(e) =>
                    setAssignForm({
                      ...assignForm,
                      assignDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  assigning ||
                  loading ||
                  facultyLoading ||
                  facultyList.length === 0 ||
                  !assignForm.studentName ||
                  !assignForm.projectName
                }
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg transition-colors shadow-sm mt-4"
              >
                {assigning ? "Assigning Faculty..." : "Assign Faculty"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
