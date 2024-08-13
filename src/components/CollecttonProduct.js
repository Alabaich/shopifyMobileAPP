import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Modal, Button, ScrollView } from 'react-native';
import axios from 'axios';
import ProductCardTest from './productCardTest';
// import { SHOPIFY_DOMAIN, ACCESS_TOKEN } from './shopifyConfig';


const SHOPIFY_DOMAIN = 'renozcentre.myshopify.com';
const ACCESS_TOKEN = '9e2b15437b50c2e5ea05d717f72b129b';


const CollectionProductsScreen = ({ route, navigation }) => {
  const { collectionId } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [colorOptions, setColorOptions] = useState([]);
  const [selectedColors, setSelectedColors] = useState(new Set());
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [tempSelectedColors, setTempSelectedColors] = useState(new Set());


  useEffect(() => {
    fetchProducts();
    fetchColorOptions();
  }, []);

  const fetchProducts = async (afterCursor = null, selectedColors = new Set()) => {
    if (isFetchingMore) return;
    setLoading(true);
    setIsFetchingMore(true);
  
    // Dynamically construct filters based on selected colors
    let filters = [];

    selectedColors.forEach(color => {
      filters.push({
        variantOption: {
          name: "color",
          value: color
        }
      });
    });
    
    
    console.log("Filters being passed to GraphQL:", filters);
    
    try {
      const graphqlQuery = {
        query: `
          query fetchProducts($id: ID!, $cursor: String, $filters: [ProductFiltersInput!]) {
            collection(id: $id) {
              id
              products(first: 10, after: $cursor, filters: $filters) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                edges {
                  node {
                    id
                    handle
                    availableForSale
                    variants(first: 10) {
                      edges {
                        node {
                          selectedOptions {
                            name
                            value
                          }
                        }
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          originalSrc
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { 
          id: collectionId,
          cursor: afterCursor,
          filters: filters
        },
      };
    
      const response = await axios.post(
        `https://${SHOPIFY_DOMAIN}/api/2024-04/graphql.json`,
        graphqlQuery,
        {
          headers: {
            'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data.errors) {
        console.error('GraphQL Errors:', response.data.errors);
        return;
      }
  
      const newEdges = response.data.data.collection.products.edges;
      const newProducts = newEdges.map(edge => edge.node);
  
      setProducts(prevProducts => afterCursor ? [...prevProducts, ...newProducts] : newProducts);
      setCursor(newEdges.length ? response.data.data.collection.products.pageInfo.endCursor : null);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsFetchingMore(false);
      setLoading(false);
    }
  };
  
  
  

  const fetchColorOptions = async () => {
    try {
      const graphqlQuery = {
        query: `
          {
            collection(id: ${JSON.stringify(collectionId)}) {
              products(first: 250) {
                edges {
                  node {
                    options {
                      name
                      values
                    }
                  }
                }
              }
            }
          }
        `,
      };

      const response = await axios.post(
        `https://${SHOPIFY_DOMAIN}/api/2024-04/graphql.json`,
        graphqlQuery,
        {
          headers: {
            'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
        }
      );

      const productEdges = response.data.data.collection.products.edges;
      const colors = new Set();
      productEdges.forEach(edge => {
        edge.node.options.forEach(option => {
          if (option.name.toLowerCase() === 'color') {
            option.values.forEach(value => colors.add(value));
          }
        });
      });

      setColorOptions(Array.from(colors));
    } catch (error) {
      console.error('Error fetching color options:', error);
    }
  };

  const fetchMoreProducts = () => {
    if (cursor && !isFetchingMore) {
      fetchProducts(cursor); // Use the cursor to load more products.
    }
  };

  const handleColorSelect = (color) => {
    setTempSelectedColors(prevColors => {
      const newColors = new Set(prevColors);
      if (newColors.has(color)) {
        newColors.delete(color);
      } else {
        newColors.add(color);
      }
      return newColors;
    });
  };
  

  const toggleFilterModal = () => {
    if (!isFilterModalVisible) {
      setTempSelectedColors(selectedColors);
    }
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  const applyFilters = () => {
    setSelectedColors(tempSelectedColors);
    fetchProducts(null, tempSelectedColors);
    setIsFilterModalVisible(false);
  };
  

  const renderItem = ({ item }) => (
    <ProductCardTest
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    />
  );

  const renderFilterOptions = () => {
    return colorOptions.map((color, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.filterOption,
          tempSelectedColors.has(color) ? styles.filterOptionSelected : styles.filterOptionUnselected,
        ]}
        onPress={() => handleColorSelect(color)}
      >
        <Text style={styles.filterOptionText}>{color}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleFilterModal} style={styles.filterButton}>
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.1}
        onEndReached={fetchMoreProducts}
        ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" /> : null}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={toggleFilterModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <Button title="Close" onPress={toggleFilterModal} />
            <ScrollView>{renderFilterOptions()}</ScrollView>
            <Button title="Apply Filters" onPress={applyFilters} />
          </View>
        </View>
      </Modal>

      {loading && <ActivityIndicator size="large" style={styles.loading} />}
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
  filterOption: {
    // Base style for your filter option
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterOptionSelected: {
    backgroundColor: '#007bff', // Selected background color
  },
  filterOptionUnselected: {
    backgroundColor: '#ffffff', // Unselected background color
  },
  filterOptionText: {
    color: '#000000', // Adjust text color as needed
  },
});

export default CollectionProductsScreen;