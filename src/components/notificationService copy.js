import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

export const setupNotifications = () => {
  PushNotification.channelExists("default-channel", function(exists) {
    if (!exists) {
      PushNotification.createChannel(
        {
          channelId: "default-channel",
          channelName: "Default Channel",
          channelDescription: "A default channel for basic notifications",
          soundName: "default",
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`CreateChannel returned '${created}'`)
      );
    }
  });
};

export const setupBackgroundHandler = (addNotification) => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    const notification = {
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      data: remoteMessage.data,
      imageUrl: remoteMessage.notification?.android?.imageUrl || remoteMessage.notification?.image || '', // Ensure the image URL is correctly parsed
      opened: false // Add opened status
    };
    addNotification(notification);

    // Display the notification
    PushNotification.localNotification({
      channelId: "default-channel",
      largeIconUrl: notification.imageUrl, // Correct usage for largeIconUrl
      smallIcon: "ic_notification", // Ensure you have a small icon in your project named ic_notification
      title: notification.title,
      message: notification.body,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      bigPictureUrl: notification.imageUrl, // Display the image in the notification
    });
  });
};

export const setupForegroundHandler = (addNotification) => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('Message received in foreground!', remoteMessage);
    const notification = {
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      data: remoteMessage.data,
      imageUrl: remoteMessage.notification?.android?.imageUrl || remoteMessage.notification?.image || '', // Ensure the image URL is correctly parsed
      opened: false // Add opened status
    };
    addNotification(notification);

    PushNotification.localNotification({
      channelId: "default-channel",
      largeIconUrl: notification.imageUrl, // Correct usage for largeIconUrl
      smallIcon: "ic_notification", // Ensure you have a small icon in your project named ic_notification
      title: remoteMessage.notification?.title,
      message: remoteMessage.notification?.body,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      bigPictureUrl: notification.imageUrl, // Display the image in the notification
    });
  });

  return unsubscribe;
};

export const getTokenAndSendToServer = async (user) => {
  const token = await messaging().getToken();
  if (user && token) {
    sendTokenToServer(token, user);
  }
};

const sendTokenToServer = async (token, user) => {
  try {
    const { userId, email, firstName, lastName } = user;
    const response = await fetch('https://a6a6-72-138-175-130.ngrok-free.app/api/deviceToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, userId, email, firstName, lastName }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.status + ' ' + response.statusText);
    }

    const data = await response.json();
    console.log('Token sent to server:', data);
  } catch (error) {
    console.error('Error sending token:', error.message);
  }
};