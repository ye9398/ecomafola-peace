export default function LoadingSkeleton() {
  return (
    <div
      className="animate-pulse min-h-screen bg-white"
      role="status"
      aria-busy="true"
      aria-label="Loading content"
    >
      {/* Hero 占位 */}
      <div className="h-96 bg-gray-200" />

      {/* 内容占位 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>

      {/* Screen reader only text */}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
