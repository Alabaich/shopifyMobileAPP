// HomeStackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../pages/HomeScreen';
import HomeHeader from '../headers/HomeHeader';
import CategoriesScreen from '../pages/CategoriesScreen';
import CollectionsListScreen from '../components/collectionListScreen';
import CollectionProductsScreen from '../components/CollecttonProduct';
import Collection from '../collection/Collection';
import ProductDetail from '../pages/ProductDetail';
import CollectionProductsHeader from '../headers/CollectionHeader';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import ProductDetailHeader from '../headers/ProductDetailHeader';
import FilterScreen from '../pages/FilterScreen';

const HomeStack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({ // This function provides you with the navigation prop
          header: () => <HomeHeader navigation={navigation} />, // Now you can pass it to HomeHeader
        })}
      />

      <HomeStack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ /* options for CategoriesScreen */ }}
      />

      <HomeStack.Screen
        name="Collections"
        component={CollectionsListScreen}
        options={{ /* options for CategoriesScreen */ }}
      />

      <HomeStack.Screen
        name="CollectionProducts"
        component={Collection}
        options={({ route, navigation }) => {
          // Adjust the type casting if necessary to match your RootStackParamList definitions
          const typedRoute = route as RouteProp<RootStackParamList, 'CollectionProducts'>;
          return {
            header: () => (
              <CollectionProductsHeader
                navigation={navigation}
                route={typedRoute} // Use the asserted route
              />
            ),
          };
        }}
      />

      <HomeStack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={({ navigation }) => ({ // This function provides you with the navigation prop
          headerTransparent: true,
          header: () => <ProductDetailHeader navigation={navigation} />, // Now you can pass it to HomeHeader
        })}
      />

<HomeStack.Screen
  name="FilterScreen"
  component={FilterScreen}
  options={{ headerTitle: 'Filter Products' }}
/>

    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
