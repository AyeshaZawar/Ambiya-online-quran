import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Award, Sparkles, Volume2, ArrowRight, ArrowLeft, CheckCircle2, Users, Clock, ShieldCheck } from 'lucide-react';
import { QuranCourseType } from './FreeTrialModal';

interface CoursesPageProps {
  onOpenTrial: (course?: QuranCourseType) => void;
  onNavigateHome: () => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onOpenTrial, onNavigateHome }) => {
  const coursesList = [
    {
      id: 'noorani-qaida',
      title: 'Noorani Qaida' as QuranCourseType,
      tag: 'Foundation',
      description: 'Learn Arabic letters, pronunciation and basic reading rules.',
      suitableFor: 'Complete beginners, children, and adults starting from scratch',
      learningPoints: [
        'Recognition of Arabic alphabet & letter shapes',
        'Accurate pronunciation (Makharij)',
        'Connecting letters and basic Harakaat',
        'Foundation rules for fluent Quranic reading',
      ],
      icon: BookOpen,
      badge: 'Course 01',
      popular: true,
    },
    {
      id: 'quran-reading',
      title: 'Quran Reading' as QuranCourseType,
      tag: 'Fluency',
      description: 'Develop fluency and confidence in Quran recitation.',
      suitableFor: 'Students who completed Qaida and wish to read directly from the Mushaf',
      learningPoints: [
        'Direct recitation practice from Juz Amma onward',
        'Word-by-word fluency building and rhythm',
        'Stopping signs (Waqf) and breathing control',
        'Confidence in continuous verse reading',
      ],
      icon: Award,
      badge: 'Course 02',
      popular: false,
    },
    {
      id: 'tajweed',
      title: 'Tajweed' as QuranCourseType,
      tag: 'Rules & Beauty',
      description: 'Learn the essential rules of Tajweed for correct pronunciation.',
      suitableFor: 'Readers wanting to eliminate errors and beautify their recitation',
      learningPoints: [
        'Articulation points (Makharij al-Huroof)',
        'Rules of Noon Saakin, Meem Saakin, and Madd',
        'Heavy and light letter attributes (Sifaat)',
        'Application of Tajweed rules in daily recitation',
      ],
      icon: Sparkles,
      badge: 'Course 03',
      popular: false,
    },
    {
      id: 'quran-recitation',
      title: 'Quran Recitation' as QuranCourseType,
      tag: 'Mastery',
      description: 'Improve recitation with proper guidance and practice.',
      suitableFor: 'Students and adults desiring polished, melodic recitation',
      learningPoints: [
        'Melodic cadence with strict Tajweed adherence',
        'Continuous one-on-one correction with senior tutors',
        'Memorization of daily Surahs and supplications',
        'Deep spiritual connection with the sacred text',
      ],
      icon: Volume2,
      badge: 'Course 04',
      popular: false,
    },
  ];

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
            <span className="text-[#103b2d] font-semibold">Courses</span>
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
            Our Quran Curriculum
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif text-[34px] sm:text-[44px] text-[#11382b] font-normal tracking-[-0.01em] mb-5 leading-tight"
          >
            Courses Taught with Patience and Care
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[16px] sm:text-[17px] text-[#4f5953] leading-relaxed max-w-2xl mx-auto"
          >
            From your first Arabic letter to fluent recitation with correct Tajweed. Each course is taught in personalized one-to-one sessions tailored to children and adult learners.
          </motion.p>
        </div>
      </section>

      {/* 4 Courses Section with 2 Left / 2 Right Animation */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coursesList.map((course, idx) => {
              const Icon = course.icon;
              // 2 from Left, 2 from Right per user instruction
              const isFromLeft = idx < 2;

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: isFromLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.55, delay: (idx % 2) * 0.1, ease: 'easeOut' }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl p-7 sm:p-8 border border-[#e5dfd3] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative group"
                >
                  {course.popular && (
                    <div className="absolute top-4 right-4 bg-[#b28338]/10 text-[#966b26] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#b28338]/20">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-3.5 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#103b2d]/10 text-[#103b2d] flex items-center justify-center shrink-0 group-hover:bg-[#103b2d] group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold tracking-widest uppercase text-[#b28338]">
                          {course.badge} · {course.tag}
                        </span>
                        <h2 className="font-serif text-2xl font-bold text-[#11382b]">
                          {course.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-[15.5px] text-[#4f5953] leading-relaxed mb-5 font-normal">
                      {course.description}
                    </p>

                    <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#eee8dd] mb-6">
                      <p className="text-[12px] font-bold uppercase tracking-wider text-[#103b2d] mb-1">
                        Suitable For:
                      </p>
                      <p className="text-[13.5px] text-[#55635c] leading-relaxed">
                        {course.suitableFor}
                      </p>
                    </div>

                    <div className="space-y-2.5 mb-7">
                      <p className="text-[12px] font-bold uppercase tracking-wider text-[#103b2d]">
                        Key Learning Outcomes:
                      </p>
                      {course.learningPoints.map((point) => (
                        <div key={point} className="flex items-start gap-2.5 text-[14px] text-[#425048]">
                          <CheckCircle2 className="w-4 h-4 text-[#184c3c] shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-[#73827a] font-medium">
                      1-on-1 · 100% Free Trial
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenTrial(course.title)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white text-xs sm:text-sm font-medium transition-colors shadow-xs cursor-pointer group/btn"
                    >
                      <span>Enroll in Free Trial</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Teaching Pillars Banner */}
      <section className="py-14 bg-[#FAF7F2] border-t border-[#ede7dc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-6 border border-[#e5dfd3] flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-[#103b2d]/10 text-[#103b2d] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#11382b] mb-1">
                  1-on-1 Attention
                </h3>
                <p className="text-xs text-[#55635c] leading-relaxed">
                  Tailored learning speed with qualified male and female tutors.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl p-6 border border-[#e5dfd3] flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-[#103b2d]/10 text-[#103b2d] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#11382b] mb-1">
                  Flexible Timings
                </h3>
                <p className="text-xs text-[#55635c] leading-relaxed">
                  Available 24/7 across multiple time zones worldwide.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl p-6 border border-[#e5dfd3] flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-[#103b2d]/10 text-[#103b2d] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#11382b] mb-1">
                  Free Trial Week
                </h3>
                <p className="text-xs text-[#55635c] leading-relaxed">
                  Experience full lessons with no card or obligation required.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
