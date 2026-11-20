/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
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
import { FreeTrialModal } from './components/FreeTrialModal';
import { ArticleModal } from './components/ArticleModal';
import { AboutPage } from './components/AboutPage';
import { CoursesPage } from './components/CoursesPage';
import { PricingPage } from './components/PricingPage';
import { BlogPage } from './components/BlogPage';
import { ContactPage } from './components/ContactPage';
import { AdminPanel } from './components/admin/AdminPanel';
import { PublicBootstrapData } from './types/cms';
import { FALLBACK_BOOTSTRAP_DATA } from './data/fallbackData';
import { publicApi } from './services/api';

const PRIMARY_ADMIN_SLUG = 'management-portal';
const ADMIN_ROUTE_SLUGS = new Set(['management-portal', 'tutors-personal-space']);

function isAdminPath(pathname: string): boolean {
  const cleanPath = pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
  return ADMIN_ROUTE_SLUGS.has(cleanPath);
}

function resolveViewFromLocation(): ViewState {
  if (isAdminPath(window.location.pathname)) {
    return 'admin';
  }
  const rawHash = window.location.hash.toLowerCase().replace('#', '');
  const hash = rawHash.split('?')[0];
  if (ADMIN_ROUTE_SLUGS.has(hash)) {
    return 'admin';
  } else if (hash === 'about' || hash === 'about-us') {
    return 'about';
  } else if (hash === 'courses' || hash === 'courses-page') {
    return 'courses';
  } else if (hash === 'pricing' || hash === 'fees') {
    return 'pricing';
  } else if (hash === 'blog' || hash === 'articles') {
    return 'blog';
  } else if (hash === 'contact' || hash === 'contact-us') {
    return 'contact';
  }
  return 'home';
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>(() => resolveViewFromLocation());
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [selectedCourseForTrial, setSelectedCourseForTrial] = useState<string>('Noorani Qaida');
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [siteData, setSiteData] = useState<PublicBootstrapData>(FALLBACK_BOOTSTRAP_DATA);

  const loadSiteData = useCallback(async () => {
    try {
      const data = await publicApi.getBootstrap();
      setSiteData(data);
    } catch {
      // Keep fallback data if database is temporarily unavailable
    }
  }, []);

  useEffect(() => {
    loadSiteData();
  }, [loadSiteData]);

  // Sync view with hash on initial load and popstate/hashchange
  useEffect(() => {
    const handleRoute = () => {
      setCurrentView(resolveViewFromLocation());
    };

    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('popstate', handleRoute);
    return () => {
      window.removeEventListener('hashchange', handleRoute);
      window.removeEventListener('popstate', handleRoute);
    };
  }, []);

  const handleOpenTrial = (course?: string) => {
    if (course) {
      setSelectedCourseForTrial(course);
    } else if (siteData.courses.length > 0) {
      setSelectedCourseForTrial(siteData.courses[0].title);
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
      if (window.location.hash || isAdminPath(window.location.pathname)) {
        window.history.pushState(null, '', '/');
      }
    } else if (view === 'admin') {
      window.location.hash = PRIMARY_ADMIN_SLUG;
    } else {
      if (isAdminPath(window.location.pathname)) {
        window.history.pushState(null, '', `/#${view}`);
      } else {
        window.location.hash = view;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'admin') {
    return (
      <AdminPanel
        onExitAdmin={() => {
          loadSiteData();
          handleNavigate('home');
        }}
        onDataUpdated={loadSiteData}
      />
    );
  }

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
            welcomeContent={siteData.websiteContent.about_welcome}
            aboutCourseCards={siteData.aboutCourseCards}
            eligibilityCards={siteData.eligibilityCards}
          />
        )}

        {currentView === 'courses' && (
          <CoursesPage 
            onOpenTrial={handleOpenTrial} 
            onNavigateHome={() => handleNavigate('home')}
            courses={siteData.courses}
          />
        )}

        {currentView === 'pricing' && (
          <PricingPage 
            onOpenTrial={handleOpenTrial} 
            onNavigateHome={() => handleNavigate('home')}
            pricingPlans={siteData.pricingPlans}
          />
        )}

        {currentView === 'blog' && (
          <BlogPage 
            onSelectArticle={handleSelectArticle} 
            onNavigateHome={() => handleNavigate('home')}
            blogs={siteData.blogs}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage 
            onOpenTrial={() => handleOpenTrial()} 
            onNavigateHome={() => handleNavigate('home')}
            contactInfo={siteData.contactInfo}
          />
        )}

        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection 
              onOpenTrial={() => handleOpenTrial()} 
              content={siteData.websiteContent.home_hero}
            />

            {/* Why Study With Us */}
            <WhyStudySection 
              onOpenTrial={() => handleOpenTrial()} 
              content={siteData.websiteContent.home_why_study}
            />

            {/* How We Teach (Unchanged) */}
            <HowWeTeachSection />

            {/* From The Blog (Articles & Reflections — Single source of truth) */}
            <ArticlesSection 
              onSelectArticle={handleSelectArticle} 
              blogs={siteData.blogs}
            />

            {/* Families Say (Testimonials) */}
            <TestimonialsSection testimonials={siteData.testimonials} />

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
        activeCourses={siteData.courses}
        registrationSettings={siteData.registrationSettings}
      />

      <ArticleModal 
        article={selectedArticle} 
        onClose={handleCloseArticle} 
      />
    </div>
  );
}
