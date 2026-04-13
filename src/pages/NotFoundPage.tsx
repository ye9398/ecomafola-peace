import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-16 text-center">
      <h1 className="text-6xl font-bold text-corals mb-4">404</h1>
      <h2 className="text-2xl font-medium text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        The page you're looking for doesn't exist. It may have been moved, renamed, or
        never existed in the first place.
      </p>
      <Link
        to="/"
        className="inline-block bg-coral hover:bg-coral-dark text-white font-medium px-8 py-3 rounded-lg transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default NotFoundPage
