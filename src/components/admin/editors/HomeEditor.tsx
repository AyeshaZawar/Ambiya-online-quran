import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Edit3, CheckCircle2, X } from 'lucide-react';
import { adminApi } from '../../../services/api';
import { HeroContentData, WhyStudyContentData, TestimonialItem } from '../../../types/cms';
import { ImageUploaderField } from '../ImageUploaderField';
import { ConfirmDialog } from '../ConfirmDialog';

interface HomeEditorProps {
  onDataUpdated: () => void;
}

export const HomeEditor: React.FC<HomeEditorProps> = ({ onDataUpdated }) => {
  const [hero, setHero] = useState<HeroContentData>({
    section: 'home_hero',
    heading: 'Learn the Quran with Tajweed, from the Comfort of Home',
    introParagraph: '',
    steps: ['', '', ''],
    imageUrl: '/images/hero_quran_academy.jpg',
  });
  const [whyStudy, setWhyStudy] = useState<WhyStudyContentData>({
    section: 'home_why_study',
    heading: 'A Quran School Built Around Your Schedule',
    paragraphs: ['', ''],
    imageUrl: '/images/student_home_learning.jpg',
  });
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [savingWhy, setSavingWhy] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Testimonial modal/inline form
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [tQuote, setTQuote] = useState('');
  const [tAuthor, setTAuthor] = useState('');
  const [tLocation, setTLocation] = useState('');
  const [showTForm, setShowTForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [contentRes, testRes] = await Promise.all([
        adminApi.getWebsiteContent(),
        adminApi.listTestimonials(),
      ]);
      const map = contentRes.websiteContent as Record<string, any>;
      if (map.home_hero) {
        setHero({
          section: 'home_hero',
          heading:
            map.home_hero.heading !== undefined
              ? map.home_hero.heading
              : 'Learn the Quran with Tajweed, from the Comfort of Home',
          introParagraph: map.home_hero.introParagraph ?? '',
          steps: map.home_hero.steps?.length ? map.home_hero.steps : [],
          imageUrl:
            map.home_hero.imageUrl !== undefined
              ? map.home_hero.imageUrl
              : '/images/hero_quran_academy.jpg',
        });
      }
      if (map.home_why_study) {
        setWhyStudy({
          section: 'home_why_study',
          heading:
            map.home_why_study.heading !== undefined
              ? map.home_why_study.heading
              : 'A Quran School Built Around Your Schedule',
          paragraphs: map.home_why_study.paragraphs?.length ? map.home_why_study.paragraphs : [''],
          imageUrl:
            map.home_why_study.imageUrl !== undefined
              ? map.home_why_study.imageUrl
              : '/images/student_home_learning.jpg',
        });
      }
      setTestimonials(testRes.testimonials);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load Home content.');
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

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHero(true);
    setErrorMsg(null);
    try {
      await adminApi.updateWebsiteSection('home_hero', {
        heading: hero.heading ?? '',
        introParagraph: hero.introParagraph ?? '',
        steps: hero.steps.filter((s) => s.trim().length > 0),
        imageUrl: hero.imageUrl ?? '',
      });
      flashSuccess('Home Hero section saved into the public website.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save Hero section.');
    } finally {
      setSavingHero(false);
    }
  };

  const handleSaveWhyStudy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWhy(true);
    setErrorMsg(null);
    try {
      await adminApi.updateWebsiteSection('home_why_study', {
        heading: whyStudy.heading ?? '',
        paragraphs: whyStudy.paragraphs.filter((p) => p.trim().length > 0),
        imageUrl: whyStudy.imageUrl ?? '',
      });
      flashSuccess('Why Study With Us section saved into the public website.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save Why Study section.');
    } finally {
      setSavingWhy(false);
    }
  };

  const openNewTestimonial = () => {
    setEditingTestimonialId(null);
    setTQuote('');
    setTAuthor('');
    setTLocation('');
    setShowTForm(true);
  };

  const openEditTestimonial = (item: TestimonialItem) => {
    setEditingTestimonialId(item._id);
    setTQuote(item.quote);
    setTAuthor(item.author);
    setTLocation(item.location || '');
    setShowTForm(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      if (editingTestimonialId) {
        await adminApi.updateTestimonial(editingTestimonialId, {
          quote: tQuote,
          author: tAuthor,
          location: tLocation.trim() || null,
          order: testimonials.find((t) => t._id === editingTestimonialId)?.order ?? 1,
        });
        flashSuccess('Testimonial saved into the public website.');
      } else {
        await adminApi.createTestimonial({
          quote: tQuote,
          author: tAuthor,
          location: tLocation.trim() || null,
          order: testimonials.length + 1,
        });
        flashSuccess('New testimonial saved into the public website.');
      }
      setShowTForm(false);
      await loadData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save testimonial.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await adminApi.deleteTestimonial(id);
      setConfirmDeleteId(null);
      flashSuccess('Testimonial removed from the public website.');
      await loadData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete testimonial.');
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

      {/* A1. Hero Section */}
      <form onSubmit={handleSaveHero} className="bg-white rounded-2xl border border-[#e5dfd3] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#efeae0] pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#11382b]">Hero Section</h3>
            <p className="text-xs text-[#6d7972]">Edit introductory paragraph, numbered steps, and hero image.</p>
          </div>
          <button
            type="submit"
            disabled={savingHero}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] disabled:opacity-60 text-white text-xs font-semibold cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingHero ? 'Saving...' : 'Save Hero'}</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#11382b] mb-1.5">
            Hero Main Heading (Leave empty to remove)
          </label>
          <input
            type="text"
            value={hero.heading ?? ''}
            onChange={(e) => setHero({ ...hero, heading: e.target.value })}
            placeholder="Learn the Quran with Tajweed, from the Comfort of Home"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#11382b] mb-1.5">
            Introductory Paragraph
          </label>
          <textarea
            rows={3}
            value={hero.introParagraph}
            onChange={(e) => setHero({ ...hero, introParagraph: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c]"
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#11382b]">
              Numbered Bullet Points
            </label>
            <button
              type="button"
              onClick={() => setHero({ ...hero, steps: [...hero.steps, ''] })}
              className="text-xs font-semibold text-[#184c3c] hover:text-[#b28338] inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Step</span>
            </button>
          </div>
          {hero.steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#103b2d] text-white text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <input
                type="text"
                required
                value={step}
                onChange={(e) => {
                  const next = [...hero.steps];
                  next[idx] = e.target.value;
                  setHero({ ...hero, steps: next });
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b]"
              />
              {hero.steps.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setHero({ ...hero, steps: hero.steps.filter((_, sIdx) => sIdx !== idx) })
                  }
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  aria-label="Remove step"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <ImageUploaderField
          label="Hero Image"
          value={hero.imageUrl}
          onChange={(url) => setHero({ ...hero, imageUrl: url })}
        />
      </form>

      {/* A2. Why Study With Us */}
      <form onSubmit={handleSaveWhyStudy} className="bg-white rounded-2xl border border-[#e5dfd3] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#efeae0] pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#11382b]">Why Study With Us Section</h3>
            <p className="text-xs text-[#6d7972]">Edit paragraphs and replace section photography.</p>
          </div>
          <button
            type="submit"
            disabled={savingWhy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] disabled:opacity-60 text-white text-xs font-semibold cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingWhy ? 'Saving...' : 'Save Section'}</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#11382b] mb-1.5">
            Section Heading (Leave empty to remove)
          </label>
          <input
            type="text"
            value={whyStudy.heading ?? ''}
            onChange={(e) => setWhyStudy({ ...whyStudy, heading: e.target.value })}
            placeholder="A Quran School Built Around Your Schedule"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b] focus:outline-none focus:ring-2 focus:ring-[#184c3c]"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#11382b]">
              Section Paragraphs
            </label>
            <button
              type="button"
              onClick={() => setWhyStudy({ ...whyStudy, paragraphs: [...whyStudy.paragraphs, ''] })}
              className="text-xs font-semibold text-[#184c3c] hover:text-[#b28338] inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Paragraph</span>
            </button>
          </div>
          {whyStudy.paragraphs.map((para, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <textarea
                rows={3}
                required
                value={para}
                onChange={(e) => {
                  const next = [...whyStudy.paragraphs];
                  next[idx] = e.target.value;
                  setWhyStudy({ ...whyStudy, paragraphs: next });
                }}
                className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm text-[#11382b]"
              />
              {whyStudy.paragraphs.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setWhyStudy({
                      ...whyStudy,
                      paragraphs: whyStudy.paragraphs.filter((_, pIdx) => pIdx !== idx),
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
          label="Section Image"
          value={whyStudy.imageUrl}
          onChange={(url) => setWhyStudy({ ...whyStudy, imageUrl: url })}
        />
      </form>

      {/* A3. Student Testimonials */}
      <div className="bg-white rounded-2xl border border-[#e5dfd3] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efeae0] pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#11382b]">Student Testimonials</h3>
            <p className="text-xs text-[#6d7972]">Add, edit, or delete student and parent review cards.</p>
          </div>
          <button
            type="button"
            onClick={openNewTestimonial}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Review Card</span>
          </button>
        </div>

        {showTForm && (
          <form onSubmit={handleSaveTestimonial} className="bg-[#FAF7F2] p-5 rounded-xl border border-[#e0d8c8] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-[#11382b]">
                {editingTestimonialId ? 'Edit Review Card' : 'New Review Card'}
              </h4>
              <button
                type="button"
                onClick={() => setShowTForm(false)}
                className="p-1 text-[#55635c] hover:text-[#11382b] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#11382b] mb-1">
                Review Quote *
              </label>
              <textarea
                rows={3}
                required
                value={tQuote}
                onChange={(e) => setTQuote(e.target.value)}
                placeholder='"The tutors are patient and make learning enjoyable..."'
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#11382b] mb-1">
                  Student / Parent Name or Label *
                </label>
                <input
                  type="text"
                  required
                  value={tAuthor}
                  onChange={(e) => setTAuthor(e.target.value)}
                  placeholder="e.g. Parent of Two Students"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#11382b] mb-1">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={tLocation}
                  onChange={(e) => setTLocation(e.target.value)}
                  placeholder="e.g. United Kingdom"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowTForm(false)}
                className="px-4 py-2 rounded-lg border border-[#d6cfc1] text-xs font-semibold text-[#4f5953] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer"
              >
                Save Review
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((item) => (
            <div key={item._id} className="bg-[#FAF7F2] rounded-xl p-5 border border-[#e5dfd3] flex flex-col justify-between gap-4">
              <div>
                <p className="text-xs italic text-[#333e38] leading-relaxed mb-3">{item.quote}</p>
                <p className="text-sm font-bold text-[#11382b]">{item.author}</p>
                {item.location && <p className="text-xs text-[#6d7972]">{item.location}</p>}
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e5dfd3]">
                <button
                  type="button"
                  onClick={() => openEditTestimonial(item)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white border border-[#d6cfc1] text-xs font-medium text-[#11382b] hover:bg-stone-50 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(item._id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDeleteId)}
        title="Delete Review Card"
        message="Delete this student/parent review card? This action cannot be undone."
        onConfirm={() => confirmDeleteId && handleDeleteTestimonial(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};
