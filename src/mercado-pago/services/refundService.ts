// src/mercado-pago/services/refund.service.ts
import { httpClient } from '../../utils/httpClient';
import logger from '../../utils/logger';
import { Refund, RequestRefund } from '../models/refund';

export class RefundService {
  async sendRefund(accessToken: string, idPayment: string): Promise<Refund> {
    try {
      const response = await httpClient.post(`/v1/payments/${idPayment}/refunds`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.statusText);
      }

      return response.data as Refund;
    } catch (error) {
      logger.error(`Error sending refund: ${error}`);
      throw error;
    }
  }

  async getRefundData(accessToken: string, idPayment: string, idRefund: number): Promise<RequestRefund> {
    try {
      const response = await httpClient.get(`/v1/payments/${idPayment}/refunds/${idRefund}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.statusText);
      }

      return response.data as RequestRefund;
    } catch (error) {
      logger.error(`Error getting refund data: ${error}`);
      throw error;
    }
  }
}
