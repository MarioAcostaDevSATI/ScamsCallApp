import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system')
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState('normal')
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Cargar preferencias guardadas
    const savedTheme = localStorage.getItem('theme') || 'system'
    const savedContrast = localStorage.getItem('highContrast') === 'true'
    const savedFontSize = localStorage.getItem('fontSize') || 'normal'
    const savedMotion = localStorage.getItem('reducedMotion') === 'true'

    setTheme(savedTheme)
    setHighContrast(savedContrast)
    setFontSize(savedFontSize)
    setReducedMotion(savedMotion)

    // Aplicar preferencias al documento
    applyTheme(savedTheme)
    applyContrast(savedContrast)
    applyFontSize(savedFontSize)
    applyMotion(savedMotion)
  }, [])

  const applyTheme = (newTheme) => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    
    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.add(isDark ? 'dark' : 'light')
    } else {
      root.classList.add(newTheme)
    }
  }

  const applyContrast = (contrast) => {
    const root = document.documentElement
    if (contrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
  }

  const applyFontSize = (size) => {
    const root = document.documentElement
    root.style.fontSize = 
      size === 'large' ? '18px' : 
      size === 'x-large' ? '20px' : '16px'
  }

  const applyMotion = (reduce) => {
    const root = document.documentElement
    if (reduce) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }
  }

  const updateTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  const toggleContrast = () => {
    const newContrast = !highContrast
    setHighContrast(newContrast)
    localStorage.setItem('highContrast', newContrast)
    applyContrast(newContrast)
  }

  const updateFontSize = (size) => {
    setFontSize(size)
    localStorage.setItem('fontSize', size)
    applyFontSize(size)
  }

  const toggleMotion = () => {
    const newMotion = !reducedMotion
    setReducedMotion(newMotion)
    localStorage.setItem('reducedMotion', newMotion)
    applyMotion(newMotion)
  }

  const resetAccessibility = () => {
    updateTheme('system')
    setHighContrast(false)
    updateFontSize('normal')
    setReducedMotion(false)
    
    localStorage.removeItem('theme')
    localStorage.removeItem('highContrast')
    localStorage.removeItem('fontSize')
    localStorage.removeItem('reducedMotion')
    
    applyTheme('system')
    applyContrast(false)
    applyFontSize('normal')
    applyMotion(false)
  }

  const value = {
    theme,
    highContrast,
    fontSize,
    reducedMotion,
    updateTheme,
    toggleContrast,
    updateFontSize,
    toggleMotion,
    resetAccessibility
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
