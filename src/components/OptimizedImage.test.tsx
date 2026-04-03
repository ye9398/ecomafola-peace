/**
 * OptimizedImage Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OptimizedImage } from './OptimizedImage';

describe('OptimizedImage', () => {
  const mockSrc = 'https://cdn.shopify.com/s/files/1/0001/image.jpg';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render an img element with optimized src', () => {
      render(<OptimizedImage src={mockSrc} alt="Test image" />);

      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', 'Test image');
      expect(img.src).toContain('cdn.shopify.com');
      expect(img.src).toContain('width=');
    });

    it('should render null for null src', () => {
      const { container } = render(
        <OptimizedImage src={null} alt="Test" />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should use preset size', () => {
      render(<OptimizedImage src={mockSrc} alt="Test" preset="card" />);

      const img = screen.getByRole('img');
      expect(img.src).toContain('width=500');
      expect(img.src).toContain('height=500');
    });
  });

  describe('lazy loading', () => {
    it('should enable lazy loading by default', () => {
      render(<OptimizedImage src={mockSrc} alt="Test" />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('should disable lazy loading for priority images', () => {
      render(<OptimizedImage src={mockSrc} alt="Test" priority />);

      const img = screen.getByRole('img');
      expect(img).not.toHaveAttribute('loading', 'lazy');
    });
  });

  describe('responsive images', () => {
    it('should generate srcSet automatically', () => {
      render(<OptimizedImage src={mockSrc} alt="Test" width={800} height={600} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('srcSet');
      // Check that srcSet is not empty
      expect(img.getAttribute('srcSet')).toBeTruthy();
      expect(img.getAttribute('srcSet')).toMatch(/\d+w/);
    });

    it('should use custom sizes attribute', () => {
      render(
        <OptimizedImage
          src={mockSrc}
          alt="Test"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
    });
  });

  describe('format optimization', () => {
    it('should use auto format when enabled', () => {
      render(
        <OptimizedImage src={mockSrc} alt="Test" autoFormat />
      );

      const img = screen.getByRole('img');
      expect(img.src).toContain('format=');
    });
  });

  describe('quality optimization', () => {
    it('should use custom quality value', () => {
      render(
        <OptimizedImage src={mockSrc} alt="Test" width={1200} quality={90} />
      );

      const img = screen.getByRole('img');
      expect(img.src).toContain('quality=90');
    });

    it('should auto-calculate quality based on size', () => {
      render(
        <OptimizedImage src={mockSrc} alt="Test" width={1920} />
      );

      const img = screen.getByRole('img');
      // Large images should have lower quality (smaller file size)
      expect(img.src).toContain('quality=');
      const qualityMatch = img.src.match(/quality=(\d+)/);
      expect(qualityMatch).toBeTruthy();
      if (qualityMatch) {
        expect(parseInt(qualityMatch[1])).toBeLessThanOrEqual(75);
      }
    });
  });

  describe('className and styling', () => {
    it('should apply custom className', () => {
      render(
        <OptimizedImage
          src={mockSrc}
          alt="Test"
          className="custom-class another-class"
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveClass('custom-class', 'another-class');
    });

    it('should apply default styles for object-fit', () => {
      render(<OptimizedImage src={mockSrc} alt="Test" />);

      const img = screen.getByRole('img');
      expect(img).toHaveClass('object-cover');
    });
  });

  describe('onLoad callback', () => {
    it('should call onLoad when image loads', () => {
      const onLoadMock = vi.fn();
      render(
        <OptimizedImage src={mockSrc} alt="Test" onLoad={onLoadMock} />
      );

      const img = screen.getByRole('img');
      img.dispatchEvent(new Event('load'));

      expect(onLoadMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('blur-up placeholder', () => {
    it('should apply blur class when blurUp is enabled', () => {
      render(
        <OptimizedImage src={mockSrc} alt="Test" blurUp />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveClass('blur-up');
    });
  });
});
