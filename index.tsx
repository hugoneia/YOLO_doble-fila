import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Platform } from "react-native";
import { Camera } from "react-native-vision-camera";
import { useCamera } from "../../src/hooks/useCamera";

export default function HomeScreen() {
  const { 
    cameraRef, 
    device, 
    cameraState, 
    photoCount, 
    logs, 
    startMonitoring, 
    stopMonitoring, 
    hasPermission 
  } = useCamera();

  if (!hasPermission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.centerText}>Esperando permisos de cámara...</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.centerText}>Cargando cámara...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Componente de cámara aislado con estilos inline puros */}
      <Camera
        ref={cameraRef}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        device={device}
        isActive={true}
      />

      {/* Panel de Control Semitransparente */}
      <View style={styles.controlPanel}>
        <View style={styles.rowJustified}>
          <Text style={styles.panelTextBold}>
            Estado:{" "}
            <Text style={cameraState === 'monitoring' ? styles.statusMonitoring : styles.statusStopped}>
              {cameraState === 'monitoring' ? 'Monitoreando' : 'Detenido'}
            </Text>
          </Text>
          <Text style={styles.panelTextBold}>
            Fotos analizadas: {photoCount}
          </Text>
        </View>
        
        {/* Área de Logs */}
        <View style={styles.logContainer}>
          <ScrollView>
            {logs.map((log: string, index: number) => (
              <Text key={index} style={styles.logText}>
                {log}
              </Text>
            ))}
          </ScrollView>
        </View>

        {/* Botones de Acción */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonGreen, cameraState === 'monitoring' && styles.buttonDisabled]}
            onPress={startMonitoring}
            disabled={cameraState === 'monitoring'}
          >
            <Text style={styles.buttonText}>Iniciar Monitoreo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.buttonRed, cameraState === 'stopped' && styles.buttonDisabled]}
            onPress={stopMonitoring}
            disabled={cameraState === 'stopped'}
          >
            <Text style={styles.buttonText}>Detener Monitoreo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  centerText: {
    color: '#ffffff',
    fontSize: 18,
  },
  controlPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowJustified: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  panelTextBold: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusMonitoring: {
    color: '#4ade80',
    fontWeight: 'bold',
  },
  statusStopped: {
    color: '#f87171',
    fontWeight: 'bold',
  },
  logContainer: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 6,
    padding: 8,
    marginBottom: 16,
    height: 90,
  },
  logText: {
    color: '#e5e7eb',
    fontSize: 12,
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  buttonGreen: {
    backgroundColor: '#16a34a',
  },
  buttonRed: {
    backgroundColor: '#dc2626',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});