import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { collectionIds } from './collectionIds';
import client from './shopifyInitialisation';

// ... (rest of your imports)
const CollectionImage = ({ collectionName, navigation }) => {
  const [collectionDetails, setCollectionDetails] = useState(null);

  useEffect(() => {
const fetchCollectionDetails = async () => {
  try {
    const id = collectionIds[collectionName];
    const collection = await client.collection.fetch(id);

    setCollectionDetails({
      name: collection.title,
      imageSrc: collection.image?.src, // This should match the actual field from the log
      imageAltText: collection.image?.altText,
    });
    // Log the state after setting it

  } catch (error) {
    console.error('Error fetching collection details:', error);
  }
};

    fetchCollectionDetails();
  }, [collectionName]);

  const handlePress = () => {
    if (collectionDetails) {
      navigation.navigate('CollectionProducts', {
        collectionId: collectionIds[collectionName],
        collectionName: collectionDetails.name // Use the name from the state
      });
    } else {
      // Optionally handle the case where collectionDetails is not yet loaded
      console.log('Collection details not available.');
    }
  };
  return (
<TouchableOpacity onPress={handlePress} style={styles.container}>
  {collectionDetails?.imageSrc ? ( // Changed from collectionDetails to collectionDetails?.imageSrc
        <View style={styles.shadow}>
        <Image
          source={{ uri: collectionDetails.imageSrc }}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel={collectionDetails.imageAltText || 'Image'}
        />
      </View>
  ) : (
    <Text>Loading image...</Text>
  )}
</TouchableOpacity>

  );
};

// ... (rest of your styles)

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 15
  },
  image: {
    width: '100%', // Set your desired width
    height: 200,
    objectFit: "cover",
    borderRadius: 15, // Set your desired height
  },
  shadow: {
    // Apply shadow styles to this view
    width: '100%', // You might need to adjust this width
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, // Only for Android, ignored on iOS
    // Make sure the shadow is visible by giving it a background color
    backgroundColor: 'white', 
  },
});

export default CollectionImage;
