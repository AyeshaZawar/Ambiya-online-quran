# Adam to Muhammad Online Quran Academy

Full-stack multi-page web application built with **React + TypeScript**, **Node.js + Express.js**, and **MongoDB (Mongoose)**, including a complete **Admin Panel** with four main sections (`Edit Content`, `Blogs`, `Users & Messages`, `Account Settings`).

---

## 1. Prerequisites

- **Node.js** 20+ (tested on Node.js 22)
- **MongoDB** (MongoDB Atlas connection string or local `mongod`)

---

## 2. Environment Setup

Copy `.env.example` to `.env` and configure your variables:

```bash
cp .env.example .env
```

Required / key environment variables:

- `MONGODB_URI`: Your MongoDB Atlas or local MongoDB URI (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/adam_muhammad_academy?retryWrites=true&w=majority`).
  - *Note for local development*: If `MONGODB_URI` is left blank in non-production mode, the server starts a local embedded `mongod` instance (persisted in `.mongodb-data/`) so all Mongoose collections and CRUD operations work immediately. In production (`NODE_ENV=production`), `MONGODB_URI` is required.
- `JWT_SECRET`: Long random secret for signing HTTP-only admin session cookies.
- `ADMIN_SEED_EMAIL` & `ADMIN_SEED_PASSWORD`: Initial admin credentials used by the seed script (no public admin registration page exists).
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: SMTP credentials for sending 6-digit verification OTPs and password-reset links.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Optional cloud image storage. If omitted, uploaded images (JPG, PNG, WebP up to 5 MB) are validated and stored securely in `/public/uploads/`.

---

## 3. Initial Admin Creation & Database Seeding

Install dependencies:

```bash
npm install
```

Run the standalone idempotent seed script to populate initial website content, courses, pricing plans (GBP £25 / £35 / £45 / £55), blogs, testimonials, registration options, and create the initial admin account:

```bash
npm run seed
```

Or pass explicit admin email and password arguments:

```bash
npx tsx server/scripts/seedAdmin.ts admin@yourdomain.com StrongPassword123!
```

*The seeder is idempotent and will never overwrite content or records already modified by an administrator.*

---

## 4. Local Development

Start the unified Express + Vite dev server on port `3000`:

```bash
npm run dev
```

- Public Website: `http://localhost:3000`
- Admin Panel: Access via your configured private admin route slug.

---

## 5. Production Build & Deployment

1. Set `NODE_ENV=production` and configure `MONGODB_URI`, `JWT_SECRET`, `APP_URL`, and SMTP/Cloudinary variables in your hosting environment.
2. Build the frontend bundle:

```bash
npm run build
```

3. Start the production Express server (serves API routes + built `dist/` frontend on port `3000`):

```bash
npm start
```

---

## 6. MongoDB Collections

- `Admins`
- `WebsiteContent`
- `Courses`
- `AboutCourseCards`
- `EligibilityCards`
- `PricingPlans`
- `Blogs`
- `Testimonials`
- `ContactInformation`
- `RegistrationSettings`
- `TrialRegistrations`
- `ContactInquiries`
- `VerificationTokens`
