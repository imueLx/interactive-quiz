"use client";

export default function Error({ error, reset }) {
  return (
    <div className="p-6 text-red-600 dark:text-red-400">
      <h2>Could not load quiz questions!</h2>
      <p>{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  );
}
