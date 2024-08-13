import Client from 'shopify-buy';

import { SHOPIFY_DOMAIN, ACCESS_TOKEN } from './shopifyClient';

const client = Client.buildClient({
  domain: SHOPIFY_DOMAIN,
  storefrontAccessToken: ACCESS_TOKEN,
});

export default client;
