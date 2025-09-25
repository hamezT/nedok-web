import { getEndpoint } from './endpointService';
import { getCookie } from '../utils/cookieUtils';

// Function to fetch relations from a device
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

// Function to fetch relations to a device
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
