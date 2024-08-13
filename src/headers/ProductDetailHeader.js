// ProductDetailHeader.js
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Import your icons
import BackIcon from '../icons/back.png'; // Replace with your icon path
import HeartIcon from '../icons/heart.png'; // Replace with your icon path
import ShareIcon from '../icons/share.png'; // Replace with your icon path

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

        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => { /* handle favorite */ }} style={styles.iconContainer} >
            <Image source={HeartIcon} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* handle share */ }} style={styles.iconContainer} >
            <Image source={ShareIcon} style={styles.icon} />
          </TouchableOpacity>
        </View>
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
    tintColor: 'black', // if your icons are not white
  },
  rightIcons: {
    flexDirection: 'row',
    width: "auto",
    justifyContent: 'space-between',
    gap: 10
},
// ... other styles you might need
});

export default ProductDetailHeader;
