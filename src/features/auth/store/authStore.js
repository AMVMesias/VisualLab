import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import predefinedUsers from '../config/users.json'

// Inicializar usuarios predefinidos en localStorage si no existen
const initializePredefinedUsers = () => {
  const existingUsers = JSON.parse(localStorage.getItem('edu_platform_users') || '[]')
  
  // Si no hay usuarios, agregamos los predefinidos
  if (existingUsers.length === 0) {
    localStorage.setItem('edu_platform_users', JSON.stringify(predefinedUsers.users))
    return predefinedUsers.users
  }
  
  // Verificar que los usuarios predefinidos existan
  predefinedUsers.users.forEach(predefinedUser => {
    const exists = existingUsers.find(u => u.username === predefinedUser.username)
    if (!exists) {
      existingUsers.push(predefinedUser)
    }
  })
  
  localStorage.setItem('edu_platform_users', JSON.stringify(existingUsers))
  return existingUsers
}

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (username, password) => {
        // Asegurar que usuarios predefinidos existen
        const users = initializePredefinedUsers()
        
        // Buscar usuario con credenciales válidas
        const user = users.find(u => u.username === username && u.password === password)
        
        if (!user) {
          // Credenciales inválidas
          return false
        }
        
        // No guardamos la contraseña en el estado
        const { password: _, ...userWithoutPassword } = user
        
        set({ user: userWithoutPassword, isAuthenticated: true })
        return true
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

// Inicializar al cargar el módulo
initializePredefinedUsers()
