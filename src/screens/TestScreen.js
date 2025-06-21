import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function TestScreen() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Tela de Teste de Rolagem</Text>
        {/* Criamos uma lista longa para forçar a necessidade de rolar a página */}
        {Array.from({ length: 50 }).map((_, index) => (
          <Text key={index} style={styles.textItem}>
            Item de Teste número {index + 1}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue', // Uma cor diferente para sabermos que é a tela de teste
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    backgroundColor: 'darkblue',
    color: 'white',
  },
  textItem: {
    padding: 20,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});