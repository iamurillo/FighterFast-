"use client";
import { useEffect } from "react";

export default function SWRegistration() {
    useEffect(() => {
        if ("serviceWorker" in navigator && window.location.hostname !== "localhost") {
            window.addEventListener("load", () => {
                navigator.serviceWorker
                    .register("/sw.js")
                    .then((registration) => {
                        console.log("Service Worker registrado con éxito:", registration.scope);
                    })
                    .catch((error) => {
                        console.error("Error al registrar el Service Worker:", error);
                    });
            });
        }
    }, []);

    return null;
}
