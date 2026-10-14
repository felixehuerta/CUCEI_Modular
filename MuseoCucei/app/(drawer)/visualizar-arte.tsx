import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = { primary: '#4C9A2A', dark: '#1E5631', gray: '#6E7A80' };

export default function VisualizarArteScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons name="color-palette-outline" size={72} color={COLORS.primary} />
      <Text style={styles.titulo}>Visualizar arte</Text>
      <Text style={styles.info}>
        Escanea el código QR de un árbol para ver su obra en 3D y su ficha.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({ pathname: '/visor', params: { codigo: 'RECT-01-0001' } })}
      >
        <Ionicons name="cube-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Ver obra de prueba</Text>
      </TouchableOpacity>

      <Text style={styles.nota}>Modo de prueba: abre el visor sin escanear.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 32 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: COLORS.dark, marginTop: 16 },
  info: { fontSize: 15, color: COLORS.gray, textAlign: 'center', marginTop: 8, marginBottom: 28, lineHeight: 21 },
  button: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  nota: { fontSize: 12, color: COLORS.gray, marginTop: 20, fontStyle: 'italic' },
});