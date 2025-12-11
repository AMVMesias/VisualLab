import { create } from 'zustand'
import { supabase } from '../../../config/supabase'

// Store para gestionar proyectos con Supabase
export const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,
  error: null,

  // Obtener todos los proyectos del usuario autenticado
  fetchProjects: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error

      set({ projects: data || [], loading: false })
      return { success: true, data }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Obtener proyectos por tipo (3d o fractal)
  fetchProjectsByType: async (type) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('type', type)
        .order('updated_at', { ascending: false })

      if (error) throw error

      set({ projects: data || [], loading: false })
      return { success: true, data }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Crear nuevo proyecto
  createProject: async (projectData) => {
    set({ loading: true, error: null })
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          user_id: user.id,
          name: projectData.name,
          type: projectData.type,
          config: projectData.config,
          thumbnail_url: projectData.thumbnail_url || null
        }])
        .select()
        .single()

      if (error) throw error

      // Agregar a la lista local
      set(state => ({
        projects: [data, ...state.projects],
        loading: false
      }))

      // Registrar en el historial
      await get().logActivity('create_project', data.id, { projectName: data.name })

      return { success: true, data }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Actualizar proyecto existente
  updateProject: async (projectId, updates) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: updates.name,
          config: updates.config,
          thumbnail_url: updates.thumbnail_url
        })
        .eq('id', projectId)
        .select()
        .single()

      if (error) throw error

      // Actualizar en la lista local
      set(state => ({
        projects: state.projects.map(p =>
          p.id === projectId ? data : p
        ),
        currentProject: state.currentProject?.id === projectId ? data : state.currentProject,
        loading: false
      }))

      await get().logActivity('update_project', projectId, { projectName: data.name })

      return { success: true, data }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Eliminar proyecto
  deleteProject: async (projectId) => {
    set({ loading: true, error: null })
    try {
      const project = get().projects.find(p => p.id === projectId)

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      set(state => ({
        projects: state.projects.filter(p => p.id !== projectId),
        currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
        loading: false
      }))

      if (project) {
        await get().logActivity('delete_project', projectId, { projectName: project.name })
      }

      return { success: true }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Cargar proyecto específico
  loadProject: async (projectId) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (error) throw error

      set({ currentProject: data, loading: false })
      await get().logActivity('open_project', projectId, { projectName: data.name })

      return { success: true, data }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Establecer proyecto actual (sin cargar desde BD)
  setCurrentProject: (project) => {
    set({ currentProject: project })
  },

  // Limpiar proyecto actual
  clearCurrentProject: () => {
    set({ currentProject: null })
  },

  // Exportar configuración de proyecto a JSON
  exportProjectConfig: (project) => {
    if (!project) return null

    const exportData = {
      name: project.name,
      type: project.type,
      config: project.config,
      exportDate: new Date().toISOString()
    }

    return JSON.stringify(exportData, null, 2)
  },

  // Importar configuración desde JSON
  importProjectConfig: async (jsonString, projectName) => {
    set({ loading: true, error: null })
    try {
      const config = JSON.parse(jsonString)

      const result = await get().createProject({
        name: projectName || `${config.name} (Importado)`,
        type: config.type,
        config: config.config
      })

      return result
    } catch (error) {
      set({ error: 'Error al importar configuración: ' + error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Registrar actividad en el historial
  logActivity: async (action, projectId = null, details = null) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      await supabase
        .from('activity_log')
        .insert([{
          user_id: user.id,
          action,
          project_id: projectId,
          details
        }])
    } catch (error) {
      console.error('Error logging activity:', error)
    }
  },

  // Obtener historial de actividades
  fetchActivityLog: async (limit = 50) => {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select(`
          *,
          projects(name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Limpiar errores
  clearError: () => set({ error: null }),

  // =====================================================
  // Funciones de almacenamiento local (localStorage)
  // Estas funciones mantienen compatibilidad con el Dashboard
  // y los viewers que usan almacenamiento local
  // =====================================================

  // Obtener estado de proyecto desde localStorage
  getProjectState: (userId, projectId) => {
    try {
      const storageKey = `project_${userId}_${projectId}`
      const data = localStorage.getItem(storageKey)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error reading project state:', error)
      return null
    }
  },

  // Guardar estado de proyecto en localStorage
  saveProjectState: (userId, projectId, state) => {
    try {
      const storageKey = `project_${userId}_${projectId}`
      const dataToSave = {
        ...state,
        lastModified: new Date().toISOString()
      }
      localStorage.setItem(storageKey, JSON.stringify(dataToSave))
      return true
    } catch (error) {
      console.error('Error saving project state:', error)
      return false
    }
  },

  // Exportar toda la configuración del usuario a JSON
  exportConfig: (userId) => {
    try {
      const config = {
        userId,
        exportDate: new Date().toISOString(),
        projects: {}
      }

      // Buscar todos los proyectos del usuario en localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(`project_${userId}_`)) {
          const projectId = key.replace(`project_${userId}_`, '')
          const data = localStorage.getItem(key)
          if (data) {
            config.projects[projectId] = JSON.parse(data)
          }
        }
      }

      // Si no hay proyectos, retornar null
      if (Object.keys(config.projects).length === 0) {
        return null
      }

      return JSON.stringify(config, null, 2)
    } catch (error) {
      console.error('Error exporting config:', error)
      return null
    }
  },

  // Importar configuración desde JSON
  importConfig: (userId, jsonString) => {
    try {
      const config = JSON.parse(jsonString)

      // Validar estructura básica
      if (!config.projects || typeof config.projects !== 'object') {
        console.error('Invalid config format')
        return false
      }

      // Importar cada proyecto
      for (const [projectId, projectData] of Object.entries(config.projects)) {
        const storageKey = `project_${userId}_${projectId}`
        localStorage.setItem(storageKey, JSON.stringify({
          ...projectData,
          importedAt: new Date().toISOString()
        }))
      }

      return true
    } catch (error) {
      console.error('Error importing config:', error)
      return false
    }
  }
}))
