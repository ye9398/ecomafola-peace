/**
 * Payment Utilities Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
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
  getPaymentMethods,
  getPaymentTerms,
  createPaymentIntent,
  confirmPayment,
  processRefund,
  clearPaymentCache,
  PaymentStatus,
  CardBrand,
} from './payment';

// Mock api module
vi.mock('../services/api', () => ({
  api: {
    getPaymentConfig: vi.fn(),
    getPaymentTerms: vi.fn(),
    createPaymentIntent: vi.fn(),
  },
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

import { api } from '../services/api';

describe('payment utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('detectCardBrand', () => {
    it('should detect Visa cards', () => {
      expect(detectCardBrand('4242424242424242')).toBe(CardBrand.VISA);
      expect(detectCardBrand('4000000000000000')).toBe(CardBrand.VISA);
      expect(detectCardBrand('4111111111111111')).toBe(CardBrand.VISA);
    });

    it('should detect Mastercard', () => {
      expect(detectCardBrand('5500000000000004')).toBe(CardBrand.MASTERCARD);
      expect(detectCardBrand('5100000000000000')).toBe(CardBrand.MASTERCARD);
      expect(detectCardBrand('2200000000000000')).toBe(CardBrand.MASTERCARD);
      expect(detectCardBrand('2700000000000000')).toBe(CardBrand.MASTERCARD);
    });

    it('should detect American Express', () => {
      expect(detectCardBrand('340000000000000')).toBe(CardBrand.AMEX);
      expect(detectCardBrand('370000000000000')).toBe(CardBrand.AMEX);
      expect(detectCardBrand('340000000000009')).toBe(CardBrand.AMEX);
    });

    it('should detect Discover', () => {
      expect(detectCardBrand('6011000000000000')).toBe(CardBrand.DISCOVER);
      expect(detectCardBrand('6500000000000000')).toBe(CardBrand.DISCOVER);
    });

    it('should detect JCB', () => {
      expect(detectCardBrand('3530000000000000')).toBe(CardBrand.JCB);
      expect(detectCardBrand('3560000000000000')).toBe(CardBrand.JCB);
    });

    it('should detect Diners Club', () => {
      expect(detectCardBrand('30000000000000')).toBe(CardBrand.DINERS);
      expect(detectCardBrand('36000000000000')).toBe(CardBrand.DINERS);
      expect(detectCardBrand('38000000000000')).toBe(CardBrand.DINERS);
    });

    it('should handle formatted card numbers', () => {
      expect(detectCardBrand('4242-4242-4242-4242')).toBe(CardBrand.VISA);
      expect(detectCardBrand('4242 4242 4242 4242')).toBe(CardBrand.VISA);
    });

    it('should return UNKNOWN for unrecognized cards', () => {
      expect(detectCardBrand('1234567890123456')).toBe(CardBrand.UNKNOWN);
      expect(detectCardBrand('9999999999999999')).toBe(CardBrand.UNKNOWN);
    });

    it('should handle partial card numbers', () => {
      expect(detectCardBrand('4')).toBe(CardBrand.VISA);
      expect(detectCardBrand('51')).toBe(CardBrand.MASTERCARD);
      expect(detectCardBrand('34')).toBe(CardBrand.AMEX);
    });
  });

  describe('formatCardNumber', () => {
    it('should format standard card numbers', () => {
      expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
    });

    it('should format Amex numbers differently', () => {
      expect(formatCardNumber('378282246310005')).toBe('3782 822463 10005');
    });

    it('should handle formatted input', () => {
      expect(formatCardNumber('4242-4242-4242-4242')).toBe('4242 4242 4242 4242');
    });

    it('should handle short numbers', () => {
      expect(formatCardNumber('4242')).toBe('4242');
    });

    it('should truncate long numbers', () => {
      expect(formatCardNumber('4242424242424242000')).toBe('4242 4242 4242 4242');
    });
  });

  describe('maskCardNumber', () => {
    it('should mask card number correctly', () => {
      expect(maskCardNumber('4242424242424242')).toBe('**** **** **** 4242');
    });

    it('should handle formatted input', () => {
      expect(maskCardNumber('4242-4242-4242-4242')).toBe('**** **** **** 4242');
    });

    it('should handle short numbers', () => {
      expect(maskCardNumber('1234')).toBe('**** **** **** 1234');
    });
  });

  describe('isValidCardNumber', () => {
    it('should validate valid Visa numbers', () => {
      expect(isValidCardNumber('4242424242424242')).toBe(true);
      expect(isValidCardNumber('4111111111111111')).toBe(true);
    });

    it('should validate valid Mastercard numbers', () => {
      expect(isValidCardNumber('5500000000000004')).toBe(true);
      expect(isValidCardNumber('5105105105105100')).toBe(true);
    });

    it('should validate valid Amex numbers', () => {
      expect(isValidCardNumber('378282246310005')).toBe(true);
      expect(isValidCardNumber('371449635398431')).toBe(true);
    });

    it('should reject invalid card numbers', () => {
      expect(isValidCardNumber('1234567890123456')).toBe(false);
      expect(isValidCardNumber('4242424242424243')).toBe(false); // Wrong checksum
    });

    it('should reject numbers that are too short', () => {
      expect(isValidCardNumber('424242424242')).toBe(false);
      expect(isValidCardNumber('123456789012')).toBe(false);
    });

    it('should reject numbers that are too long', () => {
      expect(isValidCardNumber('42424242424242424242')).toBe(false);
    });

    it('should handle formatted input', () => {
      expect(isValidCardNumber('4242-4242-4242-4242')).toBe(true);
      expect(isValidCardNumber('4242 4242 4242 4242')).toBe(true);
    });
  });

  describe('isValidCVV', () => {
    it('should validate 3-digit CVV', () => {
      expect(isValidCVV('123')).toBe(true);
      expect(isValidCVV('999')).toBe(true);
    });

    it('should validate 4-digit CVV for Amex', () => {
      expect(isValidCVV('1234', CardBrand.AMEX)).toBe(true);
      expect(isValidCVV('9999', CardBrand.AMEX)).toBe(true);
    });

    it('should reject invalid CVV formats', () => {
      expect(isValidCVV('12')).toBe(false);
      expect(isValidCVV('12345')).toBe(false);
      expect(isValidCVV('abc')).toBe(false);
      expect(isValidCVV('12a')).toBe(false);
    });

    it('should require 4 digits for Amex', () => {
      expect(isValidCVV('123', CardBrand.AMEX)).toBe(false);
    });
  });

  describe('isValidExpiry', () => {
    it('should validate future dates', () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);

      expect(isValidExpiry(future.getMonth() + 1, future.getFullYear())).toBe(true);
    });

    it('should validate current month', () => {
      const now = new Date();

      expect(isValidExpiry(now.getMonth() + 1, now.getFullYear())).toBe(true);
    });

    it('should reject past dates', () => {
      const past = new Date();
      past.setFullYear(past.getFullYear() - 1);

      expect(isValidExpiry(past.getMonth() + 1, past.getFullYear())).toBe(false);
    });

    it('should reject invalid months', () => {
      expect(isValidExpiry(0, 2025)).toBe(false);
      expect(isValidExpiry(13, 2025)).toBe(false);
      expect(isValidExpiry(15, 2025)).toBe(false);
    });

    it('should handle 2-digit years', () => {
      // 2025 is in the past (current year is 2026), so Dec 2025 is expired
      // Dec 2026 and Dec 2099 should be valid
      expect(isValidExpiry(12, 26)).toBe(true);
      expect(isValidExpiry(12, 99)).toBe(true);
    });

    it('should reject month in past year', () => {
      const now = new Date();
      const pastMonth = now.getMonth(); // 0-indexed, so this is last month

      expect(isValidExpiry(pastMonth, now.getFullYear())).toBe(false);
    });
  });

  describe('formatExpiry', () => {
    it('should format expiry date correctly', () => {
      expect(formatExpiry(1, 2025)).toBe('01/25');
      expect(formatExpiry(12, 2025)).toBe('12/25');
    });

    it('should handle 2-digit years', () => {
      expect(formatExpiry(6, 25)).toBe('06/25');
    });

    it('should pad single digit months', () => {
      expect(formatExpiry(1, 2025)).toBe('01/25');
      expect(formatExpiry(9, 2025)).toBe('09/25');
    });
  });

  describe('calculateTotalWithFees', () => {
    it('should calculate total with percentage fee', () => {
      // $100 = 10000 cents, 2.9% fee
      expect(calculateTotalWithFees(10000, 2.9)).toBe(10290);
    });

    it('should calculate total with fixed fee', () => {
      // $100 + $0.30 fixed fee
      expect(calculateTotalWithFees(10000, 0, 30)).toBe(10030);
    });

    it('should calculate total with both fees', () => {
      // $100 + 2.9% + $0.30
      expect(calculateTotalWithFees(10000, 2.9, 30)).toBe(10320);
    });

    it('should round correctly', () => {
      expect(calculateTotalWithFees(10001, 2.9)).toBe(10291);
    });

    it('should handle zero fees', () => {
      expect(calculateTotalWithFees(10000, 0)).toBe(10000);
    });
  });

  describe('dollarsToCents', () => {
    it('should convert dollars to cents', () => {
      expect(dollarsToCents(10)).toBe(1000);
      expect(dollarsToCents(10.50)).toBe(1050);
      expect(dollarsToCents(0.99)).toBe(99);
    });

    it('should handle string input', () => {
      expect(dollarsToCents('10.50')).toBe(1050);
      expect(dollarsToCents('99.99')).toBe(9999);
    });

    it('should round correctly', () => {
      expect(dollarsToCents(10.001)).toBe(1000);
      expect(dollarsToCents(10.005)).toBe(1001);
      expect(dollarsToCents(10.004)).toBe(1000);
    });
  });

  describe('centsToDollars', () => {
    it('should convert cents to dollars', () => {
      expect(centsToDollars(1000)).toBe(10);
      expect(centsToDollars(1050)).toBe(10.5);
      expect(centsToDollars(99)).toBe(0.99);
    });

    it('should handle zero', () => {
      expect(centsToDollars(0)).toBe(0);
    });
  });

  describe('getPaymentMethods', () => {
    it('should fetch payment methods from API', async () => {
      const mockMethods = [
        { provider: 'stripe', enabled: true, supportedMethods: ['card'] },
        { provider: 'paypal', enabled: true, supportedMethods: ['wallet'] },
      ];

      vi.mocked(api.getPaymentConfig).mockResolvedValue({ methods: mockMethods });

      const result = await getPaymentMethods();

      expect(result).toEqual(mockMethods);
      expect(api.getPaymentConfig).toHaveBeenCalled();
    });

    it('should use cache on second request', async () => {
      const mockMethods = [{ provider: 'stripe', enabled: true, supportedMethods: ['card'] }];

      vi.mocked(api.getPaymentConfig).mockResolvedValue({ methods: mockMethods });

      await getPaymentMethods();
      const result = await getPaymentMethods();

      expect(api.getPaymentConfig).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMethods);
    });

    it('should skip cache when requested', async () => {
      const mockMethods = [{ provider: 'stripe', enabled: true, supportedMethods: ['card'] }];

      vi.mocked(api.getPaymentConfig).mockResolvedValue({ methods: mockMethods });

      await getPaymentMethods({ skipCache: true });
      await getPaymentMethods({ skipCache: true });

      expect(api.getPaymentConfig).toHaveBeenCalledTimes(2);
    });

    it('should return empty array on error', async () => {
      vi.mocked(api.getPaymentConfig).mockRejectedValue(new Error('Network error'));

      const result = await getPaymentMethods();

      expect(result).toEqual([]);
    });

    it('should handle empty methods response', async () => {
      vi.mocked(api.getPaymentConfig).mockResolvedValue({ methods: [] });

      const result = await getPaymentMethods();

      expect(result).toEqual([]);
    });
  });

  describe('getPaymentTerms', () => {
    it('should fetch payment terms for provider', async () => {
      const mockTerms = {
        provider: 'stripe',
        processingFeePercent: 2.9,
        processingFeeFixed: 30,
        payoutDelayDays: 2,
        refundPolicyDays: 30,
        chargebackFee: 1500,
      };

      vi.mocked(api.getPaymentTerms).mockResolvedValue({ terms: mockTerms });

      const result = await getPaymentTerms('stripe');

      expect(result).toEqual(mockTerms);
      expect(api.getPaymentTerms).toHaveBeenCalledWith('stripe');
    });

    it('should return null on error', async () => {
      vi.mocked(api.getPaymentTerms).mockRejectedValue(new Error('Network error'));

      const result = await getPaymentTerms('stripe');

      expect(result).toBeNull();
    });
  });

  describe('createPaymentIntent', () => {
    it('should create payment intent', async () => {
      const mockIntent = {
        id: 'pi_123',
        clientSecret: 'pi_123_secret',
        amount: 10000,
        currency: 'USD',
        status: 'requires_payment_method',
      };

      vi.mocked(api.createPaymentIntent).mockResolvedValue({ paymentIntent: mockIntent });

      const result = await createPaymentIntent({ amount: 10000, currency: 'USD' });

      expect(result).toEqual(mockIntent);
      expect(api.createPaymentIntent).toHaveBeenCalledWith(10000, 'card');
    });

    it('should return null on error', async () => {
      vi.mocked(api.createPaymentIntent).mockRejectedValue(new Error('Failed'));

      const result = await createPaymentIntent({ amount: 10000, currency: 'USD' });

      expect(result).toBeNull();
    });
  });

  describe('confirmPayment', () => {
    it('should confirm payment successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          paymentIntent: { id: 'pi_123' },
          transactionId: 'txn_456',
        }),
      });

      const result = await confirmPayment('pi_123_secret', 'pm_card_visa');

      expect(result.success).toBe(true);
      expect(result.paymentIntent?.id).toBe('pi_123');
      expect(result.transactionId).toBe('txn_456');
    });

    it('should handle payment failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Card declined' }),
      });

      const result = await confirmPayment('pi_123_secret', 'pm_card_declined');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Card declined');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await confirmPayment('pi_123_secret', 'pm_card_visa');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  describe('processRefund', () => {
    it('should process full refund successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          refundId: 're_123',
          amount: 10000,
          status: 'succeeded',
        }),
      });

      const result = await processRefund({ paymentIntentId: 'pi_123' });

      expect(result.success).toBe(true);
      expect(result.refundId).toBe('re_123');
      expect(result.status).toBe('succeeded');
    });

    it('should process partial refund', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          refundId: 're_123',
          amount: 5000,
          status: 'succeeded',
        }),
      });

      const result = await processRefund({
        paymentIntentId: 'pi_123',
        amount: 5000,
        reason: 'Customer request',
      });

      expect(result.success).toBe(true);
      expect(result.amount).toBe(5000);
    });

    it('should handle refund failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Already refunded' }),
      });

      const result = await processRefund({ paymentIntentId: 'pi_123' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Already refunded');
    });
  });

  describe('clearPaymentCache', () => {
    it('should clear payment cache entries', () => {
      localStorage.setItem('payment:methods', 'value');
      localStorage.setItem('payment:terms:stripe', 'value');
      localStorage.setItem('other-key', 'value');

      clearPaymentCache();

      expect(localStorage.getItem('payment:methods')).toBeNull();
      expect(localStorage.getItem('payment:terms:stripe')).toBeNull();
      expect(localStorage.getItem('other-key')).toBe('value');
    });

    it('should handle empty cache gracefully', () => {
      expect(() => clearPaymentCache()).not.toThrow();
    });
  });

  describe('PaymentStatus enum', () => {
    it('should have correct status values', () => {
      expect(PaymentStatus.PENDING).toBe('pending');
      expect(PaymentStatus.PROCESSING).toBe('processing');
      expect(PaymentStatus.COMPLETED).toBe('completed');
      expect(PaymentStatus.FAILED).toBe('failed');
      expect(PaymentStatus.REFUNDED).toBe('refunded');
      expect(PaymentStatus.PARTIALLY_REFUNDED).toBe('partially_refunded');
      expect(PaymentStatus.CANCELLED).toBe('cancelled');
    });
  });

  describe('CardBrand enum', () => {
    it('should have correct brand values', () => {
      expect(CardBrand.VISA).toBe('visa');
      expect(CardBrand.MASTERCARD).toBe('mastercard');
      expect(CardBrand.AMEX).toBe('amex');
      expect(CardBrand.DISCOVER).toBe('discover');
      expect(CardBrand.JCB).toBe('jcb');
      expect(CardBrand.DINERS).toBe('diners');
      expect(CardBrand.UNKNOWN).toBe('unknown');
    });
  });
});
