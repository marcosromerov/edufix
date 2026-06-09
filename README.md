# EduFix · App de gestión de incidencias edilicias

App React Native con **Expo SDK 54** + Expo Router + NativeWind v4. UI completa con datos mockeados.

## Cómo correr

Necesitás **Node.js 18+** y la app de **Expo Go** en el teléfono (versión compatible con SDK 54).

```bash
npm install
npx expo start
```

Te aparece un QR en la terminal. Escaneálo con Expo Go (Android) o con la cámara (iOS).

> Si tira problemas con caché después del primer arranque: `npx expo start --clear`

## Versiones (SDK 54)

- Expo 54 · React Native 0.81 · React 19.1
- Expo Router 6
- NativeWind v4.2 + Tailwind 3.4.17
- Reanimated 4.1 (con `react-native-worklets`)
- New Architecture **habilitada** (obligatorio en SDK 54)

## Cómo probar los 3 roles

En la pantalla de **Login** hay un selector de rol (solo para la demo). Elegís uno y le das "Ingresar". Para cambiar: Perfil → Cerrar sesión → Login con otro.

- **Reportador** (Alejandro Moreno) — reporta incidencias, ve estado
- **Jefe de depto.** (Julián Medina) — gestiona, asigna, rechaza
- **Operario** (Ramiro Mendez) — resuelve y avanza estados

## Estructura

```
app/                       ← rutas (Expo Router file-based)
  (auth)/                  ← login, register
  (reportador)/(tabs)/     ← inicio, incidencias, escanear, notif, perfil
  (jefe)/(tabs)/           ← panel, incidencias, equipo, perfil
  (operario)/(tabs)/       ← incidencias, perfil
  incidencia/[id].tsx      ← detalle (cambia call-to-action por rol)
  modals/                  ← nuevo reporte, editar perfil, gestionar, asignar, configurar depto
  _layout.tsx              ← layout raíz (importa global.css)
  index.tsx                ← redirige según sesión

components/
  ui/                      ← Button, Card, Input, Pills, Logo, ScreenHeader, etc.
  IncidentCard.tsx
  MapPlaceholder.tsx       ← SVG inline, sin react-native-maps

data/                      ← mocks: users, incidents, extras, types
hooks/                     ← useSession
global.css                 ← directivas tailwind (NativeWind v4 lo necesita)
```

## Conectar un backend más adelante

Los mocks están en `data/`. Reemplazás esas funciones por llamadas `fetch` (o React Query / SWR) y las pantallas siguen funcionando, consumen los datos como si fueran async-ready.

## Troubleshooting

- **"NativeWind no aplica estilos":** `npx expo start --clear` para limpiar caché de Metro.
- **"Mismatched worklets version":** asegurate de no haber tocado las versiones de `react-native-reanimated` o `react-native-worklets` en `package.json`. Si ya pasó, borrá `node_modules` y `package-lock.json` y reinstalá.
- **Versión vieja de Expo Go:** SDK 54 necesita Expo Go actualizado. Actualizá desde Play Store / App Store.
