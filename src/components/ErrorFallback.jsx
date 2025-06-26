function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen  flex flex-col justify-center items-center bg-gray-50 text-gray-900 px-4">
      <div className="w-full py-8  max-w-lg bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center border border-gray-200">
        <svg
          className="w-20 h-20 text-red-500 mb-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <h1 className="text-3xl font-bold mb-3 text-red-600 text-center">
          Something went wrong!
        </h1>
        <p className="text-gray-600 mb-6 text-center break-words">
          {error.message}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="py-2 px-6 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default ErrorFallback;
