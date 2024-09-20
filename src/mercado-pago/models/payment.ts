// src/models/payment.ts
import { Refund } from "./refund";

// TODO: rever os objetos se faz sentido limpeza
export interface Payment {
  amount: number;
  currency: string;
  method: string;
}

export interface RequestBody {
  amount: number;
  description: string;
  payment: InstallmentsPayment;
  additional_info: DetailAdditionalInfo;
}

export interface PaymentResult {
  additional_info: DetailAdditionalInfo;
  amount: number;
  description: string;
  device_id: string;
  id: string;
  payment: InstallmentsPayment;
  payment_mode: string;
}

export interface InstallmentsPayment {
  installments: number;
  installments_cost: string;
  type: string;
}

export interface DetailAdditionalInfo {
  external_reference: string;
  print_on_terminal: boolean;
}

export interface CancelResult {
  id: string;
}


export interface DetailAdditionalInfo {
  external_reference: string;
  print_on_terminal: boolean;
}

export interface PaymentDetail {
  id: number;
  status: string;
  status_detail: string;
  transaction_amount: number;
  date_approved: Date;
  date_created: Date;
  date_last_updated: Date;
  money_release_date: Date;
  payment_method_id: string;
  payment_type_id: string;
  issuer_id: string;
  installments: number;
  transaction_details: TransactionDetails;
  card: Card;
  statement_descriptor: string;
  notification_url: string;
  refunds: Refund[];
}

export interface TransactionDetails {
  net_received_amount: number;
  total_paid_amount: number;
  overpaid_amount: number;
  external_resource_url: string;
  installment_amount: number;
  financial_institution: string;
  payment_method_reference_id: string;
}

export interface Card {
  first_six_digits: string;
  last_four_digits: string;
  expiration_month: number;
  expiration_year: number;
  date_created: Date;
  date_last_updated: Date;
  cardholder: Cardholder;
}

export interface Cardholder {
  name: string;
  identification: Identification;
}

export interface Identification {
  type: string;
  number: string;
}


// get-details
// TODO: rever os objetos se faz sentido limpeza
export interface StatusPayment {
  additional_info: AdditionalInfo;
  amount: number;
  description: string;
  device_id: string;
  id: string;
  payment: PaymentData;
  payment_mode: string;
  state: string;
}

export interface AdditionalInfo {
  external_reference: string;
  print_on_terminal: boolean;
}

export interface PaymentData {
  id: string;
  installments: number;
  installments_cost: string;
  type: string;
}
