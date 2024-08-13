// In ./src/pages/SearchScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import client from '../components/shopifyInitialisation';
import ProductCard from '../components/productCard';

export const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSearch = async (searchText) => {
    setLoading(true);
    setQuery(searchText);
    
    if (searchText === '') {
      setResults([]);
      setLoading(false);
      return;
    }

    try {
      const searchQuery = `title:*${searchText}* OR tag:*${searchText}* OR product_type:*${searchText}*`;
      let query = {
        query: searchQuery
      };

      const products = await client.product.fetchQuery(query);
      setResults(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setResults([]);
    }
    
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Type here to search..."
        value={query}
        onChangeText={handleSearch}
        autoCorrect={false}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}  // Display results in a grid like the ProductList
          contentContainerStyle={{ padding: 7 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  searchInput: {
    fontSize: 18,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
});

export default SearchScreen;
