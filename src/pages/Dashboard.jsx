import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#800020", "#b0003a", "#d4a5a5", "#5a0018", "#ff6b8a"];

export default function Dashboard({ allProducts }) {
  const { user } = useAuth();

  const myProducts = allProducts.filter((p) => p.owner === user?.email);

  // Category breakdown of all products (top 5)
  const categoryCounts = {};
  allProducts.forEach((p) => {
    if (p.category) categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // My items price bar data
  const priceData = myProducts.slice(0, 6).map((p) => ({
    name: p.title.slice(0, 12) + (p.title.length > 12 ? "…" : ""),
    price: parseFloat(p.price),
  }));

  const stats = [
    { icon: "🛍", label: "Total Products", value: allProducts.length, color: "#800020" },
    { icon: "📦", label: "My Items", value: myProducts.length, color: "#5a0018" },
    { icon: "❤", label: "Favorites", value: user?.favorites?.length || 0, color: "#d4003a" },
    { icon: "🔐", label: "Role", value: user?.role?.toUpperCase(), color: "#800020" },
  ];

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">Welcome back, <strong>{user?.email}</strong></p>
        </div>
        <Link to="/create" className="btn-primary">+ New Product</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info">
              <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Category Pie */}
        <div className="chart-card">
          <h3 className="chart-title">Products by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="chart-empty">No data yet</p>
          )}
        </div>

        {/* My items bar chart */}
        <div className="chart-card">
          <h3 className="chart-title">My Items — Prices</h3>
          {priceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e0e0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `$${v}`} />
                <Bar dataKey="price" fill="#800020" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">
              <p>No items yet.</p>
              <Link to="/create" className="btn-primary" style={{ marginTop: 8 }}>Create first item</Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="quick-links">
        <h3>Quick Actions</h3>
        <div className="quick-grid">
          <Link to="/products" className="quick-card">🛒 Browse Products</Link>
          <Link to="/create" className="quick-card">➕ Create Product</Link>
          <Link to="/favorites" className="quick-card">❤ Favorites ({user?.favorites?.length || 0})</Link>
          <Link to="/my-items" className="quick-card">📦 My Items ({myProducts.length})</Link>
          <Link to="/profile" className="quick-card">👤 Profile</Link>
          {user?.role === "admin" && <Link to="/admin" className="quick-card admin-link">⚙ Admin Panel</Link>}
        </div>
      </div>
    </div>
  );
}