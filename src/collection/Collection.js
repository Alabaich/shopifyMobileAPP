import React, { useState, useEffect, useCallback } from 'react';
import { View, Button } from 'react-native';
import { fetchProducts, fetchMoreProducts, fetchAllFilters, fetchFilteredProducts  } from './FetchUtilites'
import ProductList from './ProductList';
import FilterModal from './FilterModal';


const Collection = ({ route, navigation }) => {
    const { collectionId } = route.params;
    const [products, setProducts] = useState([]);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [cursor, setCursor] = useState(null);
    const [filters, setFilters] = useState({ filters: [], minPrice: 0, maxPrice: 0 });
    const [selectedFilters, setSelectedFilters] = useState({});
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

    useEffect(() => {
      const initializeData = async () => {
        await fetchInitialProducts();
        await fetchAllFilters(collectionId, setFilters);
      };
      initializeData();
    }, [collectionId]);
  
    // In your Collection component
useEffect(() => {
  if (route.params?.showFilterModal) {
    toggleFilterModal();
    // Reset the param to prevent the modal from showing again when navigating back to this screen
    navigation.setParams({ showFilterModal: false });
  }
}, [route.params?.showFilterModal, navigation]);

  const fetchInitialProducts = async () => {
    if (!isFetchingMore) {
      setIsFetchingMore(true);
      const result = await fetchProducts(null, collectionId);
      if (!result.errors) {
        setProducts(result.newProducts);
        setCursor(result.endCursor);
      } else {
        console.error(result.errors);
      }
      setIsFetchingMore(false);
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (!isFetchingMore && cursor) {
      setIsFetchingMore(true);
      // Pass selectedFilters as the third argument
      const result = await fetchMoreProducts(cursor, collectionId, selectedFilters);
      if (!result.errors) {
        // Append new products
        setProducts(prevProducts => [...prevProducts, ...result.newProducts]);
        // Set the new cursor for the next fetchMoreProducts call
        setCursor(result.endCursor);
      } else {
        console.error(result.errors);
      }
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, cursor, collectionId, selectedFilters]); // Include selectedFilters in the dependency array
  

  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  const handleFilterSelect = (filterId, value) => {
    setSelectedFilters(prevSelectedFilters => {
      // Initialize the filter array if it doesn't exist
      const currentFilterValues = prevSelectedFilters[filterId] || [];
      
      let newFilterValues;
  
      if (currentFilterValues.includes(value)) {
        // If the value is already selected, remove it
        newFilterValues = currentFilterValues.filter(item => item !== value);
      } else {
        // If it's not selected, add it to the array
        newFilterValues = [...currentFilterValues, value];
      }
      // If after modification, the filter array is empty, remove the filter from the object
      if (newFilterValues.length === 0) {
        const { [filterId]: _, ...newFilters } = prevSelectedFilters;
        return newFilters;
      }
  
      // Otherwise, update the filter with the new array of values
      return { ...prevSelectedFilters, [filterId]: newFilterValues };
    });
  };
  

  const applyFilters = async (inputMinPrice, inputMaxPrice) => {
    const minPrice = parseFloat(inputMinPrice);
    const maxPrice = parseFloat(inputMaxPrice);

    const updatedSelectedFilters = {
        ...selectedFilters,
        'filter.v.price': [minPrice, maxPrice]
    };

    setSelectedFilters(updatedSelectedFilters); // Update state

    const filteredResults = await fetchFilteredProducts(null, collectionId, updatedSelectedFilters);
    if (!filteredResults.errors) {
        setProducts(filteredResults.newProducts);
        setCursor(filteredResults.endCursor);
    }
    setIsFilterModalVisible(false);
};



  return (
    <View>
      {/* <Button title="Filter" onPress={toggleFilterModal} /> */}
      <ProductList 
        products={products} 
        navigation={navigation} 
        onEndReached={handleLoadMore}
      />
<FilterModal
  isVisible={isFilterModalVisible}
  onClose={toggleFilterModal}
  filters={filters.filters} // Only if filters is an object containing an array named filters
  selectedFilters={selectedFilters}
  onFilterSelect={handleFilterSelect}
  onApply={applyFilters}
  minPrice={filters.minPrice} // Pass minPrice as prop
  maxPrice={filters.maxPrice} // Pass maxPrice as prop
/>

    </View>
  );
};

export default Collection;
