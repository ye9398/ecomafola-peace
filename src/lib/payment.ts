/**
 * Payment Utilities
 *
 * Provides payment processing utilities including:
 * - Payment method configuration
 * - Payment intent creation
 * - Payment status tracking
 * - Refund processing
 */

import { api } from '../services/api';

/**
 * Supported payment providers.
 */
export type PaymentProvider = 'stripe' | 'paypal' | 'square' | 'klarna' | 'afterpay';

/**
 * Payment method types.
 */
export type PaymentMethodType = 'card' | 'bank_transfer' | 'wallet' | 'buy_now_pay_later';

/**
 * Payment status enum.
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  CANCELLED = 'cancelled',
}

/**
 * Card brand enum.
 */
export enum CardBrand {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  AMEX = 'amex',
  DISCOVER = 'discover',
  JCB = 'jcb',
  DINERS = 'diners',
  UNKNOWN = 'unknown',
}

/**
 * Card information (masked for security).
 */
export interface CardInfo {
  brand: CardBrand;
  last4: string;
  expMonth: number;
  expYear: number;
  fingerprint: string;
}

/**
 * Payment method details.
 */
export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  provider: PaymentProvider;
  card?: CardInfo;
  isDefault: boolean;
  createdAt: string;
}

/**
 * Payment intent configuration.
 */
export interface PaymentIntentConfig {
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
  customerId?: string;
  autoConfirm?: boolean;
}

/**
 * Payment intent result.
 */
export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  expiresAt?: string;
}

/**
 * Payment confirmation result.
 */
export interface PaymentResult {
  success: boolean;
  paymentIntent?: PaymentIntent;
  error?: string;
  transactionId?: string;
}

/**
 * Refund configuration.
 */
export interface RefundConfig {
  paymentIntentId: string;
  amount?: number; // Partial refund amount, full refund if not specified
  reason?: string;
  metadata?: Record<string, string>;
}

/**
 * Refund result.
 */
export interface RefundResult {
  success: boolean;
  refundId?: string;
  amount?: number;
  status: string;
  error?: string;
}

/**
 * Payment method configuration from backend.
 */
export interface PaymentMethodConfig {
  provider: PaymentProvider;
  enabled: boolean;
  supportedMethods: PaymentMethodType[];
  supportedCards?: CardBrand[];
  config: Record<string, any>;
}

/**
 * Payment terms for a provider.
 */
export interface PaymentTerms {
  provider: PaymentProvider;
  processingFeePercent: number;
  processingFeeFixed: number;
  payoutDelayDays: number;
  refundPolicyDays: number;
  chargebackFee: number;
}

/**
 * Cache configuration.
 */
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for payment config
const CACHE_PREFIX = 'payment:';

interface CachedData<T> {
  data: T;
  timestamp: number;
}

/**
 * Reads data from localStorage cache.
 */
function readFromCache<T>(cacheKey: string): T | null {
  if (typeof window === 'undefined') return null;

  const cached = localStorage.getItem(cacheKey);
  if (!cached) return null;

  try {
    const { data, timestamp }: CachedData<T> = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    if (isExpired) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Writes data to localStorage cache.
 */
function writeToCache<T>(cacheKey: string, data: T): void {
  if (typeof window === 'undefined') return;

  try {
    const cached: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cached));
  } catch {
    // Ignore cache write errors
  }
}

/**
 * Clears payment cache.
 */
