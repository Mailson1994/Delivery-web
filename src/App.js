import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
// 1. IMPORTE A NOVA TELA
import TestScreen from './screens/TestScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          // 2. MUDE A ROTA INICIAL PARA A TELA DE TESTE
          initialRouteName="Home" 
          screenOptions={{
            headerStyle: { backgroundColor: 'red' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          {/* 3. ADICIONE A TELA DE TESTE AO NAVEGADOR */}
          <Stack.Screen 
            name="Test" 
            component={TestScreen} 
            options={{ title: 'Teste de Rolagem' }} 
          />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Pastel da Hora' }} />
          <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Cardápio' }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Carrinho' }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
          <Stack.Screen name="Confirmation" component={ConfirmationScreen} options={{ title: 'Pedido Confirmado!' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});