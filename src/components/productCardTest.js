import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import defaultImage from '../images/defaultImage.png';

const ProductCardTest = ({ product, onPress, customCardStyle }) => {
    // Use the GraphQL-like query structure for the image source
    const imageSrc = product.images?.edges?.length
        ? { uri: product.images.edges[0].node.originalSrc }
        : defaultImage;

    // Safely access the properties with optional chaining for variants
    const firstVariant = product.variants?.edges?.[0]?.node;
    const productPrice = firstVariant?.priceV2?.amount || 'N/A';
    const productCompareAtPrice = firstVariant?.compareAtPriceV2?.amount || null;

    const truncateTitle = (title) => {
        const wordLimit = 5;
        const wordsArray = title.split(' ');
        if (wordsArray.length > wordLimit) {
            return wordsArray.slice(0, wordLimit).join(' ') + '...';
        }
        return title;
    };

    const formatPrice = (price) => {
        // Handle case where price is 'N/A'
        return price === 'N/A' ? price : Number(price).toFixed(2);
    };

    const priceColor = productCompareAtPrice && Number(productCompareAtPrice) > Number(productPrice) ? 'red' : 'black';

    return (
        <TouchableOpacity onPress={() => onPress(product)} style={[styles.cardContainer, customCardStyle]}>
            <Image source={imageSrc} style={styles.image} />
            <Text style={styles.title}>{truncateTitle(product.title)}</Text>
            <Text style={styles.vendor}>{product.vendor}</Text>
            <View style={styles.priceContainer}>
                <Text style={[styles.price, { color: priceColor }]}>
                    ${formatPrice(productPrice)}
                </Text>
                {productCompareAtPrice && (
                    <Text style={styles.compareAtPrice}>
                        ${formatPrice(productCompareAtPrice)}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

// Add your styles for the card here
const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        flexDirection: 'column',
        width: "50%",
        margin: 8,
        padding: 5,
        borderRadius: 5,

        overflow: "hidden",
        backgroundColor: '#fff', // Set the background color to white
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        // Android shadow
        elevation: 2,

    },
    image: {
        width: "100%",
        height: 150,
        objectFit: "contain",
        borderRadius: 15
    },
    title: {
        // Define your styles for the title
    },
    price: {
        fontSize: 16,
        color: "red",
        marginRight: 10,
        fontWeight: "bold",
    },
    compareAtPrice: {
        fontSize: 14,
        textDecorationLine: 'line-through',
        color: 'grey', // Optional: if you want the strikethrough price to be grey
        // Add other styles as needed, like fontSize, etc.
    },

    vendor: {
        // Style for vendor text
        fontSize: 14,
        color: 'gray',
    },

    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center', // To align prices vertically
    },
});

export default React.memo(ProductCardTest);



