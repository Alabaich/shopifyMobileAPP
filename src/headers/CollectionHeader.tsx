// CollectionProductsHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import BackIcon from '../icons/back.png'; // Update with the correct path to your back icon
import FilterIcon from '../icons/filter.png'; // Update with the correct path to your filter icon
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // ensure the path is correct

type CollectionProductsScreenRouteProp = RouteProp<RootStackParamList, 'CollectionProducts'>;

type CollectionProductsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CollectionProducts'>;

type Props = {
  route: CollectionProductsScreenRouteProp;
  navigation: CollectionProductsScreenNavigationProp;
  showFilterModal: () => void; // Add this line to include the new prop for toggling filter modal
};

// Ensure the Props are used here for the function component type definition
const CollectionProductsHeader: React.FC<Props> = ({ route, navigation }) => {
  const collectionName = route.params.collectionName; // should work if types are correct
  const handleFilterPress = () => {
    navigation.setParams({ showFilterModal: true });
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={BackIcon} style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.title}>{collectionName}</Text>
      <TouchableOpacity onPress={handleFilterPress}>
        <Image source={FilterIcon} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
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
    width: 25,
    height: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CollectionProductsHeader;
