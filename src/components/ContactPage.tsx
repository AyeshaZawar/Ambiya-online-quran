import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Phone, Globe, CheckCircle2, Send, MessageCircle } from 'lucide-react';

interface ContactPageProps {
  onOpenTrial: () => void;
  onNavigateHome: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenTrial, onNavigateHome }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Course Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSent(true);
  };

  return (
    <div className="bg-[#FAF7F2] text-[#2D3732] min-h-screen overflow-hidden">
      {/* Breadcrumb Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-b border-[#e8e2d5] bg-[#FAF7F2]/90 backdrop-blur-xs sticky top-16 z-30"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#103b2d] hover:text-[#b28338] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>

          <div className="text-[13px] text-[#78857f] hidden sm:flex items-center gap-2 font-medium">
            <span onClick={onNavigateHome} className="hover:text-[#103b2d] cursor-pointer transition-colors">
              Home
            </span>
            <span>/</span>
            <span className="text-[#103b2d] font-semibold">Contact Us</span>
          </div>
        </div>
      </motion.div>

      {/* Header Section */}
      <section className="pt-12 sm:pt-16 pb-12 sm:pb-16 border-b border-[#ede7dc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-[12px] font-semibold tracking-widest uppercase text-[#b28338] mb-3 block"
          >
            Get In Touch
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif text-[34px] sm:text-[44px] text-[#11382b] font-normal tracking-[-0.01em] mb-5 leading-tight"
          >
            Contact Adam to Muhammad Online Quran Academy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[16px] sm:text-[17px] text-[#4f5953] leading-relaxed max-w-2xl mx-auto"
          >
            We are available worldwide, online. Whether you have questions about our tutors, class schedules, or wish to register for a 1-week free trial, our coordinators are here to help.
          </motion.p>
        </div>
      </section>

      {/* Contact Content & Form */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Contact Details (Spans 5 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="bg-white rounded-2xl p-7 border border-[#e5dfd3] shadow-xs space-y-6">
                <h2 className="font-serif text-2xl font-bold text-[#11382b]">
                  Academy Information
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#103b2d]/10 text-[#103b2d] flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#103b2d]">
                        Global Availability
                      </p>
                      <p className="text-sm text-[#4f5953] mt-0.5">
                        Available worldwide, online for students across UK, USA, Canada, Europe, Middle East & Australia.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#103b2d]/10 text-[#103b2d] flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#103b2d]">
                        Coordinator WhatsApp
                      </p>
                      <p className="text-sm text-[#4f5953] mt-0.5">
                        Direct communication for instant class arrangements and timing coordination.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#103b2d]/10 text-[#103b2d] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#103b2d]">
                        Email Support
                      </p>
                      <p className="text-sm text-[#4f5953] mt-0.5">
                        Response within 24 hours for any questions or concerns.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={onOpenTrial}
                    className="w-full py-3 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white text-sm font-medium transition-colors shadow-xs cursor-pointer text-center"
                  >
                    Start Free Trial Week
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Contact Form (Spans 7 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-7"
            >
              <div className="bg-white rounded-2xl p-7 sm:p-9 border border-[#e5dfd3] shadow-xs">
                {sent ? (
                  <div className="py-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#11382b] mb-2">
                      Message Received!
                    </h3>
                    <p className="text-[#4f5953] text-[15px] leading-relaxed max-w-md mb-6">
                      Thank you for contacting Adam to Muhammad Online Quran Academy. Our team will get back to you shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setName('');
                        setEmail('');
                        setPhone('');
                        setMessage('');
                        setSent(false);
                      }}
                      className="px-6 py-2.5 rounded-lg bg-[#184c3c] text-white text-sm font-medium hover:bg-[#123b2e] transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-serif text-2xl font-bold text-[#11382b] mb-2">
                      Send a Message
                    </h3>
                    <p className="text-xs text-[#6e7d75] mb-4">
                      Fill out the form below and our academic advisor will assist you with any questions.
                    </p>

                    <div>
                      <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Brother / Sister Name"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c] transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                          WhatsApp / Phone
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+44 7123 456789"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                        Inquiry Subject
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c] transition-all"
                      >
                        <option value="Course Inquiry">Course Inquiry (Noorani Qaida, Reading, Tajweed)</option>
                        <option value="Class Timings">Class Timings & Schedule</option>
                        <option value="Fee Rates & Plans">Fee Rates & Plans</option>
                        <option value="Free Trial Questions">Free Trial Questions</option>
                        <option value="Other Questions">Other Questions</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#11382b] uppercase tracking-wider mb-1.5">
                        Your Message *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please write your questions or requests here..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c] transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white text-sm font-medium transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
