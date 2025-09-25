export interface EntityId {
  entityType: string;
  id: string;
}

export interface DeviceInfo {
  id: EntityId;
  createdTime: number;
  tenantId: EntityId;
  customerId: EntityId;
  name: string;
  type: string;
  label: string | null;
  deviceProfileId: EntityId;
  firmwareId: EntityId | null;
  softwareId: EntityId | null;
  externalId: string | null;
  version: number;
  ownerName: string;
  groups: any[];
  active: boolean;
  additionalInfo: {
    gateway?: boolean;
    overwriteActivityTime?: boolean;
    description?: string;
    lastConnectedGateway?: string;
  } | null;
  ownerId: EntityId;
  deviceData: {
    configuration: {
      type: string;
    };
    transportConfiguration: {
      type: string;
    };
  };
}

export interface DeviceInfoList {
  data: DeviceInfo[];
  totalPages?: number;
  totalElements?: number;
  hasNext?: boolean;
}
