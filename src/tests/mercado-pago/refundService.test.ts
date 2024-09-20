// tests/mercado-pago/refundService.test.ts
import { RefundService } from '../../mercado-pago/services/refundService';
import { Refund } from '../../mercado-pago/models/refund';
import { httpClient } from '../../utils/httpClient';

jest.mock('../../src/utils/httpClient');
const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('RefundService', () => {
  it('should send refund correctly', async () => {
    const refundService = new RefundService();
    const accessToken = 'test_token';
    const idPayment = 'test_payment_id';

    const refundResult: Refund = {
      id: 1,
      payment_id: 12345,
      amount: 100,
      source: {
        id: 'source_id',
        name: 'source_name',
        type: 'source_type'
      },
      date_created: new Date(),
      unique_sequence_number: null,
      refund_mode: 'full',
      adjustment_amount: 0,
      status: 'approved',
      reason: null,
      labels: [],
      amount_refunded_to_payer: 100,
      additional_data: null,
      partition_details: []
    };

    mockedHttpClient.post.mockResolvedValue({ status: 200, data: refundResult });

    await expect(refundService.sendRefund(accessToken, idPayment)).resolves.toEqual(refundResult);
    expect(mockedHttpClient.post).toHaveBeenCalledWith(
      `/v1/payments/${idPayment}/refunds`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  });

  it('should log error if sending refund fails', async () => {
    const refundService = new RefundService();
    const accessToken = 'test_token';
    const idPayment = 'test_payment_id';

    mockedHttpClient.post.mockRejectedValue(new Error('Request failed'));

    await expect(refundService.sendRefund(accessToken, idPayment)).rejects.toThrow('Request failed');
  });


  it('should log error if getting refund data fails', async () => {
    const refundService = new RefundService();
    const accessToken = 'test_token';
    const idPayment = 'test_payment_id';
    const idRefund = 1;

    mockedHttpClient.get.mockRejectedValue(new Error('Request failed'));

    await expect(refundService.getRefundData(accessToken, idPayment, idRefund)).rejects.toThrow('Request failed');
  });
});
