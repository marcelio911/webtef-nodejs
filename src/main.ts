// src/main.ts
import dotenv from 'dotenv';
import logger from './utils/logger';

// Carregar variáveis de ambiente
dotenv.config();
logger.info('Iniciando aplicação...');

// src/main.ts
export * from './mercado-pago/services/authService';
export * from './mercado-pago/services/paymentService';
export * from './mercado-pago/services/refundService';
export * from './mercado-pago/services/deviceService';

export * from './mercado-pago/models/payment';
export * from './mercado-pago/models/refund';
export * from './mercado-pago/models/device';
