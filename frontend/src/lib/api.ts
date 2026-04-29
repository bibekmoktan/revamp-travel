import type {
  ApiListResponse,
  ApiItemResponse,
  ApiPackage,
  ApiCategory,
  ApiEnquiry,
  ApiReview,
  PackageFilters,
  PaginationMeta,
  TravelerInput,
  BookingSummary,
} from '@/types/api';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002/api/v1';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? 'Request failed');
  }

  return res.json() as Promise<T>;
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// ─── Enquiries ────────────────────────────────────────────────────────────

export async function submitEnquiry(payload: {
  name: string; email: string; phone?: string;
  message: string; packageId?: string; packageTitle?: string;
}) {
  return apiFetch<{ success: boolean; message: string; data: ApiEnquiry }>('/enquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function adminGetEnquiries(token: string, params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<{ success: boolean; data: ApiEnquiry[]; meta: { total: number; page: number; limit: number; pages: number } }>(`/enquiries${qs}`, {
    headers: authHeaders(token),
    cache: 'no-store',
  });
}

export async function adminUpdateEnquiryStatus(token: string, id: string, status: 'new' | 'read' | 'replied') {
  return apiFetch<{ success: boolean; data: ApiEnquiry }>(`/enquiries/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
}

export async function adminDeleteEnquiry(token: string, id: string) {
  return apiFetch<{ success: boolean; message: string }>(`/enquiries/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

// ─── Categories ───────────────────────────────────────────────────────────

export async function getCategories(): Promise<{ success: boolean; data: ApiCategory[] }> {
  return apiFetch('/categories', { next: { revalidate: 300 } } as RequestInit);
}

export async function adminCreateCategory(token: string, data: Partial<ApiCategory>) {
  return apiFetch<{ success: boolean; data: ApiCategory }>('/categories', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function adminUpdateCategory(token: string, id: string, data: Partial<ApiCategory>) {
  return apiFetch<{ success: boolean; data: ApiCategory }>(`/categories/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function adminDeleteCategory(token: string, id: string) {
  return apiFetch<{ success: boolean; message: string }>(`/categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

// ─── Packages ──────────────────────────────────────────────────────────────

export async function getPackages(
  filters: PackageFilters = {},
): Promise<ApiListResponse<ApiPackage>> {
  const params = new URLSearchParams();

  if (filters.category)            params.set('category',   filters.category);
  if (filters.searchTerm)          params.set('searchTerm', filters.searchTerm);
  if (filters.minPrice != null)    params.set('minPrice',   String(filters.minPrice));
  if (filters.maxPrice != null)    params.set('maxPrice',   String(filters.maxPrice));
  if (filters.sortBy)              params.set('sortBy',     filters.sortBy);
  if (filters.sortOrder)           params.set('sortOrder',  filters.sortOrder);
  if (filters.page)                params.set('page',       String(filters.page));
  if (filters.limit)               params.set('limit',      String(filters.limit));
  if (filters.status)              params.set('status',     filters.status);
  if (filters.difficulty)          params.set('difficulty', filters.difficulty);
  if (filters.duration)            params.set('duration',   filters.duration);
  if (filters.season)              params.set('season',     filters.season);

  const qs = params.toString();

  return apiFetch<ApiListResponse<ApiPackage>>(
    `/packages${qs ? `?${qs}` : ''}`,
    // Revalidate every 5 min — packages don't change every second
    { next: { revalidate: 300 } } as RequestInit,
  );
}

export async function getPackageBySlug(
  slug: string,
): Promise<ApiItemResponse<ApiPackage>> {
  return apiFetch<ApiItemResponse<ApiPackage>>(
    `/packages/${slug}`,
    { next: { revalidate: 300 } } as RequestInit,
  );
}

// ─── Admin: Upload ────────────────────────────────────────────────────────

export async function adminUploadImage(token: string, file: File): Promise<{ url: string; public_id: string }> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new ApiError(res.status, json.message ?? 'Upload failed');
  return json.data;
}

// ─── Admin: Packages ───────────────────────────────────────────────────────

export async function adminGetPackages(token: string, params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<{ success: boolean; data: unknown[]; meta: { total: number; page: number; limit: number; pages: number } }>(`/packages${qs}`, {
    headers: authHeaders(token),
    cache: 'no-store',
  });
}

export async function adminCreatePackage(token: string, data: unknown) {
  return apiFetch<ApiItemResponse<ApiPackage>>('/packages', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function adminUpdatePackage(token: string, id: string, data: unknown) {
  return apiFetch<ApiItemResponse<ApiPackage>>(`/packages/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function adminDeletePackage(token: string, id: string) {
  return apiFetch<{ success: boolean; message: string }>(`/packages/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

export async function adminTogglePackageStatus(token: string, id: string, status: 'active' | 'inactive') {
  return apiFetch<ApiItemResponse<ApiPackage>>(`/packages/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
}

// ─── Admin: Bookings ───────────────────────────────────────────────────────

export async function adminGetBookings(token: string, params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<{ success: boolean; data: unknown[]; meta: unknown }>(`/bookings${qs}`, {
    headers: authHeaders(token),
  });
}

export async function adminConfirmBooking(token: string, bookingId: string) {
  return apiFetch<{ success: boolean; message: string; data: unknown }>(`/bookings/${bookingId}/confirm`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });
}

export async function adminCancelBooking(token: string, bookingId: string) {
  return apiFetch<{ success: boolean; message: string; data: unknown }>(`/bookings/${bookingId}/cancel`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });
}

// ─── Admin: Users ─────────────────────────────────────────────────────────

export async function adminGetUsers(token: string, params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<{ success: boolean; data: unknown[]; meta: unknown }>(`/users${qs}`, {
    headers: authHeaders(token),
  });
}

export async function adminUpdateUser(token: string, id: string, data: unknown) {
  return apiFetch<{ success: boolean; data: unknown }>(`/users/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function adminDeleteUser(token: string, id: string) {
  return apiFetch<{ success: boolean; message: string }>(`/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

// ─── User: Bookings ───────────────────────────────────────────────────────

export async function createBooking(
  token: string,
  payload: { packageId: string; trekDate: string; travelers: TravelerInput[] },
) {
  return apiFetch<ApiItemResponse<BookingSummary>>('/bookings', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function getMyBookings(token: string, params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<ApiListResponse<BookingSummary>>(`/bookings/my${qs}`, {
    headers: authHeaders(token),
    cache: 'no-store',
  });
}

export async function getBookingById(token: string, bookingId: string) {
  return apiFetch<ApiItemResponse<BookingSummary>>(`/bookings/${bookingId}`, {
    headers: authHeaders(token),
    cache: 'no-store',
  });
}

export async function cancelMyBooking(token: string, bookingId: string) {
  return apiFetch<{ success: boolean; message: string }>(`/bookings/${bookingId}/cancel`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });
}

// ─── Wishlist ─────────────────────────────────────────────────────────────

export async function getWishlist(token: string) {
  return apiFetch<{ success: boolean; data: any[] }>('/wishlist', {
    headers: authHeaders(token),
    cache: 'no-store',
  });
}

export async function getWishlistIds(token: string) {
  return apiFetch<{ success: boolean; data: string[] }>('/wishlist/ids', {
    headers: authHeaders(token),
    cache: 'no-store',
  });
}

export async function addToWishlist(token: string, packageId: string) {
  return apiFetch<{ success: boolean; message: string }>('/wishlist', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ packageId }),
  });
}

export async function removeFromWishlist(token: string, packageId: string) {
  return apiFetch<{ success: boolean; message: string }>(`/wishlist/${packageId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

// ─── Payments ─────────────────────────────────────────────────────────────

export async function initiatePayment(token: string, bookingIds: string[]) {
  return apiFetch<{ success: boolean; message: string; data: { payment_url: string; pidx: string; expires_at: string } }>('/payments/initiate', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ bookingIds }),
  });
}

export async function verifyPayment(token: string, pidx: string, bookingIds: string[]) {
  return apiFetch<{ success: boolean; message: string; data: { primaryBookingId: string; allBookingIds: string[] } }>('/payments/verify', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ pidx, bookingIds }),
  });
}

// ─── Public: Reviews ──────────────────────────────────────────────────────

export async function getPackageReviews(packageId: string, params?: Record<string, string>) {
  const qs = new URLSearchParams({ package: packageId, limit: '50', sortBy: 'createdAt', sortOrder: 'desc', ...params }).toString();
  return apiFetch<{ success: boolean; data: ApiReview[]; meta: PaginationMeta }>(`/reviews?${qs}`, {
    cache: 'no-store',
  });
}

export async function createReview(
  token: string,
  payload: { user: string; package: string; rating: number; comment: string; title?: string },
) {
  return apiFetch<{ success: boolean; message: string; data: ApiReview }>('/reviews', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
}

// ─── Admin: Reviews ───────────────────────────────────────────────────────

export async function adminGetReviews(token: string, params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<{ success: boolean; data: unknown[]; meta: unknown }>(`/reviews${qs}`, {
    headers: authHeaders(token),
  });
}

export async function adminVerifyReview(token: string, id: string) {
  return apiFetch<{ success: boolean; data: unknown }>(`/reviews/${id}/verify`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });
}

export async function adminRespondToReview(token: string, id: string, response: string) {
  return apiFetch<{ success: boolean; data: unknown }>(`/reviews/${id}/respond`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ response }),
  });
}
