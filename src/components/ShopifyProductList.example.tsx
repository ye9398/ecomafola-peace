/**
 * Shopify 商品列表示例组件
 * 
 * 使用方法：
 * 1. 安装依赖后，将此代码复制到 Products.tsx 或新建组件
 * 2. 替换现有的 mock 商品数据
 * 3. 使用 Shopify 真实商品数据
 */

import { useEffect, useState } from 'react';
import { useShopifyCart } from '../hooks/useShopifyCart';
import { getShopifyProducts } from '../hooks/useShopifyCart';

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

export function ShopifyProductList() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, isLoading: isAddingToCart } = useShopifyCart();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getShopifyProducts(12); // 获取 12 个商品
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart(variantId: string) {
    try {
      await addToCart(variantId, 1);
      // 显示成功提示
      alert('Added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add to cart');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        <p>{error}</p>
        <button
          onClick={loadProducts}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const firstImage = product.images.edges[0]?.node;
        const firstVariant = product.variants.edges[0]?.node;
        const price = product.priceRange.minVariantPrice;

        return (
          <div
            key={product.id}
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Product Image */}
            <div className="aspect-square overflow-hidden bg-gray-100 relative">
              {firstImage ? (
                <img
                  src={firstImage.url}
                  alt={firstImage.altText || product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
              
              {/* Quick Add Button */}
              {firstVariant?.availableForSale && (
                <button
                  onClick={() => handleAddToCart(firstVariant.id)}
                  disabled={isAddingToCart}
                  className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 py-3 rounded-lg font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-green-600 hover:text-white disabled:opacity-50"
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                {product.title}
              </h3>
              
              {product.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">
                  ${price.amount} {price.currencyCode}
                </span>
                
                {!firstVariant?.availableForSale && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Variant Selector (if multiple variants) */}
              {product.variants.edges.length > 1 && (
                <div className="mt-3">
                  <select
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    onChange={(e) => {
                      // Handle variant selection
                      console.log('Selected variant:', e.target.value);
                    }}
                  >
                    {product.variants.edges.map((variant) => (
                      <option
                        key={variant.node.id}
                        value={variant.node.id}
                        disabled={!variant.node.availableForSale}
                      >
                        {variant.node.title} - ${variant.node.price.amount}
                        {!variant.node.availableForSale && ' (Out of Stock)'}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
