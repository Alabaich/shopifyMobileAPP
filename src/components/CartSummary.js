import React from 'react';
import { View, FlatList, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useCart } from '../CartContext'; // Adjust the import path as necessary
import defaultImage from '../images/defaultImage.png'

const { width: screenWidth } = Dimensions.get('window');

const CartSummary = ({ navigation }) => {
    const { cartItems, isCartLoading } = useCart();
  
    if (isCartLoading) {
      return <ActivityIndicator size="large" />;
    }
    if (cartItems.length === 0) {
        return null; // Don't render anything if the cart is empty
    }

    const renderItem = ({ item }) => {
        const imageSrc = item.imageSrc ? { uri: item.imageSrc } : defaultImage;
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Cart')}
            >
                <Image source={imageSrc} style={styles.image} />
                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <Text>Price: {item.price}</Text>
                </View>

            </TouchableOpacity>
        );
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.leftCartTitle}> Items in you cart: </Text>
            <FlatList
                horizontal
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                style={styles.flatList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: "#fff",
    },
    flatList: {
        flexGrow: 0,
    },
    card: {
        width: 200,
        height: 100, 
        marginHorizontal: 5,
        alignItems: 'center', 
        flexDirection: "row",
        padding: 5,
        borderWidth: 1,
        borderColor: "#f0f0f0",
        borderRadius: 15,
        gap: 10,
    },
    image: {
        height: 75,
        width: 75,
        height: screenWidth / 2.5, 
        resizeMode: 'contain',
    },
    title: {
        marginTop: 5,
        textAlign: 'center',
    },

    titleContainer: {
        width: 100,
        alignItems: "start",
    },

    leftCartTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2c2d2c",
        marginBottom: 10,
    }
});

export default CartSummary;
