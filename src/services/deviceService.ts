import { getEndpoint } from './endpointService';
import { getCookie } from '../utils/cookieUtils';
import { DeviceInfoList } from '../types';

// Function to fetch device info list
export const fetchDeviceInfos = async (params: {
  pageSize?: number;
  page?: number;
  includeCustomers?: boolean;
  deviceProfileId?: string;
  textSearch?: string;
} = {}): Promise<DeviceInfoList> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  const queryParams = new URLSearchParams();

  // Set default values - pageSize and page are required parameters
  const pageSize = params.pageSize ?? 100; // Default pageSize is 100
  const page = params.page ?? 0; // Default page is 0

  queryParams.append('pageSize', pageSize.toString());
  queryParams.append('page', page.toString());
  queryParams.append('includeCustomers', 'true'); // Always include customers

  // Optional parameters
  if (params.deviceProfileId) queryParams.append('deviceProfileId', params.deviceProfileId);
  if (params.textSearch) queryParams.append('textSearch', params.textSearch);

  const url = getEndpoint(`/api/deviceInfos/all?${queryParams}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Unable to get device info list');
  }

  return response.json();
};

// Function to fetch user devices
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
