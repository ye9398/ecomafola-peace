import { shopifyClient } from './shopify';

// 创建购物车（加错误处理版本）
export const createCart = async () => {
  const { data, errors } = await shopifyClient.request(`
    mutation {
      cartCreate {
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
  `);
  
  if (errors) {
    console.error('创建购物车失败:', errors);
    return null;
  }
  
  return data.cartCreate.cart;
};

// 添加商品（加错误处理版本）
export const addToCart = async (cartId, variantId, quantity = 1) => {
  const { data, errors } = await shopifyClient.request(`
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
    return null;
  }
  
  return data.cartLinesAdd.cart;
};

// 移除商品（加错误处理版本）
export const removeFromCart = async (cartId, lineId) => {
  const { data, errors } = await shopifyClient.request(`
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
    return null;
  }
  
  return data.cartLinesRemove.cart;
};
