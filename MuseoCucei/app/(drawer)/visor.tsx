import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import modeloBase64 from '@/models/modeloBase64';
import { buscarArbol } from '@/data/arbolesMock';

const C = { primary: '#4C9A2A', accent: '#7AC143', dark: '#1E5631', gray: '#6E7A80', soft: '#EAF4E2', alerta: '#C7702B' };

const html = `
<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
<style>html,body{margin:0;height:100%;background:#EAF4E2}model-viewer{width:100%;height:100%}</style>
</head><body>
<model-viewer src="data:model/gltf-binary;base64,${modeloBase64}"
  camera-controls auto-rotate shadow-intensity="1" exposure="1"></model-viewer>
</body></html>`;

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={styles.fila}>
      <Text style={styles.etiquetaFila}>{etiqueta}</Text>
      <Text style={styles.valorFila}>{valor}</Text>
    </View>
  );
}

export default function VisorScreen() {
  const { codigo } = useLocalSearchParams<{ codigo: string }>();
  const arbol = codigo ? buscarArbol(codigo) : undefined;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.lienzo}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={{ flex: 1, backgroundColor: C.soft }}
          javaScriptEnabled
          domStorageEnabled
        />
      </View>

      {!arbol ? (
        <View style={styles.tarjeta}>
          <Text style={styles.etiqueta}>Código escaneado</Text>
          <Text style={styles.codigo}>{codigo ?? 'sin código'}</Text>
          <Text style={styles.info}>No se encontró ningún árbol con este código.</Text>
        </View>
      ) : (
        <>
          <View style={styles.encabezado}>
            <Text style={styles.especie}>{arbol.especie}</Text>
            <View style={styles.chip}>
              <Text style={styles.chipTexto}>{codigo}</Text>
            </View>
          </View>

          <View style={styles.medidas}>
            <View style={styles.medida}>
              <Text style={styles.medidaNum}>{arbol.alturaM} m</Text>
              <Text style={styles.medidaTxt}>Altura</Text>
            </View>
            <View style={styles.medida}>
              <Text style={styles.medidaNum}>{arbol.diametroCm} cm</Text>
              <Text style={styles.medidaTxt}>Diámetro</Text>
            </View>
            <View style={styles.medida}>
              <Text style={styles.medidaNum}>{arbol.mitigacionCO2Ton.toFixed(2)} t</Text>
              <Text style={styles.medidaTxt}>CO₂ mitigado</Text>
            </View>
          </View>

          <View style={styles.tarjeta}>
            <Text style={styles.etiqueta}>Ficha del árbol</Text>
            <Dato etiqueta="Estado de salud" valor={arbol.estadoSalud} />
            <Dato etiqueta="Presenta daños" valor={arbol.presentaDanios ? 'Sí' : 'No'} />
            <Dato etiqueta="Requiere supervisión" valor={arbol.requiereSupervision ? 'Sí' : 'No'} />
            <Dato etiqueta="Conífera" valor={arbol.esConifera ? 'Sí' : 'No'} />
            <Dato etiqueta="Biomasa total" valor={`${arbol.biomasaTon.toFixed(3)} t`} />
            <Dato etiqueta="Ubicación" valor={arbol.ubicacion} />
            <Dato etiqueta="Fecha de registro" valor={arbol.fechaRegistro} />
          </View>

          {arbol.comentarios ? (
            <View style={styles.tarjeta}>
              <Text style={styles.etiqueta}>Comentarios</Text>
              <Text style={styles.info}>{arbol.comentarios}</Text>
            </View>
          ) : null}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', paddingBottom: 40 },
  lienzo: { height: 320, borderRadius: 16, overflow: 'hidden', marginBottom: 20, borderWidth: 2, borderColor: '#D5E6C7' },
  encabezado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 },
  especie: { fontSize: 24, fontWeight: 'bold', color: C.dark, flexShrink: 1 },
  chip: { backgroundColor: C.dark, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  chipTexto: { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  medidas: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  medida: { flex: 1, backgroundColor: C.soft, borderRadius: 12, padding: 12, alignItems: 'center' },
  medidaNum: { fontSize: 17, fontWeight: 'bold', color: C.primary },
  medidaTxt: { fontSize: 11, color: C.gray, marginTop: 2, textAlign: 'center' },
  tarjeta: { backgroundColor: C.soft, borderRadius: 12, padding: 16, marginBottom: 14 },
  etiqueta: { fontSize: 12, color: C.gray, textTransform: 'uppercase', fontWeight: '700', marginBottom: 10 },
  codigo: { fontSize: 18, color: C.dark, fontWeight: 'bold', marginBottom: 6 },
  info: { fontSize: 14, color: C.dark, lineHeight: 20 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#D9E8CC', gap: 12 },
  etiquetaFila: { fontSize: 13, color: C.gray, flexShrink: 0 },
  valorFila: { fontSize: 13, color: C.dark, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
});