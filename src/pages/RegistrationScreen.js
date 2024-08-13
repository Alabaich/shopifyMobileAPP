import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { registerCustomer } from '../components/shopifyAuthService';

const RegistrationScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegisterPress = async () => {
    try {
      const response = await registerCustomer(email, password);
      if (response.success) {
        Alert.alert('Registration Successful', 'You can now log in with your credentials.');
      } else {
        const errorMessages = response.errors.map(error => error.message).join('\n');
        Alert.alert('Registration Failed', errorMessages);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during the registration process.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegisterPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
});

export default RegistrationScreen;
