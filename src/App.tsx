/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBanner } from './components/TopBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WhyStudySection } from './components/WhyStudySection';
import { HowWeTeachSection } from './components/HowWeTeachSection';
import { ArticlesSection, ArticleItem } from './components/ArticlesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { PricingSection } from './components/PricingSection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { FreeTrialModal } from './components/FreeTrialModal';
import { ArticleModal } from './components/ArticleModal';
import { AboutPage } from './components/AboutPage';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'about'>('home');
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  // Sync view with hash if user lands on #about or presses back/forward
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#about' || hash === '#about-us') {
        setCurrentView('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#home' || hash === '' || hash === '#') {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenTrial = () => {
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

  const handleNavigateAbout = () => {
    setCurrentView('about');
    window.location.hash = 'about';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    if (window.location.hash === '#about' || window.location.hash === '#about-us') {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D3732] flex flex-col font-sans selection:bg-[#103b2d] selection:text-white">
      {/* 1. Announcement Bar */}
      <TopBanner onOpenTrial={handleOpenTrial} />

      {/* 2. Primary Navigation Bar */}
      <Navbar 
        onOpenTrial={handleOpenTrial} 
        currentView={currentView}
        onNavigateAbout={handleNavigateAbout}
        onNavigateHome={handleNavigateHome}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {currentView === 'about' ? (
          <AboutPage 
            onOpenTrial={handleOpenTrial} 
            onNavigateHome={handleNavigateHome} 
          />
        ) : (
          <>
            {/* 3. Hero Section */}
            <HeroSection onOpenTrial={handleOpenTrial} />

            {/* 4. Why Study With Us */}
            <WhyStudySection onOpenTrial={handleOpenTrial} />

            {/* 5. How We Teach (Our Approach) */}
            <HowWeTeachSection />

            {/* 6. From The Blog (Articles & Reflections) */}
            <ArticlesSection onSelectArticle={handleSelectArticle} />

            {/* 7. Families Say (Testimonials) */}
            <TestimonialsSection />

            {/* 8. Simple Pricing (Affordable Plans for Every Family) */}
            <PricingSection onOpenTrial={handleOpenTrial} />

            {/* 9. Dark Green CTA Section */}
            <CtaBanner onOpenTrial={handleOpenTrial} />
          </>
        )}
      </main>

      {/* 10. Footer */}
      <Footer 
        onOpenTrial={handleOpenTrial} 
        onNavigateAbout={handleNavigateAbout}
        onNavigateHome={handleNavigateHome}
      />

      {/* Interactive Modals */}
      <FreeTrialModal 
        isOpen={trialModalOpen} 
        onClose={handleCloseTrial} 
      />

      <ArticleModal 
        article={selectedArticle} 
        onClose={handleCloseArticle} 
      />
    </div>
  );
}

