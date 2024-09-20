// src/mercado-pago/models/refund.ts
export interface Refund {
  id: number;
  payment_id: number;
  amount: number;
  source: RefundSource;
  date_created: Date;
  unique_sequence_number: any;
  refund_mode: string;
  adjustment_amount: number;
  status: string;
  reason: any;
  labels: any[];
  amount_refunded_to_payer: number;
  additional_data: any;
  partition_details: any[];
}

export interface RefundSource {
  id: string;
  name: string;
  type: string;
}

// get-refund

// TODO: rever os objetos se faz sentido limpeza
export interface RequestRefund {
  id: number;
  payment_id: number;
  amount: number;
  metadata: Metadata;
  source: RefundSource;
  date_created: Date;
  unique_sequence_number: string;
  refund_mode: string;
  adjustment_amount: number;
  status: string;
  reason: any;
  labels: any[];
  amount_refunded_to_payer: number;
  additional_data: any;
  partition_details: any[];
}

export interface Metadata {
  // Defina as propriedades do Metadata aqui
}

