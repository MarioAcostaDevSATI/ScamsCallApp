import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Roles del sistema
export const USER_ROLES = {
  CITIZEN: 'citizen',
  AGENT: 'agent',
  ADMIN: 'admin'
}

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  permissions: []
}

// Reducer para manejo de estado
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true }
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        permissions: getPermissions(action.payload.user.role)
      }
    
    case 'LOGIN_FAILURE':
      return { ...state, user: null, isAuthenticated: false, isLoading: false, permissions: [] }
    
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, permissions: [] }
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        permissions: getPermissions(action.payload.role || state.user.role)
      }
    
    default:
      return state
  }
}

// Permisos basados en roles
function getPermissions(role) {
  const basePermissions = ['view_reports', 'edit_profile']
  
  switch (role) {
    case USER_ROLES.CITIZEN:
      return [...basePermissions, 'create_reports', 'view_public_metrics']
    
    case USER_ROLES.AGENT:
      return [...basePermissions, 'create_reports', 'view_all_reports', 'view_agent_metrics', 'manage_cases']
    
    case USER_ROLES.ADMIN:
      return [...basePermissions, 'create_reports', 'view_all_reports', 'view_all_metrics', 'manage_users', 'system_admin']
    
    default:
      return basePermissions
  }
}

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('user_data')
        
        if (token && userData) {
          const user = JSON.parse(userData)
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user } })
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        dispatch({ type: 'LOGIN_FAILURE' })
      } finally {
        dispatch({ type: 'LOGIN_FAILURE' }) // Para desarrollo, simula no autenticado
      }
    }

    checkAuth()
  }, [])

  // Funciones de autenticación
  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      // Simulación de login - En producción esto sería una API real
      const mockUser = {
        id: Date.now(),
        email,
        name: email.split('@')[0],
        role: email.includes('agente') ? USER_ROLES.AGENT : 
              email.includes('admin') ? USER_ROLES.ADMIN : USER_ROLES.CITIZEN,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=2563EB&color=fff&size=128`,
        phone: '+57 XXX XXX XXXX',
        joinedAt: new Date().toISOString()
      }

      // Guardar en localStorage (simulado)
      localStorage.setItem('auth_token', 'mock-jwt-token')
      localStorage.setItem('user_data', JSON.stringify(mockUser))

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: mockUser } })
      return { success: true, user: mockUser }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' })
      return { success: false, error: 'Credenciales inválidas' }
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      const newUser = {
        id: Date.now(),
        ...userData,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=10B981&color=fff&size=128`,
        joinedAt: new Date().toISOString()
      }

      localStorage.setItem('auth_token', 'mock-jwt-token')
      localStorage.setItem('user_data', JSON.stringify(newUser))

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: newUser } })
      return { success: true, user: newUser }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' })
      return { success: false, error: 'Error en el registro' }
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    dispatch({ type: 'LOGOUT' })
  }

  const updateProfile = (updates) => {
    const updatedUser = { ...state.user, ...updates }
    localStorage.setItem('user_data', JSON.stringify(updatedUser))
    dispatch({ type: 'UPDATE_USER', payload: updates })
  }

  const hasPermission = (permission) => {
    return state.permissions.includes(permission)
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    hasPermission,
    USER_ROLES
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
