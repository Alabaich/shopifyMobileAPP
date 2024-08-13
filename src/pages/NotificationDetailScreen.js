import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import defaultImage from '../images/defaultImage.png';  // Import your default image

const NotificationDetailScreen = ({ route }) => {
  const { notification } = route.params;

  return (
    <View style={styles.container}>
      {notification.imageUrl ? (
        <Image source={{ uri: notification.imageUrl }} style={styles.notificationImage} />
      ) : (
        <Image source={defaultImage} style={styles.notificationImage} />
      )}
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.body}>{notification.body}</Text>
      <Text style={styles.data}>{JSON.stringify(notification.data, null, 2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  notificationImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    marginBottom: 10,
  },
  data: {
    fontSize: 14,
    color: '#555',
  },
});

export default NotificationDetailScreen;
