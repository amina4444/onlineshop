import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";

export default function Profile({ allProducts }) {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!user) return (
    <div className="empty-state">
      <div className="empty-icon">🔐</div>
      <h3>Not logged in</h3>
      <Link to="/login" className="btn-primary">Go to Login</Link>
    </div>
  );

  const myItems = (allProducts || []).filter((p) => p.owner === user.email);
  const joinDate = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully", "info");
    navigate("/");
  };

  return (
    <div className="profile-page">
      <h1 className="page-title">👤 Profile</h1>

      {  }
      <div className="profile-header-card">
        <div className="profile-avatar">
          {user.email[0].toUpperCase()}
        </div>
        <div className="profile-info">
          <h2 className="profile-email">{user.email}</h2>
          <span className={`role-badge role-${user.role}`}>
            {user.role === "admin" ? "⚙ Admin" : "👤 User"}
          </span>
          <p className="profile-joined">Member since {joinDate}</p>
        </div>
      </div>

   
      <div className="profile-stats">
        <div className="profile-stat">
          <strong>{myItems.length}</strong>
          <span>Products Created</span>
        </div>
        <div className="profile-stat">
          <strong>{user.favorites?.length || 0}</strong>
          <span>Favorites</span>
        </div>
        <div className="profile-stat">
          <strong>{user.role}</strong>
          <span>Account Type</span>
        </div>
      </div>

  
      <div className="profile-section">
        <h3 className="section-label">Quick Links</h3>
        <div className="profile-links">
          <Link to="/my-items" className="profile-link-card">
            <span>📦</span> My Items ({myItems.length})
          </Link>
          <Link to="/favorites" className="profile-link-card">
            <span>❤</span> Favorites ({user.favorites?.length || 0})
          </Link>
          <Link to="/create" className="profile-link-card">
            <span>➕</span> Create Product
          </Link>
          {user.role === "admin" && (
            <Link to="/admin" className="profile-link-card admin-link">
              <span>⚙</span> Admin Panel
            </Link>
          )}
        </div>
      </div>

    
      <div className="profile-section">
        <h3 className="section-label">Account Details</h3>
        <div className="profile-detail-card">
          <div className="profile-detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="profile-detail-row">
            <span className="detail-label">Role</span>
            <span className="detail-value">{user.role}</span>
          </div>
          <div className="profile-detail-row">
            <span className="detail-label">Status</span>
            <span className="detail-value status-active">● Active</span>
          </div>
        </div>
      </div>

      <button
        className="btn-danger logout-btn"
        onClick={() => setShowLogoutModal(true)}
      >
        Logout
      </button>

      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">👋</div>
            <p className="modal-message">Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}