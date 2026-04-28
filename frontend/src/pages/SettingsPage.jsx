import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Save, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({ name: user?.name || "" });
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return toast.error("Name is required");
    setSavingProfile(true);
    try {
      const res = await api.put("/users/profile", profileForm);
      updateUser(res.data.data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePassSave = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) return toast.error("Passwords do not match");
    if (passForm.newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    setSavingPass(true);
    try {
      await api.put("/users/password", {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      toast.success("Password changed successfully");
      setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Account</p>
        <h2 className="font-display font-bold text-2xl text-white mt-0.5">Settings</h2>
      </div>

      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center ring-1 ring-brand-500/20">
            <User size={15} className="text-brand-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-sm">Profile</h3>
            <p className="text-xs text-slate-500">Your public identity on FlowDesk</p>
          </div>
        </div>

        {/* Avatar preview */}
        <div className="flex items-center gap-4 mb-5 p-3 bg-surface-2 rounded-xl border border-white/5">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-14 h-14 rounded-xl ring-2 ring-brand-500/20"
          />
          <div>
            <p className="font-medium text-white text-sm">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <p className="text-xs text-slate-600 mt-1">Avatar generated from your name</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Display Name</label>
            <input
              className="input-field"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ name: e.target.value })}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
            <input
              className="input-field opacity-60 cursor-not-allowed"
              value={user?.email}
              disabled
            />
            <p className="text-xs text-slate-600 mt-1">Email cannot be changed</p>
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <Save size={14} />
            {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center ring-1 ring-rose-500/20">
            <Lock size={15} className="text-rose-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-sm">Change Password</h3>
            <p className="text-xs text-slate-500">Keep your account secure</p>
          </div>
        </div>

        <form onSubmit={handlePassSave} className="space-y-4">
          {[
            { key: "currentPassword", label: "Current Password", placeholder: "Your current password" },
            { key: "newPassword",     label: "New Password",     placeholder: "Min. 6 characters" },
            { key: "confirmPassword", label: "Confirm Password", placeholder: "Repeat new password" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">{label}</label>
              <input
                type="password"
                className="input-field"
                placeholder={placeholder}
                value={passForm[key]}
                onChange={(e) => setPassForm((p) => ({ ...p, [key]: e.target.value }))}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={savingPass}
            className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <Lock size={14} />
            {savingPass ? "Updating..." : "Change Password"}
          </button>
        </form>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Zap size={15} className="text-white" />
          </div>
          <div>
            <p className="font-display font-semibold text-white text-sm">FlowDesk</p>
            <p className="text-xs text-slate-500">Version 1.0.0 - Production</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
