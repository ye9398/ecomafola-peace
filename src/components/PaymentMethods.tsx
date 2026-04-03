/**
 * PaymentMethods Component
 *
 * Displays available payment methods and handles payment selection.
 * Supports credit cards, PayPal, and other payment providers.
 */

import { useState, useEffect } from 'react';
import { CreditCard, Wallet, Building, Shield } from 'lucide-react';
import {
  paymentService,
  PaymentProvider,
  PaymentMethodType,
  PaymentMethod,
  CardBrand,
  detectCardBrand,
  formatCardNumber,
  maskCardNumber,
  isValidCardNumber,
  isValidCVV,
  isValidExpiry,
} from '../lib/payment';

/**
 * Payment method card props.
 */
interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: (methodId: string) => void;
  onDelete?: (methodId: string) => void;
}

/**
 * Credit card input props.
 */
interface CardInputProps {
  onValidChange: (cardData: CardData) => void;
  onError: (error: string) => void;
}

/**
 * Card data for new payment.
 */
export interface CardData {
  number: string;
  cvv: string;
  expMonth: number;
  expYear: number;
  name: string;
}

/**
 * Payment method selection props.
 */
export interface PaymentMethodsProps {
  onPaymentSelect: (method: PaymentMethod | CardData) => void;
  onPaymentComplete?: () => void;
  amount?: number;
  currency?: string;
}

/**
 * Icons for payment providers.
 */
const providerIcons: Record<PaymentProvider | string, React.ReactNode> = {
  stripe: <CreditCard size={20} />,
  paypal: <Wallet size={20} />,
  square: <Building size={20} />,
  klarna: <Shield size={20} />,
  afterpay: <Shield size={20} />,
};

/**
 * Card brand icons.
 */
const cardBrandIcons: Record<CardBrand, string> = {
  [CardBrand.VISA]: '💳',
  [CardBrand.MASTERCARD]: '💳',
  [CardBrand.AMEX]: '💳',
  [CardBrand.DISCOVER]: '💳',
  [CardBrand.JCB]: '💳',
  [CardBrand.DINERS]: '💳',
  [CardBrand.UNKNOWN]: '💳',
};

/**
 * Individual payment method card component.
 */
