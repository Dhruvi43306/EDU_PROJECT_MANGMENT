"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {Bell,Settings,User,Mail,Phone,Briefcase,Calendar,Edit3,Lock,ShieldCheck,Sparkles,
} from "lucide-react";

const USER_API = `${process.env.NEXT_PUBLIC_API_URL}/api/Users/GetUserProfile`;

interface UserProfile {
  userId: number;
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  age: number | null;
  profilePhoto: string;
  roleId: number;
  roleName: string;
  departmentId: number | null;
  departmentName: string;
  createdAt: string | null;
  updatedAt: string | null;
  lastLoginAt: string | null;
}


interface InfoTileProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
  name?: string;
  editMode?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const RequesterProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [user, setUser] = useState<UserProfile>({
    userId: 0,
    userName: "",
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    age: null,
    profilePhoto: "",
    roleId: 0,
    roleName: "",
    departmentId: null,
    departmentName: "",
    createdAt: null,
    updatedAt: null,
    lastLoginAt: null,
  });



  const getUserId = (): number | null => {
    try {
      const storedUserId = localStorage.getItem("userId");

      if (storedUserId) {
        const id = Number(storedUserId);
        if (!isNaN(id) && id > 0) {
          return id;
        }
      }

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const id =
          parsedUser?.userId ??
          parsedUser?.UserId ??
          parsedUser?.userID ??
          parsedUser?.UserID;

        if (id) {
          return Number(id);
        }
      }

      return null;
    } catch (error) {
      console.error("Error getting UserId:", error);
      return null;
    }
  };



  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = getUserId();
      console.log("USER ID:", userId);

      if (!userId) {
        setError("User ID not found. Please login again.");
        return;
      }

      const url = `${USER_API}/${userId}`;
      console.log("USER PROFILE API:", url);

      const token = localStorage.getItem("token");

      const res = await fetch(url, {
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

      console.log("PROFILE STATUS:", res.status);

      const result = await res.json();
      console.log("PROFILE API RESPONSE:", result);

      if (!res.ok) {
        throw new Error(
          result?.message ||
            result?.Message ||
            "Failed to fetch user profile"
        );
      }

      if (result?.success && result?.data) {
        setUser(result.data);
      } else {
        setError("User profile not found.");
      }
    } catch (err: any) {
      console.error("PROFILE ERROR:", err);
      setError(
        err?.message || "Something went wrong while fetching profile."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    if (editMode) {
      console.log("Current edited user:", user);
      alert(
        "Edit values changed locally. Add the PUT UpdateUserProfile API to save changes permanently."
      );
    }
    setEditMode((prev) => !prev);
  };


  useEffect(() => {
    fetchUser();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900/5 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-700 tracking-wide">
            Loading secure workspace...
          </p>
        </div>
      </div>
    );
  }



  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-red-100 rounded-3xl shadow-xl shadow-red-500/5 p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">
            Unable to load profile
          </h2>
          <p className="text-sm text-red-600 mb-6 font-medium leading-relaxed">
            {error}
          </p>
          <button
            onClick={fetchUser}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/25 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-500 selection:text-white">

      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-6 h-18 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20">
            S
          </div>
          <div>
            <h1 className="text-white text-base font-bold tracking-tight">
              User Profile
            </h1>
            <p className="text-[11px] font-medium text-slate-400">
              Account Management Center
            </p>
          </div>
        </div>
      </header>


      <div className="relative h-44 bg-gradient-to-r from-blue-950 via-indigo-900 to-violet-700 overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-20 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/50 border border-slate-100 text-center flex flex-col items-center backdrop-blur-xl">

              <div className="relative group mb-4">
                <div className="w-24 h-24 bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-xl shadow-slate-900/10 overflow-hidden border-4 border-white">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.fullName || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.fullName?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {user.fullName || "User"}
              </h2>
              <div className="mt-2 mb-6">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs px-3.5 py-1.5 rounded-full border border-emerald-200/60 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {user.roleName || "User"}
                </span>
              </div>
              <div className="w-full mb-6 text-left space-y-3.5 text-sm bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium text-xs">User ID</span>
                  <span className="font-bold text-slate-800 text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200/50 shadow-2xs">
                    #{user.userId}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium text-xs">Username</span>
                  <span className="font-bold text-slate-800 text-xs">
                    {user.userName || "-"}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium text-xs">Department</span>
                  <span className="font-bold text-slate-800 text-xs">
                    {user.departmentName || "-"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium text-xs">Status</span>
                  <span className="text-emerald-600 font-extrabold text-xs flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active
                  </span>
                </div>
              </div>


              <div className="w-full space-y-2.5">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-200 shadow-lg shadow-blue-600/25 text-sm active:scale-[0.98]"
                >
                  <Edit3 className="w-4 h-4" />
                  {editMode ? "Save Profile" : "Edit Profile"}
                </button>

                {/* <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-3 px-4 rounded-2xl transition-all duration-200 text-sm shadow-sm active:scale-[0.98]"
                >
                  <Lock className="w-4 h-4 text-slate-400" />
                  Security Settings
                </button> */}
              </div>

            </div>
          </div>

          {/* ============================================================
              RIGHT SIDE INFORMATION
          ============================================================= */}

          <div className="md:col-span-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 h-full backdrop-blur-xl flex flex-col justify-between">

              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                      Account Information
                    </h3>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">
                      Personal parameters and system configurations
                    </p>
                  </div>

                  {editMode && (
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-3.5 py-1 rounded-full animate-bounce">
                      Editing Mode Active
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoTile
                    icon={<User className="w-5 h-5 text-blue-600" />}
                    label="Full Name"
                    value={user.fullName}
                    name="fullName"
                    editMode={editMode}
                    onChange={handleChange}
                  />

                  <InfoTile
                    icon={<Mail className="w-5 h-5 text-blue-600" />}
                    label="Email Address"
                    value={user.email}
                    name="email"
                    editMode={editMode}
                    onChange={handleChange}
                  />

                  <InfoTile
                    icon={<Phone className="w-5 h-5 text-blue-600" />}
                    label="Mobile Number"
                    value={user.phone}
                    name="phone"
                    editMode={editMode}
                    onChange={handleChange}
                  />

                  <InfoTile
                    icon={<Briefcase className="w-5 h-5 text-blue-600" />}
                    label="Role"
                    value={user.roleName}
                  />

                  <InfoTile
                    icon={<Briefcase className="w-5 h-5 text-blue-600" />}
                    label="Department"
                    value={user.departmentName}
                  />

                  <InfoTile
                    icon={<User className="w-5 h-5 text-blue-600" />}
                    label="Gender"
                    value={user.gender}
                  />

                  <InfoTile
                    icon={<Calendar className="w-5 h-5 text-blue-600" />}
                    label="Age"
                    value={user.age ?? "-"}
                  />

                  <InfoTile
                    icon={<Calendar className="w-5 h-5 text-blue-600" />}
                    label="Joined Date"
                    value={
                      user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "-"
                    }
                  />
                </div>
              </div>

              {/* Assistance Box */}

              <div className="mt-8 p-5 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-950 mb-1">
                    Need Assistance?
                  </h4>
                  <p className="text-xs font-medium text-blue-700/80 leading-relaxed">
                    If your department or role information is incorrect, please contact the system administrator.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};


const InfoTile = ({
  icon,
  label,
  value,
  name,
  editMode = false,
  onChange,
}: InfoTileProps) => {
  return (
    <div className="bg-[#fcfdfe] hover:bg-[#f8fafc] border border-slate-200/70 hover:border-slate-300 transition-all duration-200 rounded-2xl p-4 shadow-xs">
      <div className="flex items-start gap-3.5">

        {/* Icon */}

        <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
          {icon}
        </div>

        {/* Content */}

        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            {label}
          </p>

          {editMode && name && onChange ? (
            <input
              type="text"
              name={name}
              value={value ?? ""}
              onChange={onChange}
              className="w-full bg-white border border-blue-400 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none ring-2 ring-blue-500/10 transition-all"
            />
          ) : (
            <p className="text-sm font-extrabold text-slate-800 break-words tracking-tight">
              {value !== null &&
              value !== undefined &&
              value !== ""
                ? value
                : "-"}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default RequesterProfile;