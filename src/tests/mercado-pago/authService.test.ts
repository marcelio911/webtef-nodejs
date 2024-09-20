// tests/auth.service.test.ts
import { AuthService } from '../../mercado-pago/services/authService';
import { ICredentialAccessToken } from '../../mercado-pago/models/credentialsAccessToken';
import { httpClient } from '../../utils/httpClient';

jest.mock('../../src/utils/httpClient');
const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('AuthService', () => {
  it('should get access token correctly', async () => {
    const authService = new AuthService();
    const clientId = 'test_client_id';
    const clientSecret = 'test_client_secret';
    const code = 'test_code';
    const redirectUri = process.env['my-custom-domain'] as string;

    const credentialAccessToken: ICredentialAccessToken = {
      access_token: 'test_access_token',
      token_type: 'bearer',
      expires_in: 3600,
      expires: new Date(),
      scope: 'read',
      user_id: 12345,
      refresh_token: 'test_refresh_token',
      public_key: 'test_public_key',
      live_mode: true,
      created: new Date(),
    };

    mockedHttpClient.post.mockResolvedValue({ status: 200, data: credentialAccessToken });

    await expect(authService.getAccessToken(clientId, clientSecret, code, redirectUri)).resolves.toEqual(credentialAccessToken);
    expect(mockedHttpClient.post).toHaveBeenCalledWith(
      '/oauth/token',
      null,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: {
          client_secret: clientSecret,
          client_id: clientId,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri
        }
      }
    );
  });

  it('should log error if getting access token fails', async () => {
    const authService = new AuthService();
    const clientId = 'test_client_id';
    const clientSecret = 'test_client_secret';
    const code = 'test_code';
    const redirectUri = 'http://localhost';

    mockedHttpClient.post.mockRejectedValue(new Error('Request failed'));

    await expect(authService.getAccessToken(clientId, clientSecret, code, redirectUri)).rejects.toThrow('Request failed');
  });

  it('should get refresh token correctly', async () => {
    const authService = new AuthService();
    const clientId = 'test_client_id';
    const clientSecret = 'test_client_secret';
    const refreshToken = 'test_refresh_token';

    const credentialRefreshToken: ICredentialAccessToken = {
      access_token: 'test_access_token',
      token_type: 'bearer',
      expires_in: 3600,
      expires: new Date(),
      scope: 'read',
      user_id: 12345,
      refresh_token: 'new_refresh_token',
      public_key: 'test_public_key',
      live_mode: true,
      created: new Date()
    };

    mockedHttpClient.post.mockResolvedValue({ status: 200, data: credentialRefreshToken });

    await expect(authService.getRefreshToken(clientId, clientSecret, refreshToken)).resolves.toEqual(credentialRefreshToken);
    expect(mockedHttpClient.post).toHaveBeenCalledWith(
      '/oauth/token',
      null,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: {
          client_secret: clientSecret,
          client_id: clientId,
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }
      }
    );
  });

  it('should log error if getting refresh token fails', async () => {
    const authService = new AuthService();
    const clientId = 'test_client_id';
    const clientSecret = 'test_client_secret';
    const refreshToken = 'test_refresh_token';

    mockedHttpClient.post.mockRejectedValue(new Error('Request failed'));

    await expect(authService.getRefreshToken(clientId, clientSecret, refreshToken)).rejects.toThrow('Request failed');
  });
});
