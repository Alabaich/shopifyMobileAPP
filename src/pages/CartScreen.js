import React from 'react';
import { Image, View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useCart } from '../CartContext';
import deleteIcon from '../icons/deleteIcon.png'; // Import the delete icon
import defaultImage from '../images/defaultImage.png'

export const CartScreen = () => {
  const { cartItems, removeFromCart, goToCheckout } = useCart();

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
  const renderItem = ({ item }) => {
    const imageSrc = item.imageSrc ? { uri: item.imageSrc } : defaultImage;
    // Helper function to truncate title to the first 5 words
    const truncateTitle = (title) => {
      const words = title.split(' ');
      return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : title;
    };
  
    return (
      <View style={styles.itemContainer}>
        {/* Small image on the left */}
        <Image source={ imageSrc } style={styles.itemImage} />
  
        {/* Item details (title and price) */}
        <View style={styles.itemDetails}>
          <Text style={styles.itemText}>{truncateTitle(item.title)}</Text>
          <Text style={styles.itemPrice}>${item.price}</Text>
        </View>
        <Text>{item.quantity}</Text>
  
        {/* Delete icon (TouchableOpacity) */}
        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <Image source={deleteIcon} style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    const itemQuantity = parseInt(item.quantity) || 0;
    return sum + (itemPrice * itemQuantity);
  }, 0);
  
  // Format the total price
  const formattedTotalPrice = (totalPrice).toFixed(2);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>Your cart is empty.</Text>}
      />
<Text style={styles.totalPrice}>Total: ${formattedTotalPrice}</Text>
      <TouchableOpacity style={styles.checkoutButton} onPress={handleGoToCheckout}>
        <Text style={styles.checkoutButtonText}>Go to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemImage: {
    height: 50,
    width: 50
  },

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
    flexDirection: "row",
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
    paddingTop: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  itemDetails: {
    flex: 1, // Takes up remaining space
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 16,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: '#2c2d2c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteIcon: {
    height: 30,
    width: 30,
  }
});

export default CartScreen;
