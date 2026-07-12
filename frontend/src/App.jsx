import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import AnalystDashboard from './pages/AnalystDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/analyst" element={<AnalystDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route
          path="/manager"
          element={user?.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/manager"
          element={user?.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App