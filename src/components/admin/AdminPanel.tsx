import React, { useState, useEffect } from 'react';
import {
  FileEdit,
  BookOpen,
  Users,
  Settings,
  ArrowLeft,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { authApi } from '../../services/api';
import { AdminUser } from '../../types/cms';
import { AdminLogin } from './AdminLogin';
import { EditContentSection } from './EditContentSection';
import { BlogManagementSection } from './BlogManagementSection';
import { UsersMessagesSection } from './UsersMessagesSection';
import { AccountSettingsSection } from './AccountSettingsSection';
import { Logo } from '../Logo';

type AdminSidebarSection = 'edit-content' | 'blogs' | 'users-messages' | 'account-settings';

interface AdminPanelProps {
  onExitAdmin: () => void;
  onDataUpdated: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExitAdmin, onDataUpdated }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeSection, setActiveSection] = useState<AdminSidebarSection>('edit-content');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    authApi
      .me()
      .then((res) => setAdmin(res.admin))
      .catch(() => setAdmin(null))
      .finally(() => setCheckingAuth(false));

    const handleExpired = () => {
      setAdmin(null);
    };
    window.addEventListener('amqa-auth-expired', handleExpired);
    return () => {
      window.removeEventListener('amqa-auth-expired', handleExpired);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAdmin(null);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-sm text-[#4f5953]">
        Verifying admin session...
      </div>
    );
  }

  if (!admin) {
    return (
      <AdminLogin
        onSuccess={(loggedInAdmin) => setAdmin(loggedInAdmin)}
        onBackToSite={onExitAdmin}
      />
    );
  }

  // EXACTLY FOUR MAIN SIDEBAR SECTIONS
  const sidebarItems: {
    id: AdminSidebarSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'edit-content', label: 'Edit Content', icon: FileEdit },
    { id: 'blogs', label: 'Blogs', icon: BookOpen },
    { id: 'users-messages', label: 'Users & Messages', icon: Users },
    { id: 'account-settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D3732] flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#103b2d] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
            aria-label="Toggle admin menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-serif font-bold text-base">Academy Admin Panel</span>
        </div>
        <button
          type="button"
          onClick={onExitAdmin}
          className="text-xs text-[#dfc588] font-semibold inline-flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Website
        </button>
      </div>

      {/* Left Sidebar (Desktop fixed + Mobile Drawer) */}
      <aside
        className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } lg:flex lg:w-68 bg-[#103b2d] text-white flex-col justify-between shrink-0 lg:min-h-screen lg:sticky lg:top-0`}
      >
        <div className="p-5 space-y-6">
          <div className="hidden lg:block pb-4 border-b border-[#1b4e3e]">
            <Logo variant="light" size="sm" />
            <p className="text-[11px] uppercase tracking-widest text-[#d6b265] font-bold mt-3">
              Admin Panel
            </p>
          </div>

          <nav className="space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#184c3c] text-white shadow-xs border border-[#d6b265]/40'
                      : 'text-[#c9dbd2] hover:bg-[#164536] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#dfc588]' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-5 border-t border-[#1b4e3e] space-y-3">
          <div className="text-xs">
            <p className="font-semibold text-white truncate">{admin.name}</p>
            <p className="text-[#9fb5a9] text-[11px] truncate">{admin.email}</p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onExitAdmin}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#184c3c] hover:bg-[#1f5e4b] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Public Website</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-[#f4d7d7] text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-6xl w-full mx-auto">
        {activeSection === 'edit-content' && <EditContentSection onDataUpdated={onDataUpdated} />}
        {activeSection === 'blogs' && <BlogManagementSection onDataUpdated={onDataUpdated} />}
        {activeSection === 'users-messages' && <UsersMessagesSection />}
        {activeSection === 'account-settings' && (
          <AccountSettingsSection
            admin={admin}
            onAdminUpdated={(updated) => setAdmin(updated)}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
};
