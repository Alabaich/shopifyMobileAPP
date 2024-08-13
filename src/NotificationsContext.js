import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = async (notification) => {
    const updatedNotification = {
      ...notification,
      imageUrl: notification.imageUrl || notification.image || '', // Ensure imageUrl is handled correctly
      opened: false,
    };
    const updatedNotifications = [...notifications, updatedNotification];
    setNotifications(updatedNotifications);
    await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const markAsOpened = async (index) => {
    const updatedNotifications = notifications.map((notification, i) => {
      if (i === index) {
        return { ...notification, opened: true };
      }
      return notification;
    });
    setNotifications(updatedNotifications);
    await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  useEffect(() => {
    const loadNotifications = async () => {
      const storedNotifications = await AsyncStorage.getItem('notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    };

    loadNotifications();

    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      addNotification(remoteMessage.notification);
    });

    return unsubscribe;
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, markAsOpened }}>
      {children}
    </NotificationsContext.Provider>
  );
};
