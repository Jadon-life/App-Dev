"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { User, Mail, Shield, Copy, Check, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, isUpdating } = useProfile();
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const [nameEditing, setNameEditing] = useState(false);

  const studentId = user?.id || "";

  const copyStudentId = () => {
    navigator.clipboard.writeText(studentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNameSave = () => {
    if (name.trim()) {
      updateProfile({ name: name.trim() });
      setNameEditing(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-primary mb-6">Settings</h1>

      {/* Account Section */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-text-light mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-secondary" />
          Account
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Display Name
            </label>
            {nameEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Your name"
                />
                <button
                  onClick={handleNameSave}
                  disabled={isUpdating}
                  className="btn-primary text-sm px-4"
                >
                  {isUpdating ? "..." : "Save"}
                </button>
                <button
                  onClick={() => setNameEditing(false)}
                  className="btn-secondary text-sm px-4"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-text-light">
                  {profile?.name || user?.user_metadata?.full_name || "Not set"}
                </p>
                <button
                  onClick={() => {
                    setName(profile?.name || "");
                    setNameEditing(true);
                  }}
                  className="text-secondary text-sm hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Email Address
            </label>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <p className="text-text-light">{user?.email}</p>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Account Type
            </label>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <p className="text-text-light capitalize">
                {profile?.role || "Student"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Student ID Section (for parent linking — Doc 03) */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-text-light mb-2">
          Your Student ID
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          Share this ID with your parent so they can link to your account and
          monitor your progress.
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-gray-50 border border-gray-200 rounded-btn px-3 py-2 text-sm font-mono text-text-light truncate">
            {studentId}
          </code>
          <button
            onClick={copyStudentId}
            className="btn-secondary text-sm px-3 py-2 flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-success" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Logout Section */}
      <div className="card border-danger/20">
        <h2 className="text-lg font-semibold text-text-light mb-2">
          Sign Out
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          You will be redirected to the landing page.
        </p>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2.5 rounded-btn border border-danger text-danger hover:bg-danger/10 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
