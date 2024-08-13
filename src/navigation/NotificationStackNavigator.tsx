// NotificationStackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NotificationsScreen } from '../pages/NotificationsScreen';
import NotificationDetailScreen from '../pages/NotificationDetailScreen';
import NotificationsHeader from '../headers/NotificationsHeader';  // Import the custom header

const NotificationStack = createStackNavigator();

const NotificationStackNavigator = () => {
  return (
    <NotificationStack.Navigator>
      <NotificationStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          header: () => <NotificationsHeader />,  // Use the custom header
        }}
      />
      <NotificationStack.Screen
        name="NotificationDetail"
        component={NotificationDetailScreen}
        options={{ headerTitle: 'Notification Detail' }}
      />
    </NotificationStack.Navigator>
  );
};

export default NotificationStackNavigator;
