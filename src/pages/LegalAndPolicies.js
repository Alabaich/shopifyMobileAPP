import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LegalAndPolicies = () => {
  return (
    <View style={styles.container}>
      <Text>Legal And Policies</Text>
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

export default LegalAndPolicies;
