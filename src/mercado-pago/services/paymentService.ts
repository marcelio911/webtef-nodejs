// src/mercado-pago/services/paymentService.ts
import { httpClient } from '../../utils/httpClient';
import logger from '../../utils/logger';
import { CancelResult, Payment, PaymentDetail, PaymentResult, RequestBody, StatusPayment } from '../models/payment';

export class PaymentService {
  async processPayment(payment: Payment): Promise<void> {
    try {
      const response = await httpClient.post('/payments', payment);
      logger.info(`Payment processed: ${response.data}`);
    } catch (error) {
      logger.error(`Error processing payment: ${error}`);
      throw error;
    }
  }

  async setCancelPayment(accessToken: string, deviceId: string, guidPayment: string): Promise<CancelResult> {
    try {
      const response = await httpClient.delete(`/point/integration-api/devices/${deviceId}/payment-intents/${guidPayment}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.statusText);
      }

      return response.data as CancelResult;
    } catch (error) {
      logger.error(`Error cancelling payment: ${error}`);
      throw error;
    }
  }

  async sendPayment(accessToken: string, amount: string, description: string, installments: number, typePayment: string, installmentsCost: string, externalReference: string, printTerminal: boolean, deviceId: string): Promise<PaymentResult> {
    const requestBody: RequestBody = {
      amount: parseInt(amount),
      description: description,
      payment: {
        installments,
        type: typePayment,
        installments_cost: installmentsCost
      },
      additional_info: {
        external_reference: externalReference,
        print_on_terminal: printTerminal
      }
    };

    try {
      const response = await httpClient.post(`/point/integration-api/devices/${deviceId}/payment-intents`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.statusText);
      }

      return response.data as PaymentResult;
    } catch (error) {
      logger.error(`Error sending payment: ${error}`);
      throw error;
    }
  }

  async getDetailPayment(accessToken: string, idPayment: string): Promise<PaymentDetail> {
    try {
      const response = await httpClient.get(`/v1/payments/${idPayment}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.statusText);
      }

      return response.data as PaymentDetail;
    } catch (error) {
      logger.error(`Error getting payment details: ${error}`);
      throw error;
    }
  }

  async getPayment(accessToken: string, guidPayment: string): Promise<StatusPayment> {
    try {
      const response = await httpClient.get(`/point/integration-api/payment-intents/${guidPayment}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.statusText);
      }

      return response.data as StatusPayment;
    } catch (error) {
      logger.error(`Error getting payment status: ${error}`);
      throw error;
    }
  }
}

