import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import client from '../components/shopifyInitialisation';
import roductCard from '../components/productCard';

const keyExtractor = item => item.id.toString();

const CollectionProductsScreen = ({ route, navigation }) => {
  const { collectionId } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPageProducts, setNextPageProducts] = useState(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    colors: [],
    productTypes: [],
    vendors: [],
    priceRange: { min: 0, max: 1000 },
  });
  const [filterOptions, setFilterOptions] = useState({
    colors: [],
    productTypes: [],
    vendors: [],
    priceRange: { min: 0, max: 1000 },
  });

  useEffect(() => {
    fetchProducts();
  }, [collectionId]);

  const fetchProducts = async () => {
    try {
      const collection = await client.collection.fetchWithProducts(collectionId);
      const extractedFilterOptions = extractFilterOptions(collection.products);
      setProducts(collection.products);
      setNextPageProducts(collection.products);
      setFilterOptions(extractedFilterOptions);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractFilterOptions = (products) => {
    // Implement actual logic to extract filter options from products
    return {
      colors: [], // Populate based on product variant colors
      productTypes: [], // Populate based on product types
      vendors: [], // Populate based on product vendors
      priceRange: { min: 0, max: 1000 }, // Determine from product prices
    };
  };

  const onApplyFilter = (selectedFilters) => {
    setActiveFilters(selectedFilters);
    setIsFilterModalVisible(false);
    applyFiltersToProductList(selectedFilters);
  };

  const applyFiltersToProductList = (filters) => {
    setLoading(true);
    const filteredProducts = products.filter(product => {
      // Implement your filtering logic here, based on activeFilters
      return true;
    });
    setProducts(filteredProducts);
    setLoading(false);
  };

  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  const renderFilterOptions = () => {
    // Placeholder for filter options UI
    // Use filterOptions to render filter UI dynamically
    return (
      <View>
        {/* Example: Render filter options based on filterOptions */}
        <Text>Filter options will be displayed here.</Text>
        <Button title="Apply Filters" onPress={() => onApplyFilter(activeFilters)} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleFilterModal} style={styles.filterButton}>
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>
      <FlatList
        data={products}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => navigateToProductDetail(item.id)} />
        )}
        numColumns={2}
        style={styles.flatList}
        // Include fetchMoreProducts logic here
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={toggleFilterModal}>
        <View style={styles.filterModal}>
          {renderFilterOptions()}
          <Button title="Close" onPress={toggleFilterModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    backgroundColor: '#fff',
    padding: 7,
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignSelf: 'flex-end',
    margin: 10,
  },
  filterButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  filterModal: {
    marginTop: '50%',
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center', // Ensure content is centered
    justifyContent: 'center', // Ensure content is centered
  },
});

export default CollectionProductsScreen;

