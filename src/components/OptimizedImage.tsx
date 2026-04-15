/**
 * OptimizedImage Component
 *
 * A unified image component that automatically applies Shopify CDN optimizations.
 * Features:
 * - Automatic quality based on image size
 * - AVIF/WebP format selection
 * - Lazy loading by default
 * - Responsive srcSet generation
 * - LCP priority loading
 * - Blur-up placeholder effect
 *
 * @example
 * // Basic usage
 * <OptimizedImage src={productImage} alt="Product" preset="card" />
 *
 * @example
 * // LCP image (above-fold)
 * <OptimizedImage src={heroImage} alt="Hero" priority sizes="100vw" />
 *
 * @example
 * // Custom optimization
 * <OptimizedImage
 *   src={productImage}
 *   alt="Product"
 *   width={800}
 *   autoFormat
 *   blurUp
 * />
 */

import React, { useEffect, useState } from 'react';
import {
  getOptimizedImageUrl,
  generateSrcSet,
  getResponsiveSizes,
  preloadOptimizedImage,
  IMAGE_SIZES,
  type ImageSizePreset,
  type OptimizedImageOptions,
} from '../lib/imageOptimizer';

export interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'loading'> {
  /** Image source URL (Shopify CDN URL) */
  src: string | null | undefined;
  /** Image alt text (required for accessibility) */
  alt: string;
  /** Size preset from IMAGE_SIZES */
  preset?: ImageSizePreset;
  /** Target width (overrides preset if provided) */
  width?: number;
  /** Target height (overrides preset if provided) */
  height?: number;
  /** Auto-select best format (AVIF/WebP) */
  autoFormat?: boolean;
  /** Priority loading for LCP images (disables lazy loading) */
  priority?: boolean;
  /** Quality level 1-100 (auto-calculated if not provided) */
  quality?: number;
  /** Sizes attribute for responsive images */
  sizes?: string;
  /** Enable blur-up placeholder effect */
  blurUp?: boolean;
  /** Custom className (in addition to default object-cover) */
  className?: string;
  /** onLoad callback */
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  preset,
  width,
  height,
  autoFormat = false,
  priority = false,
  quality,
  sizes,
  blurUp = false,
  className = '',
  onLoad,
  loading: _loading, // Exclude from spread — loading is computed internally
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle preload for priority images
  useEffect(() => {
    if (priority && src) {
      const targetWidth = width ?? (preset ? IMAGE_SIZES[preset].width : 1200);
      preloadOptimizedImage(src, targetWidth);
    }
  }, [priority, src, width, preset]);

  // Return null for invalid src
  if (!src) {
    return null;
  }

  // Determine dimensions
  let targetWidth = width;
  let targetHeight = height;

  if (preset && !width && !height) {
    const presetSize = IMAGE_SIZES[preset];
    targetWidth = presetSize.width;
    targetHeight = presetSize.height;
  }

  // Generate optimized URL
  const optimizedSrc = getOptimizedImageUrl(src, {
    width: targetWidth,
    height: targetHeight,
    autoFormat,
    lazy: !priority,
    quality,
    priority,
  });

  // Generate srcSet for responsive images
  const srcSet = targetWidth ? generateSrcSet(src, targetWidth) : undefined;

  // Only set sizes attribute when we have a srcSet — sizes is meaningless
  // without srcSet and can cause browsers to skip loading
  const defaultSizes = srcSet
    ? (priority
      ? sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px'
      : sizes || getResponsiveSizes())
    : undefined;

  // Handle load callback
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  // Build className
  const classNames = [
    'object-cover',
    blurUp ? 'blur-up' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Use eager loading when no srcSet is generated — browsers may skip
  // lazy loading for images without srcset/srcsizes
  const hasSrcSet = !!srcSet;

  return (
    <img
      src={optimizedSrc || undefined}
      srcSet={srcSet || undefined}
      sizes={defaultSizes}
      alt={alt}
      loading={priority || !hasSrcSet ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={classNames}
      onLoad={handleLoad}
      {...props}
    />
  );
};

/**
 * Helper component for background images with optimization
 *
 * @example
 * <OptimizedBackground
 *   src={heroImage}
 *   alt="Hero background"
 *   preset="hero"
 *   autoFormat
 * />
 */
export interface OptimizedBackgroundProps {
  src: string | null | undefined;
  alt?: string;
  preset?: ImageSizePreset;
  width?: number;
  height?: number;
  autoFormat?: boolean;
  quality?: number;
  className?: string;
  children?: React.ReactNode;
}

export const OptimizedBackground: React.FC<OptimizedBackgroundProps> = ({
  src,
  alt = '',
  preset,
  width,
  height,
  autoFormat = false,
  quality,
  className = '',
  children,
}) => {
  // Determine dimensions
  let targetWidth = width;
  let targetHeight = height;

  if (preset && !width && !height) {
    const presetSize = IMAGE_SIZES[preset];
    targetWidth = presetSize.width;
    targetHeight = presetSize.height;
  }

  const optimizedSrc = getOptimizedImageUrl(src, {
    width: targetWidth,
    height: targetHeight,
    autoFormat,
    lazy: false,
    quality,
  });

  return (
    <div
      className={`relative bg-cover bg-center ${className}`}
      style={{ backgroundImage: optimizedSrc ? `url(${optimizedSrc})` : 'none' }}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
    >
      {children}
    </div>
  );
};
