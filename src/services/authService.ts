import { getEndpoint } from './endpointService';
import { setCookie, getCookie, removeCookie, clearLocalStorageAuthData } from '../utils/cookieUtils';

export interface DeviceInfo {
  id: { id: string };
  name: string;
  label?: string;
  type?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  console.log('Attempting login with:', { username, password: '***' });
  console.log('API URL:', getEndpoint('/api/auth/login'));

  const response = await fetch(getEndpoint('/api/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);

  if (!response.ok) {
    let errorMessage = 'Login failed';
    try {
      const errorData = await response.json();
      console.log('Error response data:', errorData);
      errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
    } catch (parseError) {
      console.log('Could not parse error response as JSON');
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log('Login successful, response data:', data);

  // Validate response structure
  if (!data.token || !data.refreshToken) {
    throw new Error('Invalid response format: missing token or refreshToken');
  }

  return data;
};

export const refreshAccessToken = async (refreshToken: string): Promise<LoginResponse> => {
  const response = await fetch(getEndpoint('/api/auth/token'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearAuthData();
    throw new Error('Unable to refresh token');
  }

  const data = await response.json();

  // Update access token in cookie (expires in 1 hour)
  const accessTokenExpiry = new Date(Date.now() + 3600000);
  setCookie('accessToken', data.token, {
    expires: accessTokenExpiry,
    path: '/',
    sameSite: 'Strict'
  });

  return data;
};

export interface UserInfo {
  id: {
    entityType: string;
    id: string;
  };
  createdTime: number;
  tenantId: {
    entityType: string;
    id: string;
  };
  customerId: {
    entityType: string;
    id: string;
  };
  email: string;
  authority: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  customMenuId: string | null;
  version: number;
  name: string;
  additionalInfo: {
    description: string;
    defaultDashboardFullscreen: boolean;
    homeDashboardHideToolbar: boolean;
    userCredentialsEnabled: boolean;
    failedLoginAttempts: number;
    lastLoginTs: number;
    lang: string;
    homeDashboardId: string;
  };
  ownerId: {
    entityType: string;
    id: string;
  };
}

export const getUserInfo = async (): Promise<UserInfo> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  const response = await fetch(getEndpoint('/api/auth/user'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(errorData.message || 'Unable to get user information');

    // Check if it's a 401 error (Unauthorized)
    if (response.status === 401) {
      clearAuthData();
      throw error;
    }

    throw error;
  }

  return response.json();
};

export const fetchUserDevices = async (): Promise<any> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  const response = await fetch(getEndpoint('/api/user/devices?pageSize=100&page=0'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Unable to get device list');
  }

  return response.json();
};

export const fetchRelationsFrom = async (fromId: string, fromType: string = 'DEVICE'): Promise<any> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  const response = await fetch(getEndpoint(`/api/relations/info?fromId=${fromId}&fromType=${fromType}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Unable to get relations from ${fromId}`);
  }

  return response.json();
};

export const fetchRelationsTo = async (toId: string, toType: string = 'DEVICE'): Promise<any> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  const response = await fetch(getEndpoint(`/api/relations?toId=${toId}&toType=${toType}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Unable to get relations to ${toId}`);
  }

  return response.json();
};

export interface DeviceProfileName {
  id: {
    entityType: string;
    id: string;
  };
  name: string;
}

export const fetchDeviceProfileNames = async (): Promise<DeviceProfileName[]> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  const response = await fetch(getEndpoint('/api/deviceProfile/names?activeOnly=true'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Unable to get Device Profiles list');
  }

  return response.json();
};

export interface TelemetryDataPoint {
  ts: number;
  value: string;
}

export type TelemetryResponse = Record<string, TelemetryDataPoint[]>;

export const fetchTelemetryData = async (entityId: string, keys?: string): Promise<TelemetryResponse> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  let url = getEndpoint(`/api/plugins/telemetry/DEVICE/${entityId}/values/timeseries`);
  if (keys) {
    url += `?keys=${keys}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Unable to get telemetry data');
  }

  return response.json();
};

export const fetchTelemetryHistory = async (
  entityId: string,
  key: string,
  startTs: number,
  endTs: number,
  limit: number = 43200,
  useStrictDataTypes: boolean = false
): Promise<TelemetryResponse> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  const queryParams = new URLSearchParams({
    keys: key,
    startTs: startTs.toString(),
    endTs: endTs.toString(),
    interval: '0',
    limit: limit.toString(),
    useStrictDataTypes: useStrictDataTypes.toString(),
  }).toString();

  const url = getEndpoint(`/api/plugins/telemetry/DEVICE/${entityId}/values/timeseries?${queryParams}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Unable to get telemetry history data');
  }

  return response.json();
};

// Utility function to clear auth data
export const clearAuthData = (): void => {
  // Clear cookies
  removeCookie('accessToken', { path: '/' });
  removeCookie('refreshToken', { path: '/' });

  // Clear old localStorage data (for migration)
  clearLocalStorageAuthData();
};
