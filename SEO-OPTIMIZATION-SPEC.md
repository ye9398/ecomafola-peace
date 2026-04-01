# EcoMafola Peace SEO 优化需求文档

**创建时间：** 2026-04-01  
**优化目标：** 增强产品页结构化数据和社交媒体分享卡片  
**影响范围：** 仅代码层面，不影响 UI 展示

---

## 📋 优化内容

### 1️⃣ 增强 Product Schema（产品页）

**文件位置：** `src/pages/ProductDetailPage.tsx`

**当前状态：** 已有基础 Product Schema

**优化目标：** 添加品牌、产地、材质、运费等详细信息

**代码实现：**

```typescript
// 在 ProductDetailPage.tsx 中找到现有的 schema 生成逻辑
// 替换为以下增强版本

const getProductSchema = (product: Product, reviews: Review[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": [
      product.image1,
      product.image2,
      product.image3
    ].filter(Boolean),
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "EcoMafola Peace"
    },
    "material": product.material || "Natural Materials",
    "origin": "Samoa",
    "sku": product.sku || product.handle,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": product.inStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "USD"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "d"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 7,
            "maxValue": 15,
            "unitCode": "d"
          }
        }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "5.0",
      "reviewCount": reviews.length.toString()
    }
  };
};
```

**验收标准：**
- [ ] Schema 包含 brand 字段
- [ ] Schema 包含 material 和 origin 字段
- [ ] Schema 包含 shippingDetails（包邮信息）
- [ ] Schema 包含 aggregateRating（评分）
- [ ] 使用 Google Rich Results Test 验证通过

---

### 2️⃣ 添加 BreadcrumbList Schema（面包屑导航）

**文件位置：** `src/pages/ProductDetailPage.tsx`

**当前状态：** 无面包屑 Schema

**优化目标：** 添加面包屑导航结构化数据，提升 Google 搜索结果显示

**代码实现：**

```typescript
// 在 ProductDetailPage.tsx 中添加面包屑 Schema 生成函数

const getBreadcrumbSchema = (product: Product) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": window.location.origin
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": `${window.location.origin}/products`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `${window.location.origin}/products/${product.handle}`
      }
    ]
  };
};

// 在组件中使用（在现有的 productSchema 之后添加）
<script type="application/ld+json">
  {JSON.stringify(getBreadcrumbSchema(product))}
</script>
```

**验收标准：**
- [ ] 面包屑 Schema 包含 3 级（Home > Products > 产品名）
- [ ] 每级都有正确的 URL
- [ ] 使用 Google Rich Results Test 验证通过

---

### 3️⃣ 优化 Open Graph（社交媒体分享卡片）

**文件位置：** `src/pages/ProductDetailPage.tsx` 的 `<head>` 部分

**当前状态：** 可能有基础 Open Graph 标签

**优化目标：** 添加完整的产品专用 Open Graph 和 Twitter Card 标签

**代码实现：**

```typescript
// 在 ProductDetailPage.tsx 的 Helmet 或 head 部分添加/修改以下 meta 标签

<Helmet>
  {/* 基础 Open Graph */}
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="EcoMafola Peace" />
  <meta property="og:locale" content="en_US" />
  
  {/* 产品标题和描述 */}
  <meta property="og:title" content={`${product.name} | EcoMafola Peace`} />
  <meta property="og:description" content={product.description || `Handcrafted ${product.name} from Samoa`} />
  
  {/* 产品图片（使用专用社交分享图或产品主图） */}
  <meta property="og:image" content={product.socialImage || product.image1} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={`${product.name} - Handcrafted from Samoa`} />
  
  {/* 产品 URL */}
  <meta property="og:url" content={`${window.location.origin}/products/${product.handle}`} />
  
  {/* 产品专用标签 */}
  <meta property="product:price:amount" content={product.price.toString()} />
  <meta property="product:price:currency" content="USD" />
  <meta property="product:availability" content={product.inStock ? "instock" : "outofstock"} />
  <meta property="product:brand" content="EcoMafola Peace" />
  <meta property="product:category" content="Home & Kitchen > Kitchen & Dining > Tableware" />
  <meta property="product:condition" content="new" />
  
  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ecomafola" />
  <meta name="twitter:creator" content="@ecomafola" />
  <meta name="twitter:title" content={`${product.name} | EcoMafola Peace`} />
  <meta name="twitter:description" content={product.description || `Handcrafted ${product.name} from Samoa`} />
  <meta name="twitter:image" content={product.socialImage || product.image1} />
  <meta name="twitter:image:alt" content={`${product.name} - Handcrafted from Samoa`} />
  
  {/* 可选：Twitter 产品标签 */}
  <meta name="twitter:label1" content="Price" />
  <meta name="twitter:data1" content={`$${product.price}`} />
  <meta name="twitter:label2" content="Availability" />
  <meta name="twitter:data2" content={product.inStock ? "In Stock" : "Out of Stock"} />
</Helmet>
```

