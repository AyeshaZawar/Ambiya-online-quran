import React, { useState } from 'react';
import { HomeEditor } from './editors/HomeEditor';
import { AboutEditor } from './editors/AboutEditor';
import { CoursesEditor } from './editors/CoursesEditor';
import { PricingEditor } from './editors/PricingEditor';
import { ContactInfoEditor, TrialOptionsEditor } from './editors/ContactAndTrialEditor';

type EditSubTab = 'home' | 'about' | 'courses' | 'pricing' | 'contact' | 'trial-options';

interface EditContentSectionProps {
  onDataUpdated: () => void;
}

export const EditContentSection: React.FC<EditContentSectionProps> = ({ onDataUpdated }) => {
  const [activeTab, setActiveTab] = useState<EditSubTab>('home');

  const tabs: { id: EditSubTab; label: string }[] = [
    { id: 'home', label: 'Home Page' },
    { id: 'about', label: 'About Us Page' },
    { id: 'courses', label: 'Courses Page' },
    { id: 'pricing', label: 'Pricing Page' },
    { id: 'contact', label: 'Contact Page' },
    { id: 'trial-options', label: 'Free Trial Options' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#11382b]">Edit Website Content</h2>
        <p className="text-xs text-[#6d7972] mt-1">
          Select a page below to update its editable text, images, cards, pricing, or registration options.
        </p>
      </div>

      {/* Page Switcher Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#e5dfd3] pb-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#103b2d] text-white shadow-xs'
                  : 'bg-white text-[#4f5953] border border-[#e5dfd3] hover:border-[#103b2d]/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'home' && <HomeEditor onDataUpdated={onDataUpdated} />}
      {activeTab === 'about' && <AboutEditor onDataUpdated={onDataUpdated} />}
      {activeTab === 'courses' && <CoursesEditor onDataUpdated={onDataUpdated} />}
      {activeTab === 'pricing' && <PricingEditor onDataUpdated={onDataUpdated} />}
      {activeTab === 'contact' && <ContactInfoEditor onDataUpdated={onDataUpdated} />}
      {activeTab === 'trial-options' && <TrialOptionsEditor onDataUpdated={onDataUpdated} />}
    </div>
  );
};
