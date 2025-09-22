const API_BASE_URL = (import.meta.env as any).VITE_BASE_URL || 'https://datahub-dev.i-nedok.com';

export const getEndpoint = (path: string): string => {
  return `${API_BASE_URL}${path}`;
};
