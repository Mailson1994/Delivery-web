import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: 'red' }, // Cor de fundo do topo
          headerTintColor: '#fff', // Cor do texto no header
          headerTitleAlign: 'center', // Centraliza o título
          headerTitleStyle: { fontWeight: 'bold' }, // Deixa o título em negrito
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Pastel da Hora' }} 
        />
        <Stack.Screen 
          name="Menu" 
          component={MenuScreen} 
          options={{ title: 'Cardápio' }} 
        />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen} 
          options={{ title: 'Carrinho' }} 
        />
        <Stack.Screen 
          name="Checkout" 
          component={CheckoutScreen} 
          options={{ title: 'Checkout' }} 
        />
        <Stack.Screen 
          name="Confirmation" 
          component={ConfirmationScreen} 
          options={{ title: 'Pedido Confirmado!' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
