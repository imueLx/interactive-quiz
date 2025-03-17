"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Offline Mode</h1>
        <p className="text-gray-600 mb-4">
          You're currently offline. Please check your internet connection.
        </p>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          onClick={() => window.location.reload()}
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}
