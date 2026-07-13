import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, useCameraDevices, CameraDevice, PhotoFile } from 'react-native-vision-camera';
import { Platform, PermissionsAndroid } from 'react-native';
import { CameraState, FrameData } from '../types/camera';

interface UseCameraOptions {
  intervalMs?: number; // Intervalo de captura en milisegundos
  resolution?: '480p' | '720p'; // Resolución de la foto
}

interface UseCameraResult {
  cameraRef: React.RefObject<any>; // Using any temporarily to bypass type issue with Camera ref
  device: CameraDevice | undefined;
  cameraState: CameraState;
  latestFrame: FrameData | undefined;
  photoCount: number;
  logs: string[];
  startMonitoring: () => Promise<void>;
  stopMonitoring: () => void;
  hasPermission: boolean;
}

const RESOLUTIONS = {
  '480p': { width: 640, height: 480 },
  '720p': { width: 1280, height: 720 },
};

export function useCamera(options?: UseCameraOptions): UseCameraResult {
  const { intervalMs = 5000, resolution = '720p' } = options || {};
  const cameraRef = useRef<any>(null);
  const devices = useCameraDevices();
  const [device, setDevice] = useState<CameraDevice | undefined>(undefined);
  const [cameraState, setCameraState] = useState<CameraState>('stopped');
  const [latestFrame, setLatestFrame] = useState<FrameData | undefined>(undefined);
  const [photoCount, setPhotoCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const intervalId = useRef<number | null>(null);

  const addLog = useCallback((message: string) => {
    setLogs((prevLogs) => {
      const newLogs = [...prevLogs, `[${new Date().toLocaleTimeString()}] ${message}`];
      return newLogs.slice(-10); // Mantener solo los últimos 10 logs
    });
  }, []);

  const requestCameraPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permiso de Cámara',
          message: 'Esta aplicación necesita acceso a tu cámara para monitorear el tráfico.',
          buttonNeutral: 'Preguntar luego',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Aceptar',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
        addLog('Permiso de cámara concedido.');
      } else {
        setHasPermission(false);
        addLog('Permiso de cámara denegado.');
      }
    } else {
      const status = await (Camera as any).requestCameraPermission();
      if (status === 'granted') {
        setHasPermission(true);
        addLog('Permiso de cámara concedido.');
      } else {
        setHasPermission(false);
        addLog('Permiso de cámara denegado.');
      }
    }
  }, [addLog]);

  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  useEffect(() => {
    const backCamera = devices.find(d => d.position === 'back');
    if (hasPermission && backCamera) {
      setDevice(backCamera);
      addLog('Cámara trasera detectada y seleccionada.');
    } else if (hasPermission && devices.length > 0) {
      setDevice(devices[0]); // Fallback to any available camera
      addLog('Cámara frontal detectada y seleccionada como fallback.');
    }
  }, [hasPermission, devices, addLog]);

  const takePhoto = useCallback(async () => {
    if (cameraRef.current && device) {
      try {
        addLog('Tomando foto...');
        const photo: PhotoFile = await cameraRef.current.takePhoto({
          qualityPrioritization: 'speed',
          flash: 'off',
          enableShutterSound: false,
          skipMetadata: true,
          // resizePhoto is not available in this version, we will handle resolution differently if needed
        });
        const photoPath = (photo as any).path || (photo as any).uri || 'unknown_path';
        addLog(`Foto capturada: ${photoPath}`);
        setLatestFrame({
          timestamp: Date.now(),
          photoPath: photoPath,
        });
        setPhotoCount((prev) => prev + 1);
      } catch (error) {
        addLog(`Error al tomar foto: ${error}`);
        console.error('Error taking photo:', error);
      }
    }
  }, [device, addLog, resolution]);

  const startMonitoring = useCallback(async () => {
    if (!hasPermission) {
      addLog('No hay permiso de cámara. No se puede iniciar el monitoreo.');
      return;
    }
    if (!device) {
      addLog('No hay dispositivo de cámara disponible. No se puede iniciar el monitoreo.');
      return;
    }

    addLog('Iniciando monitoreo...');
    setCameraState('monitoring');
    // Tomar una foto inmediatamente al iniciar
    await takePhoto();

    intervalId.current = setInterval(() => {
      takePhoto(); // No need for await here, as setInterval doesn't wait
    }, intervalMs);
  }, [hasPermission, device, takePhoto, intervalMs, addLog]);

  const stopMonitoring = useCallback(() => {
    addLog('Deteniendo monitoreo...');
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
    setCameraState('stopped');
  }, [addLog]);

  // Limpiar el intervalo al desmontar el componente
  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);

  return {
    cameraRef,
    device,
    cameraState,
    latestFrame,
    photoCount,
    logs,
    startMonitoring,
    stopMonitoring,
    hasPermission,
  };
}
