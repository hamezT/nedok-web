import { useEffect, useRef, useState, useCallback } from 'react';
import {
  websocketService,
  WebSocketEventCallback,
  WebSocketConnectionCallback,
  WebSocketErrorCallback
} from '../services/websocketService';

export interface UseWebSocketOptions {
  autoConnect?: boolean;
  onMessage?: WebSocketEventCallback;
  onError?: WebSocketErrorCallback;
  onConnectionChange?: WebSocketConnectionCallback;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribeToTelemetry: (entityId: string, keys: string[], callback: WebSocketEventCallback) => string;
  subscribeToAttributes: (entityType: 'DEVICE' | 'ASSET' | 'ENTITY_VIEW', entityId: string, callback: WebSocketEventCallback) => string;
  unsubscribe: (subscriptionId: string) => void;
}

/**
 * React hook for using ThingsBoard WebSocket service
 */
export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const {
    autoConnect = true,
    onMessage,
    onError,
    onConnectionChange,
  } = options;

  const [isConnected, setIsConnected] = useState(websocketService.getConnectionStatus());
  const [error, setError] = useState<Error | null>(null);

  // Use refs to store callbacks to avoid stale closures
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const onConnectionChangeRef = useRef(onConnectionChange);

  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
    onConnectionChangeRef.current = onConnectionChange;
  }, [onMessage, onError, onConnectionChange]);

  // Set up event listeners
  useEffect(() => {
    const cleanupMessage = websocketService.onMessage((data) => {
      if (onMessageRef.current) {
        try {
          onMessageRef.current(data);
        } catch (err) {
          console.error('Error in onMessage callback:', err);
        }
      }
    });

    const cleanupError = websocketService.onError((err) => {
      setError(err);
      if (onErrorRef.current) {
        try {
          onErrorRef.current(err);
        } catch (callbackErr) {
          console.error('Error in onError callback:', callbackErr);
        }
      }
    });

    const cleanupConnection = websocketService.onConnectionChange((connected) => {
      setIsConnected(connected);
      setError(null); // Clear error when connection changes
      if (onConnectionChangeRef.current) {
        try {
          onConnectionChangeRef.current(connected);
        } catch (callbackErr) {
          console.error('Error in onConnectionChange callback:', callbackErr);
        }
      }
    });

    // Auto-connect if enabled
    if (autoConnect) {
      websocketService.connect().catch(err => {
        console.error('Failed to auto-connect WebSocket:', err);
        setError(err);
      });
    }

    // Cleanup function
    return () => {
      cleanupMessage();
      cleanupError();
      cleanupConnection();
    };
  }, [autoConnect]);

  const connect = useCallback(async () => {
    try {
      setError(null);
      await websocketService.connect();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to connect WebSocket');
      setError(error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  const subscribeToTelemetry = useCallback((
    entityId: string,
    keys: string[],
    callback: WebSocketEventCallback
  ): string => {
    return websocketService.subscribeToTelemetry(entityId, keys, callback);
  }, []);

  const subscribeToAttributes = useCallback((
    entityType: 'DEVICE' | 'ASSET' | 'ENTITY_VIEW',
    entityId: string,
    callback: WebSocketEventCallback
  ): string => {
    return websocketService.subscribeToAttributes(entityType, entityId, callback);
  }, []);

  const unsubscribe = useCallback((subscriptionId: string) => {
    websocketService.unsubscribe(subscriptionId);
  }, []);

  return {
    isConnected,
    error,
    connect,
    disconnect,
    subscribeToTelemetry,
    subscribeToAttributes,
    unsubscribe,
  };
};

/**
 * Hook for subscribing to telemetry data from a specific device
 */
export const useDeviceTelemetry = (
  entityId: string | null,
  keys: string[],
  enabled: boolean = true
) => {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const subscriptionIdRef = useRef<string | null>(null);

  const { isConnected, subscribeToTelemetry, unsubscribe } = useWebSocket({
    autoConnect: enabled && !!entityId,
  });

  const handleTelemetryUpdate = useCallback((newData: Record<string, any>) => {
    setData(newData);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!enabled || !entityId || !isConnected) {
      if (subscriptionIdRef.current) {
        unsubscribe(subscriptionIdRef.current);
        subscriptionIdRef.current = null;
      }
      setData(null);
      setLoading(false);
      return;
    }

    // Subscribe to telemetry data
    setLoading(true);
    subscriptionIdRef.current = subscribeToTelemetry(entityId, keys, handleTelemetryUpdate);

    return () => {
      if (subscriptionIdRef.current) {
        unsubscribe(subscriptionIdRef.current);
        subscriptionIdRef.current = null;
      }
    };
  }, [entityId, keys, enabled, isConnected, subscribeToTelemetry, unsubscribe, handleTelemetryUpdate]);

  return {
    data,
    loading,
    isConnected,
    error: null, // Error handling is done at the WebSocket level
  };
};

/**
 * Hook for subscribing to device attributes
 */
export const useDeviceAttributes = (
  entityType: 'DEVICE' | 'ASSET' | 'ENTITY_VIEW',
  entityId: string | null,
  enabled: boolean = true
) => {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const subscriptionIdRef = useRef<string | null>(null);

  const { isConnected, subscribeToAttributes, unsubscribe } = useWebSocket({
    autoConnect: enabled && !!entityId,
  });

  const handleAttributesUpdate = useCallback((newData: Record<string, any>) => {
    setData(newData);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!enabled || !entityId || !isConnected) {
      if (subscriptionIdRef.current) {
        unsubscribe(subscriptionIdRef.current);
        subscriptionIdRef.current = null;
      }
      setData(null);
      setLoading(false);
      return;
    }

    // Subscribe to attributes
    setLoading(true);
    subscriptionIdRef.current = subscribeToAttributes(entityType, entityId, handleAttributesUpdate);

    return () => {
      if (subscriptionIdRef.current) {
        unsubscribe(subscriptionIdRef.current);
        subscriptionIdRef.current = null;
      }
    };
  }, [entityType, entityId, enabled, isConnected, subscribeToAttributes, unsubscribe, handleAttributesUpdate]);

  return {
    data,
    loading,
    isConnected,
    error: null, // Error handling is done at the WebSocket level
  };
};