**验收标准：**
- [ ] 所有 og:* 标签都存在
- [ ] 所有 product:* 标签都存在
- [ ] Twitter Card 标签完整
- [ ] 图片尺寸设置为 1200x630
- [ ] 使用 Facebook Sharing Debugger 验证通过
- [ ] 使用 Twitter Card Validator 验证通过

---

## 🧪 测试要求（TDD）

### 测试 1：验证 Product Schema

```typescript
// __tests__/seo-schema.test.tsx

import { render } from '@testing-library/react';
import ProductDetailPage from '../src/pages/ProductDetailPage';

describe('SEO Schema', () => {
  it('should include brand information in Product Schema', () => {
    const { container } = render(<ProductDetailPage product={mockProduct} />);
    const schemaScript = container.querySelector('script[type="application/ld+json"]');
    expect(schemaScript).toBeTruthy();
    
    const schema = JSON.parse(schemaScript?.textContent || '{}');
    expect(schema.brand).toBeDefined();
    expect(schema.brand.name).toBe('EcoMafola Peace');
  });

  it('should include shipping details in Product Schema', () => {
    const { container } = render(<ProductDetailPage product={mockProduct} />);
    const schemaScript = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(schemaScript?.textContent || '{}');
    
    expect(schema.offers.shippingDetails).toBeDefined();
    expect(schema.offers.shippingDetails.shippingRate.value).toBe('0');
  });

  it('should include BreadcrumbList Schema', () => {
    const { container } = render(<ProductDetailPage product={mockProduct} />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    
    let hasBreadcrumb = false;
    scripts.forEach(script => {
      const schema = JSON.parse(script.textContent || '{}');
      if (schema['@type'] === 'BreadcrumbList') {
        hasBreadcrumb = true;
        expect(schema.itemListElement).toHaveLength(3);
      }
    });
    
    expect(hasBreadcrumb).toBe(true);
  });
});
```

### 测试 2：验证 Open Graph 标签

```typescript
// __tests__/open-graph.test.tsx

import { render } from '@testing-library/react';
import ProductDetailPage from '../src/pages/ProductDetailPage';

describe('Open Graph Tags', () => {
  it('should include all required og:* tags', () => {
    const { container } = render(<ProductDetailPage product={mockProduct} />);
    
    const requiredTags = [
      'og:type',
      'og:title',
      'og:description',
      'og:image',
      'og:url'
    ];
    
    requiredTags.forEach(tag => {
      const meta = container.querySelector(`meta[property="${tag}"]`);
      expect(meta).toBeTruthy();
    });
  });

  it('should include product:* tags', () => {
    const { container } = render(<ProductDetailPage product={mockProduct} />);
    
    const productTags = [
      'product:price:amount',
      'product:price:currency',
      'product:availability',
      'product:brand'
    ];
    
    productTags.forEach(tag => {
      const meta = container.querySelector(`meta[property="${tag}"]`);
      expect(meta).toBeTruthy();
    });
  });

  it('should include Twitter Card tags', () => {
    const { container } = render(<ProductDetailPage product={mockProduct} />);
    
    const twitterTags = [
      'twitter:card',
      'twitter:title',
      'twitter:description',
      'twitter:image'
    ];
    
    twitterTags.forEach(tag => {
      const meta = container.querySelector(`meta[name="${tag}"]`);
      expect(meta).toBeTruthy();
    });
  });
});
```

---

## ✅ 验收清单

### 代码层面
- [ ] 所有测试通过
- [ ] TypeScript 编译无错误
- [ ] ESLint 无警告
- [ ] 代码格式化（Prettier）

### SEO 验证
- [ ] Google Rich Results Test 通过
- [ ] Google Search Console 无错误
- [ ] Facebook Sharing Debugger 通过
- [ ] Twitter Card Validator 通过

### UI 验证
- [ ] 对比优化前后截图，确认 UI 无变化
- [ ] 产品页正常加载
- [ ] 所有功能正常工作

---

## 📊 验证工具

### Google Rich Results Test
- URL: https://search.google.com/test/rich-results
- 预期结果：Product + BreadcrumbList 验证通过

### Facebook Sharing Debugger
- URL: https://developers.facebook.com/tools/debug/
- 预期结果：显示完整产品卡片

### Twitter Card Validator
- URL: https://cards-dev.twitter.com/validator
- 预期结果：显示 Summary Large Image 卡片

---

## 📝 注意事项

1. **不影响 UI** - 所有改动都在 `<head>` 和 JSON-LD 中
2. **动态数据** - Schema 和 meta 标签使用产品实际数据
3. **图片尺寸** - 社交分享图建议 1200x630px
4. **缓存** - 修改后需要清除 CDN 缓存
5. **部署** - 测试通过后再部署到生产环境

---

## 🔗 参考资料

- Schema.org Product: https://schema.org/Product
- Schema.org BreadcrumbList: https://schema.org/BreadcrumbList
- Open Graph Protocol: https://ogp.me/
- Twitter Cards: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards

---

**文档版本：** v1.0  
**创建者：** 多多哥哥  
**状态：** 待执行
