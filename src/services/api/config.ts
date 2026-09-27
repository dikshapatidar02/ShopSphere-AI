export interface ApiConfig {
  readonly baseUrl: string;
  readonly defaultProvider: 'dummyjson' | 'mock';
  readonly cacheTtlMs: number;
  readonly defaultTimeoutMs: number;
}

export const apiConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dummyjson.com',
  defaultProvider: (process.env.NEXT_PUBLIC_DATA_PROVIDER as 'dummyjson' | 'mock') || 'dummyjson',
  cacheTtlMs: (Number(process.env.NEXT_PUBLIC_CACHE_TTL_SECONDS) || 300) * 1000,
  defaultTimeoutMs: 10000,
};
