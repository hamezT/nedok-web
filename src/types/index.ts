export interface DeviceResponse {
  data: DeviceInfo[];
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}

export interface DeviceRelationResponse {
  data: DeviceRelation[];
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}

export interface DeviceRelation {
  from: {
    entityType: string;
    id: string;
  };
  to: {
    entityType: string;
    id: string;
  };
  type: string;
  typeGroup: string;
  additionalInfo: any;
}

export interface DeviceInfo {
  id: {
    entityType: string;
    id: string;
  };
  createdTime: number;
  tenantId: {
    entityType: string;
    id: string;
  };
  customerId: {
    entityType: string;
    id: string;
  };
  name: string;
  type: string;
  label: string;
  additionalInfo: {
    description: string;
    gateway: boolean;
    overwriteActivityTime: boolean;
    inactiveTimeout: number;
  };
  deviceProfileId: {
    entityType: string;
    id: string;
  };
}
