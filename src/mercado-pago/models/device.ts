// src/mercado-pago/models/device.ts
export interface DeviceResult {
  devices?: Device[];
  paging: Paging;
}

export interface Device {
  id: string;
  operating_mode: string;
}

export interface Paging {
  total: number;
  limit: number;
  offset: number;
}

export interface DeviceMode {
  operating_mode: string;
}