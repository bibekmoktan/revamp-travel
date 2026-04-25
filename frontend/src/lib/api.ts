import type {
  ApiListResponse,
  ApiItemResponse,
  ApiPackage,
  PackageFilters,
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
