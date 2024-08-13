// HomeScreen.tsx
import React from 'react';
import { ScrollView, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path as necessary
import CollectionImage from '../components/collectionImage';
import CollectionSlider from '../components/CollectionsSlider';
import ProductsSlider from '../components/productsSlider';
import CartSummary from '../components/CartSummary';
import CollectionCards from '../components/CollectionGrid';


type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container} >
      {/* <CollectionSlider navigation={navigation}
        collectionsList="main_sale, plumbing" />
      <Button
        title="Go to Products"
        onPress={() => navigation.navigate('Collections')}
      />  */}
      <CollectionImage collectionName="main_sale" navigation={navigation} />
     
      <CartSummary navigation={navigation} />
      <ProductsSlider 
      collectionName="main_sale" 
      navigation={navigation}
      sectionTitle="Best Sellers:" />
      <CollectionCards
        navigation={navigation}
        collectionNames={['Toilets', 'Bathtubs', 'Faucets', 'ShowerKits']}
        sectionTitle="Plumbing Perfection for Every Home"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "auto",
    backgroundColor: "#fff",
    minHeight: "100%"
  },
});

export default HomeScreen;
