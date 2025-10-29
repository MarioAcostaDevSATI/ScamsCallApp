import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import styles from '../styles/ReportStyles';

const ReportScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [reportType, setReportType] = useState('estafa');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para adjuntar imágenes.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara para tomar fotos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const submitReport = async () => {
    if (!phone || !description) {
      Alert.alert('Error', 'Por favor complete todos los campos requeridos.');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('phone_number', phone);
    formData.append('description', description);
    formData.append('report_type', reportType);
    formData.append('location', location);
    
    if (image) {
      formData.append('evidence', {
        uri: image,
        type: 'image/jpeg',
        name: 'evidence.jpg'
      });
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${await getAuthToken()}`
        }
      });

      Alert.alert(
        'Éxito',
        `Reporte enviado correctamente.\nCódigo: ${response.data.data.tracking_code}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

      // Limpiar formulario
      setPhone('');
      setDescription('');
      setImage(null);
      setLocation('');

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo enviar el reporte. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Número telefónico */}
        <Text style={styles.label}>Número del estafador *</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+57 312 345 6789"
          keyboardType="phone-pad"
        />

        {/* Tipo de reporte */}
        <Text style={styles.label}>Tipo de estafa *</Text>
        <View style={styles.radioGroup}>
          {['estafa', 'extorsion', 'phishing', 'otros'].map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.radioOption}
              onPress={() => setReportType(type)}
            >
              <View style={styles.radioCircle}>
                {reportType === type && <View style={styles.selectedRadio} />}
              </View>
              <Text style={styles.radioText}>
                {type === 'estafa' ? 'Estafa financiera' :
                 type === 'extorsion' ? 'Extorsión' :
                 type === 'phishing' ? 'Phishing' : 'Otros'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Descripción */}
        <Text style={styles.label}>Descripción *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describa en detalle lo ocurrido..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Ubicación */}
        <Text style={styles.label}>Ubicación</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Ciudad o municipio"
        />

        {/* Adjuntar imagen */}
        <Text style={styles.label}>Captura de pantalla</Text>
        <View style={styles.imageButtons}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>Galería</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
            <Text style={styles.imageButtonText}>Cámara</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <Image source={{ uri: image }} style={styles.previewImage} />
        )}

        {/* Botón de envío */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={submitReport}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Enviar Reporte</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Al enviar este reporte, acepta nuestros términos de uso y política de privacidad.
          Su información está protegida bajo la Ley 1581 de 2012.
        </Text>
      </View>
    </ScrollView>
  );
};

// Función auxiliar para obtener token (implementar después)
const getAuthToken = async () => {
  return 'temp_token';
};

export default ReportScreen;
