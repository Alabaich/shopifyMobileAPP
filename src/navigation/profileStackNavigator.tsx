import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../pages/ProfileScreen';
import MyOrdersScreen from '../pages/MyOrdersScreen';
import EditProfileScreen from '../pages/EditProfileScreen';
import WishlistScreen from '../pages/WishlistScreen';
import HelpAndSupport from '../pages/HelpAndSupport';
import LegalAndPolicies from '../pages/LegalAndPolicies';
import { NotificationsScreen } from '../pages/NotificationsScreen';
import NotificationDetailScreen from '../pages/NotificationDetailScreen';

// Import additional screens as needed

const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="My Orders" component={MyOrdersScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} options={{ headerTitle: 'Notification Detail' }} />
      <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} />
      <Stack.Screen name="LegalAndPolicies" component={LegalAndPolicies} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
