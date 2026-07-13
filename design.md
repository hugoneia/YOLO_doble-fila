# Diseño de Interfaz de Usuario (UI) - Traffic Monitor MVP

Este documento detalla el plan de diseño para la interfaz de usuario de la aplicación Traffic Monitor MVP, optimizada para dispositivos móviles en orientación vertical y uso con una sola mano, siguiendo las directrices de interfaz humana de Apple (HIG) para una experiencia nativa en iOS.

## 1. Lista de Pantallas

La aplicación constará de una única pantalla principal para el monitoreo del tráfico.

*   **Pantalla Principal (Home Screen)**: Vista principal donde se muestra la cámara, el estado del monitoreo, el contador de fotos y los logs.

## 2. Contenido Principal y Funcionalidad por Pantalla

### Pantalla Principal (Home Screen)

*   **Vista Previa de la Cámara**: Ocupará la mayor parte de la pantalla, mostrando la alimentación en tiempo real de la cámara trasera del dispositivo. Será el elemento visual central.
*   **Panel de Control Semitransparente**: Ubicado en la parte inferior de la pantalla, superpuesto a la vista previa de la cámara. Este panel contendrá:
    *   **Estado del Monitoreo**: Un indicador de texto claro que muestre si el monitoreo está `Monitoreando` (verde) o `Detenido` (rojo/gris).
    *   **Contador de Fotos Analizadas**: Un número que se actualizará cada vez que se capture una foto, mostrando la cantidad total de imágenes procesadas.
    *   **Área de Logs en Tiempo Real**: Un pequeño cuadro de texto desplazable que mostrará mensajes de depuración y eventos importantes (ej. "Permiso de cámara concedido", "Foto capturada", "Error al tomar foto"). Se mostrarán los últimos 5-10 logs para mantener la interfaz limpia.
*   **Botones de Acción**: Dos botones prominentes en el panel de control:
    *   **"Iniciar Monitoreo"**: Habilitado cuando el monitoreo está detenido. Al presionarlo, iniciará el ciclo de captura de fotos cada 5 segundos.
    *   **"Detener Monitoreo"**: Habilitado cuando el monitoreo está activo. Al presionarlo, detendrá el ciclo de captura.

## 3. Flujos de Usuario Clave

*   **Inicio de la Aplicación y Solicitud de Permisos**: Al abrir la aplicación por primera vez, se solicitará el permiso de la cámara. La vista previa de la cámara se mostrará una vez concedido el permiso.
*   **Inicio/Detención del Monitoreo**:
    1.  El usuario presiona "Iniciar Monitoreo".
    2.  El estado cambia a `Monitoreando`.
    3.  La aplicación comienza a capturar fotos cada 5 segundos, actualizando el contador y los logs.
    4.  El usuario presiona "Detener Monitoreo".
    5.  El estado cambia a `Detenido`.
    6.  La captura de fotos se detiene.

## 4. Opciones de Color

Se utilizará una paleta de colores limpia y funcional, priorizando la legibilidad y la claridad del estado.

*   **Fondo de la Aplicación**: Negro o muy oscuro para la vista de la cámara, permitiendo que la imagen de la cámara sea el foco.
*   **Panel de Control**: Fondo semitransparente oscuro (ej. `rgba(0, 0, 0, 0.6)`) para asegurar la legibilidad del texto sobre la vista de la cámara.
*   **Texto General**: Blanco o gris claro para contrastar con los fondos oscuros.
*   **Estado "Monitoreando"**: Texto verde vibrante (ej. `#4CAF50`).
*   **Estado "Detenido"**: Texto rojo o gris (ej. `#F44336` o `#9E9E9E`).
*   **Botones**: Colores contrastantes y claros. Por ejemplo, un botón "Iniciar" verde y un botón "Detener" rojo, o un color primario para "Iniciar" y un color secundario para "Detener".

## Consideraciones Adicionales

*   **Rendimiento**: Se priorizará la eficiencia y el bajo consumo de recursos para garantizar un funcionamiento fluido en dispositivos de gama media-baja. La UI será lo más ligera posible.
*   **Feedback Visual**: Los cambios de estado y las acciones del usuario tendrán feedback visual claro (cambios de color, actualizaciones de texto).
