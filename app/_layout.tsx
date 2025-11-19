import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

import { NotesProvider } from '@/hooks/use-notes';

export default function RootLayout() {
  return (
    <NotesProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0d1726' },
          headerTintColor: '#ffffff',
          contentStyle: { backgroundColor: '#0f1928' },
        }}>
        <Stack.Screen name="index" options={{ title: 'Notas Fotograficas' }} />
        <Stack.Screen name="create" options={{ title: 'Nueva Nota' }} />
        <Stack.Screen
          name="note/[id]"
          options={{
            title: 'Detalle',
          }}
        />
        <Stack.Screen name="edit/[id]" options={{ title: 'Editar Nota' }} />
      </Stack>
      <StatusBar style="light" />
    </NotesProvider>
  );
}
