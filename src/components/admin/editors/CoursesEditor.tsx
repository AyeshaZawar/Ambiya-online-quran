import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, ArrowUp, ArrowDown, CheckCircle2, X, Power } from 'lucide-react';
import { adminApi } from '../../../services/api';
import { CourseItem } from '../../../types/cms';
import { AVAILABLE_ICON_NAMES } from '../../../utils/iconMap';
import { ConfirmDialog } from '../ConfirmDialog';

interface CoursesEditorProps {
  onDataUpdated: () => void;
}

export const CoursesEditor: React.FC<CoursesEditorProps> = ({ onDataUpdated }) => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteCourse, setConfirmDeleteCourse] = useState<CourseItem | null>(null);

  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('Course 01');
  const [tag, setTag] = useState('Foundation');
  const [description, setDescription] = useState('');
  const [suitableFor, setSuitableFor] = useState('');
  const [learningPointsText, setLearningPointsText] = useState('');
  const [iconName, setIconName] = useState('BookOpen');
  const [popular, setPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await adminApi.listCourses();
      setCourses(res.courses);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const flashSuccess = (msg: string) => {
    setErrorMsg(null);
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 4000);
    onDataUpdated();
  };

  const openNew = () => {
    setEditingId(null);
    setTitle('');
    setBadge(`Course ${String(courses.length + 1).padStart(2, '0')}`);
    setTag('Curriculum');
    setDescription('');
    setSuitableFor('');
    setLearningPointsText('');
    setIconName('BookOpen');
    setPopular(false);
    setIsActive(true);
    setShowForm(true);
  };

  const openEdit = (course: CourseItem) => {
    setEditingId(course._id);
    setTitle(course.title);
    setBadge(course.badge);
    setTag(course.tag);
    setDescription(course.description);
    setSuitableFor(course.suitableFor);
    setLearningPointsText(course.learningPoints.join('\n'));
    setIconName(course.iconName || 'BookOpen');
    setPopular(course.popular);
    setIsActive(course.isActive);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const learningPoints = learningPointsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (learningPoints.length === 0) {
      setErrorMsg('Please enter at least one Key Learning Outcome (one per line).');
      return;
    }

    const payload = {
      title,
      badge,
      tag,
      description,
      suitableFor,
      learningPoints,
      iconName,
      popular,
      isActive,
      order: editingId
        ? courses.find((c) => c._id === editingId)?.order ?? 1
        : courses.length + 1,
    };

    try {
      if (editingId) {
        await adminApi.updateCourse(editingId, payload);
        flashSuccess('Course saved into the public website and synced with Free Trial Registration options.');
      } else {
        await adminApi.createCourse(payload);
        flashSuccess('New course saved into the public website and synced with Free Trial Registration options.');
      }
      setShowForm(false);
      await loadCourses();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save course.');
    }
  };

  const handleToggleActive = async (course: CourseItem) => {
    try {
      await adminApi.updateCourse(course._id, {
        title: course.title,
        badge: course.badge,
        tag: course.tag,
        description: course.description,
        suitableFor: course.suitableFor,
        learningPoints: course.learningPoints,
        iconName: course.iconName,
        popular: course.popular,
        isActive: !course.isActive,
        order: course.order,
      });
      flashSuccess(
        `Course "${course.title}" is now ${!course.isActive ? 'active' : 'inactive'} on the Courses Page and Registration Form.`
      );
      await loadCourses();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to toggle course status.');
    }
  };

  const handleDelete = async (course: CourseItem) => {
    try {
      await adminApi.deleteCourse(course._id);
      setConfirmDeleteCourse(null);
      flashSuccess('Course removed from the public website.');
      await loadCourses();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete course.');
    }
  };

  const handleMove = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= courses.length) return;
    const reordered = [...courses];
    const [moved] = reordered.splice(idx, 1);
    reordered.splice(target, 0, moved);
    setCourses(reordered);
    try {
      await adminApi.reorderCourses(reordered.map((c) => c._id));
      flashSuccess('Course display order saved into the public website.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to reorder courses.');
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
            <h3 className="font-serif text-xl font-bold text-[#11382b]">Courses Page Management</h3>
            <p className="text-xs text-[#6d7972]">
              Active courses automatically sync with the Select Course field in the Free Trial Registration Form. (Teaching Pillars remain unchanged.)
            </p>
          </div>
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Course Card</span>
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="bg-[#FAF7F2] p-5 rounded-xl border border-[#e0d8c8] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-lg font-bold text-[#11382b]">
                {editingId ? 'Edit Course Card' : 'New Course Card'}
              </h4>
              <button type="button" onClick={() => setShowForm(false)} className="cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Course Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Hifz (Quran Memorization)" className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Label / Number *</label>
                <input type="text" required value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Course 05" className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Category / Tag *</label>
                <input type="text" required value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Memorization" className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Description *</label>
              <textarea rows={2} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Suitable For *</label>
              <input type="text" required value={suitableFor} onChange={(e) => setSuitableFor(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">
                Key Learning Outcomes (One per line) *
              </label>
              <textarea
                rows={4}
                required
                value={learningPointsText}
                onChange={(e) => setLearningPointsText(e.target.value)}
                placeholder="One learning outcome per line"
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div>
                <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Card Icon</label>
                <select value={iconName} onChange={(e) => setIconName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[#d6cfc1] text-sm">
                  {AVAILABLE_ICON_NAMES.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#11382b] cursor-pointer pt-5">
                <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} className="w-4 h-4 accent-[#184c3c]" />
                <span>Show &ldquo;Most Popular&rdquo; badge</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#11382b] cursor-pointer pt-5">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 accent-[#184c3c]" />
                <span>Active (Visible &amp; selectable in Free Trial)</span>
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[#d6cfc1] text-xs font-semibold cursor-pointer">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer">Save Course</button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {courses.map((course, idx) => (
            <div
              key={course._id}
              className={`rounded-xl p-5 border flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                course.isActive ? 'bg-[#FAF7F2] border-[#e5dfd3]' : 'bg-stone-100 border-stone-300 opacity-75'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase text-[#b28338]">
                    {course.badge} · {course.tag}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      course.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {course.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {course.popular && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#b28338]/15 text-[#966b26]">
                      Most Popular
                    </span>
                  )}
                </div>
                <h4 className="font-serif text-lg font-bold text-[#11382b]">{course.title}</h4>
                <p className="text-xs text-[#4f5953]">{course.description}</p>
                <p className="text-[11px] text-[#6d7972]">
                  Suitable for: {course.suitableFor} · {course.learningPoints.length} outcomes
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <button type="button" disabled={idx === 0} onClick={() => handleMove(idx, -1)} className="p-2 rounded bg-white border border-[#d6cfc1] disabled:opacity-40 cursor-pointer" title="Move Up">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" disabled={idx === courses.length - 1} onClick={() => handleMove(idx, 1)} className="p-2 rounded bg-white border border-[#d6cfc1] disabled:opacity-40 cursor-pointer" title="Move Down">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleActive(course)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-[#d6cfc1] text-xs font-medium text-[#11382b] cursor-pointer"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{course.isActive ? 'Deactivate' : 'Activate'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(course)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-[#d6cfc1] text-xs font-medium text-[#11382b] cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteCourse(course)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-red-200 text-xs font-medium text-red-600 cursor-pointer"
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
        open={Boolean(confirmDeleteCourse)}
        title="Delete Course"
        message={
          confirmDeleteCourse
            ? `Delete "${confirmDeleteCourse.title}"? Historical registrations will keep their original course name.`
            : ''
        }
        onConfirm={() => confirmDeleteCourse && handleDelete(confirmDeleteCourse)}
        onCancel={() => setConfirmDeleteCourse(null)}
      />
    </div>
  );
};
