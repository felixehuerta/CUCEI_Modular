import { Arbol, clave } from '@/types/arbol';

export const ARBOLES: Arbol[] = [
  {
    centro: 'RECT',
    seccion: '01',
    consecutivo: 1,
    fechaRegistro: '2025-11-12',
    especie: 'Magnolio',
    ubicacion: '20.674960, -103.358711',
    alturaM: 2.85,
    diametroCm: 40,
    fotoArbol: 'Rectoría_Images/1.Foto del Árbol',
    presentaDanios: false,
    estadoSalud: 'Óptimo',
    esConifera: false,
    comentarios: 'Prueba',
    requiereSupervision: false,
    biomasaTon: 0.1011471996,
    mitigacionCO2Ton: 0.1673564707,
  },
  {
    centro: 'RECT',
    seccion: '01',
    consecutivo: 3,
    fechaRegistro: '2025-11-13',
    especie: 'Ficus benjamina',
    ubicacion: '20.675272, -103.358651',
    alturaM: 4.2,
    diametroCm: 47.5,
    presentaDanios: false,
    estadoSalud: 'Bueno',
    esConifera: false,
    comentarios: 'Árbol de prueba 1',
    requiereSupervision: false,
    biomasaTon: 0.2101965242,
    mitigacionCO2Ton: 0.3001956693,
  },
];

/** Mañana esto será un fetch a la API. Hoy busca en memoria. */
export function buscarArbol(codigo: string): Arbol | undefined {
  return ARBOLES.find((a) => clave(a) === codigo.trim().toUpperCase());
}