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

export interface DeviceRelationToResponse {
  data: DeviceRelation[];
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}
