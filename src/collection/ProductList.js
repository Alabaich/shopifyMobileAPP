// ProductList.js
import React from 'react';
import { FlatList, TouchableOpacity, Text } from 'react-native';
import ProductCardTest from '../components/productCardTest';

const ProductList = ({ products, navigation, onEndReached }) => {
  const renderItem = ({ item }) => (
    <ProductCardTest
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    />
  );

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      numColumns={2}
      onEndReached={onEndReached} 
      onEndReachedThreshold={0.5} 
      style={{ padding: 7, backgroundColor: '#fff', paddingBottom: 115 }}
    />
  );
};

export default ProductList;
