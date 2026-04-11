import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import path from 'path'
import { vitePluginSitemap } from './vite-plugin-sitemap'

// @ts-ignore
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // 仅在生产环境启用图片优化
    ...(mode === 'production' ? [ViteImageOptimizer({
      // PNG 优化
      png: {
        quality: 80,
        compressionLevel: 9,
      },
      // JPEG 优化
      jpeg: {
        quality: 80,
        progressive: true,
      },
      // WebP 转换（现代浏览器）
      webp: {
        quality: 80,
        lossless: false,
      },
      // AVIF 转换（最新浏览器）
      avif: {
        quality: 70,
        compression: 'avif',
      },
      // SVG 优化
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
              },
            },
          },
        ],
      },
    })] : []),
    // Sitemap generation (production build only)
    ...(mode === 'production' ? [vitePluginSitemap()] : []),
  ],
  server: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    fs: {
      allow: ['.']
    },
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**', '**/*.test.ts*', '**/*.spec.ts*']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
}))
