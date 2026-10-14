import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const COLORS = {
  primary: '#4C9A2A',
  dark: '#1E5631',
  gray: '#6E7A80',
};

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Museo CUCEI</Text>
      <Text style={styles.subtitle}>Naturaleza, arte y tecnología en un solo lugar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  logo: { width: 220, height: 220, marginBottom: 12 },
  title: { fontSize: 30, fontWeight: 'bold', color: COLORS.dark },
  subtitle: { fontSize: 15, color: COLORS.gray, textAlign: 'center', marginTop: 8 },
});