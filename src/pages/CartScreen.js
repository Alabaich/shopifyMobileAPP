import React from 'react';
import { View, Text, Button, FlatList, StyleSheet, Linking  } from 'react-native';
import { useCart } from '../CartContext';


export const CartScreen = () => {
  const { cartItems, removeFromCart, goToCheckout  } = useCart();

  const handleGoToCheckout = async () => {
    try {
      const url = await goToCheckout();
      if (url) {
        // Open the URL in the default web browser
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("Failed to open checkout:", error);
    }
  };
  
  // This renderItem function is for rendering each item in the cart
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.title} - Quantity: {item.quantity}</Text>
      <Text>Price: {item.price}</Text>
      <Button title="Remove" onPress={() => removeFromCart(item.id)} />
    </View>
  );



  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>Your cart is empty.</Text>}
      />
      <Button title="Go to Checkout" onPress={handleGoToCheckout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
 
  },
  itemText: {
    fontSize: 16,
  },
  // Add styles for buttons and other elements as needed
});

export default CartScreen;
