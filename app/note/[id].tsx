import { useLocalSearchParams, router } from 'expo-router';
import React, { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { useNotes } from '@/hooks/use-notes';

const formatDate = (value?: string) => {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes, deleteNote, loaded } = useNotes();

  const note = useMemo(() => notes.find((item) => item.id === id), [notes, id]);

  const handleDelete = () => {
    if (!id) return;
    Alert.alert(
      'Eliminar nota',
      '¿Quieres eliminar esta nota? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteNote(id);
            router.replace('/');
          },
        },
      ],
    );
  };

  if (!loaded) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  if (!note) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>No se encontró la nota solicitada.</Text>
        <TouchableOpacity style={styles.linkButton} onPress={() => router.replace('/')}>
          <Text style={styles.linkButtonText}>Volver al listado</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: note.imageUri }} style={styles.image} contentFit="cover" />
        </View>

        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.dateLabel}>Actualizada: {formatDate(note.updatedAt)}</Text>
        <Text style={styles.description}>{note.description}</Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.primaryButton, { flex: 1 }]}
            onPress={() => router.push(`/edit/${note.id}`)}>
            <Text style={styles.primaryButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.deleteButton, { flex: 1 }]} onPress={handleDelete}>
            <Text style={styles.deleteText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1928',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1f3552',
    backgroundColor: '#15263c',
  },
  image: {
    width: '100%',
    height: 280,
  },
  title: {
    color: '#f2f5f9',
    fontSize: 22,
    fontWeight: '700',
  },
  dateLabel: {
    color: '#8aa2c0',
    fontSize: 13,
  },
  description: {
    color: '#c7d5e0',
    fontSize: 15,
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#8BE9FD',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#0b1220',
    fontWeight: '700',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#1f2a3a',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#c44f4f',
    alignItems: 'center',
  },
  deleteText: {
    color: '#ff8b8b',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyText: {
    color: '#c7d5e0',
    textAlign: 'center',
    marginTop: 40,
  },
  linkButton: {
    marginTop: 12,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f3552',
  },
  linkButtonText: {
    color: '#8BE9FD',
    fontWeight: '600',
  },
});
