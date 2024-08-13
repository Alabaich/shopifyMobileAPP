// ShopifyCartService.js
import { ACCESS_TOKEN, SHOPIFY_DOMAIN } from "./shopifyClient";
const domain = SHOPIFY_DOMAIN;
const storefrontAccessToken = ACCESS_TOKEN;
const shopifyApiEndpoint = `https://${domain}/api/2024-01/graphql.json`;

// Helper function to perform GraphQL operations
async function shopifyGraphQLOperation(query, variables = {}) {
  try {
    const response = await fetch(shopifyApiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const jsonResponse = await response.json();
    if (jsonResponse.errors) {
      console.error('GraphQL operation error:', jsonResponse.errors);
      throw new Error('GraphQL operation failed.');
    }
    return jsonResponse.data;
  } catch (error) {
    console.error('GraphQL operation error:', error);
    throw new Error('An unexpected error occurred.');
  }
}

export const createCart = async () => {
  const mutation = `
    mutation {
      cartCreate(input: {}) {
        cart {
          id
        }
      }
    }
  `;

  const data = await shopifyGraphQLOperation(mutation);
  return data.cartCreate.cart.id;
};



export const addItemToCart = async (cartId, variantId, quantity) => {
  const mutation = `
  mutation($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 10) {
          edges {
            node {
              id
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    images(first: 1) {
                      edges {
                        node {
                          originalSrc
                        }
                      }
                    }
                  }
                }
              }
              quantity
            }
          }
        }
      }
    }
  }
`;

const variables = {
  cartId,
  lines: [{ merchandiseId: variantId, quantity }],
};

const data = await shopifyGraphQLOperation(mutation, variables);
return data.cartLinesAdd.cart.lines.edges.map(edge => ({
  id: edge.node.id,
  title: edge.node.merchandise.product.title,
  quantity: edge.node.quantity,
  price: `${edge.node.merchandise.priceV2.amount} ${edge.node.merchandise.priceV2.currencyCode}`,
  imageSrc: edge.node.merchandise.product.images.edges[0]?.node.originalSrc, // Assuming at least one image exists
}));
};

export const setCartBuyerIdentity = async (cartId, email) => {
  const mutation = `
    mutation($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart {
          id
        }
      }
    }
  `;

  const variables = {
    cartId,
    buyerIdentity: {
      email,
    },
  };

  await shopifyGraphQLOperation(mutation, variables);
};

// ... other functions remain the same

export const removeItemFromCart = async (cartId, lineItemId) => {
    const mutation = `
      mutation($cartId: ID!, $lineItemIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineItemIds) {
          cart {
            lines(first: 10) {
              edges {
                node {
                  id
                  merchandise {
                    ... on ProductVariant {
                      id
                      product {
                        title
                      }
                    }
                  }
                  quantity
                }
              }
            }
          }
        }
      }
    `;
  
    const variables = {
      cartId,
      lineItemIds: [lineItemId],
    };
  
    const data = await shopifyGraphQLOperation(mutation, variables);
    return data.cartLinesRemove.cart.lines.edges.map(edge => ({
      id: edge.node.id,
      title: edge.node.merchandise.product.title,
      quantity: edge.node.quantity,
    }));
  };

  
  export const createCheckout = async (cartId) => {
    const query = `
      query checkoutURL($cartId: ID!) {
        cart(id: $cartId) {
          checkoutUrl
        }
      }
    `;
  
    const variables = {
      cartId,
    };
  
    const data = await shopifyGraphQLOperation(query, variables);
    // Make sure to access the checkoutUrl correctly based on the response structure
    return data.cart.checkoutUrl;
  };
  