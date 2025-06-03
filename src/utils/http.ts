/**
 * @file HTTP request utility
 * @module utils/http
 */

/**
 * Options for the HTTP request, extending the standard RequestInit.
 * We use a type alias here as we are not adding new properties directly to the interface for now.
 * This can be converted back to an interface if custom options are added.
 */
export type HttpRequestOptions = RequestInit & {
  // You can add custom options here specific to your application if needed in the future.
  // For example:
  // params?: Record<string, string | number>; // To automatically append URL query parameters
};

/**
 * Structure for a standardized API response.
 * @template T The expected type of the data in a successful response.
 */
export interface ApiResponse<T = unknown> {
  /** The data returned by the API on success. */
  data?: T;
  /** An error message if the request failed. */
  error?: string;
  /** The HTTP status code of the response. */
  status: number;
  /** Indicates if the request was successful (e.g., status 2xx). */
  ok: boolean;
}

/**
 * Makes an HTTP request using the fetch API.
 * This function is designed to work on both client-side (React Native, browser) and server-side (Node.js).
 * 
 * Note: Content-Type header is only set when there's a request body to avoid CORS issues with simple GET requests.
 *
 * @async
 * @template T The expected type of the response data.
 * @param {string} url The URL to request.
 * @param {HttpRequestOptions} [options={}] The options for the request (method, headers, body, etc.).
 * @returns {Promise<ApiResponse<T>>} A promise that resolves to an ApiResponse object.
 *
 * @example
 * // GET request
 * const { data, error } = await httpRequest<{ id: number; name: string; }>('/api/users/1');
 * if (data) {
 *   console.log('User:', data);
 * } else {
 *   console.error('Error fetching user:', error);
 * }
 *
 * @example
 * // POST request
 * const newUser = { name: 'Jane Doe', email: 'jane@example.com' };
 * const { data, error, status } = await httpRequest<{ id: number }>(
 *   '/api/users',
 *   {
 *     method: 'POST',
 *     body: newUser, // Automatically stringified to JSON
 *   }
 * );
 * if (status === 201 && data) {
 *   console.log('User created with ID:', data.id);
 * } else {
 *   console.error('Error creating user:', error, 'Status:', status);
 * }
 */
export async function httpRequest<T = unknown>(
  url: string,
  options: HttpRequestOptions = {},
): Promise<ApiResponse<T>> {
  // Only set Content-Type header if there's a body to send
  const defaultHeaders: HeadersInit = {
    Accept: 'application/json',
    ...options.headers,
  };

  // Add Content-Type header only when there's a body
  if (options.body) {
    (defaultHeaders as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    ...options,
    headers: defaultHeaders,
  };

  // Automatically stringify the body if it's an object and Content-Type is application/json
  if (
    config.body &&
    typeof config.body === 'object' &&
    !(config.body instanceof FormData) &&
    (config.headers as Record<string, string>)['Content-Type'] === 'application/json'
  ) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    let responseData: unknown = null;
    const contentType = response.headers.get('content-type');

    // Attempt to parse the response body based on content type
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      // For non-JSON responses, try to get as text.
      // This could be extended to handle other types like blobs or arrayBuffers if needed.
      responseData = await response.text();
    }

    if (!response.ok) {
      // If the response is not OK, but we parsed some data (e.g. JSON error from API), use it.
      // Otherwise, use the status text or a generic message.
      let extractedErrorMessage: string | undefined;
      if (responseData && typeof responseData === 'object' && responseData !== null) {
        if ('message' in responseData && typeof (responseData as { message?: unknown }).message === 'string') {
          extractedErrorMessage = (responseData as { message: string }).message;
        }
      }

      const errorMessage =
        extractedErrorMessage
          ? extractedErrorMessage
          : typeof responseData === 'string' && responseData
            ? responseData
            : response.statusText || `Request failed with status ${response.status}`;
      return {
        error: errorMessage,
        status: response.status,
        ok: false,
        data: responseData as T, // Include data even on error, as it might contain error details from the API
      };
    }

    return {
      data: responseData as T,
      status: response.status,
      ok: true,
    };
  } catch (error: unknown) {
    // This catches network errors or other issues with the fetch call itself
    let message = 'An unknown network error occurred.';
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    
    return {
      error: message,
      status: 0,
      ok: false,
    };
  }
}

// Export the function as default or named, depending on preference.
// Named export is generally good for utilities to allow tree-shaking and clear imports.
// export default httpRequest; 