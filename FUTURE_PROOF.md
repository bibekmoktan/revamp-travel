# Travel Nepal — Future-Proofing Guide

> A complete technical reference for scaling the platform from MVP to production-grade product.
> Update this document as decisions are made and tasks are completed.

---

## Current Status

| Layer | Completion | Biggest Gap |
|-------|------------|-------------|
| Frontend — Pages | ~70% | Static data files, missing SEO |
| Frontend — Booking Flow | ~40% | No payment gateway |
| Backend — API | ~80% | No category module, no email |
| Database | ~70% | No indexes on bookings, no migrations |
| DevOps | ~10% | Not deployed, no CI/CD |

---

## 1. Backend

### 1.1 Category Module (Highest Priority)

**Problem:** Categories are hardcoded in `frontend/src/data/packages.ts`. Adding a new category requires a code change and redeployment.

**Solution:** Build a proper `category` backend module.

**Schema:**
```ts
{
  name:        String,   // "Nepal Trekking"
  slug:        String,   // "nepal-trekking" — unique, auto-generated
  description: String,
  image:       String,   // Cloudinary URL
  order:       Number,   // controls display order
  isActive:    Boolean,
  createdAt:   Date,
  updatedAt:   Date,
}
```

**Endpoints:**
```
GET    /api/v1/categories          list all active categories (public)
POST   /api/v1/categories          create category (admin)
PATCH  /api/v1/categories/:id      update category (admin)
DELETE /api/v1/categories/:id      soft delete (admin)
```

**Frontend changes:**
- `packages/page.tsx` → fetch from `/categories` instead of static file
- `packages/[category]/page.tsx` → use slug from DB, remove `generateStaticParams`
- `FeatureTrip.tsx` → fetch categories from API
- Admin package form → category dropdown populated from API
- Delete `frontend/src/data/packages.ts` entirely

---

### 1.2 Missing Backend Modules

| Module | Purpose | Priority |
|--------|---------|----------|
| `category` | Dynamic category management | High |
| `enquiry` | Custom trip request form → DB + email | High |
| `newsletter` | Email capture (name + email) | Medium |
| `coupon` | Discount codes with expiry + usage limits | Medium |
| `availability` | Block dates, seat limits per departure | Medium |
| `currency` | Exchange rates cache for multi-currency display | Low |
| `affiliate` | Referral tracking + unique links | Low |

---

### 1.3 Schema Improvements

| Field / Model | Current | Fix |
|---------------|---------|-----|
| `package.category` | Free string | Reference to `Category` slug |
| `packageCount` | Hardcoded number in frontend | Live `COUNT` query or cached counter on Category model |
| Soft delete | Hard delete everywhere | Add `deletedAt: Date` field — never hard delete |
| Package versioning | No history | Add `version: Number`, keep change history for SEO stability |
| Cloudinary images | Full URL stored | Store `public_id` only, derive URL — easier transforms |
| `booking.expiresAt` | 15-min fixed | Make configurable per environment |

---

### 1.4 API Improvements

| Issue | Fix |
|-------|-----|
| No request tracing | Add `x-request-id` header on every response |
| Rate limiting is global | Per-route + per-user limits via `express-rate-limit` |
| Auth token never refreshed | Add refresh token + rotation strategy |
| No roles beyond `user/admin` | Add `agent`, `operator` for future B2B |
| No input sanitisation on strings | Add `mongo-sanitize` middleware |
| No API versioning enforcement | Lock `/api/v1/` now, plan `/v2/` before breaking changes |
| No health check endpoint | Add `GET /health` returning DB status + uptime |
| No graceful shutdown | Handle `SIGTERM` — drain connections before exit |

---

### 1.5 Email Notifications (Nodemailer / Resend)

Trigger points:
```
booking.created    → "Your booking is reserved — complete payment"
booking.confirmed  → "Your trek is confirmed 🎉" + itinerary PDF
booking.cancelled  → "Booking cancelled — refund info"
booking.reminder   → 7 days before departure
review.request     → 3 days after departure date
enquiry.received   → Auto-reply to customer + notify admin
```

---

## 2. Frontend

### 2.1 Static Data — Replace with API

