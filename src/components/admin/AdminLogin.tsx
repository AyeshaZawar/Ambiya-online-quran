import React, { useState, useEffect } from 'react';
import { Lock, Mail, ArrowLeft, KeyRound, CheckCircle2, Shield } from 'lucide-react';
import { authApi } from '../../services/api';
import { AdminUser } from '../../types/cms';
import { Logo } from '../Logo';

interface AdminLoginProps {
  onSuccess: (admin: AdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToSite }) => {
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpOrToken, setOtpOrToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const qIdx = hash.indexOf('?');
    const queryStr = qIdx !== -1 ? hash.slice(qIdx + 1) : window.location.search.replace(/^\?/, '');
    if (queryStr) {
      const params = new URLSearchParams(queryStr);
      const action = params.get('action');
      const token = params.get('token');
      const paramEmail = params.get('email');
      if (action === 'reset-password' && token) {
        setMode('reset');
        setOtpOrToken(token);
        if (paramEmail) setEmail(paramEmail);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { admin } = await authApi.login(email.trim(), password);
      onSuccess(admin);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMsg(null);
    setDevOtpHint(null);
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email.trim());
      setInfoMsg(res.message);
      if (res.devPreviewOtp) {
        setDevOtpHint(res.devPreviewOtp);
      }
      setMode('reset');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMsg(null);
    setLoading(true);
    try {
      const res = await authApi.resetPassword({
        email: email.trim(),
        otpOrToken: otpOrToken.trim(),
        newPassword,
        confirmPassword,
      });
      setInfoMsg(res.message);
      setDevOtpHint(null);
      setPassword('');
      setOtpOrToken('');
      setNewPassword('');
      setConfirmPassword('');
      setMode('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="flex flex-col items-center text-center">
          <Logo size="md" />
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#103b2d]/10 text-[#103b2d] text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-[#b28338]" />
            <span>Academy Admin Portal</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#e5dfd3] shadow-sm p-7 sm:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {infoMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p>{infoMsg}</p>
                {devOtpHint && (
                  <p className="mt-1 font-mono text-[11px] bg-white px-2 py-1 rounded border border-emerald-200 inline-block">
                    Dev Mode OTP (SMTP not configured): <strong>{devOtpHint}</strong>
                  </p>
                )}
              </div>
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#11382b]">Admin Sign In</h1>
                <p className="text-xs text-[#6d7972] mt-1">
                  Manage academy content, blogs, registrations, and inquiries.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#78857f] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@adammohammadacademy.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#78857f] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setInfoMsg(null);
                    setMode('forgot');
                  }}
                  className="text-xs font-semibold text-[#184c3c] hover:text-[#b28338] cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#11382b]">Forgot Password</h1>
                <p className="text-xs text-[#6d7972] mt-1">
                  Enter your registered admin email to receive a 6-digit verification code.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                  Registered Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@adammohammadacademy.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {loading ? 'Sending Verification Code...' : 'Send Reset Verification Code'}
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full py-2 text-xs font-medium text-[#4f5953] hover:text-[#11382b] cursor-pointer"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#11382b]">Reset Password</h1>
                <p className="text-xs text-[#6d7972] mt-1">
                  Enter your verification code and choose a new secure password (min 8 characters).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#78857f] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={otpOrToken}
                    onChange={(e) => setOtpOrToken(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full py-2 text-xs font-medium text-[#4f5953] hover:text-[#11382b] cursor-pointer"
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onBackToSite}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#103b2d] hover:text-[#b28338] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};
