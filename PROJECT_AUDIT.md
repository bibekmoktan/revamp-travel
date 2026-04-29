# Project Audit: Travel Nepal Revamp

_Generated: 2026-04-28_

---

## FRONTEND (Next.js 15 + React 19)

### What's Good

#### Architecture & Structure
- Clean App Router layout — pages, dynamic routes, and admin section are well-separated
- `ClientLayout.tsx` elegantly hides Navbar/Footer from admin and auth pages

#### State Management
- `WishlistContext` — optimistic updates with proper revert on failure
- `CartContext` — UUID-based item keys, localStorage migration logic handles legacy data gracefully
- `AuthContext` — cookie + localStorage dual persistence with proper hydration guard

#### API Layer (`lib/api.ts`)
- Centralized `apiFetch` wrapper with a custom `ApiError` class — consistent error discrimination across the app
- `authHeaders()` helper keeps auth logic in one place
- Server-side fetches use `next: { revalidate: 300 }` for caching

#### TypeScript
- `strict: true` in tsconfig — no implicit any
- `types/api.ts` is comprehensive and shared cleanly between pages and components

#### Accessibility
- `aria-label` on buttons, `alt` on images, `rel="noopener noreferrer"` on external links

---

### What's Bad / Risks

#### Type Safety
- Several API functions (`getWishlist`, `adminGetPackages`, `adminGetBookings`) return `unknown[]` or `any[]` — silent runtime errors if the shape changes

#### Error Handling Gaps
- `AuthContext`, `WishlistContext`, and `CartContext` all have empty `catch {}` blocks — failures are invisible, nothing is logged

#### Security
- Auth token stored in both `localStorage` AND cookies — double XSS surface area; HTTP-only cookies alone would be safer
- Cookie set without `Secure` flag — must be added for production

#### Performance
- CartContext writes to `localStorage` on every single mutation — should debounce for rapid updates

#### Dead Dependencies
- `express` is listed in `frontend/package.json` — Express has no place in a Next.js frontend
- `motion` library is installed but largely unused

---

## BACKEND (Node.js + Express + TypeScript + MongoDB)

### What's Good

#### Module Structure
- Textbook clean: every module has its own `controller / service / route / model / validation / interface` — easy to navigate and extend

#### Security Middleware
- Helmet.js with CSP configured
- Rate limiting: 100 req/15 min globally, 5 req/15 min on auth routes
- `protect` middleware re-fetches user from DB on each request — invalidated/deleted users can't use stale tokens

#### Validation (Zod)
- Detailed schemas across all modules — slug format, password strength (uppercase + digit required), image URL validation, rating bounds
- `moreInfo` and `faq` sub-schemas properly validated with `min(1)` guards

#### Error Handling
- Custom error class hierarchy (`AppError`, `NotFoundError`, `ConflictError`, etc.) with a global handler
- `catchAsync` wrapper eliminates unhandled promise rejections
- Mongoose errors (CastError, duplicate key 11000) are translated cleanly

#### Database
- Strategic MongoDB indexes: compound indexes for booking availability, TTL index on `expiresAt` for automatic cleanup, text index on package title
- Compound unique index on `(user, package)` in Wishlist prevents duplicate saves

---

### What's Bad / Risks

#### HIGH — Security
- CORS in development allows ALL origins (`callback(null, true)`) — if `NODE_ENV=development` is accidentally set in production, the API is wide open
- CSP includes `'unsafe-inline'` for styles — weakens XSS protection significantly

#### MEDIUM — Security
- Password reset sends the raw token in the email body — emails are often logged/archived; should send a magic link with hashed token embedded instead

#### MEDIUM — API Design
- Admin endpoints for bookings and users have no enforced pagination limits — a bad query could pull millions of records
- `req.user` is typed as `any` in Express — should extend the Express `Request` type with `user?: IUser`

#### MEDIUM — Error Handling
- Auth service catches all errors and throws a generic `"Login failed"` — hides DB errors, hard to debug in production
- Upload route uses `res.status(400).json(...)` instead of throwing — inconsistent with the rest of the error handling

#### LOW — Code Quality
- `/modules/contact/` is an empty directory — dead code, should be deleted
- `createError()` factory function in `utils/errors.ts` is defined but never used
- `console.log` used in security middleware instead of the logger service

#### Missing
- No tests except for the bookings module — auth, payment, validation, and wishlist have zero test coverage
- No soft deletes — user and booking deletions are permanent with no audit trail
- Scheduled cleanup job can overlap if a run takes longer than 5 minutes — needs a lock or timestamp guard

---

## Risk Matrix

| Risk | Severity | Component | Action |
|------|----------|-----------|--------|
| Loose CORS in development | **HIGH** | Backend security | Lock down `ALLOWED_ORIGINS` |
| CSP `'unsafe-inline'` | **HIGH** | Backend security | Remove, use nonces |
| `unknown[]` / `any[]` return types | **MEDIUM** | Frontend API layer | Add specific response types |
| Silent `catch {}` blocks | **MEDIUM** | Frontend contexts | Add logging |
| Password reset token in email | **MEDIUM** | Backend auth | Magic link with hashed token |
| No pagination limits on admin | **MEDIUM** | Backend API | Enforce max limits |
| Token in localStorage + cookies | **MEDIUM** | Frontend security | HTTP-only cookies only |
| `req.user` typed as `any` | **MEDIUM** | Backend types | Extend Express Request |
| Dead code (contact module, express) | **LOW** | Code quality | Clean up |
| No soft deletes | **LOW** | Data integrity | Add if audit trail needed |

---

## Quick Wins (Easy to Fix)

- [ ] Remove `express` from `frontend/package.json`
- [ ] Delete `backend/src/modules/contact/` empty directory
- [ ] Add `Secure` flag to cookies in `AuthContext`
- [ ] Lock down CORS — explicit origin list even in development
- [ ] Replace `console.log` with logger in security middleware
- [ ] Remove `'unsafe-inline'` from CSP
- [ ] Add phone number regex validation in enquiry schema
- [ ] Add return types to `getWishlist`, `adminGetPackages`, `adminGetBookings`
