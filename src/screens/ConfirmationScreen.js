import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function ConfirmationScreen({ navigation, route }) {
  const total = route.params.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedido Confirmado! 🎉</Text>
      <Text style={styles.text}>Total: R$ {total.toFixed(2)}</Text>
      <Text style={styles.text}>Seu pedido está a caminho!</Text>
      <Button
        title="Voltar ao Início"
        onPress={() => navigation.popToTop()}
        color="#2196F3"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
});