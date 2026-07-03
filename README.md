# 🌳 Museo CUCEI

**Aplicación móvil de realidad aumentada y códigos QR para transformar los espacios verdes del campus en una experiencia cultural interactiva.**

Museo CUCEI permite a la comunidad del Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI) —y potencialmente de toda la Red Universitaria de la Universidad de Guadalajara (UDG)— escanear códigos QR colocados en los árboles del campus para visualizar, en realidad aumentada, obras artísticas creadas por estudiantes.

---

## 📖 Tabla de contenido

- [Descripción del proyecto](#-descripción-del-proyecto)
- [Características principales](#-características-principales)
- [Arquitectura](#-arquitectura)
- [Roles de usuario](#-roles-de-usuario)
- [Stack tecnológico](#-stack-tecnológico)
- [Estructura del repositorio](#-estructura-del-repositorio)
- [Modelo de datos](#-modelo-de-datos)
- [API — Rutas del Worker](#-api--rutas-del-worker)
- [Instalación y configuración](#-instalación-y-configuración)
- [Flujo de aprobación de contenido](#-flujo-de-aprobación-de-contenido)
- [Plan de implementación](#-plan-de-implementación)
- [Documentación académica](#-documentación-académica)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Autores](#-autores)
- [Licencia](#-licencia)

---

## 🎯 Descripción del proyecto

Cada árbol del campus cuenta con un código QR físico que funciona simultáneamente como:

1. **Identificador único** del árbol (ficha botánica, ubicación, descripción).
2. **Marcador de realidad aumentada** (`ImageTracker`) sobre el cual se superpone la obra artística aprobada para ese árbol.

Los estudiantes proponen imágenes artísticas asociadas a un árbol específico; un administrador del Centro Universitario revisa, aprueba o rechaza la propuesta, y una vez aprobada, la obra se publica y queda visible en RA para cualquier visitante que escanee el QR correspondiente.

## ✨ Características principales

- 📱 App móvil multiplataforma (Android / iOS) con React Native + Expo.
- 🔳 Escaneo de códigos QR como identificador de árbol y marcador de RA.
- 🖼️ Visualización de arte estudiantil en realidad aumentada con ViroReact.
- 🔐 Autenticación sin fricción basada en dominio de correo institucional (Cloudflare Access).
- 🧑‍🎨 Flujo de propuesta → revisión → aprobación de contenido artístico.
- 🏫 Arquitectura multi-centro: cada administrador gestiona únicamente los árboles de su propio CU.
- ☁️ Infraestructura 100% *serverless* (Cloudflare Workers, D1 y R2), operable dentro de los niveles gratuitos.
- 📊 Registro de escaneos con fines analíticos.

## 🏗️ Arquitectura

El sistema se organiza en cinco capas funcionales:

```
┌─────────────────────────────┐
│   Cliente móvil              │
│   React Native + Expo +      │
│   ViroReact                  │
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│   Autenticación               │
│   Cloudflare Access (OTP)     │
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│   API                         │
│   Cloudflare Worker           │
└───────┬───────────────┬──────┘
        │                │
┌───────▼──────┐  ┌──────▼────────┐
│ Base de datos │  │ Almacenamiento │
│ Cloudflare D1 │  │ Cloudflare R2  │
└───────────────┘  └────────────────┘
```

El módulo de realidad aumentada usa el código QR físico como `ViroARImageMarker`: al detectarlo, la app recupera la URL del *asset* artístico asociado y lo superpone sobre el árbol en tiempo real.

## 👥 Roles de usuario

| Rol | Nivel | Acceso | Permisos |
|---|---|---|---|
| **Visitante** | 1 | Cuenta compartida automática, sin login | Escanear QR, ver info del árbol, ver obra en RA |
| **Estudiante** | 2 | Correo `@alumnos.udg.mx` | Todo lo del visitante + enviar propuestas de imagen |
| **Administrador** | 7 | Correo `@udg.mx` o `@alumnos.udg.mx` | Todo lo anterior + aprobar/rechazar propuestas, asignar imágenes, alta/edición de árboles de su CU |

> Cada administrador opera únicamente dentro del alcance (`scope`) de su propio Centro Universitario.

## 🧰 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Cliente móvil | React Native + Expo |
| Realidad aumentada | [ViroReact](https://github.com/ViroCommunity/viro) (`@viro-community/react-viro`) |
| Escaneo de QR | `expo-barcode-scanner` |
| Almacenamiento seguro (JWT) | `expo-secure-store` |
| Navegación | `@react-navigation/native` |
| Notificaciones | `expo-notifications` |
| Autenticación | Cloudflare Access (OTP por correo) |
| API | Cloudflare Workers |
| Base de datos | Cloudflare D1 (SQLite serverless) |
| Almacenamiento de objetos | Cloudflare R2 |

## 📁 Estructura del repositorio

```
museo-cucei/
├── app/                        # Cliente React Native (Expo)
│   ├── src/
│   │   ├── screens/
│   │   │   ├── ARScreen.jsx
│   │   │   ├── ScannerScreen.jsx
│   │   │   └── ProposalScreen.jsx
│   │   ├── services/
│   │   │   └── treeService.js
│   │   └── navigation/
│   ├── app.json
│   └── package.json
├── worker/                     # API en Cloudflare Workers
│   ├── src/
│   │   └── index.js
│   ├── schema.sql               # Esquema de la base de datos D1
│   └── wrangler.toml
├── docs/                        # Documentación del proyecto
│   └── museo_cucei_ieee.pdf     # Reporte académico formato IEEE
└── README.md
```

## 🗄️ Modelo de datos

El sistema usa 5 tablas principales sobre Cloudflare D1:

- **`centros`** — catálogo de Centros Universitarios de la red UDG.
- **`arboles`** — metadatos botánicos, ubicación, imagen aprobada y *asset* de RA.
- **`usuarios`** — correo institucional, rol y centro de adscripción.
- **`propuestas`** — ciclo de vida de cada imagen enviada por un estudiante (`pendiente` / `aprobada` / `rechazada`).
- **`escaneos`** — registro de interacciones con fines analíticos.

```sql
CREATE TABLE propuestas (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  arbol_id          TEXT REFERENCES arboles(id),
  estudiante_id     TEXT REFERENCES usuarios(id),
  imagen_url        TEXT,
  estado            TEXT CHECK(estado IN ('pendiente','aprobada','rechazada')),
  comentario        TEXT,
  fecha_envio       TEXT,
  fecha_resolucion  TEXT
);
```

El esquema completo está disponible en [`worker/schema.sql`](./worker/schema.sql).

## 🔌 API — Rutas del Worker

| Método | Ruta | Rol requerido | Descripción |
|---|---|---|---|
| `GET` | `/arbol/:id` | ≥ 1 | Información pública de un árbol |
| `GET` | `/arboles` | ≥ 1 | Listado de árboles por Centro Universitario |
| `POST` | `/propuesta` | ≥ 2 | Enviar una imagen artística |
| `GET` | `/propuestas` | = 7 | Consultar propuestas pendientes |
| `PUT` | `/aprobar/:id` | = 7 | Aprobar una propuesta |
| `PUT` | `/rechazar/:id` | = 7 | Rechazar una propuesta |
| `POST` | `/arbol` | = 7 | Registrar un nuevo árbol |
| `PUT` | `/arbol/:id` | = 7 | Editar un árbol existente |

## ⚙️ Instalación y configuración

### Requisitos previos

- Node.js ≥ 18
- Cuenta de [Cloudflare](https://dash.cloudflare.com/) (Workers, D1 y R2)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Wrangler CLI (`npm install -g wrangler`)

### 1. Clonar el repositorio

```bash
git clone https://github.com/<usuario>/museo-cucei.git
cd museo-cucei
```

### 2. Configurar el backend (Cloudflare Worker)

```bash
cd worker
npm install
wrangler d1 create cucei-db
wrangler d1 execute cucei-db --file=./schema.sql
```

Configura `wrangler.toml` con los IDs de tu base de datos D1 y tu bucket R2:

```toml
name = "cucei-api"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "cucei-db"
database_id = "TU-ID-D1-AQUI"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "cucei-assets"

[vars]
JWT_SECRET = "TU-SECRET-AQUI"
```

Despliega el Worker:

```bash
wrangler deploy
```

### 3. Configurar el cliente móvil

```bash
cd app
npm install
```

Actualiza la URL base del API en `src/services/treeService.js`:

```js
const BASE_URL = 'https://api-cucei.TU-USUARIO.workers.dev'
```

Ejecuta la app en modo desarrollo:

```bash
npx expo start
```

## 🔄 Flujo de aprobación de contenido

1. El **estudiante** envía una propuesta de imagen asociada a un árbol (`POST /propuesta`).
2. La propuesta se guarda con estado `pendiente` y la imagen se aloja temporalmente en `/arboles/pendientes/` en R2.
3. El **administrador** de ese Centro Universitario revisa la propuesta (`GET /propuestas`) y decide aprobarla o rechazarla.
4. Si se aprueba, el Worker mueve la imagen a `/arboles/aprobadas/`, genera el *asset* de RA (1024×1024 px, PNG con fondo transparente) en `/arboles/ar-assets/` y actualiza el árbol correspondiente.

## 🗓️ Plan de implementación

| Semana | Actividad |
|---|---|
| 1 | Setup del proyecto, navegación, pantallas base |
| 2 | Escáner QR + integración con Worker y D1 |
| 3 | Login con Cloudflare Access + control de roles |
| 4 | Flujo de propuesta de imágenes (estudiante + admin) |
| 5 | Integración de ViroReact + RA sobre el QR |
| 6 | Pruebas en campus, correcciones y despliegue final |

## 📄 Documentación académica

El reporte formal del proyecto, redactado bajo el estándar **IEEE** para investigaciones académicas, se encuentra en [`docs/museo_cucei_ieee.pdf`](./docs/museo_cucei_ieee.pdf), junto con su fuente en LaTeX ([`docs/museo_cucei_ieee.tex`](./docs/museo_cucei_ieee.tex)).

## 🛣️ Roadmap

- [ ] Panel web de analítica para administradores (basado en la tabla `escaneos`)
- [ ] Notificaciones push al administrador cuando llega una nueva propuesta
- [ ] Soporte multi-idioma (español / inglés)
- [ ] Extensión a otros Centros Universitarios de la red UDG
- [ ] Modo offline para consulta de fichas botánicas

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para colaborar:

1. Haz un *fork* del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz *commit* (`git commit -m 'Agrega nueva funcionalidad'`).
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un *Pull Request*.

## 👨‍💻 Autores

- **Estrada Huerta Félix Eduardo**
- **Hernández Ruvalcaba Dania Jazmín**
- **Alan Eduardo**

Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI) — Universidad de Guadalajara.

## 📜 Licencia

Este proyecto se distribuye bajo la licencia [MIT](./LICENSE). Puedes usar, modificar y distribuir el código citando a los autores originales.