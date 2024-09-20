// src/mercado-pago/services/deviceService.ts
import { httpClient } from '../../utils/httpClient';
import logger from '../../utils/logger';
import { DeviceMode, DeviceResult } from '../models/device';

export class DeviceService {
    async getDeviceList(accessToken: string): Promise<DeviceResult> {
        try {
            const response = await httpClient.get('/point/integration-api/devices', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status !== 200 && response.status !== 201) {
                throw new Error(response.statusText);
            }

            return response.data as DeviceResult;
        } catch (error) {
            logger.error(`Error getting device list: ${error}`);
            throw error;
        }
    }

    async setModeOperation(accessToken: string, deviceMode: string, deviceId: string): Promise<DeviceMode> {
        try {
            const operatingMode: DeviceMode = { operating_mode: deviceMode };
            const response = await httpClient.patch(`/point/integration-api/devices/${deviceId}`, operatingMode, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status !== 200 && response.status !== 201) {
                throw new Error(response.statusText);
            }

            return response.data as DeviceMode;
        } catch (error) {
            logger.error(`Error setting device mode: ${error}`);
            throw error;
        }
    }
}
