import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, Text } from 'react-native';
import ProductCard from './productCard';
import { collectionIds } from './collectionIds';
import client from './shopifyInitialisation';

const { width: screenWidth } = Dimensions.get('window');

const ProductsSlider = ({ navigation, collectionName, sectionTitle }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const id = collectionIds[collectionName];
        const collection = await client.collection.fetchWithProducts(id); // This fetches all products
        setProducts(collection.products.slice(0, 5)); // Only take the first 5 products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [collectionName]);

  const renderItem = ({ item }) => (
    <ProductCard
      product={item}
      onPress={(product) => {
        navigation.navigate('ProductDetail', { productId: product.id });
      }}
      customCardStyle={styles.customCard}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      <FlatList
        horizontal
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        // Add additional FlatList props as needed
      />
      {/* You can add your arrow components here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 7,
    paddingRight: 7,
    backgroundColor: "#fff"
  },
  customCard: {
    width: 200,
    paddingBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    color: "#2c2d2c",
    paddingLeft: 7,
    // Add any additional styling you want for the section title
  },
});

export default ProductsSlider;
