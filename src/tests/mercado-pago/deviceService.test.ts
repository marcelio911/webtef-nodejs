// tests/mercado-pago/deviceService.test.ts
import { DeviceService } from '../../mercado-pago/services/deviceService';
import { DeviceMode, DeviceResult } from '../../mercado-pago/models/device';
import { httpClient } from '../../utils/httpClient';

jest.mock('../../src/utils/httpClient');
const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('DeviceService', () => {
  it('should get device list correctly', async () => {
    const deviceService = new DeviceService();
    const accessToken = 'test_token';

    const deviceResult: DeviceResult = {
      devices: [
        { id: 'device1', operating_mode: 'mode1' },
        { id: 'device2', operating_mode: 'mode2' }
      ],
      paging: {
        total: 2,
        limit: 10,
        offset: 0
      }
    };

    mockedHttpClient.get.mockResolvedValue({ status: 200, data: deviceResult });

    await expect(deviceService.getDeviceList(accessToken)).resolves.toEqual(deviceResult);
    expect(mockedHttpClient.get).toHaveBeenCalledWith(
      '/point/integration-api/devices',
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
  });

  it('should log error if getting device list fails', async () => {
    const deviceService = new DeviceService();
    const accessToken = 'test_token';

    mockedHttpClient.get.mockRejectedValue(new Error('Request failed'));

    await expect(deviceService.getDeviceList(accessToken)).rejects.toThrow('Request failed');
  });

  it('should set device mode correctly', async () => {
    const deviceService = new DeviceService();
    const accessToken = 'test_token';
    const deviceMode = 'PDV';
    const deviceId = 'GERTEC_MP35P__8701442341443345'

    const deviceModeResult: DeviceMode = { operating_mode: deviceMode };

    mockedHttpClient.patch.mockResolvedValue({ status: 200, data: deviceModeResult });

    await expect(deviceService.setModeOperation(accessToken, deviceMode, deviceId)).resolves.toEqual(deviceModeResult);
    expect(mockedHttpClient.patch).toHaveBeenCalledWith(
      `/point/integration-api/devices/${deviceId}`,
      { operating_mode: deviceMode },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  });

  it('should log error if setting device mode fails', async () => {
    const deviceService = new DeviceService();
    const accessToken = 'test_token';
    const deviceMode = 'PDV';
    const deviceId = 'GERTEC_MP35P__8701442341443345'

    mockedHttpClient.patch.mockRejectedValue(new Error('Request failed'));

    await expect(deviceService.setModeOperation(accessToken, deviceMode, deviceId)).rejects.toThrow('Request failed');
  });
});
