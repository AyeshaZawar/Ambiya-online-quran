/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBanner } from './components/TopBanner';
import { Navbar, ViewState } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WhyStudySection } from './components/WhyStudySection';
import { HowWeTeachSection } from './components/HowWeTeachSection';
import { ArticlesSection, ArticleItem } from './components/ArticlesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { PricingSection } from './components/PricingSection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { FreeTrialModal, QuranCourseType } from './components/FreeTrialModal';
import { ArticleModal } from './components/ArticleModal';
import { AboutPage } from './components/AboutPage';
import { CoursesPage } from './components/CoursesPage';
import { PricingPage } from './components/PricingPage';
import { BlogPage } from './components/BlogPage';
import { ContactPage } from './components/ContactPage';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [selectedCourseForTrial, setSelectedCourseForTrial] = useState<QuranCourseType>('Noorani Qaida');
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  // Sync view with hash on initial load and popstate/hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash === 'about' || hash === 'about-us') {
        setCurrentView('about');
      } else if (hash === 'courses' || hash === 'courses-page') {
        setCurrentView('courses');
      } else if (hash === 'pricing' || hash === 'fees') {
        setCurrentView('pricing');
      } else if (hash === 'blog' || hash === 'articles') {
        setCurrentView('blog');
      } else if (hash === 'contact' || hash === 'contact-us') {
        setCurrentView('contact');
      } else {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenTrial = (course?: QuranCourseType) => {
    if (course) {
      setSelectedCourseForTrial(course);
    }
    setTrialModalOpen(true);
  };

  const handleCloseTrial = () => {
    setTrialModalOpen(false);
  };

  const handleSelectArticle = (article: ArticleItem) => {
    setSelectedArticle(article);
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    if (view === 'home') {
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname);
      }
    } else {
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D3732] flex flex-col font-sans selection:bg-[#103b2d] selection:text-white">
      {/* 1. Announcement Bar */}
      <TopBanner onOpenTrial={() => handleOpenTrial()} />

      {/* 2. Primary Navigation Bar with Home, About, Courses, Pricing, Blog, Contact */}
      <Navbar 
        onOpenTrial={() => handleOpenTrial()} 
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {currentView === 'about' && (
          <AboutPage 
            onOpenTrial={() => handleOpenTrial()} 
            onNavigateHome={() => handleNavigate('home')} 
          />
        )}

        {currentView === 'courses' && (
          <CoursesPage 
            onOpenTrial={handleOpenTrial} 
            onNavigateHome={() => handleNavigate('home')} 
          />
        )}

        {currentView === 'pricing' && (
          <PricingPage 
            onOpenTrial={handleOpenTrial} 
            onNavigateHome={() => handleNavigate('home')} 
          />
        )}

        {currentView === 'blog' && (
          <BlogPage 
            onSelectArticle={handleSelectArticle} 
            onNavigateHome={() => handleNavigate('home')} 
          />
        )}

        {currentView === 'contact' && (
          <ContactPage 
            onOpenTrial={() => handleOpenTrial()} 
            onNavigateHome={() => handleNavigate('home')} 
          />
        )}

        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection onOpenTrial={() => handleOpenTrial()} />

            {/* Why Study With Us */}
            <WhyStudySection onOpenTrial={() => handleOpenTrial()} />

            {/* How We Teach (Our Approach - 4 cards: 2 from left, 2 from right) */}
            <HowWeTeachSection />

            {/* From The Blog (Articles & Reflections) */}
            <ArticlesSection onSelectArticle={handleSelectArticle} />

            {/* Families Say (Testimonials) */}
            <TestimonialsSection />

            {/* Simple Pricing (Affordable Plans for Every Family) */}
            <PricingSection onOpenTrial={() => handleOpenTrial()} />

            {/* Dark Green CTA Section */}
            <CtaBanner onOpenTrial={() => handleOpenTrial()} />
          </>
        )}
      </main>

      {/* Footer with links across all pages */}
      <Footer 
        onOpenTrial={() => handleOpenTrial()} 
        onNavigate={handleNavigate}
      />

      {/* Interactive Modals */}
      <FreeTrialModal 
        isOpen={trialModalOpen} 
        onClose={handleCloseTrial} 
        initialCourse={selectedCourseForTrial}
      />

      <ArticleModal 
        article={selectedArticle} 
        onClose={handleCloseArticle} 
      />
    </div>
  );
}
