import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { collectionIds } from './collectionIds'; // make sure the path is correct
import client from './shopifyInitialisation'; // make sure the path is correct

const CollectionCards = ({ navigation, collectionNames, sectionTitle  }) => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const collectionDetails = await Promise.all(
        collectionNames.map(async (collectionName) => {
          const id = collectionIds[collectionName];
          try {
            const collection = await client.collection.fetch(id);
            return {
              id,
              name: collectionName,
              imageSrc: collection.image.src ? { uri: collection.image.src } : require('../images/defaultImage.png'),
            };
          } catch (error) {
            console.error(`Error fetching collection ${collectionName}:`, error);
            return {
              id,
              name: collectionName,
              imageSrc: require('../images/defaultImage.png'),
            };
          }
        })
      );
      setCollections(collectionDetails);
    };

    fetchCollections();
  }, [collectionNames]);

  const handlePress = (collectionId, collectionName) => {
    navigation.navigate('CollectionProducts', { collectionId, collectionName });
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title} >Plumbing Perfection for Every Home</Text>
      {collections.map((collection) => (
        <TouchableOpacity
          key={collection.id}
          style={styles.card}
          onPress={() => handlePress(collection.id, collection.name)}
        >
          <Image
            source={collection.imageSrc}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.text}>{collection.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 7,
  },
  card: {
    width: '45%', // Adjust the width as needed
    aspectRatio: 1, // Adjust if you want a different aspect ratio
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100, // You may need to adjust this
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c2d2c",
    marginBottom: 10,
    textAlign: "left",
    width: "100%",
    paddingLeft: 7,
  }
});

export default CollectionCards;
