import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Mail, Phone, User, MessageSquare, BookOpen, Clock, Calendar, Timer } from 'lucide-react';

export type QuranCourseType = 'Noorani Qaida' | 'Quran Reading' | 'Tajweed' | 'Quran Recitation';

export type DaysPerWeekType = 
  | '1 Day / Week' 
  | '2 Days / Week' 
  | '3 Days / Week' 
  | '4 Days / Week' 
  | '5 Days / Week' 
  | '6 Days / Week';

export type ClassDurationType = 
  | '30 Minutes' 
  | '45 Minutes' 
  | '1 Hour' 
  | '1.5 Hours' 
  | '2 Hours (Max)';

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourse?: QuranCourseType;
}

export const COURSES_LIST: QuranCourseType[] = [
  'Noorani Qaida',
  'Quran Reading',
  'Tajweed',
  'Quran Recitation',
];

export const DAYS_OPTIONS: DaysPerWeekType[] = [
  '1 Day / Week',
  '2 Days / Week',
  '3 Days / Week',
  '4 Days / Week',
  '5 Days / Week',
  '6 Days / Week',
];

export const DURATION_OPTIONS: ClassDurationType[] = [
  '30 Minutes',
  '45 Minutes',
  '1 Hour',
  '1.5 Hours',
  '2 Hours (Max)',
];

const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES = ['00', '15', '30', '45'];

export const FreeTrialModal: React.FC<FreeTrialModalProps> = ({ 
  isOpen, 
  onClose,
  initialCourse = 'Noorani Qaida',
}) => {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<QuranCourseType>(initialCourse);
  
  // Custom Time State (User specifies exact time and clicks AM / PM)
  const [selectedHour, setSelectedHour] = useState('08');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('PM');
  
  // Class Duration State (Minutes / Hours, max 2 hours)
  const [selectedDuration, setSelectedDuration] = useState<ClassDurationType>('30 Minutes');

  // Days per week state
  const [selectedDays, setSelectedDays] = useState<DaysPerWeekType>('3 Days / Week');

  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialCourse) {
      setSelectedCourse(initialCourse);
    }
  }, [initialCourse, isOpen]);

  if (!isOpen) return null;

  const formattedTime = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !mobileNumber.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setFullName('');
    setMobileNumber('');
    setEmail('');
    setSelectedCourse('Noorani Qaida');
    setSelectedHour('08');
    setSelectedMinute('00');
    setSelectedPeriod('PM');
    setSelectedDuration('30 Minutes');
    setSelectedDays('3 Days / Week');
    setMessage('');
    setSubmitted(false);
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
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#184c3c]" />
                  <span>Class Start Time: <strong className="text-[#184c3c]">{formattedTime}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-[#184c3c]" />
                  <span>Class Duration: <strong className="text-[#184c3c]">{selectedDuration}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#184c3c]" />
                  <span>Days per Week: <strong>{selectedDays}</strong></span>
                </div>
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
              {/* 1. Course Selection */}
              <div>
                <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#b28338]" />
                  Select Course *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COURSES_LIST.map((course) => {
                    const isSelected = selectedCourse === course;
                    return (
                      <button
                        key={course}
                        type="button"
                        onClick={() => setSelectedCourse(course)}
                        className={`py-2 px-3 rounded-lg text-xs font-medium text-left border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#103b2d] text-white border-[#103b2d] shadow-xs'
                            : 'bg-white text-[#2d3a33] border-[#d6cfc1] hover:border-[#103b2d]/60'
                        }`}
                      >
                        <span>{course}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#dfc588]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Custom Time Selection (Hours, Minutes & Direct AM/PM toggle) */}
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
                  {/* Hour selector */}
                  <div className="col-span-5">
                    <div className="relative">
                      <select
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-xs sm:text-sm font-medium text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c] transition-all cursor-pointer"
                        aria-label="Select hour"
                      >
                        {HOURS.map((hr) => (
                          <option key={hr} value={hr}>
                            {hr} : 00 Hour
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Minute selector */}
                  <div className="col-span-3">
                    <select
                      value={selectedMinute}
                      onChange={(e) => setSelectedMinute(e.target.value)}
                      className="w-full px-2 py-2 rounded-lg bg-white border border-[#d6cfc1] text-xs sm:text-sm font-medium text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c] transition-all cursor-pointer text-center"
                      aria-label="Select minute"
                    >
                      {MINUTES.map((min) => (
                        <option key={min} value={min}>
                          :{min} min
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* AM / PM Toggle Buttons */}
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

              {/* 3. Class Duration Selection (Minutes & Hours, Max 2 Hours) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#11382b] uppercase tracking-wider flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-[#b28338]" />
                    Class Duration (Max 2 Hours) *
                  </label>
                  <span className="text-[11px] font-semibold text-[#184c3c] bg-[#e6f2ed] px-2 py-0.5 rounded-md border border-[#cbe4d7]">
                    {selectedDuration}
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {DURATION_OPTIONS.map((dur) => {
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

              {/* 4. Days per Week Selection */}
              <div>
                <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#b28338]" />
                  Select Days in a Week *
                </label>
                
                {/* Days options (1 to 6 days) */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {DAYS_OPTIONS.map((opt) => {
                    const isSelected = selectedDays === opt;
                    const shortLabel = opt.replace(' / Week', '');
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
                  className="w-full py-3 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white font-medium text-[15px] transition-colors shadow-xs cursor-pointer"
                >
                  Register for Free Trial
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
