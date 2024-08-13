import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Modal, ScrollView, Button } from 'react-native';
import client from './shopifyInitialisation';
import ProductCard from './productCard';

const keyExtractor = item => item.id.toString();


const CollectionProductsScreen = ({ route, navigation }) => {
  const { collectionId } = route.params;
  const [allProducts, setAllProducts] = useState([]); // Holds all fetched products
  const [products, setProducts] = useState([]); // Products to display (after applying filters)
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [nextPageProducts, setNextPageProducts] = useState(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ colors: [] });
  const [filterOptions, setFilterOptions] = useState({ colors: [] });

  useEffect(() => {
    fetchProducts(); // Fetches the initial 20 products for display
  }, [collectionId]);

  const fetchProducts = async () => {
    try {
      const collection = await client.collection.fetchWithProducts(collectionId);
      const fetchedProducts = collection.products;

      // Populate color options for filtering
      const colorSet = new Set();
      fetchedProducts.forEach(product => {
        product.variants.forEach(variant => {
          variant.selectedOptions.forEach(option => {
            if (option.name.toLowerCase() === 'color') {
              colorSet.add(option.value);
            }
          });
        });
      });

      setFilterOptions({ colors: Array.from(colorSet) });
      setAllProducts(fetchedProducts); // Store fetched products in allProducts
      setNextPageProducts(fetchedProducts); // Assuming this logic determines if there's a next page
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to allProducts and update products for display
  const applyFilters = useCallback(() => {
    let filteredProducts = [...allProducts]; // Start with all products

    if (activeFilters.colors.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.variants.some(variant =>
          variant.selectedOptions.some(option =>
            option.name.toLowerCase() === 'color' && activeFilters.colors.includes(option.value)
          )
        )
      );
    }

    setProducts(filteredProducts);
  }, [allProducts, activeFilters.colors]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);


  const fetchMoreProducts = async () => {
    if (!isFetchingMore && nextPageProducts) {
      setIsFetchingMore(true);
      try {
        const nextPage = await client.fetchNextPage(nextPageProducts);
        const newProducts = nextPage.model.filter(newItem => !products.find(existingItem => existingItem.id === newItem.id));
        setProducts(prevProducts => [...prevProducts, ...newProducts]);
        setNextPageProducts(nextPage.model);
      } catch (error) {
        console.error('Error fetching next page of products:', error);
      } finally {
        setIsFetchingMore(false);
      }
    }
  };

  const applyFiltersToProductList = useCallback(() => {
    // Filter products based solely on color
    const filteredProducts = products.filter(product => {
      let meetsColorCriteria = false; // Assume false and verify in variants
  
      // Check the variants for the color
      product.variants.forEach(variant => {
        variant.selectedOptions.forEach(option => {
          if (option.name.toLowerCase() === 'color' && activeFilters.colors.includes(option.value)) {
            meetsColorCriteria = true;
          }
        });
      });
  
      // Only include products that meet the color criteria
      return meetsColorCriteria || !activeFilters.colors.length; // Include product if no color filter is selected
    });

    if (activeFilters.colors.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        return product.variants.some(variant => {
          return variant.selectedOptions.some(option => {
            return option.name.toLowerCase() === 'color' && activeFilters.colors.includes(option.value);
          });
        });
      });
    }
  
    if (filteredProducts.length === 0) {
      console.log("No products match the filter criteria.");
    } else {
      setProducts(filteredProducts); // Update the state to reflect the filtered products
    }
    setIsFilterModalVisible(false);
  }, [products, activeFilters.colors]); // Dependency array updated to only include activeFilters.colors
  
  

  const navigateToProductDetail = useCallback((productId) => {
    navigation.navigate('ProductDetail', { productId });
  }, [navigation]);

  const renderItem = useCallback(({ item }) => (
    <ProductCard product={item} onPress={() => navigateToProductDetail(item.id)} />
  ), [navigateToProductDetail]);

  const renderFooter = () => (
    isFetchingMore ? <ActivityIndicator size="large" style={{ margin: 16 }} /> : null
  );

  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  const onApplyFilter = (selectedFilters) => {
    setActiveFilters(selectedFilters);
    // Apply filters logic here, update your product listing based on the selected filters
    setIsFilterModalVisible(false);
  };
  const renderFilterOptions = () => {

    return (
      <ScrollView style={styles.optionsContainer}>
        {/* Example for colors, replicate for other filter types */}
        <Text style={styles.header}>Colors</Text>
        {filterOptions.colors.map((color, index) => (
          <TouchableOpacity key={index} onPress={() => {
            const newColors = activeFilters.colors.includes(color)
              ? activeFilters.colors.filter(c => c !== color)
              : [...activeFilters.colors, color];
            setActiveFilters(prevFilters => ({
              ...prevFilters,
              colors: newColors,
            }));
          }} style={{ 
            backgroundColor: activeFilters.colors.includes(color) ? '#007bff' : '#fff', 
            borderColor: '#000', borderWidth: 1, padding: 10, marginBottom: 5 }}>
            <Text>{color}</Text>
          </TouchableOpacity>
        ))}
        
        <Button title="Apply Filters" onPress={() => applyFiltersToProductList()} />
      </ScrollView>
    );
  };

  const selectFilter = (category, value) => {
    setActiveFilters(prevFilters => ({
      ...prevFilters,
      [category]: prevFilters[category].includes(value) ?
        prevFilters[category].filter(item => item !== value) : [...prevFilters[category], value],
    }));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleFilterModal} style={styles.filterButton}>
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>
      <FlatList
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        style={styles.flatList}
        onEndReached={fetchMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={toggleFilterModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <Button title="Close" onPress={toggleFilterModal} />
            {renderFilterOptions()}
          </View>
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
    width: "100%",
    height: "100%",
    backgroundColor: 'white',
    padding: 20,
    },
    optionsContainer: {

    }
    });

  
    
    export default CollectionProductsScreen;