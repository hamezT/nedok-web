import { getEndpoint } from './endpointService';
import { getCookie } from '../utils/cookieUtils';

// WebSocket message types for ThingsBoard
export interface WebSocketCommand {
  ts?: number;
  cmdId?: number;
}

export interface SubscriptionCmd extends WebSocketCommand {
  cmdId: number;
  entityType: 'DEVICE' | 'ASSET' | 'ENTITY_VIEW';
  entityId: string;
  scope: 'LATEST_TELEMETRY' | 'ATTRIBUTES' | 'RPC_CALL_REQUEST';
  unsubscribe?: boolean;
}

export interface LatestTelemetryCmd extends WebSocketCommand {
  cmdId: number;
  keys: string;
  unsubscribe?: boolean;
}

export interface WebSocketMessage {
  subscriptionId?: string;
  error?: string;
  data?: Record<string, any>;
  latestValues?: Record<string, any>;
  cmdId?: number;
}

// WebSocket service configuration
export interface WebSocketConfig {
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
}

export type WebSocketEventCallback = (data: any) => void;
export type WebSocketErrorCallback = (error: Error) => void;
export type WebSocketConnectionCallback = (connected: boolean) => void;

class ThingsBoardWebSocketService {
  private ws: WebSocket | null = null;
  private subscriptions = new Map<string, Set<WebSocketEventCallback>>();
  private isConnected = false;
  private reconnectAttempts = 0;
  private reconnectTimer: number | null = null;
  private heartbeatTimer: number | null = null;
  private cmdId = 0;

  private config: WebSocketConfig = {
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
    heartbeatInterval: 30000,
  };

  private eventListeners = {
    onMessage: new Set<WebSocketEventCallback>(),
    onError: new Set<WebSocketErrorCallback>(),
    onConnectionChange: new Set<WebSocketConnectionCallback>(),
  };

  constructor(config?: Partial<WebSocketConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Connect to ThingsBoard WebSocket API
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const token = getCookie('accessToken');
        if (!token) {
          throw new Error('Access Token not found');
        }

        const wsUrl = this.buildWebSocketUrl(token);
        console.log('Connecting to WebSocket:', wsUrl);

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.notifyConnectionChange(true);
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnected = false;
          this.notifyConnectionChange(false);
          this.handleReconnection();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.notifyError(new Error('WebSocket connection error'));
          reject(error);
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
    this.subscriptions.clear();
    this.notifyConnectionChange(false);
  }

  /**
   * Subscribe to device telemetry data
   */
  public subscribeToTelemetry(
    entityId: string,
    keys: string[],
    callback: WebSocketEventCallback
  ): string {
    if (!this.isConnected || !this.ws) {
      throw new Error('WebSocket not connected');
    }

    const subscriptionId = `telemetry_${entityId}_${keys.join('_')}`;
    const cmdId = this.generateCmdId();

    // Add callback to subscriptions
    if (!this.subscriptions.has(subscriptionId)) {
      this.subscriptions.set(subscriptionId, new Set());
    }
    this.subscriptions.get(subscriptionId)!.add(callback);

    // Send subscription command
    const command: LatestTelemetryCmd = {
      cmdId,
      keys: keys.join(','),
    };

    this.sendCommand(command);
    console.log(`Subscribed to telemetry for device ${entityId}, keys: ${keys}`);

    return subscriptionId;
  }

  /**
   * Subscribe to device attributes
   */
  public subscribeToAttributes(
    entityType: 'DEVICE' | 'ASSET' | 'ENTITY_VIEW',
    entityId: string,
    callback: WebSocketEventCallback
  ): string {
    if (!this.isConnected || !this.ws) {
      throw new Error('WebSocket not connected');
    }

    const subscriptionId = `attributes_${entityType}_${entityId}`;
    const cmdId = this.generateCmdId();

    // Add callback to subscriptions
    if (!this.subscriptions.has(subscriptionId)) {
      this.subscriptions.set(subscriptionId, new Set());
    }
    this.subscriptions.get(subscriptionId)!.add(callback);

    // Send subscription command
    const command: SubscriptionCmd = {
      cmdId,
      entityType,
      entityId,
      scope: 'ATTRIBUTES',
    };

    this.sendCommand(command);
    console.log(`Subscribed to attributes for ${entityType} ${entityId}`);

    return subscriptionId;
  }

