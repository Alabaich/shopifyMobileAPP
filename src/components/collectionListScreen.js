import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import client from './shopifyInitialisation';
import { collectionIds } from './collectionIds';

const CollectionsListScreen = ({ navigation }) => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    const collectionNamesToShow = ['best_sellers', 'plumbing', 'vanities', 'flooring', 'lighting', 'decor', 'fireplaces', 'countertops', 'ventilation'];

    useEffect(() => {
        const fetchCollections = async () => {
            const promises = collectionNamesToShow.map(async (collectionName) => {
                const id = collectionIds[collectionName];
                try {
                    const collection = await client.collection.fetch(id);
                    return {
                        id: collection.id.toString(),
                        title: collection.title,
                        imageSrc: collection.image ? { uri: collection.image.src } : require('../images/defaultImage.png'),
                    };
                } catch (error) {
                    console.error(`Error fetching collection for ${collectionName}:`, error);
                    return null;
                }
            });

            const fetchedCollections = await Promise.all(promises);
            setCollections(fetchedCollections.filter(Boolean)); // Remove any null values if an error occurred
            setLoading(false);
        };

        fetchCollections();
    }, []);

    const renderCollection = ({ item, index }) => {
        const isEven = index % 2 === 0;
        return (
            <TouchableOpacity
                style={[
                    styles.collectionCard,
                    isEven ? styles.evenCard : styles.oddCard,
                ]}
                onPress={() => navigation.navigate('CollectionProducts', {
                    collectionId: item.id,
                    collectionName: item.title,
                })}
            >
                {isEven && (
                    <View style={styles.imageShadow}>
                        <Image
                            source={item.imageSrc}
                            style={styles.collectionImageEven}
                            resizeMode="cover"
                        />
                    </View>
                )}
                <Text style={styles.collectionTitle}>{item.title}</Text>
                {!isEven && (
                    <View style={styles.imageShadow}>
                        <Image
                            source={item.imageSrc}
                            style={styles.collectionImageOdd}
                            resizeMode="cover"
                        />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={collections}
                keyExtractor={(item) => item.id}
                renderItem={renderCollection}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // white background color for the whole section
    },
    listContent: {
        padding: 15,
    },
    oddCard: {
        backgroundColor: '#E9E9E7', // nice color for card background
        borderRadius: 25,
        overflow: 'visible',
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 25,
        height: 140,
        width: "100%",
        position: "relative"
    },
    evenCard: {
        backgroundColor: '#E9EAEF', // nice color for card background
        borderRadius: 25,
        overflow: 'visible',
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 25,
        height: 140,
        width: "100%",
        position: "relative"
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imageShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // For Android
        width: '50%', // Adjust width as needed
        height: 160, // Adjust height as needed
        overflow: 'hidden', // Ensures the shadow is not clipped on iOS
    },
    collectionImageOdd: {
        width: '100%', // Adjust according to the wrapper size
        height: '100%',
        resizeMode: 'cover', // Ensures the image covers the wrapper area
    },
    collectionImageEven: {
        width: '100%', // Adjust according to the wrapper size
        height: '100%',
        resizeMode: 'cover', // Ensures the image covers the wrapper area
    },
    collectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        // Additional styling
    },
    // Omit the collectionCount style as it's no longer needed
});

export default CollectionsListScreen;
