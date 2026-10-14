import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView, Platform,
  StyleSheet,
  Text, TextInput, TouchableOpacity
} from 'react-native';

const COLORS = {
  primary: '#4C9A2A',
  accent: '#7AC143',
  dark: '#1E5631',
  soft: '#EAF4E2',
  gray: '#6E7A80',
};

export default function LoginScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Museo CUCEI</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario o correo"
        placeholderTextColor={COLORS.gray}
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={COLORS.gray}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/home')}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', paddingHorizontal: 28 },
  logo: { width: 150, height: 150, alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: 'bold', color: COLORS.dark, textAlign: 'center' },
  subtitle: { fontSize: 14, color: COLORS.gray, textAlign: 'center', marginBottom: 28 },
  input: {
    borderWidth: 1, borderColor: '#D5E6C7', borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15,
    marginBottom: 14, backgroundColor: COLORS.soft, color: COLORS.dark,
  },
  button: {
    backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 10,
    alignItems: 'center', marginTop: 6,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: COLORS.primary, textAlign: 'center', marginTop: 18, fontSize: 14, fontWeight: '600' },
});