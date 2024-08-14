import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ActivityIndicator, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/navigation/bottomTabNavigator';
import LoginScreen from './src/pages/LoginScreen';

import { CartProvider } from './src/CartContext';
import LinearGradient from 'react-native-linear-gradient';
import logoWhite from "./src/images/logoWhite.png";
import 'react-native-gesture-handler';
import { NotificationsProvider, useNotifications } from './src/NotificationsContext';
import { setupNotifications, setupBackgroundHandler, setupForegroundHandler, getTokenAndSendToServer } from './src/components/notificationService';

import messaging from '@react-native-firebase/messaging';





const AuthSwitch = () => {
  const { addNotification } = useNotifications();


  async function getFCMToken() {
    const token = await messaging().getToken();
    console.log('FCM Registration Token:', token);
  }
  
  useEffect(() => {
    getFCMToken();
  }, []);




  useEffect(() => {
    setupNotifications();
    setupBackgroundHandler(addNotification);

    const unsubscribe = setupForegroundHandler(addNotification);

    return unsubscribe;
  }, [addNotification]);

  //  if (isLoading) {
  //    return (
  //      <LinearGradient
  //        colors={['#535353', '#000']}
  //        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
  //        style={styles.loadingContainer}
  //      >
  //        <ActivityIndicator size="large" color="#FFF" />
  //        <Image source={logoWhite} style={styles.logo} /> 
  //        <Text style={styles.loadScreenText}>Everything For Your Renovation</Text>
  //      </LinearGradient>
  //    );
  //  }

  return <BottomTabNavigator /> ;
};

 const linking = {
   prefixes: ['myapp://'],
   config: {
     screens: {
       Main: 'home',
       Search: 'search',
       Notifications: 'notifications',
       Profile: 'profile',
       Cart: 'cart',
       Home: 'home',
       Categories: 'categories',
       Collections: 'collections',
       CollectionProducts: {
         path: 'collection/:id', // Assuming you want to handle deep links with parameters
         parse: {
           id: (id: string) => `${id}`, // Convert the id to a string, or perform necessary parsing
         },
       },
       ProductDetail: 'product/:id',
       FilterScreen: 'filter',
     },
   },
 };


const App = () => {
  return (
    <CartProvider>
    <NotificationsProvider>
      <SafeAreaView style={styles.container}>
      <NavigationContainer linking={linking}>
        <AuthSwitch />
      </NavigationContainer>

      </SafeAreaView>
    </NotificationsProvider>
  </CartProvider>
  );
};

 const styles = StyleSheet.create({
   container: {
     flex: 1,
   },
   loadingContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
   },
   logo: {
     width: 100,
     height: 20,
     marginBottom: 20,
     marginTop: 25
   },
   loadScreenText: {
     fontSize: 18,
     fontWeight: "300",
     color: "#fff",
   }
 });

export default App;
