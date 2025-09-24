import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useState } from "react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const [name, setName] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    login(name || "Student User");
    navigate(from, { replace: true });
  };

  return (
    <form onSubmit={handleLogin} className="card max-w-md mx-auto space-y-3">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="text-sm text-davy">
        This is a simulated login for demo purposes.
      </p>

      <div>
        <label className="block text-sm mb-1">Name (optional)</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Juan Dela Cruz"
        />
      </div>

      <button className="btn-primary w-full" type="submit">
        Continue
      </button>
    </form>
  );
}
