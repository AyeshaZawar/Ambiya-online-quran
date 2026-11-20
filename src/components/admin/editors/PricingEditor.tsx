import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, ArrowUp, ArrowDown, CheckCircle2, X, Sparkles } from 'lucide-react';
import { adminApi } from '../../../services/api';
import { PricingPlanItem } from '../../../types/cms';
import { ConfirmDialog } from '../ConfirmDialog';

interface PricingEditorProps {
  onDataUpdated: () => void;
}

export const PricingEditor: React.FC<PricingEditorProps> = ({ onDataUpdated }) => {
  const [plans, setPlans] = useState<PricingPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeletePlan, setConfirmDeletePlan] = useState<PricingPlanItem | null>(null);

  const [planName, setPlanName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('2 days');
  const [daysPerMonth, setDaysPerMonth] = useState('');
  const [classesPerMonth, setClassesPerMonth] = useState('8 classes');
  const [classDuration, setClassDuration] = useState('30 minutes');
  const [monthlyPrice, setMonthlyPrice] = useState<number>(25);
  const [currency, setCurrency] = useState('GBP');
  const [currencySymbol, setCurrencySymbol] = useState('£');
  const [billingPeriod, setBillingPeriod] = useState('month');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [popularBadgeText, setPopularBadgeText] = useState('Most Popular');
  const [ctaText, setCtaText] = useState('Start 1-Week Free Trial');
  const [footnoteText, setFootnoteText] = useState('No credit card required · Cancel anytime');

  const loadPlans = async () => {
    setLoading(true);
    try {
      const res = await adminApi.listPricingPlans();
      setPlans(res.pricingPlans);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load pricing plans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const flashSuccess = (msg: string) => {
    setErrorMsg(null);
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 4000);
    onDataUpdated();
  };

  const openNew = () => {
    setEditingId(null);
    setPlanName('');
    setSubtitle('');
    setDaysPerWeek('2 days');
    setDaysPerMonth('');
    setClassesPerMonth('8 classes');
    setClassDuration('30 minutes');
    setMonthlyPrice(25);
    setCurrency('GBP');
    setCurrencySymbol('£');
    setBillingPeriod('month');
    setDescription('');
    setFeaturesText('1-to-1 dedicated teacher\n30 minutes per class\n100% Free 1-Week Trial included');
    setIsPopular(false);
    setPopularBadgeText('Most Popular');
    setCtaText('Start 1-Week Free Trial');
    setFootnoteText('No credit card required · Cancel anytime');
    setShowForm(true);
  };

  const openEdit = (plan: PricingPlanItem) => {
    setEditingId(plan._id);
    setPlanName(plan.planName);
    setSubtitle(plan.subtitle || '');
    setDaysPerWeek(plan.daysPerWeek);
    setDaysPerMonth(plan.daysPerMonth || '');
    setClassesPerMonth(plan.classesPerMonth);
    setClassDuration(plan.classDuration);
    setMonthlyPrice(plan.monthlyPrice);
    setCurrency(plan.currency);
    setCurrencySymbol(plan.currencySymbol);
    setBillingPeriod(plan.billingPeriod || 'month');
    setDescription(plan.description);
    setFeaturesText(plan.features.join('\n'));
    setIsPopular(plan.isPopular);
    setPopularBadgeText(plan.popularBadgeText || 'Most Popular');
    setCtaText(plan.ctaText || 'Start 1-Week Free Trial');
    setFootnoteText(plan.footnoteText || 'No credit card required · Cancel anytime');
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const features = featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (features.length === 0) {
      setErrorMsg('Please enter at least one plan feature (one per line).');
      return;
    }

    const payload = {
      planName,
      subtitle,
      daysPerWeek,
      daysPerMonth,
      classesPerMonth,
      classDuration,
      monthlyPrice: Number(monthlyPrice),
      currency,
      currencySymbol,
      billingPeriod,
      description,
      features,
      isPopular,
      popularBadgeText,
      ctaText,
      footnoteText,
      order: editingId
        ? plans.find((p) => p._id === editingId)?.order ?? 1
        : plans.length + 1,
    };

    try {
      if (editingId) {
        await adminApi.updatePricingPlan(editingId, payload);
        flashSuccess('Pricing plan saved into the public website.');
      } else {
        await adminApi.createPricingPlan(payload);
        flashSuccess('New pricing plan saved into the public website.');
      }
      setShowForm(false);
      await loadPlans();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save pricing plan.');
    }
  };

  const handleDelete = async (plan: PricingPlanItem) => {
    try {
      await adminApi.deletePricingPlan(plan._id);
      setConfirmDeletePlan(null);
      flashSuccess('Pricing plan removed from the public website.');
      await loadPlans();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete pricing plan.');
    }
  };

  const handleMove = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= plans.length) return;
    const reordered = [...plans];
    const [moved] = reordered.splice(idx, 1);
    reordered.splice(target, 0, moved);
    setPlans(reordered);
    try {
      await adminApi.reorderPricingPlans(reordered.map((p) => p._id));
      flashSuccess('Pricing display order saved into the public website.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to reorder plans.');
    }
  };

  if (loading) {
    return <div className="p-8 text-sm text-[#55635c]">Loading content...</div>;
  }

  return (
    <div className="space-y-6">
      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#e5dfd3] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efeae0] pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#11382b]">Pricing Page — Monthly Plans</h3>
            <p className="text-xs text-[#6d7972]">
              Informational plans (no payment gateway). Edit plan names, days, classes, duration, prices, currencies, badges, and features.
            </p>
          </div>
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Pricing Plan</span>
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="bg-[#FAF7F2] p-5 rounded-xl border border-[#e0d8c8] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-lg font-bold text-[#11382b]">
                {editingId ? 'Edit Pricing Plan' : 'New Pricing Plan'}
              </h4>
              <button type="button" onClick={() => setShowForm(false)} className="cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Plan Name *</label>
                <input type="text" required value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="e.g. Basic Plan" className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Subtitle / Pace Label</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. 2 Days / Week · Gentle & Steady Pace" className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Days per Week *</label>
                <input type="text" required value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} placeholder="2 days" className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Days per Month (Opt.)</label>
                <input type="text" value={daysPerMonth} onChange={(e) => setDaysPerMonth(e.target.value)} placeholder="e.g. 8 days" className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Classes per Month *</label>
                <input type="text" required value={classesPerMonth} onChange={(e) => setClassesPerMonth(e.target.value)} placeholder="8 classes" className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Class Duration *</label>
                <input type="text" required value={classDuration} onChange={(e) => setClassDuration(e.target.value)} placeholder="30 minutes" className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Monthly Price *</label>
                <input type="number" min={0} step="0.01" required value={monthlyPrice} onChange={(e) => setMonthlyPrice(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Currency Code *</label>
                <input type="text" required value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="GBP" className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Currency Symbol *</label>
                <input type="text" required value={currencySymbol} onChange={(e) => setCurrencySymbol(e.target.value)} placeholder="£" className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Billing Period *</label>
                <input type="text" required value={billingPeriod} onChange={(e) => setBillingPeriod(e.target.value)} placeholder="month" className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Description *</label>
              <textarea rows={2} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Features (One per line) *</label>
              <textarea rows={4} required value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#11382b] cursor-pointer pb-2">
                <input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} className="w-4 h-4 accent-[#184c3c]" />
                <span>Highlight with Popular Badge</span>
              </label>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Badge Text</label>
                <input type="text" value={popularBadgeText} onChange={(e) => setPopularBadgeText(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Button Text</label>
                <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Card Footnote Text</label>
              <input type="text" value={footnoteText} onChange={(e) => setFootnoteText(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[#d6cfc1] text-xs font-semibold cursor-pointer">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer">Save Pricing Plan</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan, idx) => (
            <div key={plan._id} className="bg-[#FAF7F2] rounded-xl p-5 border border-[#e5dfd3] flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-serif text-lg font-bold text-[#11382b]">{plan.planName}</span>
                  {plan.isPopular && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#b28338] text-white text-[10px] font-bold uppercase">
                      <Sparkles className="w-3 h-3" /> {plan.popularBadgeText}
                    </span>
                  )}
                </div>
                <p className="text-xl font-bold text-[#184c3c]">
                  {plan.currencySymbol}{plan.monthlyPrice}/{plan.billingPeriod} <span className="text-xs font-normal text-[#6d7972]">({plan.currency})</span>
                </p>
                <p className="text-xs text-[#4f5953] mt-1">
                  {plan.daysPerWeek}/wk · {plan.classesPerMonth}/mo · {plan.classDuration}
                </p>
                <p className="text-xs text-[#55635c] mt-2">{plan.description}</p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-1.5 pt-3 border-t border-[#e5dfd3]">
                <button type="button" disabled={idx === 0} onClick={() => handleMove(idx, -1)} className="p-1.5 rounded bg-white border border-[#d6cfc1] disabled:opacity-40 cursor-pointer">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" disabled={idx === plans.length - 1} onClick={() => handleMove(idx, 1)} className="p-1.5 rounded bg-white border border-[#d6cfc1] disabled:opacity-40 cursor-pointer">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => openEdit(plan)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white border border-[#d6cfc1] text-xs font-medium cursor-pointer">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button type="button" onClick={() => setConfirmDeletePlan(plan)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white border border-red-200 text-xs font-medium text-red-600 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDeletePlan)}
        title="Delete Pricing Plan"
        message={confirmDeletePlan ? `Delete "${confirmDeletePlan.planName}"?` : ''}
        onConfirm={() => confirmDeletePlan && handleDelete(confirmDeletePlan)}
        onCancel={() => setConfirmDeletePlan(null)}
      />
    </div>
  );
};
