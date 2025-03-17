"use client";

import { useEffect } from "react";

const RegisterSW = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Handle controller updates
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });

      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("ServiceWorker registered");
            registration.addEventListener("updatefound", () => {
              console.log("New service worker found");
            });
          })
          .catch(console.error);
      });
    }
  }, []);

  return null;
};

export default RegisterSW;
