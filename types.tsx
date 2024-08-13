export type RootStackParamList = {
    Home: undefined;
    Search: undefined;
    Notifications: undefined;
    Profile: undefined;
    Cart: undefined;
    Categories: undefined;
    Products: undefined;
    Collections: undefined;
    CollectionProducts: {
      collectionId: string;
      collectionName: string;
      showFilterModal: any;
    };
    ProductDetail: { productId: string };
    FilterScreen: {
      collectionId: string;
      // Include other parameters if necessary
    };
  };
  
  export interface Notification {
    id: string; // Assuming you have an id field
    title: string;
    body: string;
    imageUrl?: string;
    opened: boolean;
    data?: any;
  }
  