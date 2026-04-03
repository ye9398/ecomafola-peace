/**
 * Skeleton Components Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  ProductSkeleton,
  ProductCardSkeleton,
  CheckoutSkeleton,
  PageSkeleton,
} from '../index';

describe('Skeleton Components', () => {
  describe('ProductSkeleton', () => {
    it('should render product skeleton structure', () => {
      render(<ProductSkeleton />);

      // Should have breadcrumb placeholders
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();

      // Should have image placeholder
      const skeletons = document.querySelectorAll('.bg-gray-200');
      expect(skeletons.length).toBeGreaterThan(5);
    });

    it('should render thumbnail skeletons', () => {
      render(<ProductSkeleton />);

      // Should have 5 thumbnail placeholders
      const thumbnailGrid = document.querySelector('.grid.grid-cols-5');
      expect(thumbnailGrid).toBeInTheDocument();
      expect(thumbnailGrid?.children.length).toBe(5);
    });
  });

  describe('ProductCardSkeleton', () => {
    it('should render card skeleton structure', () => {
      render(<ProductCardSkeleton />);

      const skeleton = document.querySelector('.bg-white.rounded-2xl');
      expect(skeleton).toBeInTheDocument();
    });

    it('should have image placeholder', () => {
      render(<ProductCardSkeleton />);

      const imagePlaceholder = document.querySelector('.aspect-square.bg-gray-200');
      expect(imagePlaceholder).toBeInTheDocument();
    });
  });

  describe('CheckoutSkeleton', () => {
    it('should render checkout skeleton structure', () => {
      render(<CheckoutSkeleton />);

      // Should have main container
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();

      // Should have two columns
      const grid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('PageSkeleton', () => {
    it('should render with default lines', () => {
      render(<PageSkeleton />);

      const lines = document.querySelectorAll('.bg-gray-200.h-4');
      expect(lines.length).toBe(3); // default
    });

    it('should render with custom line count', () => {
      render(<PageSkeleton lines={5} />);

      const lines = document.querySelectorAll('.bg-gray-200.h-4');
      expect(lines.length).toBe(5);
    });

    it('should have decreasing line widths', () => {
      render(<PageSkeleton lines={3} />);

      const lines = document.querySelectorAll('.bg-gray-200.h-4');
      // Lines should decrease by 10% each: 100%, 90%, 80%
      expect(lines[0].style.width).toBe('100%');
      expect(lines[1].style.width).toBe('90%');
      expect(lines[2].style.width).toBe('80%');
    });
  });

  describe('Animation', () => {
    it('should have pulse animation class', () => {
      render(<ProductSkeleton />);

      const animated = document.querySelector('.animate-pulse');
      expect(animated).toBeInTheDocument();
    });
  });
});
