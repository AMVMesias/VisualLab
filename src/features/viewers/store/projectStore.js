import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Store para gestionar el estado de los proyectos por usuario
export const useProjectStore = create(
  persist(
    (set, get) => ({
      // Estructura: { userId: { fractals: {...}, viewer3d: {...} } }
      userProjects: {},
      
      // Obtener estado de un proyecto para el usuario actual
      getProjectState: (userId, projectName) => {
        const userProjects = get().userProjects[userId] || {}
        return userProjects[projectName] || null
      },
      
      // Guardar estado de un proyecto
      saveProjectState: (userId, projectName, state) => {
        set((prev) => ({
          userProjects: {
            ...prev.userProjects,
            [userId]: {
              ...prev.userProjects[userId],
              [projectName]: {
                ...state,
                lastModified: new Date().toISOString()
              }
            }
          }
        }))
      },
      
      // Limpiar estado de un proyecto
      clearProjectState: (userId, projectName) => {
        set((prev) => {
          const userProjects = { ...prev.userProjects }
          if (userProjects[userId]) {
            delete userProjects[userId][projectName]
          }
          return { userProjects }
        })
      },
      
      // Exportar configuración a JSON
      exportConfig: (userId) => {
        const userProjects = get().userProjects[userId]
        if (!userProjects) return null
        
        const config = {
          userId,
          exportDate: new Date().toISOString(),
          projects: userProjects
        }
        
        return JSON.stringify(config, null, 2)
      },
      
      // Importar configuración desde JSON
      importConfig: (userId, jsonString) => {
        try {
          const config = JSON.parse(jsonString)
          set((prev) => ({
            userProjects: {
              ...prev.userProjects,
              [userId]: config.projects
            }
          }))
          return true
        } catch (error) {
          console.error('Error importing config:', error)
          return false
        }
      }
    }),
    {
      name: 'project-storage',
    }
  )
)
