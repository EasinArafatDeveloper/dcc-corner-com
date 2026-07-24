"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

// Function to convert base64 to Uint8Array for VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorkerAndSubscribe();
    }
  }, []);

  const registerServiceWorkerAndSubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");

      // Check existing permission
      if (Notification.permission === "granted") {
        await subscribeUser(registration);
      } else if (Notification.permission !== "denied") {
        // Request permission
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          await subscribeUser(registration);
          toast.success("Notifications enabled!");
        }
      }
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  };

  const subscribeUser = async (registration: ServiceWorkerRegistration) => {
    try {
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.error("VAPID public key is missing");
        return;
      }

      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        // Already subscribed, maybe update it on backend
        await sendSubscriptionToBackend(existingSubscription);
        return;
      }

      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      await sendSubscriptionToBackend(subscription);
    } catch (error) {
      console.error("Failed to subscribe the user:", error);
    }
  };

  const sendSubscriptionToBackend = async (subscription: PushSubscription) => {
    try {
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });
    } catch (error) {
      console.error("Failed to send subscription to backend:", error);
    }
  };

  return null; // This component doesn't render anything
}
