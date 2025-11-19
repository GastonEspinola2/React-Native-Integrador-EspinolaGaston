import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { useNotes } from '@/hooks/use-notes';

export default function CreateNoteScreen() {
  const { addNote } = useNotes();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const ensureCameraPermission = async () => {
    if (permission?.granted) return true;
    const { granted } = await requestPermission();
    if (!granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a la camara para tomar una foto.');
    }
    return granted;
  };

  const handleCapture = async () => {
    try {
      const hasPermission = await ensureCameraPermission();
      if (!hasPermission) return;
      setShowCamera(true);
    } catch (error) {
      console.warn('No se pudo abrir la camara', error);
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (photo?.uri) {
        setImageUri(photo.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo capturar la foto. Intenta de nuevo.');
    } finally {
      setShowCamera(false);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tus fotos para elegir una imagen.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Titulo requerido', 'Agrega un titulo para tu nota.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Descripcion requerida', 'Agrega una descripcion para tu nota.');
      return;
    }
    if (!imageUri) {
      Alert.alert('Imagen requerida', 'Captura o selecciona una imagen para la nota.');
      return;
    }
    try {
      setSaving(true);
      await addNote({
        title: title.trim(),
        description: description.trim(),
        imageUri,
      });
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la nota.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.previewBox}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} contentFit="cover" />
            ) : (
              <Text style={styles.previewPlaceholder}>Toma una foto o elige una imagen</Text>
            )}
          </View>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.secondaryButton, { flex: 1 }]} onPress={handleCapture}>
              <Text style={styles.secondaryButtonText}>Abrir camara</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryButton, { flex: 1 }]}
              onPress={pickFromGallery}>
              <Text style={styles.secondaryButtonText}>Elegir galeria</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Titulo</Text>
            <TextInput
              style={styles.input}
              placeholder="Paseo al atardecer"
              placeholderTextColor="#6f819d"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Descripcion</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Notas, contexto y recordatorios..."
              placeholderTextColor="#6f819d"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}>
            <Text style={styles.primaryButtonText}>{saving ? 'Guardando...' : 'Guardar nota'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {showCamera && (
        <View style={styles.cameraOverlay}>
          <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.captureButton} onPress={takePhoto} />
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCamera(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      )}
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
    gap: 16,
  },
  previewBox: {
    height: 240,
    borderRadius: 16,
    backgroundColor: '#15263c',
    borderWidth: 1,
    borderColor: '#1f3552',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    color: '#6f819d',
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  field: {
    gap: 8,
  },
  label: {
    color: '#c7d5e0',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#15263c',
    borderRadius: 12,
    padding: 14,
    color: '#f2f5f9',
    borderWidth: 1,
    borderColor: '#1f3552',
  },
  textarea: {
    textAlignVertical: 'top',
    height: 140,
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
  secondaryButton: {
    backgroundColor: '#1a2b43',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#284366',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#c7d5e0',
    fontWeight: '600',
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '90%',
    height: '70%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 14,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#ffffffaa',
    borderWidth: 6,
    borderColor: '#0b1220',
  },
  cancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#0b1220cc',
    borderRadius: 10,
  },
  cancelText: {
    color: '#f2f5f9',
    fontWeight: '600',
  },
});
