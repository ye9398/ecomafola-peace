/**
 * Product Skeleton Component
 *
 * Loading skeleton for product detail page.
 * Provides visual feedback during data fetching.
 */

export function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-coral-white pt-20 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="w-16 h-4 bg-gray-200 rounded" />
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="w-20 h-4 bg-gray-200 rounded" />
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="w-32 h-4 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl bg-gray-200 overflow-hidden" />
            <div className="grid grid-cols-5 gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-gray-200" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div className="w-48 h-6 bg-gray-200 rounded-full" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-8 bg-gray-200 rounded w-32" />
            <div className="h-20 bg-gray-200 rounded" />
            <div className="flex gap-4">
              <div className="w-32 h-12 bg-gray-200 rounded" />
              <div className="w-32 h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* Tabs and Content Skeleton */}
        <div className="mt-16 space-y-8">
          <div className="flex gap-8 border-b border-gray-200">
            <div className="w-24 h-8 bg-gray-200 rounded-t" />
            <div className="w-24 h-8 bg-gray-200 rounded-t" />
            <div className="w-24 h-8 bg-gray-200 rounded-t" />
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Product Card Skeleton
 *
 * Loading skeleton for product cards in lists/grids.
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between">
          <div className="w-20 h-8 bg-gray-200 rounded" />
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Checkout Skeleton
 *
 * Loading skeleton for checkout page.
 */
export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-coral-white pt-20 animate-pulse">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary Skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32" />
            <div className="bg-white rounded-xl p-4 space-y-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Form Skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32" />
            <div className="bg-white rounded-xl p-4 space-y-4">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Page Skeleton (Generic)
 *
 * Generic loading skeleton for any page.
 */
export function PageSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="min-h-screen bg-coral-white pt-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="h-10 bg-gray-200 rounded w-64" />
        <div className="space-y-4">
          {[...Array(lines)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 rounded"
              style={{ width: `${100 - i * 10}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
