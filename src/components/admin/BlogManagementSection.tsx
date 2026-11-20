import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, CheckCircle2, X, Clock } from 'lucide-react';
import { adminApi } from '../../services/api';
import { BlogItem } from '../../types/cms';
import { ImageUploaderField } from './ImageUploaderField';
import { ConfirmDialog } from './ConfirmDialog';

interface BlogManagementSectionProps {
  onDataUpdated: () => void;
}

export const BlogManagementSection: React.FC<BlogManagementSectionProps> = ({ onDataUpdated }) => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteBlog, setConfirmDeleteBlog] = useState<BlogItem | null>(null);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('/images/adult_man_quran_study.jpg');
  const [readTime, setReadTime] = useState('4 min read');
  const [contentText, setContentText] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.listBlogs();
      setBlogs(res.blogs);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load blogs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
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
    setExcerpt('');
    setFeaturedImage('/images/adult_man_quran_study.jpg');
    setReadTime('4 min read');
    setContentText('');
    setStatus('published');
    setShowForm(true);
  };

  const openEdit = (blog: BlogItem) => {
    setEditingId(blog._id);
    setTitle(blog.title);
    setExcerpt(blog.excerpt);
    setFeaturedImage(blog.featuredImage);
    setReadTime(blog.readTime);
    setContentText(blog.content.join('\n\n'));
    setStatus(blog.status);
    setShowForm(true);
  };

  const handleSave = async (targetStatus: 'published' | 'draft') => {
    setErrorMsg(null);
    const paragraphs = contentText
      .split(/\n\s*\n|\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (!title.trim() || !excerpt.trim() || !featuredImage.trim() || paragraphs.length === 0) {
      setErrorMsg('Please fill in Title, Excerpt, Featured Image, and at least one paragraph of content.');
      return;
    }

    const payload = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      featuredImage: featuredImage.trim(),
      gradient:
        'linear-gradient(135deg, rgba(164, 130, 57, 0.85) 0%, rgba(93, 117, 67, 0.8) 50%, rgba(30, 73, 58, 0.9) 100%)',
      readTime: readTime.trim() || '4 min read',
      content: paragraphs,
      status: targetStatus,
      order: editingId
        ? blogs.find((b) => b._id === editingId)?.order ?? 1
        : blogs.length + 1,
    };

    try {
      if (editingId) {
        await adminApi.updateBlog(editingId, payload);
        flashSuccess(
          targetStatus === 'published'
            ? 'Article updated & published across Home Page and Blog Page.'
            : 'Article saved as draft.'
        );
      } else {
        await adminApi.createBlog(payload);
        flashSuccess(
          targetStatus === 'published'
            ? 'New article published to Home Page and Blog Page.'
            : 'New article saved as draft.'
        );
      }
      setShowForm(false);
      await loadBlogs();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save article.');
    }
  };

  const handleTogglePublish = async (blog: BlogItem) => {
    const nextStatus = blog.status === 'published' ? 'draft' : 'published';
    try {
      await adminApi.setBlogStatus(blog._id, nextStatus);
      flashSuccess(
        nextStatus === 'published'
          ? `"${blog.title}" is now published on Home Page and Blog Page.`
          : `"${blog.title}" was unpublished and hidden from public visitors.`
      );
      await loadBlogs();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update status.');
    }
  };

  const handleDelete = async (blog: BlogItem) => {
    try {
      await adminApi.deleteBlog(blog._id);
      setConfirmDeleteBlog(null);
      flashSuccess('Article removed from the public website.');
      await loadBlogs();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete article.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#11382b]">Blog Management</h2>
          <p className="text-xs text-[#6d7972] mt-1">
            Single source of truth: published articles automatically sync across the Home Page and Blog Page.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

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

      {showForm && (
        <div className="bg-white rounded-2xl border border-[#e5dfd3] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#efeae0] pb-3">
            <h3 className="font-serif text-xl font-bold text-[#11382b]">
              {editingId ? 'Edit Article' : 'Create New Article'}
            </h3>
            <button type="button" onClick={() => setShowForm(false)} className="cursor-pointer text-[#55635c]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Article Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Developing Consistency in Daily Quran Recitation"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Read Time *</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="4 min read"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Excerpt / Summary *</label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary shown on Home Page and Blog Page cards..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm"
            />
          </div>

          <ImageUploaderField
            label="Featured Image"
            value={featuredImage}
            onChange={(url) => setFeaturedImage(url)}
          />

          <div>
            <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">
              Full Article Content (Separate paragraphs with a blank line) *
            </label>
            <textarea
              rows={8}
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              placeholder="Write full article paragraphs here..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm leading-relaxed"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#efeae0]">
            <span className="text-xs text-[#6d7972]">
              Current editor status: <strong className="uppercase">{status}</strong>
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-[#d6cfc1] text-xs font-semibold text-[#4f5953] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSave('draft')}
                className="px-4 py-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-[#11382b] text-xs font-semibold cursor-pointer"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave('published')}
                className="px-5 py-2 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white text-xs font-semibold cursor-pointer"
              >
                Save &amp; Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-sm text-[#55635c]">Loading articles...</div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-[#e5dfd3] text-center text-sm text-[#55635c]">
          No articles found yet. Click &ldquo;New Article&rdquo; to publish your first article.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl border border-[#e5dfd3] overflow-hidden flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="aspect-[16/10] bg-stone-100 relative overflow-hidden">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span
                    className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs ${
                      blog.status === 'published'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {blog.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#6d7972]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#b28338]" /> {blog.readTime}
                    </span>
                    {blog.updatedAt && (
                      <span>Updated {new Date(blog.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#11382b] leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-[#4f5953] line-clamp-3">{blog.excerpt}</p>
                </div>
              </div>

              <div className="px-5 py-3 bg-[#FAF7F2] border-t border-[#efeae0] flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(blog)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white border border-[#d6cfc1] text-xs font-medium text-[#11382b] cursor-pointer"
                >
                  {blog.status === 'published' ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> <span>Unpublish</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" /> <span>Publish</span>
                    </>
                  )}
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(blog)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white border border-[#d6cfc1] text-xs font-medium text-[#11382b] cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteBlog(blog)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white border border-red-200 text-xs font-medium text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirmDeleteBlog)}
        title="Delete Article"
        message={
          confirmDeleteBlog
            ? `Permanently delete article "${confirmDeleteBlog.title}"? This will remove it from both the Home Page and Blog Page.`
            : ''
        }
        onConfirm={() => confirmDeleteBlog && handleDelete(confirmDeleteBlog)}
        onCancel={() => setConfirmDeleteBlog(null)}
      />
    </div>
  );
};
