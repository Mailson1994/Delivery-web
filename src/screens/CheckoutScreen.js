import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Clipboard, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Linking } from 'react-native';

export default function CheckoutScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [selectedBairro, setSelectedBairro] = useState('');

  const { cart = [] } = route.params || {};
  
  const [numeroPedido] = useState(() => {
    return Math.floor(Date.now() / 1000).toString().slice(-6);
  });

  const total = cart.reduce((sum, item) => 
    sum + (item.price || 0) * (item.quantity || 0), 0
  ).toFixed(2);

  const taxaEntregaPorBairro = {
    'Centro': 10.00,
    'José Walter': 3.00,
    'Planalto A.sena': 5.00,
    'Parque Dois Irmãos': 5.00,
    'Passaré': 5.00,
    'Maraponga': 7.00,
    'Cidade nova': 5.00,
    'Mondubim': 6.00
  };

  const taxaEntrega = taxaEntregaPorBairro[selectedBairro] || 0;
  const totalComEntrega = (parseFloat(total) + taxaEntrega).toFixed(2);

  const chavePix = '60537908340';
  const titularConta = 'Mailson Avila Gouveia';
  const banco = 'BCO C6 S.A.';

  const CASHIER_PHONE = '+5585988442407';

  const copiarChavePix = () => {
    Clipboard.setString(chavePix);
    Alert.alert('Chave Pix copiada!', 'Após o pagamento, confirme o pedido e envie o comprovante.');
  };

  const validarFormulario = () => {
    const camposObrigatorios = [];
    
    if (!name.trim()) camposObrigatorios.push('Nome');
    if (!street.trim()) camposObrigatorios.push('Rua');
    if (!houseNumber.trim()) camposObrigatorios.push('Número');
    if (!phone.trim()) camposObrigatorios.push('Telefone');
    if (!selectedBairro) camposObrigatorios.push('Bairro');
    if (!paymentMethod) camposObrigatorios.push('Forma de Pagamento');
    
    if (camposObrigatorios.length > 0) {
      Alert.alert(
        'Campos obrigatórios',
        `Preencha os seguintes campos:\n${camposObrigatorios.join('\n')}`
      );
      return false;
    }

    if (paymentMethod === 'Dinheiro' && !cashAmount.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o valor para o troco');
      return false;
    }

    return true;
  };

  const enviarParaWhatsApp = () => {
    const orderDetails = cart.map(item => 
      `${item.quantity}x ${item.name} - R$${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const mensagemCaixa = `*📄 PEDIDO #${numeroPedido}*\n
👤 **CLIENTE:** ${name}
📞 **TELEFONE:** ${phone}
📍 **ENDEREÇO:** ${street}, ${houseNumber}
🏘️ **BAIRRO:** ${selectedBairro}

💳 **FORMA DE PAGAMENTO:** ${paymentMethod}
${paymentMethod === 'Dinheiro' ? `💰 **TROCO PARA:** R$${cashAmount}\n` : ''}
📦 **ITENS:**
${orderDetails}

🧾 **VALORES:**
▫️ Subtotal: R$${total}
▫️ Taxa de Entrega: R$${taxaEntrega.toFixed(2)}
▫️ **TOTAL:** R$${totalComEntrega}`;

    const urlCaixa = `https://wa.me/${CASHIER_PHONE}?text=${encodeURIComponent(mensagemCaixa)}`;
    Linking.openURL(urlCaixa);
  };

  const handleCheckout = () => {
    if (!validarFormulario()) return;

    Alert.alert(
      'Confirmar Pedido',
      `Deseja enviar o pedido #${numeroPedido} para o caixa?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: enviarParaWhatsApp,
          style: 'destructive'
        }
      ]
    );
  };

  const isFormValido = 
    name.trim() && 
    street.trim() && 
    houseNumber.trim() && 
    phone.trim() && 
    selectedBairro && 
    paymentMethod && 
    (paymentMethod !== 'Dinheiro' || cashAmount.trim());

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Finalizar Pedido</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Nome Completo *" 
        value={name} 
        onChangeText={setName} 
      />
      
      <View style={styles.addressContainer}>
        <TextInput 
          style={[styles.input, styles.streetInput]} 
          placeholder="Rua *" 
          value={street} 
          onChangeText={setStreet} 
        />
        <TextInput 
          style={[styles.input, styles.numberInput]} 
          placeholder="Número *" 
          value={houseNumber} 
          onChangeText={setHouseNumber} 
          keyboardType="number-pad" 
        />
      </View>

      <TextInput 
        style={styles.input} 
        placeholder="Telefone *" 
        value={phone} 
        onChangeText={setPhone} 
        keyboardType="phone-pad" 
      />

      <Text style={styles.label}>Bairro *</Text>
      <Picker
        selectedValue={selectedBairro}
        style={styles.picker}
        onValueChange={setSelectedBairro}
      >
        <Picker.Item label="Selecione" value="" />
        <Picker.Item label="Centro" value="Centro" />
        <Picker.Item label="José Walter" value="José Walter" />
        <Picker.Item label="Planalto A.sena" value="Planalto A.sena" />
        <Picker.Item label="Parque Dois Irmãos" value="Parque Dois Irmãos" />
        <Picker.Item label="Passaré" value="Passaré" />
        <Picker.Item label="Maraponga" value="Maraponga" />
        <Picker.Item label="Cidade nova" value="Cidade nova" />
        <Picker.Item label="Mondubim" value="Mondubim" />
      </Picker>

      <Text style={styles.label}>Forma de Pagamento *</Text>
      <Picker
        selectedValue={paymentMethod}
        style={styles.picker}
        onValueChange={setPaymentMethod}
      >
        <Picker.Item label="Selecione" value="" />
        <Picker.Item label="Dinheiro" value="Dinheiro" />
        <Picker.Item label="Cartão" value="Cartão" />
        <Picker.Item label="Pix" value="Pix" />
      </Picker>

      {paymentMethod === 'Dinheiro' && (
        <TextInput
          style={styles.input}
          placeholder="Troco Para *"
          value={cashAmount}
          onChangeText={setCashAmount}
          keyboardType="numeric"
        />
      )}

      {paymentMethod === 'Pix' && (
        <View style={styles.pixContainer}>
          <Text style={styles.pixText}>Use a chave Pix abaixo para pagamento:</Text>
          <Text style={styles.pixCode}>{chavePix}</Text>
          <Text style={styles.pixInfo}>Titular: {titularConta}</Text>
          <Text style={styles.pixInfo}>Banco: {banco}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={copiarChavePix}>
            <Text style={styles.copyButtonText}>Copiar Chave Pix</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.totalsContainer}>
        <Text style={styles.totalText}>Subtotal: R$ {total}</Text>
        <Text style={styles.totalText}>Taxa de Entrega: R$ {taxaEntrega.toFixed(2)}</Text>
        <Text style={styles.finalTotalText}>Total: R$ {totalComEntrega}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !isFormValido && styles.disabledButton]}
        onPress={handleCheckout}
        disabled={!isFormValido}
      >
        <Text style={styles.buttonText}>✅ Confirmar pedido (#{numeroPedido})</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffa500',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addressContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  streetInput: {
    flex: 2,
  },
  numberInput: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#34495e',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalsContainer: {
    marginVertical: 15,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  totalText: {
    fontSize: 16,
    color: '#2c3e50',
    marginVertical: 4,
  },
  finalTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 8,
  },
  pixContainer: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  pixText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  pixCode: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    color: '#2980b9',
  },
  pixInfo: {
    textAlign: 'center',
    fontSize: 14,
    color: '#7f8c8d',
  },
  copyButton: {
    backgroundColor: '#c0392b',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});