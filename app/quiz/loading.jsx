export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-6">
      {/* Topic Skeleton */}
      <div className="mb-6 w-48 h-6 bg-gray-300 rounded animate-pulse"></div>

      {/* Card Skeleton */}
      <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-xl text-gray-900 relative">
        {/* Progress Bar Skeleton */}
        <div className="w-full bg-gray-200 h-4 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-gray-300 animate-pulse"></div>
        </div>

        {/* Question Number Skeleton */}
        <div className="w-40 h-6 bg-gray-300 rounded mb-4 animate-pulse mx-auto"></div>

        {/* Question Text Skeleton */}
        <div className="w-full h-12 bg-gray-300 rounded mb-6 animate-pulse"></div>

        {/* Options Skeleton */}
        <div className="grid gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="w-full h-12 bg-gray-300 rounded animate-pulse"
            ></div>
          ))}
        </div>

        {/* Buttons Skeleton */}
        <div className="flex justify-between mt-6">
          <div className="w-24 h-10 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-24 h-10 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
