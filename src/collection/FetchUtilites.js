import axios from 'axios';
import { CALLBACK_TYPE } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';

const SHOPIFY_DOMAIN = 'renozcentre.myshopify.com';
const ACCESS_TOKEN = '9e2b15437b50c2e5ea05d717f72b129b';

export const fetchProducts = async (afterCursor = null, collectionId) => {
  try {
    const graphqlQuery = {
      query: `
        query fetchProducts($id: ID!, $cursor: String) {
          collection(id: $id) {
            id
            products(first: 10, after: $cursor) {
              pageInfo {
                hasNextPage
                endCursor
              }
              edges {
                node {
                    id
                    title
                    options {
                      name
                      values
                    }
                    images(first: 1) {
                      edges {
                        node {
                          originalSrc
                          altText
                        }
                      }
                    }
                    variants(first: 1) {
                      edges {
                        node {
                          priceV2 {
                            amount
                            currencyCode
                          }
                          compareAtPriceV2 {
                            amount
                            currencyCode
                          }
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
        cursor: afterCursor
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
      return { errors: response.data.errors };
    }
    
    const newEdges = response.data.data.collection.products.edges;
    const newProducts = newEdges.map(edge => edge.node);
    const endCursor = newEdges.length ? response.data.data.collection.products.pageInfo.endCursor : null;

    return { newProducts, endCursor };
  
  } catch (error) {
    console.error('Error fetching products:', error);
    return { errors: error };
  }
};

export const fetchAllFilters = async (collectionId, setFilters) => {
  try {
    const graphqlQuery = {
      query: `
        query Facets {
          collection(id: "${collectionId}") {
            handle
            products(first: 250) {
              filters {
                id
                label
                type
                values {
                  id
                  label
                  count
                  input
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

    if (response.data.errors) {
      console.error('GraphQL Errors:', response.data.errors);
      return;
    }

    const filters = response.data.data.collection.products.filters;
    const priceRangeFilter = filters.find(filter => filter.type === 'PRICE_RANGE');
    
    let minPrice = 0, maxPrice = 0;
    if (priceRangeFilter && priceRangeFilter.values[0].input) {
      const priceRange = JSON.parse(priceRangeFilter.values[0].input).price;
      minPrice = priceRange.min;
      maxPrice = priceRange.max;
    }
    setFilters({ filters, minPrice, maxPrice });
  } catch (error) {
    console.error('Error fetching filters:', error);
  }
};


export const fetchFilteredProducts = async (afterCursor = null, collectionId, selectedFilters) => {
  try {
    // Adjusting filters criteria to match the expected structure in the GraphQL query
    let filtersCriteria = [];

    const priceFilter = selectedFilters['filter.v.price'];
    const [minPrice, maxPrice] = priceFilter || [null, null];
    

    Object.entries(selectedFilters ?? {}).forEach(([filterId, optionValues]) => {
      if (filterId === "filter.p.product_type") {
        optionValues.forEach(value => {
          filtersCriteria.push({
            "productType": value,
          });
        });
      } else if (filterId === "filter.p.vendor") {
        optionValues.forEach(value => {
          filtersCriteria.push({
            "productVendor": value,
          });
        });
      } else if (filterId === "filter.v.price") {

      } else if (filterId.includes("custom")) {
        optionValues.forEach(value => {
          const parts = filterId.split('.'); // Split filterId into parts
          const mIndex = parts.indexOf('m'); // Find the index of 'm'
          let keyMy = '', namespace = '';
        
          if (mIndex !== -1 && mIndex + 1 < parts.length) {
            // Ensure 'm' is found and it's not the last element
            keyMy = parts[mIndex + 1]; // The part after 'm' is keyMy
          }
        
          if (parts.length > 0) {
            namespace = parts[parts.length - 1]; // The last part is namespace
          }
        
          filtersCriteria.push({
            "variantMetafield": {
              "namespace": keyMy,
              "key": namespace,
              "value": value
            }
          });
        });
      } else {
        optionValues.forEach(value => {
          // Remove "filter.v.option." from the filterId
          const cleanedFilterId = filterId.replace("filter.v.option.", "");
      
          filtersCriteria.push({
            "variantOption": {
              "name": cleanedFilterId, // Use the cleaned filter ID
              "value": value
            }
          });
        });
      }
    });

    if (minPrice !== null && maxPrice !== null && minPrice !== "" && maxPrice !== "") {
      if ( maxPrice !== null && maxPrice !== "" ) {
        filtersCriteria.push({
          "price": { "min": parseFloat(minPrice) }
      });
      } else {
        filtersCriteria.push({
          "price": { "min": parseFloat(minPrice), "max": parseFloat(maxPrice) }
      });
      }
  }


    const graphqlQuery = {
      query: `
      query fetchProducts($id: ID!, $cursor: String, $filters: [ProductFilter!]) {
        collection(id: $id) {
          id
          products(first: 10, after: $cursor, filters: $filters ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                  id
                  title
                  images(first: 1) {
                    edges {
                      node {
                        originalSrc
                        altText
                      }
                    }
                  }
                  variants(first: 1) {
                    edges {
                      node {
                        priceV2 {
                          amount
                          currencyCode
                        }
                        compareAtPriceV2 {
                          amount
                          currencyCode
                        }
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
        filters: filtersCriteria, // Ensure this matches the structure expected by your GraphQL server
      },
    };

    console.log('Sending GraphQL Query:', JSON.stringify(graphqlQuery, null, 2));

    // Assuming `axios` and other constants are already defined elsewhere
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
      return { errors: response.data.errors };
    }

    const newEdges = response.data.data.collection.products.edges;
    const newProducts = newEdges.map(edge => edge.node);
    const endCursor = newEdges.length ? response.data.data.collection.products.pageInfo.endCursor : null;

    return { newProducts, endCursor };
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    return { errors: error };
  }
};




  

export const fetchMoreProducts = async (cursor, collectionId, selectedFilters = null) => {
  // Check if there are selected filters
  if (selectedFilters && Object.keys(selectedFilters).length > 0) {
    // If so, fetch more filtered products
    const result = await fetchFilteredProducts(cursor, collectionId, selectedFilters);
    return result;
  } else {
    // If no filters are selected, proceed with fetching more products as usual
    const result = await fetchProducts(cursor, collectionId);
    return result;
  }
};



