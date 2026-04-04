import { shopifyClient } from './shopify';

// Cart API 自定义错误类
export class CartAPIError extends Error {
  constructor(
    message: string,
    public readonly originalErrors: unknown
  ) {
    super(message);
    this.name = 'CartAPIError';
  }
}

// Cart 相关类型定义
export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
}

export interface CartLineUpdateInput {
  id: string;
  quantity: number;
}

export interface CartMerchandise {
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
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: CartMerchandise;
}

export interface CartCost {
  totalAmount: {
    amount: string;
    currencyCode: string;
  };
  subtotalAmount?: {
    amount: string;
    currencyCode: string;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
  cost: CartCost;
}

interface CartCreateResponse {
  cartCreate: {
    cart: Cart;
  };
}

interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: Cart;
  };
}

interface CartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: Cart;
  };
}

interface CartLinesRemoveResponse {
  cartLinesRemove: {
    cart: Cart;
  };
}

interface CartGetResponse {
  cart: Cart | null;
}

// 创建购物车
export const createCart = async (lines: CartLineInput[] = []): Promise<Cart | null> => {
  const { data, errors } = await shopifyClient.request<CartCreateResponse>(`
    mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first:1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `, {
    variables: { lines }
  });

  if (errors) {
    console.error('创建购物车失败:', errors);
    throw new CartAPIError('Failed to create cart', errors);
  }

  return data.cartCreate.cart;
};

// 添加商品到购物车
export const addToCart = async (
  cartId: string,
  variantId: string,
  quantity: number = 1
): Promise<Cart | null> => {
  const { data, errors } = await shopifyClient.request<CartLinesAddResponse>(`
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first:1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `, {
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }]
    }
  });

  if (errors) {
    console.error('添加购物车失败:', errors);
    throw new CartAPIError('Failed to add item to cart', errors);
  }

  return data.cartLinesAdd.cart;
};

// 更新购物车商品数量
export const updateCartLines = async (
  cartId: string,
  lines: CartLineUpdateInput[]
): Promise<Cart | null> => {
  const { data, errors } = await shopifyClient.request<CartLinesUpdateResponse>(`
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `, {
    variables: { cartId, lines }
  });

  if (errors) {
    console.error('更新购物车失败:', errors);
    throw new CartAPIError('Failed to update cart lines', errors);
  }

  return data.cartLinesUpdate.cart;
};

// 移除商品
export const removeFromCart = async (
  cartId: string,
  lineId: string
): Promise<Cart | null> => {
  const { data, errors } = await shopifyClient.request<CartLinesRemoveResponse>(`
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first:1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `, {
    variables: { cartId, lineIds: [lineId] }
  });

  if (errors) {
    console.error('从购物车移除失败:', errors);
    throw new CartAPIError('Failed to remove item from cart', errors);
  }

  return data.cartLinesRemove.cart;
};

// 获取购物车
export const getCart = async (cartId: string): Promise<Cart | null> => {
  const { data, errors } = await shopifyClient.request<CartGetResponse>(`
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    images(first:1) {
                      edges {
                        node {
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `, {
    variables: { cartId }
  });

  if (errors) {
    console.error('获取购物车失败:', errors);
    return null;
  }

  return data?.cart || null;
};
