import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'

// Context Providers
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { OnboardingProvider } from './contexts/OnboardingContext'

// Layout Components
import Layout from './components/layout/Layout'
import AccessibilityBar from './components/ui/AccessibilityBar'

// Pages
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Register from './pages/Register'
import Login from './pages/Login'
import ReportForm from './pages/ReportForm'
import Dashboard from './pages/Dashboard'
import Metrics from './pages/Metrics'
import Profile from './pages/Profile'
import Emergency from './pages/Emergency'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <AuthProvider>
          <OnboardingProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <AccessibilityBar />
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/registro" element={<Register />} />
                    <Route path="/ingreso" element={<Login />} />
                    <Route path="/reportar" element={<ReportForm />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/metricas" element={<Metrics />} />
                    <Route path="/perfil" element={<Profile />} />
                    <Route path="/emergencia" element={<Emergency />} />
                  </Routes>
                </Layout>
              </div>
            </Router>
          </OnboardingProvider>
        </AuthProvider>
      </ThemeProvider>
    </MotionConfig>
  )
}

export default App
