/**
 * Configuración general de la aplicación
 */

export const APP_CONFIG = {
  name: 'Plataforma Educativa',
  version: '1.0.0',
  description: 'Visualizadores Interactivos de Figuras Geométricas',
  
  // Configuración del servidor
  server: {
    port: 3000,
    host: 'localhost',
  },
  
  // Configuración de auto-guardado
  autosave: {
    enabled: true,
    intervalMs: 30000, // 30 segundos
  },
  
  // Configuración de almacenamiento
  storage: {
    keys: {
      auth: 'auth-storage',
      projects: 'project-storage',
      users: 'edu_platform_users',
    },
  },
  
  // Proyectos disponibles
  projects: [
    {
      id: 'fractals',
      name: 'FractalLab',
      description: 'Visualizador interactivo de fractales matemáticos',
      icon: '∞',
      color: '#667eea',
      path: '/fractals-app/index.html',
      features: [
        'Conjunto de Mandelbrot',
        'Conjunto de Julia',
        'Curva de Koch',
        'Triángulo de Sierpinski',
        'Árbol Fractal',
      ],
    },
    {
      id: 'viewer3d',
      name: 'Visor 3D Interactivo',
      description: 'Explorador de figuras geométricas tridimensionales',
      icon: '🎲',
      color: '#f093fb',
      path: '/3d-app/index.html',
      features: [
        'Figuras 3D dinámicas',
        'Control de cámara',
        'Animaciones',
        'Texturas y materiales',
        'Exportación de escenas',
      ],
    },
  ],
}

export default APP_CONFIG
