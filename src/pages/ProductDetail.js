
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import client from '../components/shopifyInitialisation';
import { useCart } from '../CartContext';
import defaultImage from '../images/defaultImage.png';
import closeIcon from '../icons/close.png';
import Modal from 'react-native-modal';
import ImageZoom from 'react-native-image-pan-zoom';

const { width: screenWidth } = Dimensions.get('window');

const ProductDetail = ({ route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [variantTitle, setVariantTitle] = useState('');
  const [variantPrice, setVariantPrice] = useState('');
  const [showAddToCartPopup, setShowAddToCartPopup] = useState(false);



  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productDetails = await client.product.fetch(productId);
        setProduct(productDetails);
        // Select the first variant by default
        const defaultVariant = productDetails.variants[0];
        setSelectedVariant(defaultVariant);
        setVariantTitle(`${productDetails.title} - ${defaultVariant.selectedOptions.map(o => o.value).join(', ')}`);
        setVariantPrice(defaultVariant.price.amount); // Ensure you're accessing the amount correctly

        // Log the variants and their options to see the structure
        productDetails.variants.forEach(variant => {

        });
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [productId]);


  const updateSelectedOptions = (optionName, optionValue) => {
    const updatedOptionValue = optionValue.value || optionValue;
    const updatedOptions = { ...selectedOptions, [optionName]: updatedOptionValue };
    setSelectedOptions(updatedOptions);

    if (product && Object.keys(updatedOptions).length === product.options.length) {
      const matchingVariant = product.variants.find(variant =>
        variant.selectedOptions.every(
          option => updatedOptions[option.name] === option.value
        )
      );

      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
        setVariantTitle(`${product.title} - ${matchingVariant.selectedOptions.map(o => o.value).join(', ')}`);
        setVariantPrice(matchingVariant.price.amount);

        // Find the index of the matching variant's image in the product images array
        const variantImageSrc = matchingVariant.image.src;
        const imageIndex = product.images.findIndex(image => image.src === variantImageSrc);

        // Update the carousel's active image index if the image is found
        if (imageIndex !== -1) {
          setSelectedImageIndex(imageIndex);
        }
      } else {
        console.error('No matching variant found for the selected options:', updatedOptions);
        // Handle no matching variant case here
      }
    }
  };


  const isOptionValueAvailable = (checkingOptionName, checkingOptionValue) => {
    return product.variants.some((variant) => {
      const optionMatch = variant.selectedOptions.every((option) => {
        // If we're checking the current option, see if the value matches.
        if (option.name === checkingOptionName) return option.value === checkingOptionValue;
        // For other options, they must match the already selected values (if any).
        return selectedOptions[option.name] === option.value || !selectedOptions[option.name];
      });
      return optionMatch;
    });
  };


  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(selectedVariant.id, 1);
      setShowAddToCartPopup(true); // Show the popup
      // Set a timeout to hide the popup after 2 seconds
      setTimeout(() => {
        setShowAddToCartPopup(false);
      }, 2000);
    } else {
      // Alert the user to select a variant if none is selected
      alert('Please select a variant before adding to cart.');
    }
  };

  const renderItem = ({ item, index, carouselType }) => {
    const handlePress = () => {
      setSelectedImageIndex(index);
      setModalVisible(true);
    };
    if (carouselType === 'modal') {
      return (
        <View style={styles.modalCarouselItemStyle}>
          <ImageZoom
            cropWidth={screenWidth}
            cropHeight={300} // Adjust height as needed
            imageWidth={screenWidth}
            imageHeight={300} // Adjust height as needed
            style={styles.modalCarouselItemStyle}
          >
            <Image
              source={item.src ? { uri: item.src } : defaultImage}
              style={{ width: screenWidth, height: 300 }} // Adjust height as needed
              resizeMode="contain"
            />
          </ImageZoom>
        </View>

      );
    } else {
      return (
        <TouchableOpacity
          onPress={handlePress}
          style={styles.mainCarouselItemStyle}
        >
          <Image
            source={item.src ? { uri: item.src } : defaultImage}
            style={styles.image}
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    }
  };
  if (!product) {
    return <ActivityIndicator size="large" />;
  }
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.carouselContainer}>
          <Carousel
            data={product.images.length > 0 ? product.images : [defaultImage]}

            sliderWidth={screenWidth}
            itemWidth={screenWidth}
            firstItem={selectedImageIndex}
            onSnapToItem={(index) => setSelectedImageIndex(index)}
            renderItem={({ item, index }) => renderItem({ item, index, carouselType: 'main' })}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{variantTitle}</Text>

          <Text style={styles.vendor}>{product.vendor}</Text>
          <Text style={styles.price}>{`Price: $${Number(variantPrice).toFixed(2)}`}</Text>
          {product.options.map((option, index) => {
            // Check if the option has more than one value
            if (option.values.length > 1) {
              return (
                <View key={index} style={styles.variantOptionContainer}>
                  <Text style={styles.variantOptionTitle}>{option.name}</Text>
                  {option.values.map((optionValue, valueIndex) => {
                    const isAvailable = isOptionValueAvailable(option.name, optionValue.value);
                    return (
                      <TouchableOpacity
                        key={valueIndex}
                        style={[
                          styles.variantButton,
                          selectedOptions[option.name] === optionValue.value && styles.variantButtonSelected,
                          !isAvailable && styles.variantButtonUnavailable,
                        ]}
                        onPress={() => isAvailable && updateSelectedOptions(option.name, optionValue)}
                        disabled={!isAvailable}
                      >
                        <Text style={styles.variantButtonText}>{optionValue.value}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            }
            return null; // Return null if the option has only one value
          })}
        </View>
      </ScrollView>
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection={['up']}
        style={styles.modal}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Carousel
            data={product.images}
            sliderWidth={screenWidth}
            itemWidth={screenWidth}
            firstItem={selectedImageIndex}
            onSnapToItem={(index) => setSelectedImageIndex(index)}
            renderItem={({ item, index }) => renderItem({ item, index, carouselType: 'modal' })}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Image source={closeIcon} style={styles.closeButtonIcon} />
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
      {showAddToCartPopup && (
        <View style={styles.popupContainer}>
          <Text style={styles.popupText}>
            Added to cart - {variantTitle} for ${Number(variantPrice).toFixed(2)}
          </Text>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1, // The container takes the full height of the screen
    backgroundColor: '#fff', // Background color for the entire screen
  },
  scrollView: {
    flex: 1, // The ScrollView takes up all available space above the footer
  },
  mainCarouselItemStyle: {
    // styles specific to the main view carousel items
    width: screenWidth,
    height: 300,
    // ... other styles
  },
  modalCarouselItemStyle: {
    width: screenWidth,
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth,
    height: 300,
    objectFit: "cover",
  },
  infoContainer: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c2d2c', // or any color you want
    marginBottom: 10,
  },
  vendor: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 15,
  },
  // Additional styles as needed
  closeButton: {
    position: "absolute",
    top: 45,
    right: 20,
    zIndex: 10,
  },
  closeButtonIcon: {
    width: 35,
    height: 35,
  },
  modal: {
    flex: 1, // Make sure the modal takes the full screen
    justifyContent: 'center', // Align children vertically in the center
    margin: 0,
  },
  modalContent: {
    flex: 1,
    height: "100%",
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: "absolute",
    top: 45,
    right: 20,
    zIndex: 10,
  },
  closeButtonIcon: {
    width: 35,
    height: 35,
  },
  carouselContainer: {
    marginTop: 0, // Adjust this value as needed to pull the carousel up
    // ... other styling for the carousel container
  },
  carouselImage: {
    width: '100%', // Use 100% of the TouchableOpacity
    height: '100%', // Use 100% of the TouchableOpacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 15, // Padding inside the footer (adjust as needed)
    backgroundColor: '#fff', // Background color for the footer
    shadowOpacity: 0,
  },
  button: {
    height: 50, // Specify a fixed height for your button (adjust as needed)
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    backgroundColor: "#2c2d2c", // Background color for the button
    borderRadius: 25, // Border radius for the button (adjust as needed)
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "medium",
    fontSize: 18,
  },
  variantsContainer: {
    padding: 15,
    backgroundColor: '#f7f7f7', // A light background color for the variants section
  },
  variantsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  variantButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 5,
    marginBottom: 10,
  },
  variantButtonSelected: {
    borderColor: '#000', // Highlight the selected variant
  },
  variantButtonText: {
    fontSize: 16,
    color: '#333',
  },
  popupContainer: {
    position: 'absolute',
    bottom: 100, // You can adjust this value as needed
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  popupText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  variantButtonUnavailable: {
    borderColor: '#ccc', // Greyed out border color
    backgroundColor: '#f0f0f0', // Greyed out background color
  },
});

export default ProductDetail;