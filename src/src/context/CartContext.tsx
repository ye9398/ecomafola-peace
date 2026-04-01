import { createContext, useContext, useState } from 'react';
import { createCart, addToCart, removeFromCart } from '../lib/cart';

interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    product: {
      title: string;
      images: {
        edges: Array<{
          node: {
            url: string;
          };
        }>;
      };
    };
  };
}

interface Cart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface CartContextType {
  cart: Cart | null;
  count: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (variantId: string) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  goToCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // 计算购物车商品数量
  const count = cart?.lines?.edges?.reduce((sum, edge) => sum + edge.node.quantity, 0) || 0;

  const handleAddToCart = async (variantId: string) => {
    let currentCart = cart;

    if (!currentCart) {
      currentCart = await createCart();
    }

    const updated = await addToCart(currentCart.id, variantId);
    setCart(updated);
    setIsOpen(true); // 自动打开购物车浮窗
  };

  const handleRemoveFromCart = async (lineId: string) => {
    if (!cart) return;
    const updated = await removeFromCart(cart.id, lineId);
    setCart(updated);
  };

  const goToCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl; // 跳转 Shopify Checkout
    }
  };

  return (
    <CartContext.Provider value={{
      cart, 
      count,
      isOpen, 
      setIsOpen,
      addToCart: handleAddToCart,
      removeFromCart: handleRemoveFromCart,
      goToCheckout
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};