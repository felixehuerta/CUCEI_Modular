import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ARBOLES } from '@/data/arbolesMock';
import { clave } from '@/types/arbol';

const C = { primary: '#4C9A2A', dark: '#1E5631', gray: '#6E7A80', soft: '#EAF4E2' };

export default function ArbolesRecientesScreen() {
  const router = useRouter();

  return (
    <FlatList
      style={{ backgroundColor: '#fff' }}
      contentContainerStyle={{ padding: 16 }}
      data={ARBOLES}
      keyExtractor={(a) => clave(a)}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push({ pathname: '/visor', params: { codigo: clave(item) } })}
        >
          <View style={styles.icono}>
            <Ionicons name="leaf" size={22} color={C.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.especie}>{item.especie}</Text>
            <Text style={styles.meta}>{clave(item)} · {item.alturaM} m · {item.estadoSalud}</Text>
            <Text style={styles.fecha}>Registrado el {item.fechaRegistro}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={C.gray} />
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text style={styles.vacio}>Aún no has escaneado ningún árbol.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.soft, borderRadius: 12, padding: 14, marginBottom: 10,
  },
  icono: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  especie: { fontSize: 16, fontWeight: 'bold', color: C.dark },
  meta: { fontSize: 12, color: C.primary, marginTop: 2, fontWeight: '600' },
  fecha: { fontSize: 11, color: C.gray, marginTop: 2 },
  vacio: { textAlign: 'center', color: C.gray, marginTop: 40 },
});