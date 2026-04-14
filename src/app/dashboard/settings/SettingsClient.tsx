"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "confident", label: "Confident" },
  { value: "conversational", label: "Conversational" },
  { value: "executive", label: "Executive" },
];

interface SettingsProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    plan: string;
    defaultTone: string;
    stripeCustomerId: string | null;
  };
}

export default function SettingsClient({ user }: SettingsProps) {
  const { update } = useSession();
  const { showToast } = useToast();

  // Profile
  const [name, setName] = useState(user.name || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Preferences
  const [defaultTone, setDefaultTone] = useState(user.defaultTone || "professional");
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Danger zone
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Billing
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      await update({ name });
      showToast("Profile updated.", "success");
    } catch {
      showToast("Failed to update profile.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultTone }),
      });
      if (!res.ok) throw new Error();
      showToast("Preferences saved.", "success");
    } catch {
      showToast("Failed to save preferences.", "error");
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters.", "error");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password updated.", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to change password.", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleUpgrade = async () => {
    setLoadingCheckout(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      showToast("Failed to start checkout.", "error");
      setLoadingCheckout(false);
    }
  };

  const handleManageBilling = async () => {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      showToast("Failed to open billing portal.", "error");
      setLoadingPortal(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      if (!res.ok) throw new Error();
      window.location.href = "/";
    } catch {
      showToast("Failed to delete account.", "error");
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <Input value={user.email} disabled />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={savingProfile}>
              {savingProfile ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Current Password</label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Confirm New Password</label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleChangePassword} disabled={savingPassword || !currentPassword || !newPassword}>
              {savingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Default settings for new optimizations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Default Tone</label>
            <Select
              value={defaultTone}
              onChange={(e) => setDefaultTone(e.target.value)}
              options={TONE_OPTIONS}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSavePreferences} disabled={savingPrefs}>
              {savingPrefs ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your plan and billing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Badge variant={user.plan === "pro" ? "success" : "secondary"}>
                {user.plan === "pro" ? "Pro" : "Free"}
              </Badge>
              <span className="text-sm text-gray-600">
                {user.plan === "pro"
                  ? "Unlimited optimizations, PDF export, detailed scores"
                  : "3 optimizations per month"}
              </span>
            </div>
            {user.plan === "pro" ? (
              <Button variant="outline" onClick={handleManageBilling} disabled={loadingPortal}>
                {loadingPortal ? "Loading..." : "Manage Billing"}
              </Button>
            ) : (
              <Button onClick={handleUpgrade} disabled={loadingCheckout}>
                {loadingCheckout ? "Loading..." : "Upgrade to Pro — $19/mo"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-500">
                Permanently delete your account and all data.
              </p>
            </div>
            <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account">
        <p className="text-sm text-gray-600 mb-4">
          This will permanently delete your account, all optimizations, and cancel any active subscriptions.
          This action <strong>cannot be undone</strong>.
        </p>
        <p className="text-sm text-gray-600 mb-2">
          Type <strong>DELETE</strong> to confirm:
        </p>
        <Input
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          placeholder="DELETE"
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleteConfirm !== "DELETE" || deleting}
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
