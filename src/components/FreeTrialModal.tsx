import React, { useState } from 'react';
import { X, CheckCircle, Mail, Phone, User, MessageSquare } from 'lucide-react';

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeTrialModal: React.FC<FreeTrialModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !mobileNumber.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setFullName('');
    setMobileNumber('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#e5dfd3] overflow-hidden transition-all max-h-[92vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="bg-[#103b2d] px-6 py-5 text-white flex items-center justify-between">
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
        <div className="p-6 overflow-y-auto">
          {submitted ? (
            <div className="py-6 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#11382b] mb-2">
                Registration Received!
              </h4>
              <p className="text-[#4f5953] text-[15px] leading-relaxed max-w-md mb-6">
                Assalamu Alaikum, <strong className="text-[#11382b]">{fullName}</strong>. Your request has been submitted successfully. Our coordinator will contact you via WhatsApp and email to schedule your first lesson.
              </p>

              <div className="w-full bg-white rounded-xl p-4 border border-[#e6e2d8] text-left text-xs text-[#526058] space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#184c3c]" />
                  <span>Name: <strong>{fullName}</strong></span>
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
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Fatima Ahmed"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c] transition-all"
                  />
                </div>
              </div>

              {/* Mobile Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                    Mobile Number *
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

              {/* Message (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider">
                    Message
                  </label>
                  <span className="text-[11px] text-[#78857e]">
                    Optional
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share any preferred days, timing, or specific learning goals (optional)..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c] transition-all resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white font-medium text-[15px] transition-colors shadow-xs cursor-pointer"
                >
                  Register for Free Trial
                </button>
                <p className="text-[12px] text-center text-[#737c76] mt-2">
                  No credit card needed — just register, schedule, and start learning.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
