import { useAuth } from "../contexts/AuthContext.jsx";
import { Link, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While restoring auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <p className="text-davy">Loading...</p>
      </div>
    );
  }

  // If not logged in, show a message instead of redirecting instantly
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-start flex-1 pt-32 space-y-4">
        <p className="text-lg font-medium text-eerie text-center">
          You must <span className="text-pumpkin">login</span> first to view your bookings.
        </p>
        <Link
          to="/"
          state={{ from: location }}
          className="btn-primary px-6 py-2"
        >
          Go to Home & Login
        </Link>
      </div>
    );
  }

  // If logged in, show the protected page
  return children;
}
