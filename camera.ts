export type CameraState = "monitoring" | "stopped";

export interface FrameData {
  timestamp: number;
  photoPath: string;
  // Add other relevant data extracted from the frame here
}
