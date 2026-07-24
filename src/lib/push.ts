import webpush from 'web-push';
import PushSubscription from '@/models/PushSubscription';

export async function sendPushNotificationToAll(payload: any) {
  try {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
      console.warn('VAPID keys not configured, skipping push notification');
      return;
    }

    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:admin@dcccorner.com',
      publicKey,
      privateKey
    );
    const subscriptions = await PushSubscription.find({});
    const notifications = subscriptions.map((sub: any) => {
      const pushSub = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.keys.p256dh,
          auth: sub.keys.auth,
        },
      };

      return webpush
        .sendNotification(pushSub, JSON.stringify(payload))
        .catch((error) => {
          console.error('Error sending push notification:', error);
          if (error.statusCode === 410 || error.statusCode === 404) {
            // Subscription has expired or is no longer valid, delete it
            return PushSubscription.findByIdAndDelete(sub._id);
          }
        });
    });

    await Promise.allSettled(notifications);
  } catch (error) {
    console.error('Error fetching subscriptions for push:', error);
  }
}
