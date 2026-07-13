# Traffic Monitor MVP

Esta es la primera fase del MVP de una aplicación de monitoreo de tráfico construida con React Native y TypeScript, optimizada para dispositivos Android de gama media-baja (como el Redmi Note 8T con Android 11 y 4GB de RAM). El objetivo principal es la captura eficiente de imágenes para evitar problemas de memoria y sobrecalentamiento.

## Características Implementadas (Fase 1):

*   **Captura de Imágenes Eficiente**: Utiliza `react-native-vision-camera` para capturar fotos en baja resolución (640x480 o 1280x720) cada 5 segundos, controlada por un temporizador.
*   **Interfaz de Usuario Básica**: Muestra una vista previa de la cámara a pantalla completa, un panel semitransparente con el estado del monitoreo, un contador de fotos analizadas y un área de logs en tiempo real.
*   **Control de Monitoreo**: Botones para "Iniciar Monitoreo" y "Detener Monitoreo".
*   **Permisos de Cámara**: Manejo de permisos de cámara para Android.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

*   **Node.js** (versión LTS recomendada)
*   **pnpm** (administrador de paquetes)
*   **Java Development Kit (JDK)** (versión 11 o superior)
*   **Android Studio** (para SDK de Android y herramientas de línea de comandos)
*   **Expo CLI** (`npm install -g expo-cli`)

## Configuración del Entorno Android (Pasos Manuales)

Aunque el proyecto ya está configurado para la mayoría de los permisos, es crucial verificar y, si es necesario, ajustar la configuración nativa de Android.

### 1. Permisos de Cámara en `AndroidManifest.xml`

Asegúrate de que los siguientes permisos estén presentes en el archivo `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" /> <!-- Necesario para VisionCamera, aunque no se use audio -->
<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
```

**Nota**: El permiso `RECORD_AUDIO` es un requisito de `react-native-vision-camera` incluso si no se graba audio. El archivo `app.config.ts` ya incluye el permiso `CAMERA`.

### 2. Configuración de `build.gradle` (Nivel de Aplicación)

Verifica el archivo `android/app/build.gradle` para asegurar la compatibilidad y las configuraciones de `react-native-vision-camera`.

Asegúrate de que `minSdkVersion` sea al menos `23` (o `21` si `react-native-vision-camera` lo permite, pero `23` es más seguro para Android 11).

```gradle
android {
    compileSdkVersion <tu_compile_sdk_version>
    defaultConfig {
        applicationId "com.app.TrafficMonitorMVP"
        minSdkVersion 23 // Asegúrate de que sea al menos 23
        targetSdkVersion <tu_target_sdk_version>
        versionCode 1
        versionName "1.0"
    }
    buildTypes {
        release {
            // ...
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
        }
    }
}
```

### 3. Configuración de `proguard-rules.pro`

El archivo `proguard-rules.pro` ha sido creado en la raíz del proyecto para optimizaciones específicas. Asegúrate de que esté referenciado en `android/app/build.gradle` como se muestra arriba.

## Instalación y Ejecución

1.  **Clonar el repositorio (si aplica) o navegar al directorio del proyecto:**
    ```bash
    cd /home/ubuntu/TrafficMonitorMVP
    ```

2.  **Instalar dependencias:**
    ```bash
    pnpm install
    ```

3.  **Ejecutar la aplicación en Android:**
    ```bash
    pnpm android
    ```
    Esto iniciará el servidor de desarrollo de Metro y abrirá la aplicación en un emulador o dispositivo conectado. Asegúrate de que tu dispositivo Android esté conectado y reconocido por `adb` (`adb devices`).

## Notas de Optimización

*   **`react-native-vision-camera`**: Se ha elegido esta librería por su rendimiento y control a bajo nivel de la cámara, crucial para dispositivos de gama baja.
*   **Captura Programada**: La captura de fotos cada 5 segundos, en lugar de un `Frame Processor` continuo, reduce significativamente la carga de la CPU y el consumo de batería, mitigando el sobrecalentamiento y los problemas de OOM.
*   **Resolución Baja**: La captura en resoluciones como 640x480 o 1280x720 minimiza el tamaño de los datos de imagen a procesar.
*   **ProGuard**: Las reglas de ProGuard (o R8 en versiones más recientes de Gradle) ayudan a optimizar el tamaño del APK y el rendimiento en producción al eliminar código no utilizado y ofuscar el código.

## Solución de Problemas Comunes

*   **"No matching version found for react-native-vision-camera"**: Asegúrate de usar la versión especificada (`5.1.0`) o una compatible con tu versión de Expo/React Native.
*   **Problemas de Permisos**: Si la cámara no funciona, verifica manualmente los permisos en la configuración de la aplicación en tu dispositivo Android.
*   **Errores de Compilación de Gradle**: A menudo se resuelven limpiando el proyecto (`cd android && ./gradlew clean`) y reconstruyendo.

---
