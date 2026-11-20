import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Edit3, ArrowUp, ArrowDown, CheckCircle2, X } from 'lucide-react';
import { adminApi } from '../../../services/api';
import {
  AboutWelcomeContentData,
  AboutCourseCardItem,
  EligibilityCardItem,
} from '../../../types/cms';
import { AVAILABLE_ICON_NAMES } from '../../../utils/iconMap';
import { ImageUploaderField } from '../ImageUploaderField';
import { ConfirmDialog } from '../ConfirmDialog';

interface AboutEditorProps {
  onDataUpdated: () => void;
}

export const AboutEditor: React.FC<AboutEditorProps> = ({ onDataUpdated }) => {
  const [welcome, setWelcome] = useState<AboutWelcomeContentData>({
    section: 'about_welcome',
    heading: '',
    paragraphs: [''],
    imageUrl: '/images/student_home_learning.jpg',
    imageCaption: '',
  });
  const [aboutCourses, setAboutCourses] = useState<AboutCourseCardItem[]>([]);
  const [eligibilityCards, setEligibilityCards] = useState<EligibilityCardItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingWelcome, setSavingWelcome] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // What We Teach Card form
  const [showAcForm, setShowAcForm] = useState(false);
  const [editingAcId, setEditingAcId] = useState<string | null>(null);
  const [acTitle, setAcTitle] = useState('');
  const [acDesc, setAcDesc] = useState('');
  const [acTag, setAcTag] = useState('01');
  const [acIcon, setAcIcon] = useState('BookOpen');

  // Who Can Join Card form
  const [showElForm, setShowElForm] = useState(false);
  const [editingElId, setEditingElId] = useState<string | null>(null);
  const [elNum, setElNum] = useState('01');
  const [elHeading, setElHeading] = useState('');
  const [elDesc, setElDesc] = useState('');
  const [elIcon, setElIcon] = useState('Baby');
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'ac' | 'el'; id: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [contentRes, acRes, elRes] = await Promise.all([
        adminApi.getWebsiteContent(),
        adminApi.listAboutCourseCards(),
        adminApi.listEligibilityCards(),
      ]);
      const map = contentRes.websiteContent as Record<string, any>;
      if (map.about_welcome) {
        setWelcome({
          section: 'about_welcome',
          heading: map.about_welcome.heading || '',
          paragraphs: map.about_welcome.paragraphs?.length ? map.about_welcome.paragraphs : [''],
          imageUrl: map.about_welcome.imageUrl || '/images/student_home_learning.jpg',
          imageCaption: map.about_welcome.imageCaption || '',
        });
      }
      setAboutCourses(acRes.aboutCourseCards);
      setEligibilityCards(elRes.eligibilityCards);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load About Us content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const flashSuccess = (msg: string) => {
    setErrorMsg(null);
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 4000);
    onDataUpdated();
  };

  const handleSaveWelcome = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWelcome(true);
    try {
      await adminApi.updateWebsiteSection('about_welcome', {
        heading: welcome.heading,
        paragraphs: welcome.paragraphs.filter((p) => p.trim().length > 0),
        imageUrl: welcome.imageUrl,
        imageCaption: welcome.imageCaption,
      });
      flashSuccess('About Us Welcome section saved into the public website.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save Welcome section.');
    } finally {
      setSavingWelcome(false);
    }
  };

  // About Course Cards CRUD
  const openNewAc = () => {
    setEditingAcId(null);
    setAcTitle('');
    setAcDesc('');
    setAcTag(String(aboutCourses.length + 1).padStart(2, '0'));
    setAcIcon('BookOpen');
    setShowAcForm(true);
  };

  const openEditAc = (c: AboutCourseCardItem) => {
    setEditingAcId(c._id);
    setAcTitle(c.title);
    setAcDesc(c.description);
    setAcTag(c.tag);
    setAcIcon(c.iconName || 'BookOpen');
    setShowAcForm(true);
  };

  const handleSaveAc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAcId) {
        await adminApi.updateAboutCourseCard(editingAcId, {
          title: acTitle,
          description: acDesc,
          tag: acTag,
          iconName: acIcon,
          order: aboutCourses.find((x) => x._id === editingAcId)?.order ?? 1,
        });
        flashSuccess('Course overview card saved into the public website.');
      } else {
        await adminApi.createAboutCourseCard({
          title: acTitle,
          description: acDesc,
          tag: acTag,
          iconName: acIcon,
          order: aboutCourses.length + 1,
        });
        flashSuccess('Course overview card saved into the public website.');
      }
      setShowAcForm(false);
      await loadData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save card.');
    }
  };

  const handleDeleteAc = async (id: string) => {
    try {
      await adminApi.deleteAboutCourseCard(id);
      setConfirmDelete(null);
      flashSuccess('Course overview card removed from the public website.');
      await loadData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to remove card.');
    }
  };

  // Eligibility Cards CRUD & Reorder
  const openNewEl = () => {
    setEditingElId(null);
    setElNum(String(eligibilityCards.length + 1).padStart(2, '0'));
    setElHeading('');
    setElDesc('');
    setElIcon('Baby');
    setShowElForm(true);
  };

  const openEditEl = (c: EligibilityCardItem) => {
    setEditingElId(c._id);
    setElNum(c.num);
    setElHeading(c.heading || '');
    setElDesc(c.description);
    setElIcon(c.iconName || 'Baby');
    setShowElForm(true);
  };

  const handleSaveEl = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingElId) {
        await adminApi.updateEligibilityCard(editingElId, {
          num: elNum,
          heading: elHeading,
          description: elDesc,
          iconName: elIcon,
          order: eligibilityCards.find((x) => x._id === editingElId)?.order ?? 1,
        });
        flashSuccess('Eligibility card saved into the public website.');
      } else {
        await adminApi.createEligibilityCard({
          num: elNum,
          heading: elHeading,
          description: elDesc,
          iconName: elIcon,
          order: eligibilityCards.length + 1,
        });
        flashSuccess('Eligibility card saved into the public website.');
      }
      setShowElForm(false);
      await loadData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save eligibility card.');
    }
  };

  const handleDeleteEl = async (id: string) => {
    try {
      await adminApi.deleteEligibilityCard(id);
      setConfirmDelete(null);
      flashSuccess('Eligibility card removed from the public website.');
      await loadData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to remove card.');
    }
  };

  const moveEl = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= eligibilityCards.length) return;
    const reordered = [...eligibilityCards];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);
    setEligibilityCards(reordered);
    try {
      await adminApi.reorderEligibilityCards(reordered.map((c) => c._id));
      flashSuccess('Eligibility display order saved into the public website.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to reorder.');
    }
  };

  if (loading) {
    return <div className="p-8 text-sm text-[#55635c]">Loading content...</div>;
  }

  return (
    <div className="space-y-8">
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

      {/* B1. Welcome / Introduction Section */}
      <form onSubmit={handleSaveWelcome} className="bg-white rounded-2xl border border-[#e5dfd3] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#efeae0] pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#11382b]">Welcome / Introduction Section</h3>
            <p className="text-xs text-[#6d7972]">Edit heading, paragraphs, image, and caption. (Our Mission, Methodology, and CTA remain unchanged.)</p>
          </div>
          <button
            type="submit"
            disabled={savingWelcome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] disabled:opacity-60 text-white text-xs font-semibold cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingWelcome ? 'Saving...' : 'Save Welcome'}</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#11382b] mb-1.5">
            Section Heading
          </label>
          <input
            type="text"
            required
            value={welcome.heading}
            onChange={(e) => setWelcome({ ...welcome, heading: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b]"
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#11382b]">
              Paragraphs
            </label>
            <button
              type="button"
              onClick={() => setWelcome({ ...welcome, paragraphs: [...welcome.paragraphs, ''] })}
              className="text-xs font-semibold text-[#184c3c] hover:text-[#b28338] inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Paragraph</span>
            </button>
          </div>
          {welcome.paragraphs.map((p, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <textarea
                rows={3}
                required
                value={p}
                onChange={(e) => {
                  const next = [...welcome.paragraphs];
                  next[idx] = e.target.value;
                  setWelcome({ ...welcome, paragraphs: next });
                }}
                className="flex-1 px-3.5 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm"
              />
              {welcome.paragraphs.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setWelcome({
                      ...welcome,
                      paragraphs: welcome.paragraphs.filter((_, i) => i !== idx),
                    })
                  }
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <ImageUploaderField
          label="Welcome Image"
          value={welcome.imageUrl}
          onChange={(url) => setWelcome({ ...welcome, imageUrl: url })}
        />

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#11382b] mb-1.5">
            Image Caption
          </label>
          <input
            type="text"
            value={welcome.imageCaption}
            onChange={(e) => setWelcome({ ...welcome, imageCaption: e.target.value })}
            placeholder="One-on-one live Quran classes from home"
            className="w-full px-3.5 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm"
          />
        </div>
      </form>

      {/* B2. What We Teach — Course Overview Cards */}
      <div className="bg-white rounded-2xl border border-[#e5dfd3] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efeae0] pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#11382b]">What We Teach — Course Overview Cards</h3>
            <p className="text-xs text-[#6d7972]">Edit, add, or remove cards displayed on the About Us page.</p>
          </div>
          <button
            type="button"
            onClick={openNewAc}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </div>

        {showAcForm && (
          <form onSubmit={handleSaveAc} className="bg-[#FAF7F2] p-5 rounded-xl border border-[#e0d8c8] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-[#11382b]">
                {editingAcId ? 'Edit Overview Card' : 'New Overview Card'}
              </h4>
              <button type="button" onClick={() => setShowAcForm(false)} className="cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Title *</label>
                <input type="text" required value={acTitle} onChange={(e) => setAcTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Tag / Number *</label>
                <input type="text" required value={acTag} onChange={(e) => setAcTag(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Icon</label>
                <select value={acIcon} onChange={(e) => setAcIcon(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm">
                  {AVAILABLE_ICON_NAMES.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Description *</label>
              <textarea rows={2} required value={acDesc} onChange={(e) => setAcDesc(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAcForm(false)} className="px-4 py-2 rounded-lg border border-[#d6cfc1] text-xs font-semibold cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer">Save Card</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {aboutCourses.map((c) => (
            <div key={c._id} className="bg-[#FAF7F2] rounded-xl p-5 border border-[#e5dfd3] flex flex-col justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#b28338]">{c.tag} · {c.iconName}</span>
                <h4 className="font-serif text-lg font-bold text-[#11382b]">{c.title}</h4>
                <p className="text-xs text-[#55635c] mt-1">{c.description}</p>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#e5dfd3]">
                <button type="button" onClick={() => openEditAc(c)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white border border-[#d6cfc1] text-xs font-medium cursor-pointer">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button type="button" onClick={() => setConfirmDelete({ type: 'ac', id: c._id })} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white border border-red-200 text-xs font-medium text-red-600 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* B3. Who Can Join? — Eligibility Cards */}
      <div className="bg-white rounded-2xl border border-[#e5dfd3] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efeae0] pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#11382b]">Who Can Join? — Eligibility Cards</h3>
            <p className="text-xs text-[#6d7972]">Edit headings & descriptions, add/remove cards, and change display order.</p>
          </div>
          <button
            type="button"
            onClick={openNewEl}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Eligibility Card</span>
          </button>
        </div>

        {showElForm && (
          <form onSubmit={handleSaveEl} className="bg-[#FAF7F2] p-5 rounded-xl border border-[#e0d8c8] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-[#11382b]">
                {editingElId ? 'Edit Eligibility Card' : 'New Eligibility Card'}
              </h4>
              <button type="button" onClick={() => setShowElForm(false)} className="cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Number Label *</label>
                <input type="text" required value={elNum} onChange={(e) => setElNum(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Heading (Optional)</label>
                <input type="text" value={elHeading} onChange={(e) => setElHeading(e.target.value)} placeholder="e.g. Young Beginners" className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Icon</label>
                <select value={elIcon} onChange={(e) => setElIcon(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm">
                  {AVAILABLE_ICON_NAMES.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Description *</label>
              <textarea rows={2} required value={elDesc} onChange={(e) => setElDesc(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowElForm(false)} className="px-4 py-2 rounded-lg border border-[#d6cfc1] text-xs font-semibold cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer">Save Card</button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {eligibilityCards.map((item, idx) => (
            <div key={item._id} className="bg-[#FAF7F2] rounded-xl p-4 border border-[#e5dfd3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#b28338]">{item.num} · {item.iconName}</span>
                {item.heading && <h4 className="font-serif font-bold text-[#11382b] text-sm">{item.heading}</h4>}
                <p className="text-sm text-[#2d3a33]">{item.description}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button type="button" disabled={idx === 0} onClick={() => moveEl(idx, -1)} className="p-1.5 rounded bg-white border border-[#d6cfc1] disabled:opacity-40 cursor-pointer" title="Move Up">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" disabled={idx === eligibilityCards.length - 1} onClick={() => moveEl(idx, 1)} className="p-1.5 rounded bg-white border border-[#d6cfc1] disabled:opacity-40 cursor-pointer" title="Move Down">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => openEditEl(item)} className="px-2.5 py-1.5 rounded bg-white border border-[#d6cfc1] text-xs font-medium cursor-pointer">
                  Edit
                </button>
                <button type="button" onClick={() => setConfirmDelete({ type: 'el', id: item._id })} className="px-2.5 py-1.5 rounded bg-white border border-red-200 text-xs font-medium text-red-600 cursor-pointer">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Remove Card"
        message={
          confirmDelete?.type === 'ac'
            ? 'Remove this What We Teach overview card?'
            : 'Remove this Who Can Join eligibility card?'
        }
        confirmLabel="Remove"
        onConfirm={() => {
          if (!confirmDelete) return;
          if (confirmDelete.type === 'ac') handleDeleteAc(confirmDelete.id);
          else handleDeleteEl(confirmDelete.id);
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};
