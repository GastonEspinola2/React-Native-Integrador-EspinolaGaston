# Notas Fotográficas (Expo)

Aplicación móvil en Expo/React Native para crear, ver, editar y eliminar notas basadas en fotos, con persistencia local en AsyncStorage y rutas con Expo Router.

## Requisitos
- Node 18+
- Expo CLI (`npx expo`)

## Instalación
```bash
npm install
```

## Ejecutar
```bash
npx expo start
```
Luego escanea el QR con Expo Go (o abre en emulador Android/iOS).

## Funcionalidades
- Crear nota: título, descripción, foto desde cámara (expo-camera) o galería (expo-image-picker).
- Listado en `/index` con miniatura y título.
- Detalle en `/note/[id]` con opción de eliminar (confirmación).
- Edición en `/edit/[id]` para actualizar texto y reemplazar foto.
- Persistencia local: las notas se guardan/leen de AsyncStorage en cada operación.

## Estructura de rutas
- `app/index.tsx` – lista de notas.
- `app/create.tsx` – formulario de creación.
- `app/note/[id].tsx` – detalle.
- `app/edit/[id].tsx` – edición.
- `hooks/use-notes.tsx` – estado global y persistencia.

## Notas
- Habilita permisos de cámara/galería en el dispositivo.
- Si hay problemas con el bundle, ejecuta `npx expo start --clear`.
