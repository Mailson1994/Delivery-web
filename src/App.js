import React from 'react';
// PASSO 1: Importar View e StyleSheet
import { View, StyleSheet } from 'react-native';
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
    // PASSO 2: Envelopar tudo em uma View com o estilo do container
    <View style={styles.container}>
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
    </View>
  );
}

// PASSO 3: Adicionar o StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1, // Este é o comando mágico que diz: "ocupe todo o espaço disponível"
  },
});