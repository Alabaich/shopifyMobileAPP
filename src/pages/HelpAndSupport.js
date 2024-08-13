import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelpAndSupport = () => {
  return (
    <View style={styles.container}>
      <Text>Help and support</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HelpAndSupport;
