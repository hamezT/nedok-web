import { getEndpoint } from './endpointService';
import { getCookie } from '../utils/cookieUtils';
import { DeviceRelation } from '../types/api/relation';

// Function to fetch relations from a device
export const fetchRelationsFrom = async (fromId: string, fromType: string = 'DEVICE', relationType: string = 'Registered'): Promise<any> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  const params = new URLSearchParams({
    fromId,
    fromType,
    relationType
  });

  const response = await fetch(getEndpoint(`/api/relations/info?${params.toString()}`), {
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
export const fetchRelationsTo = async (toId: string, toType: string = 'DEVICE', relationType: string = 'Registered'): Promise<any> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  const params = new URLSearchParams({
    toId,
    toType,
    relationType
  });

  const response = await fetch(getEndpoint(`/api/relations?${params.toString()}`), {
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

// Function to fetch relations for multiple gateway IDs
export const fetchGatewayRelations = async (gatewayIds: string[]): Promise<any[]> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  const allRelations: any[] = [];

  // Fetch relations for each gateway concurrently
  const promises = gatewayIds.map(async (gatewayId) => {
    try {
      const relations = await fetchRelationsFrom(gatewayId, 'DEVICE', 'Registered');
      return relations;
    } catch (error) {
      console.error(`Failed to fetch relations for gateway ${gatewayId}:`, error);
      return [];
    }
  });

  const results = await Promise.all(promises);

  // Flatten and return all relations
  results.forEach(relations => {
    if (Array.isArray(relations)) {
      allRelations.push(...relations);
    }
  });

  return allRelations;
};

// Function to fetch relations TO a device (relations pointing to a specific device)
export const fetchRelationsToDevices = async (deviceIds: string[], toType: string = 'DEVICE'): Promise<DeviceRelation[]> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  const allRelations: DeviceRelation[] = [];

  // Fetch relations for each device concurrently
  const promises = deviceIds.map(async (deviceId) => {
    try {
      const params = new URLSearchParams({
        toId: deviceId,
        toType: toType,
        // relationTypeGroup is intentionally left empty as per requirements
      });

      const response = await fetch(getEndpoint(`/api/relations?${params.toString()}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Unable to get relations to device ${deviceId}`);
      }

      const relations: DeviceRelation[] = await response.json();
      return Array.isArray(relations) ? relations : [];
    } catch (error) {
      console.error(`Failed to fetch relations for device ${deviceId}:`, error);
      return [];
    }
  });

  const results = await Promise.all(promises);

  // Flatten and return all relations
  results.forEach(relations => {
    if (Array.isArray(relations)) {
      allRelations.push(...relations);
    }
  });

  return allRelations;
};

// Function to fetch all relations for a list of device IDs (including FROM relations as parent and "Manages" relation)
export const fetchAllRelationsForDevices = async (deviceIds: string[]): Promise<DeviceRelation[]> => {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error('Access Token not found');
  }

  const allRelations: DeviceRelation[] = [];
  const relationSet = new Set<string>();

  const promises = deviceIds.map(async (deviceId) => {
    try {
      // Fetch FROM relations (where this device is the parent)
      const registeredRelations = await fetchRelationsFrom(deviceId, 'DEVICE', 'Registered');
      if (Array.isArray(registeredRelations)) {
        registeredRelations.forEach(relation => {
          const relationString = JSON.stringify(relation);
          if (!relationSet.has(relationString)) {
            relationSet.add(relationString);
            allRelations.push(relation);
          }
        });
      }
      
      // Fetch "Manages" relations (for sensorbase-camera relationships)
      const managesRelations = await fetchRelationsFrom(deviceId, 'DEVICE', 'Manages');
      if (Array.isArray(managesRelations)) {
        managesRelations.forEach(relation => {
          const relationString = JSON.stringify(relation);
          if (!relationSet.has(relationString)) {
            relationSet.add(relationString);
            allRelations.push(relation);
          }
        });
      }
    } catch (error) {
      console.error(`Failed to fetch relations for device ${deviceId}:`, error);
    }
  });

  await Promise.all(promises);
  return allRelations;
};
