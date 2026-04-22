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