export function clearPaymentCache(): void {
  if (typeof window === 'undefined') return;

  Object.keys(localStorage)
    .filter((key) => key.startsWith(CACHE_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
}

/**
 * Detects card brand from card number.
 *
 * @param cardNumber - Card number (may contain spaces/dashes)
 * @returns Detected card brand
 *
 * @example
 * const brand = detectCardBrand('4242424242424242') // CardBrand.VISA
 */
export function detectCardBrand(cardNumber: string): CardBrand {
  const number = cardNumber.replace(/\D/g, '');

  const patterns: { pattern: RegExp; brand: CardBrand }[] = [
    { pattern: /^4\d{0,}$/, brand: CardBrand.VISA },
    { pattern: /^5[1-5]\d{0,}$/, brand: CardBrand.MASTERCARD },
    { pattern: /^2[2-7]\d{0,}$/, brand: CardBrand.MASTERCARD },
    { pattern: /^3[47]\d{0,}$/, brand: CardBrand.AMEX },
    { pattern: /^6(?:011|5[0-9])\d{0,}$/, brand: CardBrand.DISCOVER },
    { pattern: /^35(?:2[89]|[3-8]\d)\d{0,}$/, brand: CardBrand.JCB },
    { pattern: /^3(?:0[0-5]|[68]\d)\d{0,}$/, brand: CardBrand.DINERS },
  ];

  for (const { pattern, brand } of patterns) {
    if (pattern.test(number)) {
      return brand;
    }
  }

  return CardBrand.UNKNOWN;
}

/**
 * Formats card number for display (adds spaces).
 *
 * @param cardNumber - Raw card number
 * @returns Formatted card number
 *
 * @example
 * formatCardNumber('4242424242424242') // '4242 4242 4242 4242'
 */
export function formatCardNumber(cardNumber: string): string {
  const number = cardNumber.replace(/\D/g, '');

  // Group by 4 for most cards, 4-6-5 for Amex
  if (/^3[47]/.test(number)) {
    return number
      .slice(0, 15)
      .replace(/(\d{4})(\d{6})(\d{5}).*/, '$1 $2 $3');
  }

  return number.slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * Masks card number for secure display.
 *
 * @param cardNumber - Full card number
 * @returns Masked card number (**** **** **** 1234)
 *
 * @example
 * maskCardNumber('4242424242424242') // '**** **** **** 4242'
 */
export function maskCardNumber(cardNumber: string): string {
  const number = cardNumber.replace(/\D/g, '');
  const last4 = number.slice(-4);
  return `**** **** **** ${last4}`;
}

/**
 * Validates a credit card number using Luhn algorithm.
 *
 * @param cardNumber - Card number to validate
 * @returns true if valid
 *
 * @example
 * isValidCardNumber('4242424242424242') // true
 */
export function isValidCardNumber(cardNumber: string): boolean {
  const number = cardNumber.replace(/\D/g, '');

  if (number.length < 13 || number.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  // Loop through digits from right to left
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validates CVV/CVC code.
 *
 * @param cvv - CVV/CVC code
 * @param brand - Card brand (Amex uses 4 digits)
 * @returns true if valid
 */
export function isValidCVV(cvv: string, brand?: CardBrand): boolean {
  if (!/^\d+$/.test(cvv)) return false;

  // Amex uses 4-digit CVV, others use 3
  const requiredLength = brand === CardBrand.AMEX ? 4 : 3;
  return cvv.length === requiredLength;
}

/**
 * Validates expiry date.
 *
 * @param month - Expiry month (1-12)
 * @param year - Expiry year (2 or 4 digits)
 * @returns true if valid and not expired
 */
export function isValidExpiry(month: number, year: number): boolean {
  const monthNum = parseInt(month.toString(), 10);
  const yearNum = parseInt(year.toString(), 10);

  if (monthNum < 1 || monthNum > 12) return false;
  if (yearNum < 0 || yearNum > 9999) return false;

  // Convert 2-digit year to 4-digit
  const fullYear = yearNum < 100 ? 2000 + yearNum : yearNum;

  // Check if card is expired
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (fullYear < currentYear) return false;
  if (fullYear === currentYear && monthNum < currentMonth) return false;

  return true;
}

/**
 * Formats expiry date for display.
 *
 * @param month - Expiry month
 * @param year - Expiry year
 * @returns Formatted string (MM/YY)
 */
export function formatExpiry(month: number, year: number): string {
  const monthStr = month.toString().padStart(2, '0');
  const yearStr = year.toString().slice(-2);
  return `${monthStr}/${yearStr}`;
}

/**
 * Calculates the total amount including fees.
 *
 * @param amount - Base amount in cents
 * @param feePercent - Percentage fee
 * @param feeFixed - Fixed fee in cents
 * @returns Total amount in cents
 */
export function calculateTotalWithFees(
  amount: number,
  feePercent: number,
  feeFixed: number = 0
): number {
  const feeAmount = Math.round((amount * feePercent) / 100);
  return amount + feeAmount + feeFixed;
}

/**
 * Converts dollars to cents.
 *
 * @param dollars - Amount in dollars
 * @returns Amount in cents
 */
export function dollarsToCents(dollars: number | string): number {
  const num = typeof dollars === 'string' ? parseFloat(dollars) : dollars;
  return Math.round(num * 100);
}

/**
 * Converts cents to dollars.
 *
 * @param cents - Amount in cents
 * @returns Amount in dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Fetches available payment methods configuration.
 *
 * @param skipCache - Whether to bypass cache
 * @returns Array of payment method configs
 */
export async function getPaymentMethods(skipCache: boolean = false): Promise<PaymentMethodConfig[]> {
  const cacheKey = `${CACHE_PREFIX}methods`;

  if (!skipCache) {
    const cached = readFromCache<PaymentMethodConfig[]>(cacheKey);
    if (cached) {
      console.log('[Payment] Cache HIT: payment methods');
      return cached;
    }
  }

  try {
    const data = await api.getPaymentConfig();
    const methods = data.methods || [];

    writeToCache(cacheKey, methods);
    return methods;
  } catch (error) {
    console.error('[Payment] Failed to fetch payment methods:', error);
    return [];
  }
}

/**
 * Fetches payment terms for a specific provider.
 *
 * @param provider - Payment provider
 * @returns Payment terms or null
 */
export async function getPaymentTerms(provider: PaymentProvider): Promise<PaymentTerms | null> {
  try {
    const data = await api.getPaymentTerms(provider);
    return data.terms || null;
  } catch (error) {
    console.error('[Payment] Failed to fetch payment terms:', error);
    return null;
  }
}

/**
 * Creates a payment intent.
 *
 * @param config - Payment intent configuration
 * @returns Payment intent or null
 */
export async function createPaymentIntent(config: PaymentIntentConfig): Promise<PaymentIntent | null> {
  try {
    const data = await api.createPaymentIntent(config.amount, 'card');
    return data.paymentIntent || null;
  } catch (error) {
    console.error('[Payment] Failed to create payment intent:', error);
    return null;
  }
}

/**
 * Confirms a payment.
 *
 * @param clientSecret - Payment intent client secret
 * @param paymentMethodId - Payment method ID
 * @returns Payment result
 */
export async function confirmPayment(
  clientSecret: string,
  paymentMethodId: string
): Promise<PaymentResult> {
  try {
    // This would typically use Stripe.js or similar
    // For now, we'll use our API
    const response = await fetch('/api/payment/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret, paymentMethodId }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return {
      success: true,
      paymentIntent: data.paymentIntent,
      transactionId: data.transactionId,
    };
  } catch (error) {
    console.error('[Payment] Payment confirmation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed',
    };
  }
}

/**
 * Processes a refund.
 *
 * @param config - Refund configuration
 * @returns Refund result
 */
export async function processRefund(config: RefundConfig): Promise<RefundResult> {
  try {
    const response = await fetch('/api/payment/refund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, status: 'failed', error: error.message };
    }

    const data = await response.json();
    return {
      success: true,
      refundId: data.refundId,
      amount: data.amount,
      status: data.status,
    };
  } catch (error) {
    console.error('[Payment] Refund failed:', error);
    return {
      success: false,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Refund failed',
    };
  }
}

/**
 * Gets a saved payment method by ID.
 *
 * @param methodId - Payment method ID
 * @returns Payment method or null
 */
export async function getPaymentMethod(methodId: string): Promise<PaymentMethod | null> {
  try {
    const response = await fetch(`/api/payment/methods/${methodId}`);

    if (!response.ok) return null;

    const data = await response.json();
    return data.method || null;
  } catch (error) {
    console.error('[Payment] Failed to fetch payment method:', error);
    return null;
  }
}

/**
 * Saves a payment method for future use.
 *
 * @param paymentMethodId - Payment method ID from provider
 * @param setAsDefault - Whether to set as default method
 * @returns Saved payment method or null
 */
export async function savePaymentMethod(
  paymentMethodId: string,
  setAsDefault: boolean = false
): Promise<PaymentMethod | null> {
  try {
    const response = await fetch('/api/payment/methods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethodId, isDefault: setAsDefault }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.method || null;
  } catch (error) {
    console.error('[Payment] Failed to save payment method:', error);
    return null;
  }
}

/**
 * Deletes a saved payment method.
 *
 * @param methodId - Payment method ID to delete
 * @returns true if successful
 */
export async function deletePaymentMethod(methodId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/payment/methods/${methodId}`, {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error) {
    console.error('[Payment] Failed to delete payment method:', error);
    return false;
  }
}

/**
 * Service API for payment operations.
 */
export const paymentService = {
  // Utilities
  detectCardBrand,
  formatCardNumber,
  maskCardNumber,
  isValidCardNumber,
  isValidCVV,
  isValidExpiry,
  formatExpiry,
  calculateTotalWithFees,
  dollarsToCents,
  centsToDollars,

  // API operations
  getPaymentMethods,
  getPaymentTerms,
  createPaymentIntent,
  confirmPayment,
  processRefund,
  getPaymentMethod,
  savePaymentMethod,
  deletePaymentMethod,

  // Cache
  clearPaymentCache,

  // Enums
  PaymentStatus,
  CardBrand,
};

export default paymentService;