  /**
   * Unsubscribe from telemetry or attributes
   */
  public unsubscribe(subscriptionId: string): void {
    if (!this.isConnected || !this.ws) {
      return;
    }

    const callbacks = this.subscriptions.get(subscriptionId);
    if (!callbacks) {
      console.warn(`No subscription found with ID: ${subscriptionId}`);
      return;
    }

    // Remove from subscriptions
    this.subscriptions.delete(subscriptionId);

    // Extract entity info from subscription ID
    const parts = subscriptionId.split('_');
    if (parts.length < 3) return;

    const type = parts[0]; // 'telemetry' or 'attributes'
    const cmdId = this.generateCmdId();

    if (type === 'telemetry') {
      const keys = parts.slice(3).join(',');
      const command: LatestTelemetryCmd = {
        cmdId,
        keys,
        unsubscribe: true,
      };
      this.sendCommand(command);
    } else if (type === 'attributes') {
      const entityType = parts[1] as 'DEVICE' | 'ASSET' | 'ENTITY_VIEW';
      const entityId = parts[2];
      const command: SubscriptionCmd = {
        cmdId,
        entityType,
        entityId,
        scope: 'ATTRIBUTES',
        unsubscribe: true,
      };
      this.sendCommand(command);
    }

    console.log(`Unsubscribed from ${subscriptionId}`);
  }

  /**
   * Add event listener for connection changes
   */
  public onConnectionChange(callback: WebSocketConnectionCallback): () => void {
    this.eventListeners.onConnectionChange.add(callback);
    return () => this.eventListeners.onConnectionChange.delete(callback);
  }

  /**
   * Add event listener for messages
   */
  public onMessage(callback: WebSocketEventCallback): () => void {
    this.eventListeners.onMessage.add(callback);
    return () => this.eventListeners.onMessage.delete(callback);
  }

  /**
   * Add event listener for errors
   */
  public onError(callback: WebSocketErrorCallback): () => void {
    this.eventListeners.onError.add(callback);
    return () => this.eventListeners.onError.delete(callback);
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Build WebSocket URL with authentication
   */
  private buildWebSocketUrl(token: string): string {
    const baseUrl = getEndpoint('').replace(/^http/, 'ws');
    return `${baseUrl}/api/ws/plugins/telemetry?token=${token}`;
  }

  /**
   * Send command to WebSocket
   */
  private sendCommand(command: WebSocketCommand): void {
    if (!this.ws || !this.isConnected) {
      console.warn('Cannot send command: WebSocket not connected');
      return;
    }

    const message = JSON.stringify(command);
    this.ws.send(message);
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);

      // Handle subscription data
      if (message.subscriptionId && message.data) {
        const callbacks = this.subscriptions.get(message.subscriptionId);
        if (callbacks) {
          callbacks.forEach(callback => {
            try {
              callback(message.data);
            } catch (error) {
              console.error('Error in subscription callback:', error);
            }
          });
        }
      }

      // Handle latest values
      if (message.latestValues) {
        this.eventListeners.onMessage.forEach(callback => {
          try {
            callback(message.latestValues);
          } catch (error) {
            console.error('Error in message callback:', error);
          }
        });
      }

      // Handle errors
      if (message.error) {
        this.notifyError(new Error(message.error));
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnection(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.notifyError(new Error('WebSocket reconnection failed'));
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})...`);

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
        this.handleReconnection();
      });
    }, this.config.reconnectInterval);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected && this.ws) {
        // Send a simple ping command
        this.sendCommand({ ts: Date.now() });
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Generate unique command ID
   */
  private generateCmdId(): number {
    return ++this.cmdId;
  }

  /**
   * Notify connection status change
   */
  private notifyConnectionChange(connected: boolean): void {
    this.eventListeners.onConnectionChange.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Error in connection change callback:', error);
      }
    });
  }

  /**
   * Notify error
   */
  private notifyError(error: Error): void {
    this.eventListeners.onError.forEach(callback => {
      try {
        callback(error);
      } catch (callbackError) {
        console.error('Error in error callback:', callbackError);
      }
    });
  }
}

// Export singleton instance
export const websocketService = new ThingsBoardWebSocketService();

// Export class for testing or custom instances
export { ThingsBoardWebSocketService };
