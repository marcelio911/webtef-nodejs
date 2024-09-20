// tests/mercado-pago/paymentService.test.ts
import { PaymentDetail, PaymentResult, RequestBody, StatusPayment } from '../../mercado-pago/models/payment';
import { PaymentService } from '../../mercado-pago/services/paymentService';
import { httpClient } from '../../utils/httpClient';

jest.mock('../../src/utils/httpClient');
const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('PaymentService', () => {
  it('should process payment correctly', async () => {
    const paymentService = new PaymentService();
    const payment = { amount: 100, currency: 'USD', method: 'credit_card' };

    mockedHttpClient.post.mockResolvedValue({ data: 'success' });

    await expect(paymentService.processPayment(payment)).resolves.not.toThrow();
    expect(mockedHttpClient.post).toHaveBeenCalledWith('/payments', payment);
  });

  it('should cancel payment correctly', async () => {
    const paymentService = new PaymentService();
    const accessToken = 'test_token';
    const deviceId = 'test_device';
    const guidPayment = 'test_guid';

    const cancelResult = { id: 'cancel_id' };
    mockedHttpClient.delete.mockResolvedValue({ status: 200, data: cancelResult });

    await expect(paymentService.setCancelPayment(accessToken, deviceId, guidPayment)).resolves.toEqual(cancelResult);
    expect(mockedHttpClient.delete).toHaveBeenCalledWith(
      `/point/integration-api/devices/${deviceId}/payment-intents/${guidPayment}`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
  });

  it('should send payment correctly', async () => {
    const paymentService = new PaymentService();
    const accessToken = 'test_token';
    const amount = '100';
    const description = 'Test payment';
    const installments = 1;
    const typePayment = 'credit_card';
    const installmentsCost = '0';
    const externalReference = 'test_reference';
    const printTerminal = true;
    const deviceId = 'test_device';

    const paymentResult: PaymentResult = {
      additional_info: {
        external_reference: externalReference,
        print_on_terminal: printTerminal
      },
      amount: parseInt(amount),
      description: description,
      device_id: deviceId,
      id: 'payment_id',
      payment: {
        installments: installments,
        installments_cost: installmentsCost,
        type: typePayment
      },
      payment_mode: 'test_mode'
    };

    mockedHttpClient.post.mockResolvedValue({ status: 200, data: paymentResult });

    await expect(paymentService.sendPayment(accessToken, amount, description, installments, typePayment, installmentsCost, externalReference, printTerminal, deviceId)).resolves.toEqual(paymentResult);
    expect(mockedHttpClient.post).toHaveBeenCalledWith(
      `/point/integration-api/devices/${deviceId}/payment-intents`,
      {
        amount: parseInt(amount),
        description: description,
        payment: {
          installments: installments,
          type: typePayment,
          installments_cost: installmentsCost
        },
        additional_info: {
          external_reference: externalReference,
          print_on_terminal: printTerminal
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  });

  it('should log error if sending payment fails', async () => {
    const paymentService = new PaymentService();
    const accessToken = 'test_token';
    const amount = '100';
    const description = 'Test payment';
    const installments = 1;
    const typePayment = 'credit_card';
    const installmentsCost = '0';
    const externalReference = 'test_reference';
    const printTerminal = true;
    const deviceId = 'test_device';

    mockedHttpClient.post.mockRejectedValue(new Error('Request failed'));

    await expect(paymentService.sendPayment(accessToken, amount, description, installments, typePayment, installmentsCost, externalReference, printTerminal, deviceId)).rejects.toThrow('Request failed');
  });

  it('should get payment details correctly', async () => {
    const paymentService = new PaymentService();
    const accessToken = 'test_token';
    const idPayment = 'test_payment_id';

    const paymentDetail: PaymentDetail = {
      id: 1,
      status: 'approved',
      status_detail: 'accredited',
      transaction_amount: 100,
      date_approved: new Date(),
      date_created: new Date(),
      date_last_updated: new Date(),
      money_release_date: new Date(),
      payment_method_id: 'visa',
      payment_type_id: 'credit_card',
      issuer_id: 'issuer_id',
      installments: 1,
      transaction_details: {
        net_received_amount: 100,
        total_paid_amount: 100,
        overpaid_amount: 0,
        external_resource_url: '',
        installment_amount: 100,
        financial_institution: '',
        payment_method_reference_id: ''
      },
      card: {
        first_six_digits: '123456',
        last_four_digits: '7890',
        expiration_month: 12,
        expiration_year: 2025,
        date_created: new Date(),
        date_last_updated: new Date(),
        cardholder: {
          name: 'John Doe',
          identification: {
            type: 'CPF',
            number: '12345678900'
          }
        }
      },
      statement_descriptor: 'Test Payment',
      notification_url: 'http://example.com/notification',
      refunds: []
    };

    mockedHttpClient.get.mockResolvedValue({ status: 200, data: paymentDetail });

    await expect(paymentService.getDetailPayment(accessToken, idPayment)).resolves.toEqual(paymentDetail);
    expect(mockedHttpClient.get).toHaveBeenCalledWith(
      `/v1/payments/${idPayment}`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
  });

  it('should log error if getting payment details fails', async () => {
    const paymentService = new PaymentService();
    const accessToken = 'test_token';
    const idPayment = 'test_payment_id';

    mockedHttpClient.get.mockRejectedValue(new Error('Request failed'));

    await expect(paymentService.getDetailPayment(accessToken, idPayment)).rejects.toThrow('Request failed');
  });

  it('should get payment status correctly', async () => {
    const paymentService = new PaymentService();
    const accessToken = 'test_token';
    const guidPayment = 'test_guid_payment';

    const statusPayment: StatusPayment = {
      additional_info: {
        external_reference: 'test_reference',
        print_on_terminal: true
      },
      amount: 100,
      description: 'Test payment',
      device_id: 'test_device',
      id: 'payment_id',
      payment: {
        id: 'payment_data_id',
        installments: 1,
        installments_cost: '0',
        type: 'credit_card'
      },
      payment_mode: 'test_mode',
      state: 'approved'
    };

    mockedHttpClient.get.mockResolvedValue({ status: 200, data: statusPayment });

    await expect(paymentService.getPayment(accessToken, guidPayment)).resolves.toEqual(statusPayment);
    expect(mockedHttpClient.get).toHaveBeenCalledWith(
      `/point/integration-api/payment-intents/${guidPayment}`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
  });

  it('should log error if getting payment status fails', async () => {
    const paymentService = new PaymentService();
    const accessToken = 'test_token';
    const guidPayment = 'test_guid_payment';

    mockedHttpClient.get.mockRejectedValue(new Error('Request failed'));

    await expect(paymentService.getPayment(accessToken, guidPayment)).rejects.toThrow('Request failed');
  });
});
