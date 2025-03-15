"use client";

import React from "react";

const error = () => {
  const handleRetry = () => {
    // Logic to retry the action
    window.location.reload();
  };

  return (
    <div>
      <h1>Something went wrong</h1>
      <p>
        We encountered an error while processing your request. Please try again.
      </p>
      <button onClick={handleRetry}>Retry</button>
    </div>
  );
};

export default error;
