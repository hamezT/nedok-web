export interface EntityId {
  entityType: string;
  id: string;
}

export interface DeviceProfile {
  id: EntityId;
  name: string;
  description?: string;
}

export interface DeviceProfileNamesRequest {
  activeOnly: boolean;
}

export interface DeviceProfileList {
  data: DeviceProfile[];
}
