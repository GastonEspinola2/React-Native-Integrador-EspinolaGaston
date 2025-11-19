import { Link, router } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNotes } from '@/hooks/use-notes';

const formatDate = (value: string) => {
  try {
    const date = new Date(value);
    return date.toLocaleString();
  } catch {
    return value;
  }
};

export default function NotesListScreen() {
  const { notes, loaded } = useNotes();

  const data = useMemo(
    () => [...notes].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
    [notes],
  );

  if (!loaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color="#8BE9FD" size="large" />
        <Text style={styles.loadingText}>Cargando notas guardadas...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis notas fotográficas</Text>
        <Link href="/create" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Crear nueva</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={data.length === 0 ? styles.emptyList : styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/note/${item.id}`)}
            activeOpacity={0.8}>
            <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title || 'Sin título'}
              </Text>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {item.description || 'Sin descripción'}
              </Text>
              <Text style={styles.cardDate}>Actualizada: {formatDate(item.updatedAt)}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Aún no hay notas</Text>
            <Text style={styles.emptyText}>
              Crea tu primera nota fotográfica para empezar a organizar tus ideas con imágenes.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1928',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f1928',
    gap: 12,
  },
  loadingText: {
    color: '#c7d5e0',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 10,
  },
  title: {
    color: '#f2f5f9',
    fontSize: 22,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#8BE9FD',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#0b1220',
    fontWeight: '700',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#15263c',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1f3552',
  },
  thumbnail: {
    width: 100,
    height: 100,
    backgroundColor: '#253a53',
  },
  cardBody: {
    flex: 1,
    padding: 12,
    gap: 6,
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#f2f5f9',
    fontSize: 16,
    fontWeight: '700',
  },
  cardDescription: {
    color: '#c7d5e0',
    fontSize: 13,
  },
  cardDate: {
    color: '#8aa2c0',
    fontSize: 12,
  },
  emptyList: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyTitle: {
    color: '#f2f5f9',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    color: '#c7d5e0',
    textAlign: 'center',
    lineHeight: 20,
  },
});
