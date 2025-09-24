import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import SpaceDetail from './pages/SpaceDetail.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { BookingProvider } from './contexts/BookingContext.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider> 
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="container mx-auto px-4 py-6 flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/space/:spaceId" element={<SpaceDetail />} />
              <Route path="/dashboard/my-bookings" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <footer className="border-t py-6 text-center text-sm text-davy">
            © {new Date().getFullYear()} StudySpot PH
          </footer>
        </div>
      </BookingProvider>
    </AuthProvider>
  )
}
