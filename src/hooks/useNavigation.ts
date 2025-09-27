import { useCallback } from 'react';
import { useDevice } from '../contexts/DeviceContext';

export const useNavigation = () => {
  const { setSelectedDevice } = useDevice();

  const navigateToSensorData = useCallback((gatewayId: string) => {
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
