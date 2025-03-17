import { getAllQuizzes, saveAllQuizzes } from "./idb";

const SYNC_INTERVAL = 3600000; // 1 hour
const API_ENDPOINT = "/api/all-questions";

export class DataSync {
  constructor() {
    this.lastSync = 0;
    this.isSyncing = false;
    this.hasInitialData = false;
  }

  async initialize() {
    try {
      const existingData = await getAllQuizzes();

      if (!existingData?.length) {
        await this.loadFromCache();
        const postCacheData = await getAllQuizzes();
        this.hasInitialData = postCacheData?.length > 0;
      } else {
        this.hasInitialData = true;
      }

      if (navigator.onLine) {
        !this.hasInitialData
          ? await this.fullSync()
          : await this.backgroundSync();
      }
    } catch (error) {
      console.error("DataSync failed:", error);
      if (!this.hasInitialData) await this.loadFromCache();
    }
  }

  async cacheQuizPages() {
    try {
      const quizzes = await getAllQuizzes();
      const cache = await caches.open("quiz-pages");
      await cache.addAll([
        "/quiz",
        ...quizzes.map((q) => `/quiz?rule=${q.ruleNumber}`),
      ]);
    } catch (error) {
      console.error("Quiz page caching failed:", error);
    }
  }
  async fullSync() {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const allQuizzes = await response.json();
      await saveAllQuizzes(allQuizzes);

      // Update cached pages
      const cache = await caches.open("quiz-pages");
      const urls = allQuizzes.map((q) => `/quiz?rule=${q.ruleNumber}`);
      await cache.addAll([...urls, "/quiz"]);

      this.lastSync = Date.now();
      this.hasInitialData = true;
    } catch (error) {
      console.error("Full sync failed:", error);
      if (!navigator.onLine) await this.loadFromCache();
    } finally {
      this.isSyncing = false;
    }
  }

  async backgroundSync() {
    if (this.isSyncing || Date.now() - this.lastSync < SYNC_INTERVAL) return;

    try {
      const response = await fetch(API_ENDPOINT, {
        headers: {
          "Cache-Control": "no-cache", // Bypass browser cache
          "X-Data-Sync": "background", // Identify sync requests
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const freshData = await response.json();
      const existingData = await getAllQuizzes();

      // Efficient deep comparison
      if (JSON.stringify(freshData) !== JSON.stringify(existingData)) {
        await saveAllQuizzes(freshData);
        this.lastSync = Date.now();
        console.log("Background sync completed with changes");
      } else {
        console.log("Background sync: data is up-to-date");
        this.lastSync = Date.now(); // Update timestamp even if no changes
      }
    } catch (error) {
      console.error("Background sync failed:", error);
      if (!navigator.onLine) {
        console.log("Queueing sync for when connection resumes");
        // You could add background sync registration here
      }
    }
  }
}

export const dataSync = new DataSync();
