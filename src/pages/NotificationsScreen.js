import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNotifications } from '../NotificationsContext';
import defaultImage from '../images/defaultImage.png';  // Import your default image

export const NotificationsScreen = () => {
  const { notifications, markAsOpened } = useNotifications();
  const navigation = useNavigation();

  useEffect(() => {

  }, [notifications]);

  const handlePress = (notification) => {
    const index = notifications.findIndex(n => n === notification);

    markAsOpened(index);
    navigation.navigate('NotificationDetail', { notification });
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <View style={styles.notificationItem}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.notificationImage}
            onError={() => console.log(`Failed to load image: ${item.imageUrl}`)}
          />
        ) : (
          <Image source={defaultImage} style={styles.notificationImage} />
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.notificationTitle, { fontWeight: item.opened ? 'normal' : 'bold' }]}>{item.title}</Text>
          <Text style={styles.notificationBody}>{item.body}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Reverse notifications to show the latest first
  const reversedNotifications = [...notifications].reverse();

  const notificationsWithSections = [
    { type: 'header', title: 'Recent' },
    ...reversedNotifications.filter(notification => !notification.opened).map(notification => ({ type: 'item', notification })),
    { type: 'header', title: 'Previous' },
    ...reversedNotifications.filter(notification => notification.opened).map(notification => ({ type: 'item', notification })),
  ];

  const renderSectionItem = ({ item }) => {
    if (item.type === 'header') {
      return <Text style={styles.sectionHeader}>{item.title}</Text>;
    } else if (item.type === 'item') {
      return renderNotificationItem({ item: item.notification });
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notificationsWithSections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderSectionItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f8f8f8',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  notificationImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationTitle: {
    fontSize: 16,
  },
  notificationBody: {
    fontSize: 14,
    color: '#555',
  },
});
