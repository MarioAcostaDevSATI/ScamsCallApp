import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import { Shield, AlertTriangle, BarChart, Users, Phone } from 'lucide-react-native';

const HomeScreen = ({ navigation }) => {
  const stats = [
    { label: 'Reportes', value: '1,200+' },
    { label: 'Números', value: '850+' },
    { label: 'Ciudades', value: '25+' },
    { label: 'Prevenidas', value: '300+' },
  ];

  const features = [
    {
      icon: <AlertTriangle size={24} color="#3b82f6" />,
      title: 'Reporte Rápido',
      description: 'Reporta estafas en menos de 2 minutos'
    },
    {
      icon: <BarChart size={24} color="#3b82f6" />,
      title: 'Estadísticas',
      description: 'Datos actualizados en tiempo real'
    },
    {
      icon: <Users size={24} color="#3b82f6" />,
      title: 'Comunidad',
      description: 'Protege a otros colombianos'
    },
    {
      icon: <Shield size={24} color="#3b82f6" />,
      title: 'Seguro',
      description: 'Protección de datos garantizada'
    },
  ];

  const handleEmergencyCall = () => {
    Linking.openURL('tel:123');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Shield size={48} color="#3b82f6" />
        <Text style={styles.heroTitle}>ScamsCall Colombia</Text>
        <Text style={styles.heroSubtitle}>
          Protegiendo a los colombianos de estafas telefónicas
        </Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Report')}
        >
          <Text style={styles.primaryButtonText}>Reportar Estafa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.secondaryButtonText}>Ver Estadísticas</Text>
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>¿Cómo Funciona?</Text>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={styles.featureIcon}>{feature.icon}</View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Emergency Section */}
      <View style={styles.emergencySection}>
        <AlertTriangle size={32} color="#dc2626" />
        <Text style={styles.emergencyTitle}>¿Estás en Peligro?</Text>
        <Text style={styles.emergencyText}>
          Contacta inmediatamente a las autoridades
        </Text>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergencyCall}
        >
          <Phone size={20} color="#fff" />
          <Text style={styles.emergencyButtonText}>Llamar al 123</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  heroSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  statItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  actionSection: {
    padding: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  secondaryButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  emergencySection: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginTop: 12,
  },
  emergencyText: {
    fontSize: 14,
    color: '#b91c1c',
    marginTop: 4,
    textAlign: 'center',
  },
  emergencyButton: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
