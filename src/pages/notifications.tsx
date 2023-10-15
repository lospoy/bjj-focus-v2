// pages/notification.tsx

import { useEffect } from "react";
import type { NextPage } from "next";
import { Button } from "~/components/ui/button";
import { PageLayout } from "~/components/ui/layout";

async function requestNotificationPermission() {
  if ("Notification" in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Permission granted, you can now show notifications
      }
    } catch (error) {
      console.error("Error while requesting notification permission:", error);
    }
  }
}

function notificationTest() {
  const notifTitle = "title title";
  const notifBody = "notification body";
  const notifImg = "/maskable.png";
  const options = {
    title: notifTitle,
    body: notifBody,
    icon: notifImg,
  };
  new Notification(notifTitle, options);
}

function showNotification() {
  if (Notification.permission === "granted") {
    notificationTest();
  }
}

const NotificationPage: NextPage = () => {
  useEffect(() => {
    if ("Notification" in window) {
      document.addEventListener("notificationclick", (event) => {
        // Handle the click event here
        console.log("Notification clicked:", event);
      });
    }
  }, []);

  return (
    <PageLayout>
      <h1>Notifications Page</h1>
      <Button className="mb-4 flex" onClick={requestNotificationPermission}>
        Request Notification Permission
      </Button>
      <Button className="flex" onClick={() => showNotification()}>
        Show Notification
      </Button>
    </PageLayout>
  );
};

export default NotificationPage;
