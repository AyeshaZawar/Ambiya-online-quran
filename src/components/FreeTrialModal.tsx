import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Mail, Phone, User, MessageSquare, BookOpen, Clock, Calendar, Timer } from 'lucide-react';
import { CourseItem, RegistrationSettingsData } from '../types/cms';
import { FALLBACK_BOOTSTRAP_DATA } from '../data/fallbackData';
import { publicApi } from '../services/api';

export type QuranCourseType = string;
export type DaysPerWeekType = string;
export type ClassDurationType = string;

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourse?: string;
  activeCourses?: CourseItem[];
  registrationSettings?: RegistrationSettingsData;
}

export const FreeTrialModal: React.FC<FreeTrialModalProps> = ({ 
  isOpen, 
  onClose,
  initialCourse,
  activeCourses,
  registrationSettings,
}) => {
  const coursesList =
    activeCourses && activeCourses.length > 0
      ? activeCourses
      : FALLBACK_BOOTSTRAP_DATA.courses;

  const settings = registrationSettings || FALLBACK_BOOTSTRAP_DATA.registrationSettings;
  const hours = settings.hours || [];
  const minutes = settings.minutes || [];
  const durations = settings.durations || [];
  const weeklyOptions = settings.daysPerWeekOptions || [];
  const monthlyOptions = settings.daysPerMonthOptions || [];

  const showClassTime =
    (settings.allowTimeSelection ?? true) && hours.length > 0 && minutes.length > 0;
  const showDuration = (settings.allowDurationSelection ?? true) && durations.length > 0;
  const canWeekly = settings.allowWeeklySelection && weeklyOptions.length > 0;
  const canMonthly = settings.allowMonthlySelection && monthlyOptions.length > 0;
  const showDays = canWeekly || canMonthly;

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>(
    initialCourse || coursesList[0]?.title || 'Noorani Qaida'
  );
  
  const [selectedHour, setSelectedHour] = useState(hours[7] || hours[0] || '');
  const [selectedMinute, setSelectedMinute] = useState(minutes[0] || '');
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('PM');
  const [selectedDuration, setSelectedDuration] = useState<string>(durations[0] || '');

  const [scheduleType, setScheduleType] = useState<'weekly' | 'monthly'>(
    canWeekly ? 'weekly' : 'monthly'
  );
  const [selectedDays, setSelectedDays] = useState<string>(
    (canWeekly ? weeklyOptions[2] || weeklyOptions[0] : monthlyOptions[0]) || ''
  );

  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialCourse && coursesList.some((c) => c.title === initialCourse)) {
      setSelectedCourse(initialCourse);
    } else if (!coursesList.some((c) => c.title === selectedCourse)) {
      setSelectedCourse(coursesList[0]?.title || 'Noorani Qaida');
    }
  }, [initialCourse, isOpen, coursesList]);

  useEffect(() => {
    if (hours.length > 0 && !hours.includes(selectedHour)) setSelectedHour(hours[0]);
    if (minutes.length > 0 && !minutes.includes(selectedMinute)) setSelectedMinute(minutes[0]);
    if (durations.length > 0 && !durations.includes(selectedDuration)) setSelectedDuration(durations[0]);
  }, [hours, minutes, durations]);

  useEffect(() => {
    if (scheduleType === 'weekly' && !canWeekly && canMonthly) {
      setScheduleType('monthly');
      setSelectedDays(monthlyOptions[0]);
    } else if (scheduleType === 'monthly' && !canMonthly && canWeekly) {
      setScheduleType('weekly');
      setSelectedDays(weeklyOptions[0]);
    } else if (scheduleType === 'weekly' && weeklyOptions.length > 0 && !weeklyOptions.includes(selectedDays)) {
      setSelectedDays(weeklyOptions[0]);
    } else if (scheduleType === 'monthly' && monthlyOptions.length > 0 && !monthlyOptions.includes(selectedDays)) {
      setSelectedDays(monthlyOptions[0]);
    }
  }, [scheduleType, canWeekly, canMonthly, weeklyOptions, monthlyOptions]);

  if (!isOpen) return null;

  const formattedTime = showClassTime ? `${selectedHour}:${selectedMinute} ${selectedPeriod}` : 'Not specified';
  const activeDayOptions = scheduleType === 'weekly' ? weeklyOptions : monthlyOptions;

  const handleSwitchScheduleType = (nextType: 'weekly' | 'monthly') => {
    setScheduleType(nextType);
    const opts = nextType === 'weekly' ? weeklyOptions : monthlyOptions;
    if (opts.length > 0) {
      setSelectedDays(opts[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !mobileNumber.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const matchedCourse = coursesList.find((c) => c.title === selectedCourse);
      await publicApi.submitTrialRegistration({
        fullName: fullName.trim(),
        selectedCourse,
        courseId: matchedCourse && !matchedCourse._id.startsWith('fallback-') ? matchedCourse._id : null,
        mobileNumber: mobileNumber.trim(),
        email: email.trim(),
        classTime: showClassTime
          ? {
              hour: selectedHour,
              minute: selectedMinute,
              period: selectedPeriod,
              formatted: formattedTime,
            }
          : {
              hour: '',
              minute: '',
              period: 'PM',
              formatted: 'Not specified',
            },
        classDuration: showDuration ? selectedDuration : 'Not specified',
        selectedDays: showDays ? selectedDays : 'Not specified',
        scheduleType,
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not submit registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName('');
    setMobileNumber('');
    setEmail('');
    setSelectedCourse(coursesList[0]?.title || 'Noorani Qaida');
    setSelectedHour(hours[7] || hours[0] || '');
    setSelectedMinute(minutes[0] || '');
    setSelectedPeriod('PM');
    setSelectedDuration(durations[0] || '');
    setScheduleType(canWeekly ? 'weekly' : 'monthly');
    setSelectedDays((canWeekly ? weeklyOptions[2] || weeklyOptions[0] : monthlyOptions[0]) || '');
    setMessage('');
    setSubmitted(false);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#e5dfd3] overflow-hidden transition-all max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Bar */}
        <div className="bg-[#103b2d] px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-serif text-xl font-bold tracking-tight">
              Begin Your Free Trial Week
            </h3>
            <p className="text-xs text-[#cadcd2] mt-0.5">
              100% Free · No credit card or payment required
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {submitted ? (
            <div className="py-4 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#11382b] mb-2">
                Registration Received!
              </h4>
              <p className="text-[#4f5953] text-[15px] leading-relaxed max-w-md mb-6">
                Assalamu Alaikum, <strong className="text-[#11382b]">{fullName}</strong>. Your free trial request for <strong className="text-[#11382b]">{selectedCourse}</strong> has been received. Our coordinator will contact you via WhatsApp and email to confirm your schedule.
              </p>

              <div className="w-full bg-white rounded-xl p-4 border border-[#e6e2d8] text-left text-xs text-[#526058] space-y-2.5 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#184c3c]" />
                  <span>Name: <strong>{fullName}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#184c3c]" />
                  <span>Course: <strong className="text-[#184c3c]">{selectedCourse}</strong></span>
                </div>
                {showClassTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#184c3c]" />
                    <span>Class Start Time: <strong className="text-[#184c3c]">{formattedTime}</strong></span>
                  </div>
                )}
                {showDuration && (
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-[#184c3c]" />
                    <span>Class Duration: <strong className="text-[#184c3c]">{selectedDuration}</strong></span>
                  </div>
                )}
                {showDays && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#184c3c]" />
                    <span>
                      {scheduleType === 'weekly' ? 'Days per Week' : 'Days per Month'}:{' '}
                      <strong>{selectedDays}</strong>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#184c3c]" />
                  <span>Mobile: <strong>{mobileNumber}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#184c3c]" />
                  <span>Email: <strong>{email}</strong></span>
                </div>
                {message.trim() && (
                  <div className="flex items-start gap-2 pt-1 border-t border-stone-100">
                    <MessageSquare className="w-4 h-4 text-[#184c3c] mt-0.5" />
                    <span>Message: <em>"{message.trim()}"</em></span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-lg bg-[#184c3c] text-white font-medium text-sm hover:bg-[#123b2e] transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* 1. Course Selection (Synced with active courses) */}
              <div>
                <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#b28338]" />
                  Select Course *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {coursesList.map((course) => {
                    const isSelected = selectedCourse === course.title;
                    return (
                      <button
                        key={course._id || course.title}
                        type="button"
                        onClick={() => setSelectedCourse(course.title)}
                        className={`py-2 px-3 rounded-lg text-xs font-medium text-left border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#103b2d] text-white border-[#103b2d] shadow-xs'
                            : 'bg-white text-[#2d3a33] border-[#d6cfc1] hover:border-[#103b2d]/60'
                        }`}
                      >
                        <span>{course.title}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#dfc588]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Custom Time Selection (Hidden if removed/disabled in Admin) */}
              {showClassTime && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#11382b] uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#b28338]" />
                      Select Class Time *
                    </label>
                    <span className="text-[11px] font-semibold text-[#184c3c] bg-[#e6f2ed] px-2 py-0.5 rounded-md border border-[#cbe4d7]">
                      {formattedTime}
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <select
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-xs sm:text-sm font-medium text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c] transition-all cursor-pointer"
                        aria-label="Select hour"
                      >
                        {hours.map((hr) => (
                          <option key={hr} value={hr}>
                            {hr} : 00 Hour
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-3">
                      <select
                        value={selectedMinute}
                        onChange={(e) => setSelectedMinute(e.target.value)}
                        className="w-full px-2 py-2 rounded-lg bg-white border border-[#d6cfc1] text-xs sm:text-sm font-medium text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c] transition-all cursor-pointer text-center"
                        aria-label="Select minute"
                      >
                        {minutes.map((min) => (
                          <option key={min} value={min}>
                            :{min} min
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-4 flex items-center rounded-lg bg-white p-0.5 border border-[#d6cfc1]">
                      <button
                        type="button"
                        onClick={() => setSelectedPeriod('AM')}
                        className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          selectedPeriod === 'AM'
                            ? 'bg-[#103b2d] text-white shadow-xs'
                            : 'text-[#58665f] hover:text-[#11382b]'
                        }`}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPeriod('PM')}
                        className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          selectedPeriod === 'PM'
                            ? 'bg-[#103b2d] text-white shadow-xs'
                            : 'text-[#58665f] hover:text-[#11382b]'
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Class Duration Selection (Hidden if removed/disabled in Admin) */}
              {showDuration && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#11382b] uppercase tracking-wider flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 text-[#b28338]" />
                      Class Duration *
                    </label>
                    <span className="text-[11px] font-semibold text-[#184c3c] bg-[#e6f2ed] px-2 py-0.5 rounded-md border border-[#cbe4d7]">
                      {selectedDuration}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {durations.map((dur) => {
                      const isSelected = selectedDuration === dur;
                      return (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setSelectedDuration(dur)}
                          className={`py-2 px-1 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer whitespace-nowrap ${
                            isSelected
                              ? 'bg-[#103b2d] text-white border-[#103b2d] shadow-xs font-bold'
                              : 'bg-white text-[#2d3a33] border-[#d6cfc1] hover:border-[#103b2d]/60'
                          }`}
                        >
                          {dur}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Select Days (Weekly / Monthly — Hidden if both disabled or emptied in Admin) */}
              {showDays && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#11382b] uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#b28338]" />
                      {scheduleType === 'weekly' ? 'Select Days in a Week *' : 'Select Days in a Month *'}
                    </label>

                    {canWeekly && canMonthly && (
                      <div className="inline-flex rounded-md bg-white border border-[#d6cfc1] p-0.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => handleSwitchScheduleType('weekly')}
                          className={`px-2 py-0.5 rounded cursor-pointer font-semibold transition-colors ${
                            scheduleType === 'weekly'
                              ? 'bg-[#103b2d] text-white'
                              : 'text-[#58665f] hover:text-[#11382b]'
                          }`}
                        >
                          Per Week
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSwitchScheduleType('monthly')}
                          className={`px-2 py-0.5 rounded cursor-pointer font-semibold transition-colors ${
                            scheduleType === 'monthly'
                              ? 'bg-[#103b2d] text-white'
                              : 'text-[#58665f] hover:text-[#11382b]'
                          }`}
                        >
                          Per Month
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {activeDayOptions.map((opt) => {
                      const isSelected = selectedDays === opt;
                      const shortLabel = opt.replace(' / Week', '').replace(' / Month', '');
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedDays(opt)}
                          className={`py-2 px-1.5 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer whitespace-nowrap ${
                            isSelected
                              ? 'bg-[#103b2d] text-white border-[#103b2d] shadow-xs font-bold'
                              : 'bg-white text-[#2d3a33] border-[#d6cfc1] hover:border-[#103b2d]/60'
                          }`}
                        >
                          {shortLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Fatima Ahmed"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c] transition-all"
                />
              </div>

              {/* 6. Mobile Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                    WhatsApp / Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+44 7123 456789"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c] transition-all"
                  />
                </div>
              </div>

              {/* 7. Message (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider">
                    Message / Notes
                  </label>
                  <span className="text-[11px] text-[#78857e]">
                    Optional
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Student age, prior knowledge, or specific preferences (optional)..."
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c] transition-all resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] disabled:opacity-60 text-white font-medium text-[15px] transition-colors shadow-xs cursor-pointer"
                >
                  {submitting ? 'Submitting Registration...' : 'Register for Free Trial'}
                </button>
                <p className="text-[11.5px] text-center text-[#737c76] mt-1.5">
                  Start with a 100% free trial week — no payment required.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
