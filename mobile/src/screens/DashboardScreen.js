import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TrendingUp, Users, Phone, AlertTriangle } from 'lucide-react-native';

const DashboardScreen = () => {
  const stats = [
    { label: 'Total Reportes', value: '1,247', icon: <TrendingUp size={20} color="#3b82f6" />, change: '+12%' },
    { label: 'Números Únicos', value: '856', icon: <Phone size={20} color="#10b981" />, change: '+8%' },
    { label: 'Reportes Hoy', value: '24', icon: <Users size={20} color="#f59e0b" />, change: '-3%' },
    { label: 'Estafas Activas', value: '12', icon: <AlertTriangle size={20} color="#dc2626" />, change: '+2' },
  ];

  const recentReports = [
    { number: '+57 312 345 6789', type: 'Estafa', date: '2024-01-15', status: 'Pendiente' },
    { number: '+57 320 987 6543', type: 'Extorsión', date: '2024-01-15', status: 'Revisado' },
    { number: '+57 315 123 4567', type: 'Phishing', date: '2024-01-14', status: 'Pendiente' },
    { number: '+57 318 555 8888', type: 'Estafa', date: '2024-01-14', status: 'Cerrado' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return '#f59e0b';
      case 'Revisado': return '#3b82f6';
      case 'Cerrado': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Estafa': return '#dc2626';
      case 'Extorsión': return '#ea580c';
      case 'Phishing': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Estadísticas de estafas telefónicas</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.statIcon}>
                {stat.icon}
              </View>
              <Text style={styles.statChange}>{stat.change}</Text>
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Recent Reports */}
      <View style={styles.reportsSection}>
        <Text style={styles.sectionTitle}>Reportes Recientes</Text>
        {recentReports.map((report, index) => (
          <View key={index} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportNumber}>{report.number}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                <Text style={styles.statusText}>{report.status}</Text>
              </View>
            </View>
            <View style={styles.reportDetails}>
              <View style={[styles.typeBadge, { backgroundColor: getTypeColor(report.type) }]}>
                <Text style={styles.typeText}>{report.type}</Text>
              </View>
              <Text style={styles.reportDate}>{report.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  statsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  reportsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  reportCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  reportDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  reportDate: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default DashboardScreen;
