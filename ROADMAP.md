# Travel Nepal — Project Roadmap

## Current Status: ~65–70% Complete

### What's Done
- Homepage (Hero, BestSeller, Destinations, Trending, Offers, WhyUs, Testimonials, Articles)
- Trekking listing page — filter, search, sort, pagination, API-connected
- Trek detail page — itinerary, gallery, extras, booking card
- Admin dashboard — packages, bookings, users, reviews
- Auth — login, signup, protected routes
- Backend — packages, bookings, users, reviews, auth, upload (Cloudinary)
- Blog listing page
- Destination pages
- Luxury tours page
- Smooth scroll (Lenis)

---

## Phase 1 — Complete the Core Booking Flow
> Turns the project from a showcase into a real product

- [ ] Cart system — add/remove packages, traveler count, date selection
- [ ] Checkout page — traveler details form, booking summary
- [ ] Payment integration — Khalti (local) + Stripe (international)
- [ ] Booking confirmation page — booking ID, PDF receipt download
- [ ] User profile page — view past bookings, cancel, re-book

---

## Phase 2 — Content & Discovery
> Keeps users on the site longer, improves SEO

- [ ] Blog detail page (`/blog/[slug]`) — full article with related packages
- [ ] Review system — submit after booking, star rating, admin verify, display on detail page
- [ ] Package comparison — compare 2–3 packages side by side
- [ ] Search improvement — autocomplete, filter by region + activity type

---

## Phase 3 — Trust & Conversion
> What actually makes someone book

- [ ] Availability calendar — show dates with slots remaining
- [ ] Group discount logic — price tiers by group size
- [ ] Inquiry / custom package form → backend endpoint + email notification
- [ ] WhatsApp / live chat floating button
- [ ] Photo gallery lightbox on trek detail page

---

## Phase 4 — Admin & Operations
> Makes it manageable as a real business tool

- [ ] Package form — multi-image reorder drag-and-drop, itinerary builder UI
- [ ] Revenue analytics — charts for bookings over time, top packages
- [ ] Email notifications — booking confirmed/cancelled (Nodemailer or Resend)
- [ ] Coupon / promo code system
- [ ] Inventory management — block dates, set seat limits per departure

---

## Phase 5 — Production Readiness
> Before sharing the URL publicly

- [ ] Deploy — Vercel (frontend) + Railway/Render (backend) + MongoDB Atlas
- [ ] SEO — `generateMetadata()` on all pages, sitemap.xml, robots.txt
- [ ] Performance — image optimization audit, Lighthouse 90+
- [ ] Error monitoring — Sentry
- [ ] Rate limiting + security headers on backend

---

## Recommended Priority Order

```
Phase 1  →  Phase 5 (deploy early)  →  Phase 3  →  Phase 2  →  Phase 4
```

Deploy after Phase 1 so there's a live URL to share.
Phase 3 before Phase 2 — conversion matters more than content for a booking platform.

---

## Resume Impact

| State | Weight |
|-------|--------|
| Current (no deploy, no payment) | Medium |
| + Live deployment | Medium-High |
| + Payment flow (Khalti/Stripe) | High |
| + Real users / bookings | Very High |

> **Immediate next step:** Cart system — single most impactful missing piece.
