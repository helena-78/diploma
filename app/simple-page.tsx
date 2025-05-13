export default function SimplePage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Pet Adoption Network</h1>
          <p className="mb-4">
            We're experiencing some technical difficulties. Please try again later or contact support if the issue
            persists.
          </p>
          <a href="/" className="text-blue-600 hover:underline">
            Try refreshing the page
          </a>
        </div>
      </div>
    )
  }
  