| File | Still Used By | Fix |
|------|--------------|-----|
| `data/packages.ts` | `FeatureTrip`, `packages/page`, `packages/[category]` | Replace with `GET /categories` |
| `data/destinations.ts` | `TopDestinations`, `TrendingDestinations`, `destinations/page` | Build `destination` module in backend OR keep static (low churn data) |
| `data/categories.ts` | `packages/[category]` page hub | Replace with `GET /categories` |
| `data/blog/blogData.ts` | `blog/page` | Build `blog` backend module |
| `Testimonials.tsx` | Hardcoded in component | Build `testimonial` module + admin UI |
| `Articles.tsx` | Hardcoded in component | Connect to blog module |

---

### 2.2 SEO — Every Page Needs This

```ts
// app/trekking/[slug]/page.tsx — example
export async function generateMetadata({ params }) {
  const pkg = await getPackageBySlug(params.slug);
  return {
    title: `${pkg.title} | Travel Nepal`,
    description: pkg.description.slice(0, 160),
    openGraph: {
      title: pkg.title,
      description: pkg.description.slice(0, 160),
      images: [{ url: pkg.featureImage.url }],
    },
  };
}
```

**Checklist:**
- [ ] `generateMetadata()` on every page (home, trekking, detail, destinations, packages)
- [ ] Dynamic Open Graph images via `next/og`
- [ ] `sitemap.xml` — all package slugs + static pages
- [ ] `robots.txt` — allow crawlers, block admin
- [ ] JSON-LD structured data on trek detail pages (TouristAttraction / Trip schema)
- [ ] Canonical URLs on paginated pages

---

### 2.3 Performance

| Issue | Fix |
|-------|-----|
| Missing `sizes` prop on most `<Image>` | Add `sizes="(max-width: 768px) 100vw, 33vw"` per context |
| `priority` on non-hero images | Only first above-fold image gets `priority` |
| Lenis + Framer Motion loaded everywhere | Dynamic import on pages that need it |
| No `revalidate` tags on server fetches | Add `{ next: { revalidate: 300 } }` to package fetches |
| No streaming / Suspense on listing page | Wrap `PackageResults` in `<Suspense>` (already done — maintain it) |
| No bundle analysis | Add `@next/bundle-analyzer`, audit quarterly |

---

### 2.4 Error Handling

```tsx
// Add to every page section that fetches
<ErrorBoundary fallback={<SectionError />}>
  <BestSeller />
</ErrorBoundary>
```

- [ ] Global error boundary in `layout.tsx`
- [ ] Per-section error boundaries on homepage
- [ ] `error.tsx` files in each route segment
- [ ] `not-found.tsx` with search suggestion
- [ ] Loading skeletons on all async sections

---

### 2.5 TypeScript Hygiene

| File | Issue |
|------|-------|
| Admin pages | `unknown[]` and `unknown` types everywhere |
| `lib/api.ts` admin functions | Return type is `unknown` |
| `BookingSummary.package` | Partial `Pick<>` — extend if more fields needed |

Fix: Create a `types/admin.ts` with proper types for booking, user, review admin responses.

---

## 3. Database

### 3.1 Indexes to Add

```ts
// bookings — for user profile page + admin filters
bookingSchema.index({ user: 1, bookingStatus: 1 });
bookingSchema.index({ trekDate: 1 });
bookingSchema.index({ createdAt: -1 });

// packages — for category + status + price filter (already partial)
packageSchema.index({ category: 1, status: 1, price: 1 });

// reviews
reviewSchema.index({ package: 1, isVerified: 1 });
```

### 3.2 Migrations

Use `migrate-mongo` for all schema changes going forward.
```bash
npm install migrate-mongo
# Never change a schema in prod without a migration file
```

### 3.3 MongoDB Atlas Setup

- Enable replica set (even on free tier M0)
- Enable Atlas Search for full-text package search (replaces basic `searchTerm` filter)
- Set up automated daily backups
- Enable Performance Advisor for index suggestions

---

## 4. Business Logic

### 4.1 Payment Gateway

**Required before launch.**

| Gateway | Use Case | SDK |
|---------|---------|-----|
| Khalti | Nepal domestic payments | `khalti-checkout-web` |
| Stripe | International cards | `stripe-js` + `@stripe/react-stripe-js` |

**Flow:**
```
POST /bookings              → booking created (status: reserved)
POST /payments/initiate     → create payment intent, return client_secret
[user pays on frontend]
POST /webhooks/khalti        → verify + mark booking paid + confirmed
POST /webhooks/stripe        → verify + mark booking paid + confirmed
```

### 4.2 Multi-Currency

