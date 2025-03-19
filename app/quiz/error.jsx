"use client";

import React from "react";
import { AiOutlineReload } from "react-icons/ai";
import { MdErrorOutline } from "react-icons/md";
import { useRouter } from "next/router";

const error = () => {
  const router = useRouter();

  const handleHome = () => {
    // Navigate to the home page
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-700">
      <MdErrorOutline className="text-red-500 text-6xl mb-4" />
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-gray-700 mb-4 dark:text-white">
        We encountered an error while processing your request. Please try again.
      </p>
      <button
        onClick={handleHome}
        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <AiOutlineReload className="mr-2" />
        Home
      </button>
    </div>
  );
};

export default error;
