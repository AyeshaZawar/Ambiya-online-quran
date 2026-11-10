/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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

export default function App() {
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

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

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D3732] flex flex-col font-sans selection:bg-[#11382b] selection:text-white">
      {/* 1. Announcement Bar */}
      <TopBanner onOpenTrial={handleOpenTrial} />

      {/* 2. Primary Navigation Bar */}
      <Navbar onOpenTrial={handleOpenTrial} />

      {/* Main Content Sections */}
      <main className="flex-1">
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
      </main>

      {/* 10. Footer */}
      <Footer onOpenTrial={handleOpenTrial} />

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
