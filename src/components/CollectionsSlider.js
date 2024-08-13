import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Image, Dimensions, StyleSheet, Text } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { collectionIds } from './collectionIds';
import client from './shopifyInitialisation';
import defaultImage from '../images/defaultImage.png'; 


const { width: screenWidth } = Dimensions.get('window');

const leftArrowIcon = require('../icons/leftArrow.png');
const rightArrowIcon = require('../icons/rightArrow.png');


const CollectionSlider = ({ navigation, collectionsList  }) => {
  const [collections, setCollections] = useState([]);
  const carouselRef = useRef(null);


  const goPrev = () => {
    carouselRef.current.snapToPrev();
  };

  // Function to go to the next item
  const goNext = () => {
    carouselRef.current.snapToNext();
  };

  // Render the arrow components
  const renderLeftArrow = () => (
    <TouchableOpacity onPress={goPrev} style={styles.leftArrow}>
      <Image source={leftArrowIcon} style={styles.arrowImage} />
    </TouchableOpacity>
  );

  const renderRightArrow = () => (
    <TouchableOpacity onPress={goNext} style={styles.rightArrow}>
      <Image source={rightArrowIcon} style={styles.arrowImage} />
    </TouchableOpacity>
  );

  useEffect(() => {
    const fetchCollectionsDetails = async () => {
      try {
        // Convert the collectionsList string to an array
        const collectionsArray = collectionsList.split(', ').map(name => name.trim());
        // Filter collectionIds to include only those in collectionsArray
        const filteredCollectionIds = Object.keys(collectionIds)
          .filter(key => collectionsArray.includes(key))
          .reduce((obj, key) => {
            obj[key] = collectionIds[key];
            return obj;
          }, {});

        const fetchedCollections = await Promise.all(
          Object.keys(filteredCollectionIds).map(async (collectionName) => {
            const id = filteredCollectionIds[collectionName];
            const collection = await client.collection.fetch(id);
            if (collection) {
              return {
                id,
                name: collection.title,
                imageSrc: collection.image?.src ? { uri: collection.image.src } : defaultImage,
                imageAltText: collection.image?.altText || 'Default Image',
              };
            } else {
              // Use defaultImage if collection is null
              return {
                id,
                name: 'Default Collection',
                imageSrc: defaultImage,
                imageAltText: 'Default Image',
              };
            }
          })
        );
        setCollections(fetchedCollections);
      } catch (err) {
        console.error('Error fetching collections: ', err);
        // Set default data on error
        setCollections([{
          id: 'default',
          name: 'Default Collection',
          imageSrc: defaultImage,
          imageAltText: 'Default Image',
        }]);
      }
    };

    if (collectionsList) { // Ensure fetchCollectionsDetails is called only if collectionsList is provided
      fetchCollectionsDetails();
    }
  }, [collectionsList]); // Add collectionsList to the dependency array to refetch when it changes

  const renderItem = ({ item }) => (
    <View style={styles.shadow}>
      <TouchableOpacity
        onPress={() => navigation.navigate('CollectionProducts', {
          collectionId: item.id,
          collectionName: item.name,
        })}
        style={styles.item}
      >
        <Image
          source={item.imageSrc}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={ styles.container }>
      
      {renderLeftArrow()}
      <Carousel
      ref={carouselRef}
        data={collections}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth - 30}
        inactiveSlideScale={0.95}
        inactiveSlideOpacity={0.7}
      />
      {renderRightArrow()}
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  item: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: "cover",
  },
  shadow: {
    width: screenWidth - 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: 'white',
  },

  container: {
    paddingTop: 15,
    paddingBottom: 15,
    height: 230,
  },

  leftArrow: {
    position: 'absolute',
    left: 30,
    top: '50%',
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',

  },
  rightArrow: {
    position: 'absolute',
    right: 30,
    top: '50%',
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',

  },
  arrowText: {
    fontSize: 24, // Adjust the size as needed
    color: '#333', // This is your arrow color, change as needed
  },

  arrowImage: {
    width: 25, 
    height: 25, 
    resizeMode: 'contain', 
    opacity: 0.5,
  },

});

export default CollectionSlider;
