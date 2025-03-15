"use client";

import { useEffect } from "react";

const RegisterSW = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope
            );
          })
          .catch((error) => {
            console.log("ServiceWorker registration failed: ", error);
          });
      });
    }
  }, []);

  return null;
};

export default RegisterSW;
