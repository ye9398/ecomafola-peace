# 商品详情区块图片配置

## 图片目录结构

```
public/product-images/
├── coconutbowl-story.jpg          # 手工椰子碗 - 产品故事
├── coconutbowl-environmental.jpg  # 手工椰子碗 - 环保价值
├── coconutbowl-partnership.jpg    # 手工椰子碗 - 合作模式
├── coconutbowl-features.jpg       # 手工椰子碗 - 产品特点
├── coconutbowl-specifications.jpg # 手工椰子碗 - 规格说明
├── coconutbowl-guarantee.jpg      # 手工椰子碗 - 质量保证
├── coconutbowl-shipping.jpg       # 手工椰子碗 - 配送说明
├── coconutbowl-faqs.jpg           # 手工椰子碗 - 常见问题
├── wovenbasket-*.jpg              # 编织篮系列图片
├── naturalsoap-*.jpg              # 天然肥皂系列图片
├── woven-tote-*.jpg               # 草编托特包系列图片
├── shell-necklace-*.jpg           # 贝壳项链系列图片
├── tapa-cloth-*.jpg               # Tapa 布艺系列图片
└── image-config.json              # 图片配置文件
```

## 使用方法

1. 根据 `image-config.json` 中的 prompts 生成对应图片
2. 将生成的图片保存到此目录
3. 在 `src/data/productDescriptions.ts` 中引用图片路径

## 图片规格建议

- 格式：JPEG 或 PNG
- 尺寸：1200×800px (3:2 比例) 或 1600×900px (16:9 比例)
- 质量：高质量压缩，文件大小< 500KB
- 风格：自然光、真实场景、符合品牌调性

## 品牌视觉指南

- **色调**：绿色 + 蓝色系，自然原生态
- **风格**：简洁、真实、人文关怀
- **主题**：Empowerment + Partnership（赋能与合作）
- **避免**：过度修饰、虚假摆拍、慈善援助视角
