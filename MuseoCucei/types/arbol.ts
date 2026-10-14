export type EstadoSalud = 'Óptimo' | 'Bueno' | 'Regular' | 'Malo' | 'Crítico';

export interface Arbol {
  // Llave compuesta
  centro: string;        // 'RECT', 'CUCEI', 'CUCEA'
  seccion: string;       // '01', 'II'
  consecutivo: number;   // 1, 2, 3...

  fechaRegistro: string;
  especie: string;
  ubicacion: string;          // "lat, lon"
  alturaM: number;
  diametroCm: number;
  fotoArbol?: string;
  capturaApp?: string;
  presentaDanios: boolean;
  estadoSalud: EstadoSalud;
  esConifera: boolean;        // pinos, abetos, alerces, falsos tsugas
  comentarios?: string;
  requiereSupervision: boolean;
  biomasaTon: number;
  mitigacionCO2Ton: number;
}

/** Construye la llave compuesta: RECT-01-0001 */
export function clave(a: Pick<Arbol, 'centro' | 'seccion' | 'consecutivo'>): string {
  return `${a.centro}-${a.seccion}-${String(a.consecutivo).padStart(4, '0')}`;
}

/** Descompone la llave leída del QR */
export function parsearClave(codigo: string) {
  const partes = codigo.trim().toUpperCase().split('-');
  if (partes.length < 3) return null;
  const consecutivo = Number(partes[partes.length - 1]);
  if (Number.isNaN(consecutivo)) return null;
  return {
    centro: partes[0],
    seccion: partes.slice(1, -1).join('-'),
    consecutivo,
  };
}