- Store all prices in **USD** (already doing this)
- Fetch exchange rates daily from an API (e.g. Open Exchange Rates)
- Cache in Redis or MongoDB
- Frontend reads user's preferred currency from localStorage
- Display converted price — booking always processes in USD

### 4.3 Seasonal Pricing

```ts
// Add to package schema
pricingRules: [
  { label: "Peak Season", months: [3,4,10,11], multiplier: 1.2 },
  { label: "Off Season",  months: [6,7,8],     multiplier: 0.85 },
]
```

### 4.4 Availability & Inventory

```ts
// packageDateInventory model (already exists in backend)
// Extend with:
{
  package:      ObjectId,
  date:         Date,
  totalSeats:   Number,
  bookedSeats:  Number,
  isBlocked:    Boolean,   // admin can block a date
  price:        Number,    // override base price for this specific date
}
```

Admin UI: calendar view per package — block dates, set seat limits, override price.

### 4.5 Coupon System

```ts
{
  code:         String,   // "NEPAL20"
  type:         "percent" | "fixed",
  value:        Number,   // 20 for 20% or 20 for $20 off
  minAmount:    Number,
  maxUses:      Number,
  usedCount:    Number,
  expiresAt:    Date,
  packageIds:   ObjectId[],  // empty = applies to all
  isActive:     Boolean,
}
```

### 4.6 B2B / Agent Portal

Future revenue stream. Agents get:
- Login with role `agent`
- Custom pricing tier (e.g. 15% below retail)
- Their own booking dashboard
- Commission tracking

---

## 5. DevOps & Infrastructure

### 5.1 Deployment Stack

| Service | Tool | Cost |
|---------|------|------|
| Frontend | Vercel | Free tier |
| Backend | Railway or Render | ~$5/mo |
| Database | MongoDB Atlas M0 | Free (512MB) → M10 when needed |
| Images | Cloudinary | Free tier |
| Email | Resend | Free up to 3000/mo |
| Monitoring | Sentry | Free tier |

### 5.2 Environment Variables

```bash
# Backend
NODE_ENV=production
PORT=3002
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
KHALTI_SECRET_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
FRONTEND_URL=

# Frontend
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_KHALTI_PUBLIC_KEY=
```

Add a `env.ts` validation file using Zod — crash on startup if required vars are missing.

### 5.3 CI/CD (GitHub Actions)

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  check:
    - npm run lint
    - npm run typecheck
    - npm run build
  deploy:
    - if: branch == main
    - Deploy to Vercel (frontend)
    - Deploy to Railway (backend)
```

### 5.4 Security Checklist

- [ ] `helmet` middleware on Express
- [ ] CORS locked to frontend domain in production
- [ ] Rate limiting on auth routes (5 req/min)
- [ ] Rate limiting on booking creation (10 req/min per user)
- [ ] `mongo-sanitize` on all user inputs
- [ ] JWT stored in `httpOnly` cookie (not localStorage)
- [ ] Admin routes double-checked with role middleware
- [ ] No `console.log` with sensitive data in production
- [ ] Dependency audit — `npm audit` in CI

---

## 6. Priority Stack Rank

```
1.  Payment gateway (Khalti + Stripe)    ← no real revenue without this
2.  Category backend module              ← content cannot scale without this
3.  SEO (metadata + sitemap + JSON-LD)   ← organic traffic = free bookings
4.  Email notifications (Resend)         ← trust + booking completion
5.  Deploy to production                 ← nothing matters until it's live
6.  Availability calendar                ← prevents overbooking
7.  Sentry + health check                ← know when things break
8.  Review display on detail page        ← social proof = conversion
9.  Multi-currency display               ← international travelers
10. Coupon system                        ← marketing campaigns
11. Atlas Search                         ← better search = more bookings
12. Seasonal pricing                     ← revenue optimisation
13. B2B / agent portal                   ← revenue diversification
14. Affiliate / referral system          ← growth loop
```

---

## 7. Quick Wins (Under 2 Hours Each)

| Task | Impact |
|------|--------|
| Add `generateMetadata()` to trek detail page | SEO — ranks for trek names |
| Add `robots.txt` and `sitemap.xml` | SEO — gets indexed |
| Add `GET /health` endpoint | Ops — uptime monitoring |
| Add `helmet` to Express | Security |
| Add `revalidate: 300` to all server fetches | Performance |
| Add skeleton loaders to homepage sections | UX polish |
| Fix TypeScript `unknown` types in admin | Code quality |
| Add `.env.example` to repo | DX — onboarding |

---

*Last updated: April 2026*
