import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Provides authentication state and functions to the app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // holds the current logged-in user
  const [loading, setLoading] = useState(true); // tracks if auth state is being loaded

  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // check for saved user in localStorage
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // restore user if found
    }
    setLoading(false); // done checking/loading auth state
  }, []);

  const login = (name) => {
    const newUser = { name };
    setUser(newUser); // update user state
    localStorage.setItem("user", JSON.stringify(newUser)); // save user to localStorage for persistence
  };

  const logout = () => {
    setUser(null); // clear user state
    localStorage.removeItem("user"); // remove user from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access to authentication context
export function useAuth() {
  return useContext(AuthContext);
}
