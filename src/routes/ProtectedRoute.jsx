import { useAuth } from "../contexts/AuthContext.jsx";
import { Link, useLocation } from "react-router-dom";

// A wrapper component to protect routes that require authentication
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth(); // Get the current user and loading state from the Auth context
  const location = useLocation(); // Get the current route location to redirect back after login if needed

  // While the auth state is being restored (e.g., checking if user is logged in)
  if (loading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <p className="text-davy">Loading...</p>
      </div>
    );
  }

  // If no user is logged in, show a message and a link to login/home
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-start flex-1 pt-32 space-y-4">
        <p className="text-lg font-medium text-eerie text-center">
          You must <span className="text-pumpkin">login</span> first to view
          your bookings.
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

  // If user is logged in, render the protected content (children)
  return children;
}
