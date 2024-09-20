// src/services/mercado-pago/auth.service.ts
import { httpClient } from '../../utils/httpClient';
import logger from '../../utils/logger';
import { ICredentialAccessToken } from '../models/credentialsAccessToken';

export class AuthService {
  async getAccessToken(clientId: string, clientSecret: string, code: string, redirectUri: string): Promise<ICredentialAccessToken> {
    try {
      const response = await httpClient.post('/oauth/token', null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          client_secret: clientSecret,
          client_id: clientId,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri
        }
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.statusText);
      }

      return response.data as ICredentialAccessToken;
    } catch (error) {
      logger.error(`Error getting access token: ${error}`);
      throw error;
    }
  }

  async getRefreshToken(clientId: string, clientSecret: string, refreshToken: string): Promise<ICredentialAccessToken> {
    try {
      const response = await httpClient.post('/oauth/token', null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          client_secret: clientSecret,
          client_id: clientId,
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.statusText);
      }

      return response.data as ICredentialAccessToken;
    } catch (error) {
      logger.error(`Error getting refresh token: ${error}`);
      throw error;
    }
  }
}
