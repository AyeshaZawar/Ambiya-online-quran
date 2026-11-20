import { Request, Response, NextFunction } from 'express';
import { Blog } from '../models/Blog';
import { blogSchema } from '../validation/schemas';

function makeSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `article-${Date.now()}`
  );
}

export async function listAllBlogs(_req: Request, res: Response, next: NextFunction) {
  try {
    const blogs = await Blog.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json({ blogs });
  } catch (err) {
    next(err);
  }
}

export async function createBlog(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = blogSchema.parse(req.body);
    let slug = makeSlug(parsed.title);
    const existing = await Blog.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const count = await Blog.countDocuments();
    const created = await Blog.create({
      ...parsed,
      slug,
      order: parsed.order ?? count + 1,
      publishedAt: parsed.status === 'published' ? new Date() : undefined,
    });

    res.status(201).json({ blog: created });
  } catch (err) {
    next(err);
  }
}

export async function updateBlog(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = blogSchema.parse(req.body);
    const existing = await Blog.findById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Article not found.' });
      return;
    }

    const publishedAt =
      parsed.status === 'published'
        ? existing.publishedAt || new Date()
        : existing.publishedAt;

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        ...parsed,
        publishedAt,
      },
      { new: true }
    );

    res.json({ blog: updated });
  } catch (err) {
    next(err);
  }
}

export async function setBlogStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const status = req.body?.status;
    if (status !== 'published' && status !== 'draft') {
      res.status(400).json({ error: 'Status must be "published" or "draft".' });
      return;
    }

    const existing = await Blog.findById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Article not found.' });
      return;
    }

    existing.status = status;
    if (status === 'published' && !existing.publishedAt) {
      existing.publishedAt = new Date();
    }
    await existing.save();

    res.json({ blog: existing });
  } catch (err) {
    next(err);
  }
}

export async function deleteBlog(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Article not found.' });
      return;
    }
    res.json({ message: 'Article deleted.' });
  } catch (err) {
    next(err);
  }
}
