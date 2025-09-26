import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import SpaceDetail from "./pages/SpaceDetails.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { BookingProvider } from "./contexts/BookingContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function AppContent() {
  const { loading } = useAuth();

  // ✅ While restoring auth state, show a loading spinner/message
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-davy">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/space/:spaceId" element={<SpaceDetail />} />
          <Route
            path="/dashboard/my-bookings"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="border-t py-6 text-center text-sm text-davy">
        © {new Date().getFullYear()} SeatZee
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AppContent />
      </BookingProvider>
    </AuthProvider>
  );
}
