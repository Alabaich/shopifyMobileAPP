// In ./src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { login, fetchCustomerInfo } from '../components/shopifyAuthService'; // Adjust the path as necessary
import { useUser } from '../UserContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useUser(); // Corrected use of loginUser

  const handleLoginPress = async () => {
    setIsLoading(true);
    try {
      const response = await login(email, password);
      if (response.success) {
        const customerInfo = await fetchCustomerInfo(response.accessToken);
        loginUser(customerInfo); // Here we are calling loginUser instead of setUser
        let welcomeMessage = 'Welcome back!';
        if (customerInfo && (customerInfo.firstName || customerInfo.lastName)) {
          welcomeMessage = `Welcome back, ${customerInfo.firstName || ''} ${customerInfo.lastName || ''}!`.trim();
        } else {
          welcomeMessage = `Welcome back, ${customerInfo.email}!`;
        }
        Alert.alert('Login Successful', welcomeMessage);
      } else {
        const errorMessages = response.errors.map(error => error.message).join('\n');
        Alert.alert('Login Failed', errorMessages);
      }
      
          } catch (error) {
          Alert.alert('Error', 'An error occurred during the login process.');
          console.error(error);
          } finally {
          setIsLoading(false);
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
          <Button title="Login" onPress={handleLoginPress} disabled={isLoading} />
          {isLoading && <ActivityIndicator size="large" />}
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
          
          export default LoginScreen;
