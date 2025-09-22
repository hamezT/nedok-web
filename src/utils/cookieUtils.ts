/**
 * Cookie utility functions for managing authentication tokens
 */

export interface CookieOptions {
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * Set a cookie with the given name and value
 */
export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += '; secure';
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * Get a cookie by name
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
};

/**
 * Remove a cookie by name
 */
export const removeCookie = (name: string, options: CookieOptions = {}): void => {
  // Set the cookie to expire in the past to delete it
  const pastDate = new Date(0);
  setCookie(name, '', {
    ...options,
    expires: pastDate
  });
};

/**
 * Check if a cookie exists
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * Clear localStorage auth data (for migration purposes)
 */
export const clearLocalStorageAuthData = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

/**
 * Debug function to check current auth storage
 */
export const debugAuthStorage = (): void => {
  console.log('=== AUTH STORAGE DEBUG ===');
  console.log('Cookies:');
  console.log('- accessToken:', getCookie('accessToken') ? '✓ Present' : '✗ Not found');
  console.log('- refreshToken:', getCookie('refreshToken') ? '✓ Present' : '✗ Not found');

  console.log('localStorage:');
  console.log('- accessToken:', localStorage.getItem('accessToken') ? '✓ Present' : '✗ Not found');
  console.log('- refreshToken:', localStorage.getItem('refreshToken') ? '✓ Present' : '✗ Not found');

  console.log('=== END DEBUG ===');
};
