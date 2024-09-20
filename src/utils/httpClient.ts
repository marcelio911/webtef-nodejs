// src/utils/httpClient.ts
import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'https://api.mercadopago.com',
  timeout: 1000,
});
  