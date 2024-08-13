// HomeHeader.tsx
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Logo from '../images/logo.png'; // Update with the correct path to your logo

import MenuIcon from '../icons/humburger.png'; // Update with the correct path to your menu icon
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path as necessary

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;


type HomeHeaderProps = {
  navigation: HomeScreenNavigationProp;
};

const HomeHeader: React.FC<HomeHeaderProps> = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
        <Image source={MenuIcon} style={styles.icon} />
      </TouchableOpacity>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
      <Image source={MenuIcon} style={styles.iconInv} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff' ,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2, 
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icon: {
    width: 30,
    height: 30,
    // add more styling as needed
  },
  logo: {
    width: 100,
    height: 20,
    // add more styling as needed
  },
  iconInv: {
    opacity: 0,
    width: 25,
    height: 25,
  }
});

export default HomeHeader;
