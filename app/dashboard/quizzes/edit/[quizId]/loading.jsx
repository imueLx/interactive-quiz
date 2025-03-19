export default function Loading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
      {/* Add more skeleton elements */}
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
      {/* New skeleton elements */}
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
    </div>
  );
}
