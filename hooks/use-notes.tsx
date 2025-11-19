import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type PhotoNote = {
  id: string;
  title: string;
  description: string;
  imageUri: string;
  updatedAt: string;
};

type NoteInput = {
  title: string;
  description: string;
  imageUri: string;
};

type NotesContextValue = {
  notes: PhotoNote[];
  loaded: boolean;
  addNote: (data: NoteInput) => Promise<PhotoNote>;
  updateNote: (id: string, data: NoteInput) => Promise<PhotoNote | null>;
  deleteNote: (id: string) => Promise<void>;
  reload: () => Promise<void>;
};

const STORAGE_KEY = 'photo-notes';

const NotesContext = createContext<NotesContextValue | null>(null);

const persistNotes = (next: PhotoNote[]) => {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((error) => {
    console.warn('No se pudo guardar en AsyncStorage', error);
  });
};

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<PhotoNote[]>([]);
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PhotoNote[];
        setNotes(parsed);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.warn('No se pudieron leer las notas guardadas', error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addNote = useCallback(async ({ title, description, imageUri }: NoteInput) => {
    const newNote: PhotoNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      description,
      imageUri,
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => {
      const next = [newNote, ...prev];
      persistNotes(next);
      return next;
    });

    return newNote;
  }, []);

  const updateNote = useCallback(async (id: string, { title, description, imageUri }: NoteInput) => {
    let updated: PhotoNote | null = null;
    setNotes((prev) => {
      const next = prev.map((note) => {
        if (note.id === id) {
          updated = {
            ...note,
            title,
            description,
            imageUri,
            updatedAt: new Date().toISOString(),
          };
          return updated;
        }
        return note;
      });
      persistNotes(next);
      return next;
    });
    return updated;
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    setNotes((prev) => {
      const next = prev.filter((note) => note.id !== id);
      persistNotes(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      notes,
      loaded,
      addNote,
      updateNote,
      deleteNote,
      reload,
    }),
    [notes, loaded, addNote, updateNote, deleteNote, reload],
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error('useNotes debe usarse dentro de NotesProvider');
  }
  return ctx;
}
