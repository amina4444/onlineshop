import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ConfirmModal";

export default function Admin({ allProducts, onDelete }) {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [sortBy, setSortBy] = useState("default");

    const filtered = useMemo(() => {
        let result = [...allProducts];
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title?.toLowerCase().includes(q) ||
                    p.category?.toLowerCase().includes(q) ||
                    p.owner?.toLowerCase().includes(q)
            );
        }
        if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
        if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
        if (sortBy === "name") result.sort((a, b) => a.title?.localeCompare(b.title));
        return result;
    }, [allProducts, search, sortBy]);

    const handleDeleteConfirm = () => {
        onDelete(deleteTarget);
        addToast("Product deleted", "info");
        setDeleteTarget(null);
    };

    // Stats
    const totalValue = allProducts.reduce((s, p) => s + Number(p.price || 0), 0);
    const categories = [...new Set(allProducts.map((p) => p.category).filter(Boolean))];
    const userProducts = allProducts.filter((p) => p.owner).length;

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">⚙ Admin Panel</h1>
                    <p className="page-subtitle">Manage all products and users</p>
                </div>
                <Link to="/create" className="btn-primary">+ Add Product</Link>
            </div>

            {/* Admin stats */}
            <div className="admin-stats">
                <div className="admin-stat-card">
                    <span className="admin-stat-icon">📦</span>
                    <div>
                        <p className="admin-stat-value">{allProducts.length}</p>
                        <p className="admin-stat-label">Total Products</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <span className="admin-stat-icon">🏷</span>
                    <div>
                        <p className="admin-stat-value">{categories.length}</p>
                        <p className="admin-stat-label">Categories</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <span className="admin-stat-icon">👤</span>
                    <div>
                        <p className="admin-stat-value">{userProducts}</p>
                        <p className="admin-stat-label">User Products</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <span className="admin-stat-icon">💰</span>
                    <div>
                        <p className="admin-stat-value">${totalValue.toFixed(0)}</p>
                        <p className="admin-stat-label">Total Value</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-wrap">
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        className="search-input"
                        placeholder="Search by title, category, owner..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button className="search-clear" onClick={() => setSearch("")}>×</button>
                    )}
                </div>
                <select
                    className="filter-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="default">Default order</option>
                    <option value="price-asc">Price ↑</option>
                    <option value="price-desc">Price ↓</option>
                    <option value="name">Name A–Z</option>
                </select>
                <span className="results-count">{filtered.length} items</span>
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No products found</h3>
                </div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Owner</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <div className="table-product">
                                            {p.thumbnail && (
                                                <img
                                                    src={p.thumbnail}
                                                    alt={p.title}
                                                    className="table-thumb"
                                                    onError={(e) => (e.target.style.display = "none")}
                                                />
                                            )}
                                            <div>
                                                <p className="table-title">{p.title}</p>
                                                <p className="table-id">ID: {p.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="table-badge">{p.category || "—"}</span>
                                    </td>
                                    <td className="table-price">${Number(p.price).toFixed(2)}</td>
                                    <td className="table-owner">
                                        {p.owner ? (
                                            <span className="owner-badge">{p.owner}</span>
                                        ) : (
                                            <span className="table-api">API</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <Link to={`/products/${p.id}`}>
                                                <button className="btn-icon" title="View">👁</button>
                                            </Link>
                                            <Link to={`/products/${p.id}/edit`}>
                                                <button className="btn-icon" title="Edit">✎</button>
                                            </Link>
                                            <button
                                                className="btn-icon btn-icon-danger"
                                                title="Delete"
                                                onClick={() => setDeleteTarget(p.id)}
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {deleteTarget && (
                <ConfirmModal
                    message="Are you sure you want to delete this product?"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}