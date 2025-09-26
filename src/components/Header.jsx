import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Header() {
  const { user, login, logout } = useAuth(); // get auth state and functions
  const navigate = useNavigate(); // navigate programmatically
  const location = useLocation(); // current route info

  const handleLogout = () => {
    logout(); // log the user out

    // If currently on My Bookings page, redirect to Home
    if (location.pathname === "/dashboard/my-bookings") {
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-1 text-xl font-bold text-eerie transform transition duration-300 hover:scale-110 hover:rotate-1"
        >
          {/* Logo */}
          <img
            src="/assets/SeatZee-logo.png"
            alt="SeatZee Logo"
            className="h-8 w-8 object-contain"
          />
          <span>
            Seat<span className="text-pumpkin">Zee</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative transition duration-300 hover:text-pumpkin
              after:absolute after:left-0 after:-bottom-1 after:h-[2px] 
              after:bg-pumpkin after:w-0 hover:after:w-full 
              after:transition-all after:duration-300
              ${
                isActive ? "text-pumpkin font-medium after:w-full" : "text-davy"
              }`
            }
          >
            Home
          </NavLink>

          {/* Show My Bookings ONLY if logged in */}
          {user && (
            <NavLink
              to="/dashboard/my-bookings"
              className={({ isActive }) =>
                `relative transition duration-300 hover:text-pumpkin
                after:absolute after:left-0 after:-bottom-1 after:h-[2px] 
                after:bg-pumpkin after:w-0 hover:after:w-full 
                after:transition-all after:duration-300
                ${
                  isActive
                    ? "text-pumpkin font-medium after:w-full"
                    : "text-davy"
                }`
              }
            >
              My Bookings
            </NavLink>
          )}

          {/* Auth buttons */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-davy">
                Hi, <b>{user.name}</b>
              </span>
              <button
                className="btn-secondary transition transform hover:scale-105 hover:shadow-md active:translate-y-0.5"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => login("guest")}
              className="btn-primary transition transform hover:scale-105 hover:shadow-md active:translate-y-0.5"
            >
              Login as Guest
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
