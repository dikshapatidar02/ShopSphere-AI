import { describe, expect, it, vi } from 'vitest';
import { ApiClient } from '../api/client';

describe('ApiClient', () => {
  it('should build correct URLs with query parameters', () => {
    const client = new ApiClient('https://api.example.com');
    const url = client.buildUrl('/products', {
      limit: 10,
      skip: 20,
      empty: '',
      nullValue: null,
      undefinedValue: undefined,
      active: true,
    });

    expect(url).toBe('https://api.example.com/products?limit=10&skip=20&active=true');
  });

  it('should return successful response data when fetch succeeds', async () => {
    const client = new ApiClient('https://dummyjson.com');

    const mockData = { id: 1, title: 'Test Item' };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    const res = await client.get<typeof mockData>('/test');
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data).toEqual(mockData);
    }
  });

  it('should return error when HTTP response is not ok', async () => {
    const client = new ApiClient('https://dummyjson.com');

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const res = await client.get('/nonexistent');
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('NOT_FOUND');
    }
  });
});
