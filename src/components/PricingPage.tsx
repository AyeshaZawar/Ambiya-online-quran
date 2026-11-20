import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { PricingPlanItem } from '../types/cms';
import { FALLBACK_BOOTSTRAP_DATA } from '../data/fallbackData';

interface PricingPageProps {
  onOpenTrial: (course?: string) => void;
  onNavigateHome: () => void;
  pricingPlans?: PricingPlanItem[];
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onOpenTrial,
  onNavigateHome,
  pricingPlans,
}) => {
  const plans =
    pricingPlans !== undefined ? pricingPlans : FALLBACK_BOOTSTRAP_DATA.pricingPlans;

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
            <span className="text-[#103b2d] font-semibold">Pricing</span>
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
            Our Monthly Plans
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif text-[34px] sm:text-[44px] text-[#11382b] font-normal tracking-[-0.01em] mb-5 leading-tight"
          >
            Affordable Plans for Every Family
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[16px] sm:text-[17px] text-[#4f5953] leading-relaxed max-w-2xl mx-auto"
          >
            All prices in GBP (£) · Per student · One-to-one classes. Start with a completely free trial week — no card required.
          </motion.p>
        </div>
      </section>

      {/* Pricing Plans Grid */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan._id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: (idx % 4) * 0.12, ease: 'easeOut' }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
                  plan.isPopular
                    ? 'bg-[#103b2d] text-white shadow-xl ring-2 ring-[#b28338]'
                    : 'bg-white text-[#2D3732] border border-[#e5dfd3] shadow-xs hover:shadow-md'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#b28338] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{plan.popularBadgeText || 'Most Popular'}</span>
                  </div>
                )}

                <div>
                  <div className="mb-5">
                    {plan.subtitle && (
                      <span className={`text-[12px] font-semibold tracking-wider uppercase block mb-1 ${
                        plan.isPopular ? 'text-[#dfc588]' : 'text-[#b28338]'
                      }`}>
                        {plan.subtitle}
                      </span>
                    )}
                    <h2 className={`font-serif text-2xl sm:text-3xl font-bold mb-2 ${
                      plan.isPopular ? 'text-white' : 'text-[#11382b]'
                    }`}>
                      {plan.planName}
                    </h2>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mt-3 mb-2">
                      <span className={`font-serif text-3xl sm:text-4xl font-bold ${
                        plan.isPopular ? 'text-[#dfc588]' : 'text-[#103b2d]'
                      }`}>
                        {plan.currencySymbol}{plan.monthlyPrice}
                      </span>
                      <span className={`text-sm ${plan.isPopular ? 'text-[#c0d4ca]' : 'text-[#58645e]'}`}>
                        /{plan.billingPeriod || 'month'} ({plan.currency})
                      </span>
                    </div>

                    {/* Schedule Breakdown */}
                    <div className={`text-xs space-y-1 pt-2 ${plan.isPopular ? 'text-[#c0d4ca]' : 'text-[#58645e]'}`}>
                      <p>
                        <strong className={plan.isPopular ? 'text-white' : 'text-[#11382b]'}>
                          {plan.daysPerWeek}
                        </strong> per week
                        {plan.daysPerMonth ? ` · ${plan.daysPerMonth} per month` : ''}
                      </p>
                      <p>
                        <strong className={plan.isPopular ? 'text-white' : 'text-[#11382b]'}>
                          {plan.classesPerMonth}
                        </strong> per month · {plan.classDuration} / class
                      </p>
                    </div>
                  </div>

                  <p className={`text-[14px] leading-relaxed mb-6 pb-6 border-b ${
                    plan.isPopular ? 'text-[#cadcd2] border-white/15' : 'text-[#4f5953] border-stone-100'
                  }`}>
                    {plan.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    <p className={`text-xs font-bold uppercase tracking-wider ${
                      plan.isPopular ? 'text-[#dfc588]' : 'text-[#103b2d]'
                    }`}>
                      What's Included:
                    </p>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-[14px]">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                          plan.isPopular ? 'text-[#dfc588]' : 'text-[#184c3c]'
                        }`} />
                        <span className={plan.isPopular ? 'text-[#e5ede9]' : 'text-[#45524b]'}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => onOpenTrial()}
                    className={`w-full py-3.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      plan.isPopular
                        ? 'bg-[#dfc588] text-[#11382b] hover:bg-[#d4b76e]'
                        : 'bg-[#184c3c] text-white hover:bg-[#123b2e]'
                    }`}
                  >
                    <span>{plan.ctaText || 'Start 1-Week Free Trial'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className={`text-[11px] text-center mt-2 ${
                    plan.isPopular ? 'text-[#a2bcaf]' : 'text-[#7d8b84]'
                  }`}>
                    {plan.footnoteText || 'No credit card required · Cancel anytime'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Trial Guarantee Note */}
      <section className="py-12 bg-white border-t border-[#ede7dc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF7F2] rounded-2xl p-6 sm:p-8 border border-[#e5dfd3] flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-[#103b2d]/10 text-[#103b2d] flex items-center justify-center shrink-0">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-serif text-xl font-bold text-[#11382b] mb-1">
                Have questions about our rates or schedule?
              </h3>
              <p className="text-[14px] text-[#4f5953] leading-relaxed">
                We offer custom family discounts for siblings and multiple family members studying together. Contact us for our current international fee schedule.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenTrial()}
              className="px-6 py-3 rounded-lg bg-[#184c3c] text-white text-xs sm:text-sm font-medium hover:bg-[#123b2e] transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              Contact Coordinator
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
