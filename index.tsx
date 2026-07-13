import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { Camera } from "react-native-vision-camera";
import { useCamera } from "../../src/hooks/useCamera"; // Corrected import path

export default function HomeScreen() {
  const { cameraRef, device, cameraState, photoCount, logs, startMonitoring, stopMonitoring, hasPermission } = useCamera();

  if (!hasPermission) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground text-lg">Esperando permisos de cámara...</Text>
      </ScreenContainer>
    );
  }

  if (device == null) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground text-lg">Cargando cámara...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1 p-0">
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        // photo={true} // 'photo' prop is not directly supported on Camera component in v5.1.0, using takePhoto instead
      />

      {/* Panel de Control Semitransparente */}
      <View className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white text-lg font-bold">
            Estado: <Text className={cameraState === 'monitoring' ? 'text-green-400' : 'text-red-400'}>
              {cameraState === 'monitoring' ? 'Monitoreando' : 'Detenido'}
            </Text>
          </Text>
          <Text className="text-white text-lg font-bold">
            Fotos analizadas: {photoCount}
          </Text>
        </View>
        
        {/* Área de Logs */}
        <View className="bg-gray-800 bg-opacity-70 rounded-md p-2 mb-4" style={{ height: 80 }}>
          <ScrollView>
            {logs.map((log: string, index: number) => (
              <Text key={index} className="text-gray-300 text-xs">
                {log}
              </Text>
            ))}
          </ScrollView>
        </View>

        {/* Botones de Acción */}
        <View className="flex-row justify-around">
          <TouchableOpacity
            className="bg-green-600 px-6 py-3 rounded-full active:opacity-80"
            onPress={startMonitoring}
            disabled={cameraState === 'monitoring'}
          >
            <Text className="text-white font-semibold">Iniciar Monitoreo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-600 px-6 py-3 rounded-full active:opacity-80"
            onPress={stopMonitoring}
            disabled={cameraState === 'stopped'}
          >
            <Text className="text-white font-semibold">Detener Monitoreo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
