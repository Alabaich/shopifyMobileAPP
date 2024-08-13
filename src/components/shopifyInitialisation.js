import Client from 'shopify-buy';

const client = Client.buildClient({
  domain: 'renozcentre.myshopify.com',
  storefrontAccessToken: '9e2b15437b50c2e5ea05d717f72b129b',
});

export default client;
