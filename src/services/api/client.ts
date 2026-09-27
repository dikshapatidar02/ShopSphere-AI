import type { ApiResponse } from '@/types';
import { apiConfig } from './config';
import { handleHttpError, handleNetworkError } from './errors';

export interface RequestOptions {
  readonly params?: Record<string, string | number | boolean | undefined | null>;
  readonly headers?: Record<string, string>;
  readonly signal?: AbortSignal;
  readonly timeoutMs?: number;
}

export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = apiConfig.baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  public buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>
  ): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const fullUrl = new URL(`${this.baseUrl}${cleanEndpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          fullUrl.searchParams.append(key, String(value));
        }
      });
    }

    return fullUrl.toString();
  }

  public async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params);
    const timeoutMs = options?.timeoutMs ?? apiConfig.defaultTimeoutMs;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Combine user signal with timeout signal if user provided signal
    const signal = options?.signal
      ? this.combineSignals(options.signal, controller.signal)
      : controller.signal;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...options?.headers,
        },
        signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: handleHttpError(response.status, response.statusText),
        };
      }

      const data = (await response.json()) as T;
      return {
        success: true,
        data,
      };
    } catch (err) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: handleNetworkError(err),
      };
    }
  }

  private combineSignals(signal1: AbortSignal, signal2: AbortSignal): AbortSignal {
    const controller = new AbortController();
    const onAbort = () => controller.abort();

    if (signal1.aborted || signal2.aborted) {
      controller.abort();
    } else {
      signal1.addEventListener('abort', onAbort, { once: true });
      signal2.addEventListener('abort', onAbort, { once: true });
    }

    return controller.signal;
  }
}

export const apiClient = new ApiClient();
