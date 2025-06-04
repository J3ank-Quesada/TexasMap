'use client';

/**
 * @file React Hook for making HTTP requests
 * @module hooks/useHttpRequest
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiResponse, HttpRequestOptions as BaseHttpRequestOptions, httpRequest } from '../utils/http';

/**
 * Represents the state of an HTTP request managed by the useHttpRequest hook.
 * @template T The expected type of the data in a successful response.
 */
export interface HttpRequestHookState<T> {
  /** The data returned by the API. Undefined if the request hasn't completed, failed, or was cleared. */
  data: T | undefined;
  /** True if the request is currently in progress. */
  isLoading: boolean;
  /** True if the request resulted in an error. */
  isError: boolean;
  /** The error message string if the request failed. */
  error: string | undefined;
}

/**
 * Options for the useHttpRequest hook, extending base HTTP request options.
 */
export interface UseHttpRequestOptions<T = unknown> extends BaseHttpRequestOptions {
  /** If true, the request will be made immediately when the hook is mounted or when `initialUrl` or `initialOptions` change. Defaults to true. */
  immediate?: boolean;
  /** Initial data to set before the first request. Useful for SSR or optimistic updates. */
  initialData?: T;
}

/**
 * Type for the `execute` function returned by the hook.
 * Allows for overriding the URL and/or options for a specific request.
 * @template T The expected type of the response data.
 */
type ExecuteHttpRequest<T> = (
  urlOrOverrideOptions?: string | BaseHttpRequestOptions,
  overrideOptions?: BaseHttpRequestOptions
) => Promise<ApiResponse<T>>;

/**
 * A React hook for making HTTP requests using the `httpRequest` utility.
 * It manages the reactive state of the request: data, loading, and error states.
 *
 * @template T The expected type of the response data.
 * @param {string} initialUrl The initial URL for the request.
 * @param {UseHttpRequestOptions} [initialHookOptions={}] Options for the hook and the underlying HTTP request.
 *   - `immediate`: If `true` (default), executes the request on mount and when `initialUrl` or `initialHookOptions` change.
 *   - `initialData`: Optional initial data.
 *   - Other properties are passed as `HttpRequestOptions` to the `httpRequest` utility.
 * @returns {HttpRequestHookState<T> & { execute: ExecuteHttpRequest<T> }}
 *          An object containing the request state (`data`, `isLoading`, `isError`, `error`)
 *          and an `execute` function to manually trigger or re-trigger the request.
 */
export function useHttpRequest<T = unknown>(
  initialUrl: string,
  initialHookOptions?: UseHttpRequestOptions<T>,
): HttpRequestHookState<T> & { execute: ExecuteHttpRequest<T> } {
  const { immediate = true, initialData, ...baseOptions } = initialHookOptions || {};

  const [data, setData] = useState<T | undefined>(initialData);
  //isLoading is true if immediate is true AND there's no initialData to show immediately.
  const [isLoading, setIsLoading] = useState<boolean>(immediate && initialData === undefined);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const mountedRef = useRef(true);
  const urlRef = useRef(initialUrl);
  const optionsRef = useRef(baseOptions);

  // Update refs if initialUrl or baseOptions (derived from initialHookOptions) change
  useEffect(() => {
    urlRef.current = initialUrl;
    optionsRef.current = baseOptions;
  }, [initialUrl, baseOptions]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (
    urlOrOverrideOptions?: string | BaseHttpRequestOptions,
    overrideOptions?: BaseHttpRequestOptions
  ): Promise<ApiResponse<T>> => {
    if (!mountedRef.current) {
      // If the component is unmounted, prevent state updates and return a non-committal response.
      return Promise.resolve({ ok: false, status: 0, error: "Component unmounted" } as ApiResponse<T>);
    }

    setIsLoading(true);
    setIsError(false);
    setError(undefined);

    let currentUrl = urlRef.current;
    let currentOptions: BaseHttpRequestOptions = { ...optionsRef.current };

    if (typeof urlOrOverrideOptions === 'string') {
      currentUrl = urlOrOverrideOptions;
      if (overrideOptions) {
        currentOptions = { ...currentOptions, ...overrideOptions };
      }
    } else if (typeof urlOrOverrideOptions === 'object') {
      currentOptions = { ...currentOptions, ...urlOrOverrideOptions };
    }

    try {
      const response = await httpRequest<T>(currentUrl, currentOptions);
      if (mountedRef.current) {
        setData(response.data); // Set data, which might be undefined if API returned no data or on error
        if (!response.ok) {
          setIsError(true);
          setError(response.error || 'Request failed');
        } else {
          setIsError(false); // Ensure isError is false on successful response
          setError(undefined);
        }
      }
      return response;
    } catch (e: unknown) {
      if (mountedRef.current) {
        setIsError(true);
        const errorMessage = e instanceof Error ? e.message : typeof e === 'string' ? e : 'A critical error occurred.';
        setError(errorMessage);
        setData(undefined); // Clear data on critical/network error
      }
      return {
        ok: false,
        status: 0, // Indicate client-side/network error
        error: e instanceof Error ? e.message : typeof e === 'string' ? e : 'A critical error occurred.',
        data: undefined
      } as ApiResponse<T>;
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []); // useCallback dependencies are empty as it uses refs updated by useEffect.

  useEffect(() => {
    if (immediate) {
        // If initialData was provided, we might not need to load immediately if data is already set.
        if (initialData !== undefined && data === initialData) {
            if(isLoading) setIsLoading(false); // Correct isLoading if it was true due to immediate=true
            return;
        }
      execute(urlRef.current, optionsRef.current);
    }
  // Trigger effect if `immediate` changes, or if `initialUrl` or `baseOptions` change, making `execute` call with new values.
  // `execute` itself is stable. `initialData` is included to re-evaluate skipping the fetch.
  // `data` and `isLoading` were removed from here to prevent potential loops.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, initialUrl, baseOptions, initialData, execute]);

  return { data, isLoading, isError, error, execute };
} 