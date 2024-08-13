// ProductDetailHeader.js
import React from 'react';
import { Share, View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Import your icons
import BackIcon from '../icons/back.png'; // Replace with your icon path
import HeartIcon from '../icons/heart.png'; // Replace with your icon path
import ShareIcon from '../icons/share.png'; // Replace with your icon path

const handleShare = async () => {
  try {
    const result = await Share.share({
      message: 'Check out this amazing product!',
      url: product.url, // Replace with the URL or content you want to share
      title: 'Share via',
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log('Shared with activity type of:', result.activityType);
      } else {
        console.log('Shared successfully');
      }
    } else if (result.action === Share.dismissedAction) {
      console.log('Share was dismissed');
    }
  } catch (error) {
    console.error('Error sharing:', error.message);
  }
};

const ProductDetailHeader = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0)']}
      style={styles.linearGradient}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer} >
          <Image source={BackIcon} style={styles.icon} />
        </TouchableOpacity>

        {/* <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => {}} style={styles.iconContainer} >
            <Image source={HeartIcon} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.iconContainer} >
            <Image source={ShareIcon} style={styles.icon} />
          </TouchableOpacity>
        </View> */}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 25,
    backgroundColor: "transparent"
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    padding: 5,
    borderRadius: 25,
    backgroundColor: "white"
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: 'black',
  },
  rightIcons: {
    flexDirection: 'row',
    width: "auto",
    justifyContent: 'space-between',
    gap: 10
},
});

export default ProductDetailHeader;
