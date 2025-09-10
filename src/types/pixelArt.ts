export type CanvasCell = string; // Hex color code

export interface PixelArtProject {
  id: string;
  name: string;
  username: string;
  size: number;
  pixels: CanvasCell[];
  createdAt: number;
  updatedAt: number;
}

export interface EdgeConfigProjects {
  [username: string]: PixelArtProject[];
}
