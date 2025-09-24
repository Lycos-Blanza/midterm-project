import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-xl font-bold text-eerie transform transition duration-300 hover:scale-110 hover:rotate-1"
        >
          StudySpot <span className="text-pumpkin">PH</span>
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
                isActive
                  ? 'text-pumpkin font-medium after:w-full'
                  : 'text-davy'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/dashboard/my-bookings"
            className={({ isActive }) =>
              `relative transition duration-300 hover:text-pumpkin
              after:absolute after:left-0 after:-bottom-1 after:h-[2px] 
              after:bg-pumpkin after:w-0 hover:after:w-full 
              after:transition-all after:duration-300
              ${
                isActive
                  ? 'text-pumpkin font-medium after:w-full'
                  : 'text-davy'
              }`
            }
          >
            My Bookings
          </NavLink>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-davy">
                Hi, <b>{user.name}</b>
              </span>
              <button
                className="btn-secondary transition transform hover:scale-105 hover:shadow-md active:translate-y-0.5"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="btn-primary transition transform hover:scale-105 hover:shadow-md active:translate-y-0.5"
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
