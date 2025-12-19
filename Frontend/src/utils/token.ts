/**
 * Token management utilities for JWT Bearer authentication
 * Uses localStorage for token persistence
 */

const TOKEN_KEY = "auth_token";

/**
 * Save authentication token to localStorage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get authentication token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user has a valid token
 */
export const hasToken = (): boolean => {
  return !!getToken();
};

/**
 * Get Authorization header value for API requests
 */
export const getAuthHeader = (): string | null => {
  const token = getToken();
  return token ? `Bearer ${token}` : null;
};

