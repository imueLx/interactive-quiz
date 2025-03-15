"use client";

import { useEffect, useState } from "react";
import { FaDownload, FaShareAlt } from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import { PiPlusSquare } from "react-icons/pi";

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = window.navigator.standalone;

    if (isIosDevice && !isStandalone) {
      setIsIos(true);
    }

    // Handle "beforeinstallprompt" for supported browsers
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
      setIsVisible(false);
    });
  };

  const handleIosInstallClick = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      {/* Install button for non-iOS devices */}
      {isVisible && !isIos && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-3 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg transition-all duration-300 text-sm sm:text-lg font-semibold"
        >
          <FaDownload className="text-lg sm:text-2xl" />
          Install App
        </button>
      )}

      {/* iOS-specific Install button */}
      {isIos && (
        <button
          onClick={handleIosInstallClick}
          className="flex items-center gap-3 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-lg transition-all duration-300 text-sm sm:text-lg font-semibold"
        >
          <FaShareAlt className="text-lg sm:text-2xl" />
          Install on iOS
        </button>
      )}

      {/* Modal for iOS Installation Guide */}
      {isModalVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end"
          onClick={closeModal} // Close modal on outside click
        >
          <div
            className="bg-white rounded-t-xl p-6 w-full max-w-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              How to Install on iOS
            </h2>
            <p className="text-gray-700 text-sm mb-6">
              To install the app from Safari on iOS:
            </p>

            {/* Step 1: Share Button */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 flex items-center justify-center bg-blue-100 rounded-lg">
                <IoShareOutline className="text-3xl text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">
                  Tap the "Share" button
                </p>
                <p className="text-gray-600 text-sm">
                  Located at the bottom of your Safari browser.
                </p>
              </div>
            </div>

            {/* Step 2: Add to Home Screen */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 flex items-center justify-center bg-green-100 rounded-lg">
                <PiPlusSquare className="text-3xl text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">Add to Home Screen</p>
                <p className="text-gray-600 text-sm">
                  Swipe up and select "Add to Home Screen."
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PWAInstallPrompt;
