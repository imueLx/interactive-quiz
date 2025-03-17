import { Serwist, NetworkFirst, StaleWhileRevalidate } from "serwist";
import { defaultCache } from "@serwist/next/worker";

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ url }) => url.pathname.startsWith("/quiz"),
      handler: new NetworkFirst({
        cacheName: "quiz-pages",
        networkTimeoutSeconds: 2,
        matchOptions: { ignoreSearch: true },
      }),
    },
    {
      matcher: ({ url }) => url.pathname.startsWith("/api"),
      handler: new NetworkFirst({
        cacheName: "api-cache",
        networkTimeoutSeconds: 3,
      }),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
  additionalPrecacheEntries: [
    { url: "/offline", revision: "1" },
    { url: "/api/all-questions", revision: "1" },
    { url: "/quiz", revision: "1" },
    { url: "/quizzes", revision: "1" },
  ],
});

// Activate Event - Pre-cache Quiz Pages
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open("quiz-pages");
        const response = await fetch("/api/all-questions");

        if (!response.ok) throw new Error("Failed to fetch quiz data");

        const quizzes = await response.json();
        const urls = quizzes.map((quiz) => `/quiz?rule=${quiz.ruleNumber}`);

        await cache.addAll([...urls, "/quiz"]);
      } catch (error) {
        console.error("Error caching quiz pages:", error);
      }
    })()
  );
});

// Fetch handler for quiz pages (Dynamically Cache Visited Pages)
self.addEventListener("fetch", (event) => {
  if (
    event.request.mode === "navigate" &&
    event.request.url.includes("/quiz")
  ) {
    event.respondWith(
      caches
        .match(event.request, { ignoreSearch: true })
        .then(async (cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          try {
            const response = await fetch(event.request);
            const cache = await caches.open("quiz-pages");
            cache.put(event.request, response.clone()); // Cache the new quiz page dynamically
            return response;
          } catch (error) {
            return caches.match("/offline"); // Show offline page if network fails
          }
        })
    );
  }
});

serwist.addEventListeners();
