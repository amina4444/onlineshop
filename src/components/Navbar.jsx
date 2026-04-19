import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <span className="brand-icon">🛍</span>
          <span className="brand-name">BestShop</span>
        </Link>
      </div>

      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Products</NavLink>

        {user && (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
            <NavLink to="/favorites" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              ❤ Favorites
              {user.favorites?.length > 0 && (
                <span className="badge">{user.favorites.length}</span>
              )}
            </NavLink>
            <NavLink to="/my-items" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>My Items</NavLink>
            <NavLink to="/create" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>+ Create</NavLink>
          </>
        )}

        {user?.role === "admin" && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active nav-admin" : "nav-link nav-admin"}>
            ⚙ Admin
          </NavLink>
        )}
      </div>

      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === "light" ? (

            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          ) : (

            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          )}
        </button>

        {user ? (
          <div className="navbar-user">
            <NavLink to="/profile" className="user-avatar">
              {user.email[0].toUpperCase()}
            </NavLink>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" className="btn-nav-login">Login</Link>
            <Link to="/register" className="btn-nav-register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}