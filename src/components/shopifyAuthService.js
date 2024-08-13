// shopifyAuthService.js
import Client from 'shopify-buy';

const client = Client.buildClient({
  domain: 'renozcentre.myshopify.com',
  storefrontAccessToken: '9e2b15437b50c2e5ea05d717f72b129b',
});

export const login = async (email, password) => {
  const mutation = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${client.config.domain}/api/2022-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': client.config.storefrontAccessToken,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: { email, password },
        },
      }),
    });
    
    const jsonResponse = await response.json();
    if (jsonResponse.errors) {
      throw new Error('Error with GraphQL query.');
    }

    const result = jsonResponse.data.customerAccessTokenCreate;
    if (result.userErrors.length > 0) {
      // Handle user errors, e.g., invalid credentials
      return { success: false, errors: result.userErrors };
    }

    // Successfully obtained access token
    return { success: true, accessToken: result.customerAccessToken.accessToken };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, errors: [{ message: 'An unexpected error occurred.' }] };
  }
};

export const fetchCustomerInfo = async (accessToken) => {
    const query = `
      query customer($accessToken: String!) {
        customer(customerAccessToken: $accessToken) {
          id
          firstName
          lastName
          email
        }
      }
    `;
  
    try {
      const response = await fetch(`https://${client.config.domain}/api/2022-04/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': client.config.storefrontAccessToken,
        },
        body: JSON.stringify({
          query: query,
          variables: { accessToken },
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      const jsonResponse = await response.json();
      if (jsonResponse.errors) {
        throw new Error(`GraphQL Error: ${JSON.stringify(jsonResponse.errors)}`);
      }
  
      // Extract the customer data from the response
      const customerData = jsonResponse.data.customer;

      const userId = customerData.id.split('/').pop();
      // If customer data is present, return it; otherwise, return null.
      return customerData ? {
        userId: userId,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email
      } : null;
  
    } catch (error) {
      console.error('Fetch customer info error:', error);
      return null; // Optionally, you could throw the error instead of returning null
    }
  };