function PaymentMethodCard({ method, isSelected, onSelect, onDelete }: PaymentMethodCardProps) {
  const getMethodIcon = () => {
    if (method.type === 'card' && method.card) {
      return (
        <span className="text-2xl">
          {cardBrandIcons[method.card.brand] || '💳'}
        </span>
      );
    }

    return providerIcons[method.provider] || <CreditCard size={20} />;
  };

  const getMethodLabel = () => {
    if (method.type === 'card' && method.card) {
      return `${method.card.brand.toUpperCase()} •••• ${method.card.last4}`;
    }

    if (method.type === 'wallet') {
      return method.provider.toUpperCase();
    }

    if (method.type === 'bank_transfer') {
      return 'Bank Transfer';
    }

    if (method.type === 'buy_now_pay_later') {
      return method.provider.toUpperCase();
    }

    return 'Payment Method';
  };

  return (
    <div
      className={`
        flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
        ${isSelected
          ? 'border-ocean-blue bg-ocean-blue/5'
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
      onClick={() => onSelect(method.id)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          {getMethodIcon()}
        </div>
        <div>
          <p className="font-sans font-medium text-gray-800">{getMethodLabel()}</p>
          {method.card && (
            <p className="text-xs text-gray-500">
              Expires {method.card.expMonth.toString().padStart(2, '0')}/
              {method.card.expYear.toString().slice(-2)}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {method.isDefault && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            Default
          </span>
        )}
        <input
          type="radio"
          name="payment-method"
          checked={isSelected}
          onChange={() => onSelect(method.id)}
          className="w-4 h-4 text-ocean-blue"
        />
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(method.id);
            }}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete payment method"
          >
            <svg size={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Credit card input form component.
 */
function CardInputForm({ onValidChange, onError }: CardInputProps) {
  const [cardData, setCardData] = useState<CardData>({
    number: '',
    cvv: '',
    expMonth: new Date().getMonth() + 1,
    expYear: new Date().getFullYear(),
    name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: keyof CardData, value: string | number) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'number': {
        const numValue = value as string;
        if (!numValue) {
          newErrors.number = 'Card number is required';
        } else if (!isValidCardNumber(numValue)) {
          newErrors.number = 'Invalid card number';
        } else {
          delete newErrors.number;
        }
        break;
      }
      case 'cvv': {
        const cvvValue = value as string;
        const brand = detectCardBrand(cardData.number);
        if (!cvvValue) {
          newErrors.cvv = 'CVV is required';
        } else if (!isValidCVV(cvvValue, brand)) {
          newErrors.cvv = `Invalid CVV for ${brand}`;
        } else {
          delete newErrors.cvv;
        }
        break;
      }
      case 'expMonth': {
        const monthValue = value as number;
        if (!isValidExpiry(monthValue, cardData.expYear)) {
          newErrors.expiry = 'Invalid expiry date';
        } else {
          delete newErrors.expiry;
        }
        break;
      }
      case 'expYear': {
        const yearValue = value as number;
        if (!isValidExpiry(cardData.expMonth, yearValue)) {
          newErrors.expiry = 'Invalid expiry date';
        } else {
          delete newErrors.expiry;
        }
        break;
      }
      case 'name': {
        const nameValue = value as string;
        if (!nameValue.trim()) {
          newErrors.name = 'Name on card is required';
        } else {
          delete newErrors.name;
        }
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CardData, value: string | number) => {
    const newData = { ...cardData, [field]: value };
    setCardData(newData);

    const isValid = validateField(field, value);

    if (isValid && Object.keys(errors).length === 0) {
      // Validate all fields before emitting
      const allValid =
        isValidCardNumber(newData.number) &&
        isValidCVV(newData.cvv, detectCardBrand(newData.number)) &&
        isValidExpiry(newData.expMonth, newData.expYear) &&
        newData.name.trim();

      if (allValid) {
        onValidChange(newData);
      }
    } else {
      onError(Object.values(errors)[0] || 'Invalid card details');
    }
  };

  const brand = detectCardBrand(cardData.number);

  return (
    <div className="space-y-4">
      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Number
        </label>
        <div className="relative">
          <input
            id="card-number"
            type="text"
            value={formatCardNumber(cardData.number)}
            onChange={(e) => handleChange('number', e.target.value.replace(/\s/g, ''))}
            placeholder="1234 5678 9012 3456"
            aria-label="Card Number"
            className={`
              w-full px-4 py-3 pr-12 border rounded-xl font-mono
              ${errors.number ? 'border-red-500' : 'border-gray-300'}
              focus:ring-2 focus:ring-ocean-blue focus:border-transparent
            `}
            maxLength={19}
          />
          {brand !== CardBrand.UNKNOWN && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl">
              {cardBrandIcons[brand]}
            </span>
          )}
        </div>
        {errors.number && (
          <p className="mt-1 text-sm text-red-500">{errors.number}</p>
        )}
      </div>

      {/* Name on Card */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name on Card
        </label>
        <input
          id="card-name"
          type="text"
          value={cardData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="John Doe"
          aria-label="Name on Card"
          className={`
            w-full px-4 py-3 border rounded-xl
            ${errors.name ? 'border-red-500' : 'border-gray-300'}
            focus:ring-2 focus:ring-ocean-blue focus:border-transparent
          `}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <div className="flex gap-2">
            <select
              value={cardData.expMonth}
              onChange={(e) => handleChange('expMonth', parseInt(e.target.value, 10))}
              aria-label="Expiry month"
              className={`
                flex-1 px-3 py-3 border rounded-xl font-medium
                ${errors.expiry ? 'border-red-500' : 'border-gray-300'}
                focus:ring-2 focus:ring-ocean-blue focus:border-transparent
              `}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {(i + 1).toString().padStart(2, '0')}
                </option>
              ))}
            </select>
            <select
              value={cardData.expYear}
              onChange={(e) => handleChange('expYear', parseInt(e.target.value, 10))}
              aria-label="Expiry year"
              className={`
                flex-1 px-3 py-3 border rounded-xl font-medium
                ${errors.expiry ? 'border-red-500' : 'border-gray-300'}
                focus:ring-2 focus:ring-ocean-blue focus:border-transparent
              `}
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() + i;
                return (
                  <option key={year} value={year}>
                    {year.toString().slice(-2)}
                  </option>
                );
              })}
            </select>
          </div>
          {errors.expiry && (
            <p className="mt-1 text-sm text-red-500">{errors.expiry}</p>
          )}
        </div>

        {/* CVV */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CVV
          </label>
          <input
            id="card-cvv"
            type="password"
            value={cardData.cvv}
            onChange={(e) => handleChange('cvv', e.target.value.replace(/\D/g, ''))}
            placeholder={brand === CardBrand.AMEX ? '1234' : '123'}
            aria-label="CVV"
            maxLength={brand === CardBrand.AMEX ? 4 : 3}
            className={`
              w-full px-4 py-3 border rounded-xl font-mono
              ${errors.cvv ? 'border-red-500' : 'border-gray-300'}
              focus:ring-2 focus:ring-ocean-blue focus:border-transparent
            `}
          />
          {errors.cvv && (
            <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Main PaymentMethods component.
 */
export default function PaymentMethods({
  onPaymentSelect,
  onPaymentComplete,
  amount,
  currency = 'USD',
}: PaymentMethodsProps) {
  const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardData, setCardData] = useState<CardData | null>(null);

  // Load saved payment methods
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from the API
      // For now, we'll use empty array
      setSavedMethods([]);
    } catch (err) {
      console.error('Failed to load payment methods:', err);
      setError('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethodId(methodId);
    const method = savedMethods.find((m) => m.id === methodId);
    if (method) {
      onPaymentSelect(method);
      setError(null);
    }
  };

  const handleCardDataValid = (data: CardData) => {
    setCardData(data);
    setError(null);
  };

  const handleCardError = (errorMsg: string) => {
    setCardData(null);
    setError(errorMsg);
  };

  const handleDeleteMethod = async (methodId: string) => {
    try {
      const success = await paymentService.deletePaymentMethod(methodId);
      if (success) {
        setSavedMethods((prev) => prev.filter((m) => m.id !== methodId));
        if (selectedMethodId === methodId) {
          setSelectedMethodId(null);
        }
      }
    } catch (err) {
      setError('Failed to delete payment method');
    }
  };

  const handleSubmit = () => {
    if (selectedMethodId) {
      const method = savedMethods.find((m) => m.id === selectedMethodId);
      if (method) {
        onPaymentSelect(method);
        onPaymentComplete?.();
      }
    } else if (cardData) {
      onPaymentSelect(cardData);
      onPaymentComplete?.();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Amount Summary */}
      {amount && (
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount to pay</span>
            <span className="text-xl font-bold text-ocean-blue">
              {paymentService.formatPrice((amount / 100).toString(), currency)}
            </span>
          </div>
        </div>
      )}

      {/* Saved Payment Methods */}
      {savedMethods.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-serif text-lg font-semibold text-gray-800">
            Saved Payment Methods
          </h3>
          <div className="space-y-2">
            {savedMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                isSelected={selectedMethodId === method.id}
                onSelect={handleMethodSelect}
                onDelete={handleDeleteMethod}
              />
            ))}
          </div>
        </div>
      )}

      {/* Divider or "Or" text */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or pay with card</span>
        </div>
      </div>

      {/* Card Input Form */}
      <div className="space-y-4">
        <CardInputForm
          onValidChange={handleCardDataValid}
          onError={handleCardError}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!(selectedMethodId || cardData)}
        className={`
          w-full py-4 rounded-xl font-sans font-semibold text-white transition-all
          ${(selectedMethodId || cardData)
            ? 'bg-ocean-blue hover:bg-tropical-green'
            : 'bg-gray-300 cursor-not-allowed'
          }
        `}
      >
        {amount
          ? `Pay ${paymentService.formatPrice((amount / 100).toString(), currency)}`
          : 'Confirm Payment'}
      </button>

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <Shield size={16} />
        <span>Payments are secure and encrypted</span>
      </div>
    </div>
  );
}

/**
 * Formats a price for display.
 */
function formatPrice(amount: string, currency: string = 'USD'): string {
  return paymentService.formatPrice(amount, currency);
}
