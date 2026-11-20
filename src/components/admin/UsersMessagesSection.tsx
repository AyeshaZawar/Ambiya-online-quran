import React, { useState, useEffect } from 'react';
import {
  Search,
  Trash2,
  Eye,
  Mail,
  MailOpen,
  Calendar,
  Clock,
  Phone,
  BookOpen,
  X,
  Users,
  MessageSquare,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { TrialRegistrationItem, ContactInquiryItem } from '../../types/cms';
import { ConfirmDialog } from './ConfirmDialog';

export const UsersMessagesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'registrations' | 'inquiries'>('registrations');

  // A. Free Trial Registrations state
  const [registrations, setRegistrations] = useState<TrialRegistrationItem[]>([]);
  const [regSearch, setRegSearch] = useState('');
  const [regCourseFilter, setRegCourseFilter] = useState('all');
  const [regScheduleFilter, setRegScheduleFilter] = useState('all');
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [selectedReg, setSelectedReg] = useState<TrialRegistrationItem | null>(null);

  // B. Contact Inquiries state
  const [inquiries, setInquiries] = useState<ContactInquiryItem[]>([]);
  const [inqSearch, setInqSearch] = useState('');
  const [inqStatusFilter, setInqStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [loadingInq, setLoadingInq] = useState(true);
  const [selectedInq, setSelectedInq] = useState<ContactInquiryItem | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<
    | { type: 'reg'; item: TrialRegistrationItem }
    | { type: 'inq'; item: ContactInquiryItem }
    | null
  >(null);

  const loadRegistrations = async () => {
    setLoadingRegs(true);
    try {
      const res = await adminApi.listRegistrations({
        search: regSearch,
        course: regCourseFilter,
        scheduleType: regScheduleFilter !== 'all' ? regScheduleFilter : undefined,
      });
      setRegistrations(res.registrations);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load registrations.');
    } finally {
      setLoadingRegs(false);
    }
  };

  const loadInquiries = async () => {
    setLoadingInq(true);
    try {
      const res = await adminApi.listInquiries({
        search: inqSearch,
        status: inqStatusFilter,
      });
      setInquiries(res.inquiries);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load inquiries.');
    } finally {
      setLoadingInq(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, [regCourseFilter, regScheduleFilter]);

  useEffect(() => {
    loadInquiries();
  }, [inqStatusFilter]);

  const handleDeleteReg = async (reg: TrialRegistrationItem) => {
    try {
      await adminApi.deleteRegistration(reg._id);
      setConfirmDelete(null);
      if (selectedReg?._id === reg._id) setSelectedReg(null);
      await loadRegistrations();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete registration.');
    }
  };

  const handleOpenInquiry = async (inq: ContactInquiryItem) => {
    setSelectedInq(inq);
    if (!inq.isRead) {
      try {
        await adminApi.toggleInquiryRead(inq._id, true);
        setInquiries((prev) =>
          prev.map((item) => (item._id === inq._id ? { ...item, isRead: true } : item))
        );
      } catch {
        // non-blocking
      }
    }
  };

  const handleToggleInqRead = async (inq: ContactInquiryItem) => {
    try {
      await adminApi.toggleInquiryRead(inq._id, !inq.isRead);
      if (selectedInq?._id === inq._id) {
        setSelectedInq({ ...inq, isRead: !inq.isRead });
      }
      await loadInquiries();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update read status.');
    }
  };

  const handleDeleteInq = async (inq: ContactInquiryItem) => {
    try {
      await adminApi.deleteInquiry(inq._id);
      setConfirmDelete(null);
      if (selectedInq?._id === inq._id) setSelectedInq(null);
      await loadInquiries();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete inquiry.');
    }
  };

  const uniqueCourseNames = Array.from(
    new Set(registrations.map((r) => r.selectedCourse))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#11382b]">Users &amp; Messages</h2>
        <p className="text-xs text-[#6d7972] mt-1">
          Manage Free Trial Registrations and Contact Inquiries separately in the admin panel.
        </p>
      </div>

      {/* Internal Section Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-[#e5dfd3] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('registrations')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            activeTab === 'registrations'
              ? 'bg-[#103b2d] text-white shadow-xs'
              : 'bg-white text-[#4f5953] border border-[#e5dfd3]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Free Trial Registrations ({registrations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            activeTab === 'inquiries'
              ? 'bg-[#103b2d] text-white shadow-xs'
              : 'bg-white text-[#4f5953] border border-[#e5dfd3]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>
            Contact Inquiries ({inquiries.filter((i) => !i.isRead).length} unread / {inquiries.length} total)
          </span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* A. FREE TRIAL REGISTRATIONS */}
      {activeTab === 'registrations' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-[#e5dfd3] flex flex-wrap gap-3 items-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                loadRegistrations();
              }}
              className="flex-1 min-w-[220px] flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#78857f] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  placeholder="Search by student name, email, phone, or course..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-xs"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer"
              >
                Search
              </button>
            </form>

            <select
              value={regCourseFilter}
              onChange={(e) => setRegCourseFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-xs font-medium"
            >
              <option value="all">All Courses</option>
              {uniqueCourseNames.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={regScheduleFilter}
              onChange={(e) => setRegScheduleFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-xs font-medium"
            >
              <option value="all">All Schedule Types</option>
              <option value="weekly">Weekly Schedule</option>
              <option value="monthly">Monthly Schedule</option>
            </select>
          </div>

          {loadingRegs ? (
            <div className="p-8 text-sm text-[#55635c]">Loading registrations...</div>
          ) : registrations.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-[#e5dfd3] text-center text-sm text-[#55635c]">
              No free trial registrations match your criteria.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#e5dfd3] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF7F2] border-b border-[#e5dfd3] text-[#11382b] uppercase tracking-wider">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Course</th>
                      <th className="py-3 px-4">Schedule</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Submitted</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#efeae0]">
                    {registrations.map((reg) => (
                      <tr key={reg._id} className="hover:bg-[#FAF7F2]/60">
                        <td className="py-3.5 px-4 font-semibold text-[#11382b]">{reg.fullName}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#103b2d]/10 text-[#103b2d] font-semibold">
                            {reg.selectedCourse}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#4f5953]">
                          <div>
                            {[reg.classTime?.formatted, reg.classDuration]
                              .filter((v) => v && v !== 'Not specified')
                              .join(' · ') || 'Schedule not specified'}
                          </div>
                          {reg.selectedDays && reg.selectedDays !== 'Not specified' && (
                            <div className="text-[11px] text-[#78857f]">
                              {reg.selectedDays} ({reg.scheduleType})
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#4f5953]">
                          <div>{reg.mobileNumber}</div>
                          <div className="text-[11px] text-[#78857f]">{reg.email}</div>
                        </td>
                        <td className="py-3.5 px-4 text-[#6d7972]">
                          {new Date(reg.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedReg(reg)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white border border-[#d6cfc1] text-xs font-medium cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDelete({ type: 'reg', item: reg })}
                              className="p-1.5 rounded bg-white border border-red-200 text-red-600 cursor-pointer"
                              title="Delete registration"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* B. CONTACT INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-[#e5dfd3] flex flex-wrap gap-3 items-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                loadInquiries();
              }}
              className="flex-1 min-w-[220px] flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#78857f] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={inqSearch}
                  onChange={(e) => setInqSearch(e.target.value)}
                  placeholder="Search by sender name, email, subject, or message..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-xs"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer"
              >
                Search
              </button>
            </form>

            <select
              value={inqStatusFilter}
              onChange={(e) => setInqStatusFilter(e.target.value as 'all' | 'unread' | 'read')}
              className="px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-xs font-medium"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>

          {loadingInq ? (
            <div className="p-8 text-sm text-[#55635c]">Loading contact inquiries...</div>
          ) : inquiries.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-[#e5dfd3] text-center text-sm text-[#55635c]">
              No contact inquiries found.
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq._id}
                  className={`rounded-xl p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    inq.isRead
                      ? 'bg-white border-[#e5dfd3]'
                      : 'bg-[#fdfaf3] border-[#b28338]/50 shadow-xs'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          inq.isRead
                            ? 'bg-stone-100 text-stone-600'
                            : 'bg-[#b28338] text-white'
                        }`}
                      >
                        {inq.isRead ? 'Read' : 'Unread'}
                      </span>
                      <span className="text-xs font-bold text-[#11382b]">{inq.subject}</span>
                      <span className="text-[11px] text-[#78857f]">
                        · {new Date(inq.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#11382b]">
                      {inq.name} <span className="font-normal text-xs text-[#55635c]">({inq.email}{inq.phone ? ` · ${inq.phone}` : ''})</span>
                    </p>
                    <p className="text-xs text-[#4f5953] line-clamp-2">{inq.message}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenInquiry(inq)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#184c3c] text-white text-xs font-medium cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Read
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleInqRead(inq)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#d6cfc1] text-xs font-medium text-[#11382b] cursor-pointer"
                    >
                      {inq.isRead ? (
                        <>
                          <Mail className="w-3.5 h-3.5" /> Mark Unread
                        </>
                      ) : (
                        <>
                          <MailOpen className="w-3.5 h-3.5" /> Mark Read
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete({ type: 'inq', item: inq })}
                      className="p-1.5 rounded-lg bg-white border border-red-200 text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Individual Registration Details */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#e5dfd3] shadow-xl overflow-hidden">
            <div className="bg-[#103b2d] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">Free Trial Registration Details</h3>
              <button type="button" onClick={() => setSelectedReg(null)} className="cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm text-[#2D3732]">
              <p><strong>Full Name:</strong> {selectedReg.fullName}</p>
              <p className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#184c3c]" /> <strong>Selected Course:</strong> {selectedReg.selectedCourse}</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#184c3c]" /> <strong>WhatsApp / Mobile:</strong> {selectedReg.mobileNumber}</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#184c3c]" /> <strong>Email:</strong> {selectedReg.email}</p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#184c3c]" /> <strong>Class Time &amp; Duration:</strong>{' '}
                {[selectedReg.classTime?.formatted, selectedReg.classDuration]
                  .filter((v) => v && v !== 'Not specified')
                  .join(' · ') || 'Not specified'}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#184c3c]" /> <strong>Schedule:</strong>{' '}
                {selectedReg.selectedDays && selectedReg.selectedDays !== 'Not specified'
                  ? `${selectedReg.selectedDays} (${selectedReg.scheduleType === 'monthly' ? 'Per Month' : 'Per Week'})`
                  : 'Not specified'}
              </p>
              <p><strong>Submission Date:</strong> {new Date(selectedReg.createdAt).toLocaleString()}</p>
              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#e5dfd3]">
                <p className="text-xs font-bold uppercase text-[#11382b] mb-1">Message / Notes</p>
                <p className="text-xs text-[#4f5953] whitespace-pre-wrap">
                  {selectedReg.message || 'No additional notes provided.'}
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete({ type: 'reg', item: selectedReg })}
                  className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-semibold cursor-pointer"
                >
                  Delete Record
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReg(null)}
                  className="px-5 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Individual Inquiry Message */}
      {selectedInq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#e5dfd3] shadow-xl overflow-hidden">
            <div className="bg-[#103b2d] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">Contact Inquiry</h3>
              <button type="button" onClick={() => setSelectedInq(null)} className="cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm text-[#2D3732]">
              <p><strong>Name:</strong> {selectedInq.name}</p>
              <p><strong>Email:</strong> {selectedInq.email}</p>
              <p><strong>WhatsApp / Phone:</strong> {selectedInq.phone || 'Not provided'}</p>
              <p><strong>Subject:</strong> {selectedInq.subject}</p>
              <p><strong>Submitted:</strong> {new Date(selectedInq.createdAt).toLocaleString()}</p>
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#e5dfd3]">
                <p className="text-xs font-bold uppercase text-[#11382b] mb-1">Full Message</p>
                <p className="text-sm text-[#2D3732] whitespace-pre-wrap leading-relaxed">
                  {selectedInq.message}
                </p>
              </div>
              <div className="flex justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleToggleInqRead(selectedInq)}
                  className="px-4 py-2 rounded-lg border border-[#d6cfc1] text-xs font-semibold cursor-pointer"
                >
                  {selectedInq.isRead ? 'Mark as Unread' : 'Mark as Read'}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete({ type: 'inq', item: selectedInq })}
                    className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-semibold cursor-pointer"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedInq(null)}
                    className="px-5 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title={confirmDelete?.type === 'reg' ? 'Delete Registration' : 'Delete Contact Inquiry'}
        message={
          confirmDelete
            ? confirmDelete.type === 'reg'
              ? `Permanently delete free trial registration for ${confirmDelete.item.fullName}?`
              : `Permanently delete contact inquiry from ${confirmDelete.item.name}?`
            : ''
        }
        onConfirm={() => {
          if (!confirmDelete) return;
          if (confirmDelete.type === 'reg') handleDeleteReg(confirmDelete.item);
          else handleDeleteInq(confirmDelete.item);
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};
