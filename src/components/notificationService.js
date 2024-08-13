import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import { Notifications } from 'react-native-notifications';

// Ensure you have the correct icons in your project
const createDefaultChannel = () => {
  if (Platform.OS === 'android') {
    Notifications.postLocalNotification({
      body: 'Setting up default notification channel',
      title: 'Setup',
      silent: true,
    });
  }
};

export const setupNotifications = () => {
  createDefaultChannel();
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
    Notifications.postLocalNotification({
      title: notification.title,
      body: notification.body,
      data: notification.data,
      sound: 'default',
      silent: false,
      fireDate: new Date().toISOString(),
      priority: 'high',
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

    Notifications.postLocalNotification({
      title: notification.title,
      body: notification.body,
      data: notification.data,
      sound: 'default',
      silent: false,
      fireDate: new Date().toISOString(),
      priority: 'high',
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
