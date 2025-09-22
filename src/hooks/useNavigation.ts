import { useCallback } from 'react';
import { useDevice } from '../contexts/DeviceContext';

export const useNavigation = () => {
  const { setSelectedDevice } = useDevice();

  const navigateToSensorData = useCallback((gatewayId: string) => {
    console.log("Navigating to sensor data with ID:", gatewayId); // Debug log
    setSelectedDevice(gatewayId);
  }, [setSelectedDevice]);

  const navigateBack = useCallback(() => {
    setSelectedDevice(null);
  }, [setSelectedDevice]);

  return {
    navigateToSensorData,
    navigateBack
  };
};
