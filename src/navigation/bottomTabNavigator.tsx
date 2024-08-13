import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Badge } from 'react-native-elements'; // Import Badge component
import { useNotifications } from '../NotificationsContext'; // Import useNotifications hook

// Import the screen components
import { SearchScreen } from '../pages/SearchScreen';
import NotificationStackNavigator from './NotificationStackNavigator';
import ProfileStackNavigator from './profileStackNavigator';
import { CartScreen } from '../pages/CartScreen.js';
import HomeStackNavigator from './HomeStackNavigator';
import { Notification } from '../../types'; // Import the Notification type

// Import icons
import HomeIcon from '../icons/home.png';
import HomeActiveIcon from '../icons/homeActive.png';
import SearchIcon from '../icons/search.png';
import SearchActiveIcon from '../icons/searchActive.png';
import ProfileIcon from '../icons/profile.png';
import ProfileActiveIcon from '../icons/profileActive.png';
import NotificationIcon from '../icons/notification.png';
import NotificationActiveIcon from '../icons/notificationActive.png';
import CartIcon from '../icons/cart.png';
import CartActiveIcon from '../icons/cartActive.png';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { notifications } = useNotifications();
  const unreadNotifications = notifications.filter((notification: Notification)  => !notification.opened);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: route.name,
        headerShown: false,
        tabBarShowLabel: false,
        headerTitleAlign: 'center', // Align the header title to center
        headerStyle: {
          backgroundColor: '#fff', // Match the topBar style in your App.tsx
        },
        headerTintColor: '#2c2d2c',
        tabBarIcon: ({ focused }) => {
          let icon;
          let showBadge = false;
          switch (route.name) {
            case 'Main':
              icon = focused ? HomeActiveIcon : HomeIcon;
              break;
            case 'Search':
              icon = focused ? SearchActiveIcon : SearchIcon;
              break;
            case 'Notifications':
              icon = focused ? NotificationActiveIcon : NotificationIcon;
              showBadge = unreadNotifications.length > 0;
              break;
            case 'Cart':
              icon = focused ? CartActiveIcon : CartIcon;
              break;
          }
          return (
            <View>
              <Image source={icon} style={{ width: 25, height: 25 }} />
              {showBadge && (
                <Badge
                  status="error"
                  containerStyle={styles.badgeContainer}
                />
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Main" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Notifications" component={NotificationStackNavigator} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
});

export default BottomTabNavigator;
