import React, { useState } from 'react';
import { User, Mail, Lock, KeyRound, LogOut, CheckCircle2, ShieldCheck } from 'lucide-react';
import { authApi } from '../../services/api';
import { AdminUser } from '../../types/cms';

interface AccountSettingsSectionProps {
  admin: AdminUser;
  onAdminUpdated: (admin: AdminUser) => void;
  onLogout: () => void;
}

export const AccountSettingsSection: React.FC<AccountSettingsSectionProps> = ({
  admin,
  onAdminUpdated,
  onLogout,
}) => {
  const [name, setName] = useState(admin.name);
  const [savingProfile, setSavingProfile] = useState(false);

  // Change Email state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmNewEmail, setConfirmNewEmail] = useState('');
  const [changingEmail, setChangingEmail] = useState(false);

  // Change Password via Email Verification OTP state
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpOrToken, setOtpOrToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // Forgot Password quick trigger
  const [sendingReset, setSendingReset] = useState(false);

  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const flashSuccess = (msg: string) => {
    setErrorMsg(null);
    setStatusMsg(msg);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setErrorMsg(null);
    try {
      const res = await authApi.updateProfile(name.trim());
      onAdminUpdated(res.admin);
      flashSuccess(res.message);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingEmail(true);
    setErrorMsg(null);
    try {
      const res = await authApi.changeEmail({
        currentPassword,
        newEmail: newEmail.trim(),
        confirmNewEmail: confirmNewEmail.trim(),
      });
      onAdminUpdated(res.admin);
      setCurrentPassword('');
      setNewEmail('');
      setConfirmNewEmail('');
      flashSuccess(res.message);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update email address.');
    } finally {
      setChangingEmail(false);
    }
  };

  const handleRequestPasswordOtp = async () => {
    setErrorMsg(null);
    setDevOtpHint(null);
    setChangingPassword(true);
    try {
      const res = await authApi.requestPasswordChangeOtp();
      setOtpRequested(true);
      if (res.devPreviewOtp) setDevOtpHint(res.devPreviewOtp);
      flashSuccess(res.message);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send verification code.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleConfirmPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setChangingPassword(true);
    try {
      const res = await authApi.confirmPasswordChange({
        otpOrToken: otpOrToken.trim(),
        newPassword,
        confirmPassword,
      });
      setOtpRequested(false);
      setOtpOrToken('');
      setNewPassword('');
      setConfirmPassword('');
      setDevOtpHint(null);
      flashSuccess(res.message);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSendForgotResetLink = async () => {
    setSendingReset(true);
    setErrorMsg(null);
    setDevOtpHint(null);
    try {
      const res = await authApi.forgotPassword(admin.email);
      if (res.devPreviewOtp) setDevOtpHint(res.devPreviewOtp);
      flashSuccess(res.message);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to initiate password reset.');
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#11382b]">Account Settings</h2>
          <p className="text-xs text-[#6d7972] mt-1">
            Manage your administrator profile, email address, password verification, and session.
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold space-y-1.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
          {devOtpHint && (
            <p className="font-mono text-[11px] bg-white px-2.5 py-1 rounded border border-emerald-200 inline-block">
              Dev Mode Verification Code (SMTP not configured): <strong>{devOtpHint}</strong>
            </p>
          )}
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* 1. Admin Profile Information */}
      <form onSubmit={handleUpdateProfile} className="bg-white rounded-2xl border border-[#e5dfd3] p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-[#efeae0] pb-3">
          <User className="w-5 h-5 text-[#184c3c]" />
          <h3 className="font-serif text-lg font-bold text-[#11382b]">Admin Profile Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Display Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Registered Email</label>
            <input
              type="text"
              disabled
              value={admin.email}
              className="w-full px-3.5 py-2.5 rounded-lg bg-stone-100 border border-[#d6cfc1] text-sm text-[#55635c]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6d7972]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#184c3c]" />
            Role: <strong className="uppercase">{admin.role}</strong>
            {admin.lastLoginAt && ` · Last sign-in: ${new Date(admin.lastLoginAt).toLocaleString()}`}
          </span>
          <button
            type="submit"
            disabled={savingProfile}
            className="px-4 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer"
          >
            {savingProfile ? 'Saving...' : 'Update Profile'}
          </button>
        </div>
      </form>

      {/* 2. Change Email Address */}
      <form onSubmit={handleChangeEmail} className="bg-white rounded-2xl border border-[#e5dfd3] p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-[#efeae0] pb-3">
          <Mail className="w-5 h-5 text-[#184c3c]" />
          <div>
            <h3 className="font-serif text-lg font-bold text-[#11382b]">Change Email Address</h3>
            <p className="text-xs text-[#6d7972]">Requires current password verification and confirmation of the new email address.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Current Password *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">New Email Address *</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Confirm New Email *</label>
            <input
              type="email"
              required
              value={confirmNewEmail}
              onChange={(e) => setConfirmNewEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={changingEmail}
            className="px-4 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer"
          >
            {changingEmail ? 'Updating Email...' : 'Update Email Address'}
          </button>
        </div>
      </form>

      {/* 3. Change Password (Email OTP Verification) & Forgot Password */}
      <div className="bg-white rounded-2xl border border-[#e5dfd3] p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efeae0] pb-3">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-[#184c3c]" />
            <div>
              <h3 className="font-serif text-lg font-bold text-[#11382b]">Change Password (Email Verification)</h3>
              <p className="text-xs text-[#6d7972]">
                Password updates require a secure, expiring 6-digit OTP sent to {admin.email}.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={sendingReset}
            onClick={handleSendForgotResetLink}
            className="text-xs font-semibold text-[#184c3c] hover:text-[#b28338] cursor-pointer"
          >
            {sendingReset ? 'Sending...' : 'Send Forgot Password Reset Code'}
          </button>
        </div>

        {!otpRequested ? (
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FAF7F2] p-4 rounded-xl border border-[#e5dfd3]">
            <p className="text-xs text-[#4f5953]">
              Step 1: Request a verification code to your registered email address (<strong>{admin.email}</strong>).
            </p>
            <button
              type="button"
              disabled={changingPassword}
              onClick={handleRequestPasswordOtp}
              className="px-4 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer"
            >
              {changingPassword ? 'Sending Code...' : 'Send Verification OTP'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleConfirmPasswordChange} className="space-y-4 bg-[#FAF7F2] p-5 rounded-xl border border-[#e5dfd3]">
            <p className="text-xs font-semibold text-[#11382b]">
              Step 2: Enter the 6-digit verification code sent to {admin.email} and your new password.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">6-Digit OTP *</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#78857f] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={otpOrToken}
                    onChange={(e) => setOtpOrToken(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOtpRequested(false)}
                className="px-4 py-2 rounded-lg border border-[#d6cfc1] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={changingPassword}
                className="px-5 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer"
              >
                {changingPassword ? 'Verifying & Saving...' : 'Confirm Password Change'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
