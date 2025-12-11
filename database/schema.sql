-- ========================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS
-- VisualLab 3D - PostgreSQL + Supabase
-- ========================================

-- 1. TABLA DE PROYECTOS
-- Almacena configuraciones de escenas 3D y fractales
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('3d', 'fractal')) NOT NULL,
  config JSONB NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA DE PREFERENCIAS DE USUARIO
-- Almacena configuraciones personales de cada usuario
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  quality VARCHAR(20) DEFAULT 'medium' CHECK (quality IN ('low', 'medium', 'high', 'ultra')),
  theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  camera_settings JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE HISTORIAL DE ACTIVIDADES
-- Registro de auditoría de acciones del usuario
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action VARCHAR(100) NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ========================================

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLÍTICAS DE SEGURIDAD: PROJECTS
-- ========================================

-- Los usuarios solo pueden ver sus propios proyectos
CREATE POLICY "Users can view own projects" 
  ON projects FOR SELECT 
  USING (auth.uid() = user_id);

-- Los usuarios solo pueden crear proyectos para sí mismos
CREATE POLICY "Users can insert own projects" 
  ON projects FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden actualizar sus propios proyectos
CREATE POLICY "Users can update own projects" 
  ON projects FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden eliminar sus propios proyectos
CREATE POLICY "Users can delete own projects" 
  ON projects FOR DELETE 
  USING (auth.uid() = user_id);

-- ========================================
-- POLÍTICAS DE SEGURIDAD: USER_PREFERENCES
-- ========================================

-- Los usuarios pueden gestionar sus propias preferencias
CREATE POLICY "Users can manage own preferences" 
  ON user_preferences FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- POLÍTICAS DE SEGURIDAD: ACTIVITY_LOG
-- ========================================

-- Los usuarios solo pueden ver su propio historial
CREATE POLICY "Users can view own activity" 
  ON activity_log FOR SELECT 
  USING (auth.uid() = user_id);

-- Los usuarios solo pueden insertar su propio historial
CREATE POLICY "Users can insert own activity" 
  ON activity_log FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- FUNCIONES Y TRIGGERS
-- ========================================

-- Función para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualización automática de timestamps
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_preferences_updated_at 
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- FUNCIÓN PARA INICIALIZAR PREFERENCIAS
-- ========================================

-- Función que se ejecuta automáticamente cuando se crea un nuevo usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función al crear un nuevo usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- DATOS DE PRUEBA (OPCIONAL)
-- ========================================

-- Puedes insertar datos de prueba después de crear un usuario
-- Ejemplo (ejecutar después de registrar un usuario):
/*
INSERT INTO projects (user_id, name, type, config) VALUES
(
  'TU-USER-ID-AQUI',
  'Proyecto Demo 3D',
  '3d',
  '{"camera": {"position": [0, 0, 5]}, "objects": []}'::jsonb
),
(
  'TU-USER-ID-AQUI',
  'Fractal de Mandelbrot',
  'fractal',
  '{"type": "mandelbrot", "iterations": 100, "zoom": 1}'::jsonb
);
*/
