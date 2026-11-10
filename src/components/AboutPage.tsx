import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  BookOpen, 
  Sparkles, 
  Award, 
  Volume2, 
  Users, 
  Heart, 
  Compass, 
  Baby, 
  UserCheck, 
  GraduationCap 
} from 'lucide-react';

interface AboutPageProps {
  onOpenTrial: () => void;
  onNavigateHome: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenTrial, onNavigateHome }) => {
  const courses = [
    {
      title: 'Noorani Qaida',
      description: 'Learn Arabic letters, pronunciation and basic reading rules.',
      icon: BookOpen,
      tag: '01',
    },
    {
      title: 'Quran Reading',
      description: 'Develop fluency and confidence in Quran recitation.',
      icon: Award,
      tag: '02',
    },
    {
      title: 'Tajweed',
      description: 'Learn the essential rules of Tajweed for correct pronunciation.',
      icon: Sparkles,
      tag: '03',
    },
    {
      title: 'Quran Recitation',
      description: 'Improve recitation with proper guidance and practice.',
      icon: Volume2,
      tag: '04',
    },
  ];

  const teachingPillars = [
    {
      title: 'Personalised One-to-One Lessons',
      desc: 'Each student receives individual attention tailored to their learning speed.',
      icon: Users,
    },
    {
      title: 'Patience & Regular Practice',
      desc: 'Focused on steady daily reinforcement and a gentle, encouraging environment.',
      icon: Heart,
    },
    {
      title: 'Understanding Learning Needs',
      desc: 'Adapted to the specific goals and comfort of children and adult learners alike.',
      icon: Compass,
    },
  ];

  const suitableFor = [
    {
      text: 'Children who are beginning their Quran learning journey.',
      icon: Baby,
      num: '01',
    },
    {
      text: 'Adults who want to improve their Quran reading.',
      icon: UserCheck,
      num: '02',
    },
    {
      text: 'Beginners who want to learn Noorani Qaida.',
      icon: BookOpen,
      num: '03',
    },
    {
      text: 'Students who wish to improve their Tajweed and recitation.',
      icon: GraduationCap,
      num: '04',
    },
  ];

  return (
    <div className="bg-[#FAF7F2] text-[#2D3732] min-h-screen overflow-hidden">
      {/* Breadcrumb Navigation - Drops from top */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-[#e8e2d5] bg-[#FAF7F2]/90 backdrop-blur-xs sticky top-20 z-30"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#103b2d] hover:text-[#b28338] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>

          <div className="text-[13px] text-[#78857f] hidden sm:flex items-center gap-2 font-medium">
            <span 
              onClick={onNavigateHome} 
              className="hover:text-[#103b2d] cursor-pointer transition-colors"
            >
              Home
            </span>
            <span>/</span>
            <span className="text-[#103b2d] font-semibold">About Us</span>
          </div>
        </div>
      </motion.div>

      {/* 1. About Us & Welcome Section */}
      <section className="pt-12 sm:pt-16 pb-16 sm:pb-20 border-b border-[#ede7dc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Text */}
            <div className="lg:col-span-7 space-y-6">
              <motion.span 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-[12px] font-semibold tracking-widest uppercase text-[#b28338] block"
              >
                About Us
              </motion.span>

              <motion.h1 
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-medium text-[#103b2d] leading-[1.2] tracking-tight"
              >
                Welcome to Adam to Muhammad Online Quran Academy
              </motion.h1>

              <div className="space-y-4 text-[16.5px] text-[#44524b] leading-relaxed">
                <motion.p
                  initial={{ opacity: 0, x: -35 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.65, delay: 0.2 }}
                >
                  At <strong className="font-semibold text-[#103b2d]">Adam to Muhammad Online Quran Academy</strong>, we believe that learning the Holy Quran is an important journey for every Muslim. Our aim is to make Quran learning easy, accessible and comfortable for students of all ages.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -35 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.65, delay: 0.35 }}
                >
                  We provide online one-to-one Quran classes for children and adults, allowing students to learn from the comfort of their homes.
                </motion.p>
              </div>
            </div>

            {/* Right Column: Authentic Quran Learning Image - Slide in from Right */}
            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-2xl overflow-hidden border border-[#e4ded2] shadow-md aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="/images/student_home_learning.jpg"
                  alt="Student learning the Holy Quran from home"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-5">
                  <p className="text-white text-xs sm:text-sm font-medium drop-shadow-sm">
                    One-on-one live Quran classes from home
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Our Mission (Centered Green Card - Drops from Top with Glow) */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#ede7dc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="relative rounded-2xl bg-[#103b2d] text-white p-8 sm:p-12 lg:p-14 overflow-hidden shadow-md"
          >
            {/* Ambient glows */}
            <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[#184c3c] blur-3xl pointer-events-none opacity-60"></div>
            <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-[#b28338] blur-3xl pointer-events-none opacity-20"></div>

            <div className="relative max-w-3xl mx-auto text-center space-y-6">
              <div>
                <span className="text-[12px] font-semibold tracking-widest uppercase text-[#d6b265] block mb-2">
                  Our Mission
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-4xl font-medium text-white leading-tight">
                  Our Mission
                </h2>
              </div>
              <blockquote className="text-lg sm:text-xl text-[#dbe7e1] leading-relaxed font-light italic max-w-2xl mx-auto">
                “Our mission is to help students develop a strong connection with the Holy Quran by teaching them with care, patience and dedication. We aim to create a friendly and supportive learning environment where every student can learn at their own pace.”
              </blockquote>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. What We Teach (Centered header, cards animated Left-to-Right) */}
      <section className="py-16 sm:py-24 border-b border-[#ede7dc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <span className="text-[12px] font-semibold tracking-widest uppercase text-[#b28338] block mb-2">
              Courses
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#103b2d] tracking-tight mb-3">
              What We Teach
            </h2>
            <p className="text-[16px] text-[#55635c]">
              We offer the following online Quran courses:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {courses.map((course, idx) => {
              const Icon = course.icon;
              return (
                <motion.div
                  key={course.title}
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: 0.12 + idx * 0.12, ease: 'easeOut' }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl p-7 sm:p-8 border border-[#e4ded2] shadow-xs hover:border-[#103b2d]/30 hover:shadow-md transition-shadow flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-13 h-13 rounded-xl bg-[#FAF7F2] border border-[#e5ded0] flex items-center justify-center text-[#103b2d] group-hover:bg-[#103b2d] group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-semibold text-[#b28338] bg-[#fbf6ec] border border-[#f0e3cc] px-2.5 py-1 rounded-full">
                        {course.tag}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#103b2d] mb-2.5">
                      {course.title}
                    </h3>
                    <p className="text-[15.5px] text-[#55635c] leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Our Teaching Approach (Centered heading, centered card & paragraph, pillars Left-to-Right) */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#ede7dc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="max-w-3xl mx-auto text-center mb-8"
          >
            <span className="text-[12px] font-semibold tracking-widest uppercase text-[#b28338] block mb-2">
              Methodology
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#103b2d] tracking-tight mb-4">
              Our Teaching Approach
            </h2>
          </motion.div>

          {/* Centered Approach Card - Drops in */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#FAF7F2] border border-[#e6dfd2] text-center mb-12 shadow-xs"
          >
            <p className="text-[17px] sm:text-[18px] text-[#2d3a33] leading-relaxed font-medium max-w-2xl mx-auto">
              We provide personalised one-to-one online lessons so that each student receives individual attention. Our teaching approach focuses on patience, regular practice and understanding each student&apos;s learning needs.
            </p>
          </motion.div>

          {/* 3 Pillars - Animated Left to Right */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teachingPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -45 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: 0.2 + idx * 0.15, ease: 'easeOut' }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-[#FAF7F2] rounded-xl p-6 sm:p-7 border border-[#e4ded2] flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-lg bg-[#103b2d] text-white flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#103b2d] leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-[14px] text-[#55635c] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Who Can Join? (Cards animated Left-to-Right) */}
      <section className="py-16 sm:py-24 border-b border-[#ede7dc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <span className="text-[12px] font-semibold tracking-widest uppercase text-[#b28338] block mb-2">
              Eligibility
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#103b2d] tracking-tight mb-3">
              Who Can Join?
            </h2>
            <p className="text-[16px] text-[#55635c]">
              Our classes are suitable for:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {suitableFor.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: 0.12 + index * 0.12, ease: 'easeOut' }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl p-7 border border-[#e4ded2] shadow-xs hover:border-[#103b2d]/30 hover:shadow-sm transition-shadow flex items-start gap-5"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#e5ded0] flex items-center justify-center text-[#103b2d] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-[#b28338] block">
                      {item.num}
                    </span>
                    <p className="text-[16px] font-medium text-[#2d3a33] leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Start Your Quran Learning Journey (Dark Green Section with Simple Underlined Text Link) */}
      <section className="bg-[#103b2d] text-white py-16 sm:py-20 text-center relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: -25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6"
        >
          <span className="text-[12px] font-semibold tracking-widest uppercase text-[#d6b265] block">
            Begin Today
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight">
            Start Your Quran Learning Journey
          </h2>

          <p className="text-[16px] sm:text-[18px] text-[#d9e6e0] max-w-2xl mx-auto leading-relaxed font-light">
            Whether you are a beginner or looking to improve your Quran recitation, we are here to support you.
          </p>

          {/* Simple underlined text - not a button, not golden background */}
          <p className="text-[16px] sm:text-[18px] text-[#d9e6e0] max-w-2xl mx-auto leading-relaxed font-light">
            Book your{' '}
            <button
              type="button"
              onClick={onOpenTrial}
              className="inline font-medium text-white underline underline-offset-4 decoration-[#d6b265] hover:text-[#d6b265] transition-colors cursor-pointer bg-transparent border-0 p-0"
            >
              FREE TRIAL LESSON
            </button>{' '}
            today and take the first step towards learning the Holy Quran with confidence.
          </p>

          <div className="pt-8 border-t border-[#1b4e3e] max-w-md mx-auto space-y-1.5">
            <h3 className="font-serif text-lg sm:text-xl font-medium text-white">
              Adam to Muhammad Online Quran Academy
            </h3>
            <p className="text-[14px] text-[#9fc1b4]">
              Learn the Quran from the Comfort of Your Home.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
