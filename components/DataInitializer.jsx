"use client";

import { useEffect } from "react";
import { saveAllQuizzes, getAllQuizzes } from "../lib/idb";

const DataInitializer = () => {
  useEffect(() => {
    const initializeData = async () => {
      try {
        const cachedData = await getAllQuizzes();

        if (cachedData.length === 0) {
          if (navigator.onLine) {
            const response = await fetch("/api/all-questions");
            const quizzes = await response.json();
            await saveAllQuizzes(quizzes);
          } else {
            // Check service worker cache
            const cache = await caches.open("api-cache");
            const response = await cache.match("/api/all-questions");

            if (response) {
              const quizzes = await response.json();
              await saveAllQuizzes(quizzes);
              console.log("Loaded quizzes from service worker cache");
            } else {
              console.warn("No cached data available offline");
            }
          }
        }
      } catch (error) {
        console.error("Data init error:", error);
        if (!navigator.onLine) {
          console.log("Running in offline mode");
        }
      }
    };

    initializeData();
  }, []);

  return null;
};

export default DataInitializer;
