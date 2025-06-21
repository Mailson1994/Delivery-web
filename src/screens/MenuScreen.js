import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import menu from '../data/menu';
import { Ionicons } from '@expo/vector-icons';

export default function MenuScreen({ navigation }) {
  // ...toda a sua lógica de state e functions continua a mesma...
  const [cart, setCart] = useState([]);
  const [selectedFlavors, setSelectedFlavors] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadCart = async () => {
        try {
          const savedCart = await AsyncStorage.getItem('cart');
          setCart(savedCart ? JSON.parse(savedCart) : []);
        } catch (error) {
          console.error("Erro ao carregar carrinho:", error);
        }
      };
      loadCart();
    }, [])
  );

  useEffect(() => {
    const saveCart = async () => {
      try {
        if (cart.length === 0) {
          await AsyncStorage.removeItem('cart');
        } else {
          await AsyncStorage.setItem('cart', JSON.stringify(cart));
        }
      } catch (error) {
        console.error("Erro ao salvar carrinho:", error);
      }
    };
    saveCart();
  }, [cart]);

  const addPizzaToCart = (pizza) => {
    if (selectedFlavors.length === 0) {
      setSelectedFlavors([pizza]);
    } else if (selectedFlavors.length === 1) {
      const combinedPizza = {
        id: `${selectedFlavors[0].id}-${pizza.id}`,
        name: `${selectedFlavors[0].name} / ${pizza.name}`,
        price: (selectedFlavors[0].price + pizza.price) / 2,
        image: selectedFlavors[0].image,
        quantity: 1,
        half: true,
      };
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === combinedPizza.id);
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === combinedPizza.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prevCart, combinedPizza];
        }
      });
      setSelectedFlavors([]);
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      {/* O ScrollView não precisa mais de estilo aqui, pois o container já resolve */}
      <ScrollView>
        {Object.keys(menu).map((category) => (
          <View key={category}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <FlatList
              // Este estilo para a rolagem horizontal ainda é útil
              style={Platform.OS === 'web' ? { overflowX: 'scroll' } : {}}
              data={Array.isArray(menu[category]) ? menu[category] : []}
              keyExtractor={(item) => String(item.id)}
              horizontal
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
              renderItem={({ item }) => {
                const isHalfSelected = selectedFlavors.includes(item);
                const cartItem = cart.find((cartItem) => cartItem.id === item.id);
                const quantity = cartItem ? cartItem.quantity : 0;

                return (
                  <View style={styles.menuItem}>
                    <Image source={item.image} style={styles.itemImage} />
                    {isHalfSelected && (
                      <View style={styles.halfBadge}><Text style={styles.halfText}>0,5</Text></View>
                    )}
                    {quantity > 0 && (
                      <View style={styles.quantityBadge}><Text style={styles.quantityText}>{quantity}</Text></View>
                    )}
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)}</Text>
                    <Text style={styles.itemDescription}>{item.description || 'Sem descrição'}</Text>
                    {category === 'Pizzas' ? (
                      <TouchableOpacity style={[styles.addButton, isHalfSelected && styles.selectedButton]} onPress={() => addPizzaToCart(item)}>
                        <Text style={styles.addButtonText}>{isHalfSelected ? 'Selecionado' : 'Escolher'}</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                        <Text style={styles.addButtonText}>Adicionar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }}
            />
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate('Cart', { cart })}
      >
        <Ionicons name="cart" size={30} color="white" />
        {totalItemsInCart > 0 && (
          <View style={styles.badgeContainer}><Text style={styles.badgeText}>{totalItemsInCart}</Text></View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // <<< A SOLUÇÃO! Simplesmente ocupe o espaço que o App.js te deu.
    backgroundColor: 'yellow',
  },
  cartButton: {
    position: 'fixed', // 'fixed' continua correto para o botão flutuante na web
    zIndex: 1000,
    bottom: 30,
    right: 30,
    backgroundColor: 'red',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  // ... resto dos estilos continua igual ...
  badgeContainer: { position: 'absolute', top: -5, right: -5, backgroundColor: 'white', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'red' },
  badgeText: { color: 'red', fontSize: 12, fontWeight: 'bold' },
  categoryTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, marginTop: 20, paddingHorizontal: 10, color: '#333' },
  menuItem: { backgroundColor: '#ffa500', padding: 15, marginRight: 10, borderRadius: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, elevation: 3, width: 180, position: 'relative', textAlign: 'center' },
  itemImage: { width: 120, height: 120, borderRadius: 10, marginBottom: 10 },
  halfBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: 'red', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  halfText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  quantityBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: 'red', width: 25, height: 25, borderRadius: 12.5, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  quantityText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  addButton: { backgroundColor: 'red', padding: 8, borderRadius: 5, marginTop: 10 },
  selectedButton: { backgroundColor: 'green' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  itemName: { fontWeight: 'bold', fontSize: 16 },
  itemPrice: { fontSize: 14, color: '#333', marginVertical: 4 },
  itemDescription: { fontSize: 12, textAlign: 'center', minHeight: 30 }
});