import { getEndpoint } from './endpointService';
import { getCookie } from '../utils/cookieUtils';
import { DeviceInfoList } from '../types';
import { websocketService } from './websocketService';
import type { WebSocketEventCallback } from './websocketService';

/**
 * WebSocket Functions for Real-time Gateway Status
 *
 * These functions provide real-time updates for gateway measurement and upload interval status
 * using WebSocket instead of REST API polling.
 *
 * Usage in components:
 * ```typescript
 * const { data, loading, isConnected } = useGatewayMeasurementStatus(deviceIds);
 *
 * // Or manually:
 * const subscriptionIds = subscribeToGatewayMeasurementAndUploadIntervalStatus(
 *   deviceIds,
 *   (data) => console.log('Status updated:', data)
 * );
 * ```
 */

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

// Function to fetch gateway devices for current user
export const fetchGatewayDevices = async (params: {
  pageSize?: number;
  page?: number;
  textSearch?: string;
} = {}): Promise<DeviceInfoList> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  const queryParams = new URLSearchParams();

  // Set parameters from UI or defaults
  const pageSize = params.pageSize ?? 10;
  const page = params.page ?? 0;

  queryParams.append('pageSize', pageSize.toString());
  queryParams.append('page', page.toString());
  queryParams.append('includeCustomers', 'true'); // Always include customers
  queryParams.append('deviceProfileId', '970f3fe0-b20e-11ef-8f8f-09ec942e43b6'); // Fixed gateway deviceProfileId

  // Optional parameters - leave empty for now
  // textSearch will be added when search functionality is implemented

  const finalQuery = queryParams.toString();
  const url = getEndpoint(`/api/deviceInfos/all?${finalQuery}`);
  console.log('Gateway API URL:', url);
  console.log('Query parameters:', Object.fromEntries(queryParams));

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Unable to get gateway devices');
  }

  return response.json();
};

// Function to fetch measurement status attributes for gateway devices
export const fetchGatewayMeasurementAndUploadIntervalStatus = async (
  deviceIds: string[],
  keys: string[] = ["measurement_started,upload_interval_time"]
): Promise<Record<string, Record<string, any>>> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  const entityType = "DEVICE";
  const queryParams = new URLSearchParams();
  keys.forEach(key => queryParams.append('keys', key));

  // Fetch attributes for all devices concurrently
  const promises = deviceIds.map(async (deviceId) => {
    const url = getEndpoint(`/api/plugins/telemetry/${entityType}/${deviceId}/values/attributes?${queryParams}`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch measurement status for device ${deviceId}:`, response.status);
        return { deviceId, attributes: {} };
      }

      const data = await response.json();
      return { deviceId, attributes: data };
    } catch (error) {
      console.error(`Error fetching measurement status for device ${deviceId}:`, error);
      return { deviceId, attributes: {} };
    }
  });

  const results = await Promise.all(promises);

  // Transform results into a map of deviceId -> attributes
  const attributesMap: Record<string, Record<string, any>> = {};
  results.forEach(({ deviceId, attributes }) => {
    attributesMap[deviceId] = attributes;
  });

  return attributesMap;
};

// Function to fetch device attributes (including upload interval time)
export const fetchDeviceAttributes = async (
  deviceIds: string[],
  keys: string[] = ["upload_interval_time"]
): Promise<Record<string, Record<string, any>>> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  const entityType = "DEVICE";
  const queryParams = new URLSearchParams();
  keys.forEach(key => queryParams.append('keys', key));

  // Fetch attributes for all devices concurrently
  const promises = deviceIds.map(async (deviceId) => {
    // Try multiple possible API endpoints
    const endpoints = [
      `/api/plugins/telemetry/${entityType}/${deviceId}/values/attributes?${queryParams}`,
      `/api/plugins/telemetry/${entityType}/${deviceId}/attributes?${queryParams}`,
      `/api/attributes/${entityType}/${deviceId}?${queryParams}`,
    ];

    for (const endpoint of endpoints) {
      const url = getEndpoint(endpoint);
      console.log(`Trying endpoint for device ${deviceId}:`, url);

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`Success with endpoint ${endpoint} for device ${deviceId}:`, data);
          return { deviceId, attributes: data };
        } else {
          console.warn(`Failed endpoint ${endpoint} for device ${deviceId}:`, response.status);
        }
      } catch (error) {
        console.error(`Error with endpoint ${endpoint} for device ${deviceId}:`, error);
      }
    }

    // If all endpoints fail, return empty attributes
    console.error(`All endpoints failed for device ${deviceId}`);
    return { deviceId, attributes: {} };
  });

  const results = await Promise.all(promises);

  // Transform results into a map of deviceId -> attributes
  const attributesMap: Record<string, Record<string, any>> = {};
  results.forEach(({ deviceId, attributes }) => {
    attributesMap[deviceId] = attributes;
  });

  return attributesMap;
};

// Function to subscribe to gateway measurement and upload interval status via WebSocket
export const subscribeToGatewayMeasurementAndUploadIntervalStatus = (
  deviceIds: string[],
  callback: (data: Record<string, Record<string, any>>) => void
): string[] => {
  const subscriptionIds: string[] = [];

  // Subscribe to attributes for each device
  deviceIds.forEach(deviceId => {
    const subscriptionId = websocketService.subscribeToAttributes(
      'DEVICE',
      deviceId,
      (data: Record<string, any>) => {
        // Filter only measurement_started and upload_interval_time attributes
        const filteredData: Record<string, Record<string, any>> = {};
        filteredData[deviceId] = {};

        if (data.measurement_started !== undefined) {
          filteredData[deviceId].measurement_started = [{ value: data.measurement_started }];
        }
        if (data.upload_interval_time !== undefined) {
          filteredData[deviceId].upload_interval_time = [{ value: data.upload_interval_time }];
        }

        // Call the callback with updated data for all devices
        const updatedData: Record<string, Record<string, any>> = {};
        deviceIds.forEach(id => {
          if (filteredData[id]) {
            updatedData[id] = filteredData[id];
          } else {
            updatedData[id] = {};
          }
        });

        callback(updatedData);
      }
    );

    subscriptionIds.push(subscriptionId);
  });

  return subscriptionIds;
};

// Function to unsubscribe from gateway measurement and upload interval status
export const unsubscribeFromGatewayMeasurementAndUploadIntervalStatus = (
  subscriptionIds: string[]
): void => {
  subscriptionIds.forEach(subscriptionId => {
    websocketService.unsubscribe(subscriptionId);
  });
};