// Add version constant at the top
const DB_NAME = "QuizDB";
const DB_VERSION = 4;

let db;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("quizzes")) {
        db.createObjectStore("quizzes", { keyPath: "ruleNumber" });
      }

      if (!db.objectStoreNames.contains("submissions")) {
        const submissionsStore = db.createObjectStore("submissions", {
          autoIncrement: true,
        });
        submissionsStore.createIndex("byTimestamp", "timestamp");
      }

      if (!db.objectStoreNames.contains("pendingSubmissions")) {
        db.createObjectStore("pendingSubmissions", {
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Get all quizzes
export const getAllQuizzes = async () => {
  const db = await openDB();
  const tx = db.transaction("quizzes", "readonly");
  const store = tx.objectStore("quizzes");
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

// Save all quizzes with validation
export const saveAllQuizzes = async (quizzes) => {
  const db = await openDB();
  const tx = db.transaction("quizzes", "readwrite");
  const store = tx.objectStore("quizzes");

  // Add validation and logging
  const validQuizzes = quizzes.filter((quiz) => {
    const isValid = !!quiz?.ruleNumber;
    if (!isValid) {
      console.error("Invalid quiz format:", quiz);
    }
    return isValid;
  });

  if (validQuizzes.length === 0) {
    console.warn("No valid quizzes to save");
    return;
  }

  await Promise.all(validQuizzes.map((quiz) => store.put(quiz)));
  await tx.done;
};

export const savePendingSubmission = async (submission) => {
  const db = await openDB();
  const tx = db.transaction("pendingSubmissions", "readwrite");
  const store = tx.objectStore("pendingSubmissions");

  const submissionWithId = {
    ...submission,
    timestamp: new Date().toISOString(),
    status: "pending",
  };

  await store.put(submissionWithId);
  await tx.done;
  return submissionWithId.id;
};

export const getPendingSubmissions = async () => {
  const db = await openDB();
  const tx = db.transaction("pendingSubmissions", "readonly");
  const store = tx.objectStore("pendingSubmissions");
  const index = store.index("byStatus");

  return new Promise((resolve, reject) => {
    const request = index.getAll("pending");
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

export const removePendingSubmission = async (id) => {
  const db = await openDB();
  const tx = db.transaction("pendingSubmissions", "readwrite");
  const store = tx.objectStore("pendingSubmissions");
  await store.delete(id);
  await tx.done;
};
