import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ConfirmModal";
import { useState } from "react";

export default function MyItems({ allProducts, onDelete }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const myItems = allProducts.filter((p) => p.owner === user?.email);

  const handleDeleteConfirm = () => {
    onDelete(deleteTarget);
    addToast("Product deleted", "info");
    setDeleteTarget(null);
  };

  return (
    <div className="my-items-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">📦 My Items</h1>
          <p className="page-subtitle">Products you've created</p>
        </div>
        <Link to="/create" className="btn-primary">+ Create New</Link>
      </div>

      {myItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No items yet</h3>
          <p>Create your first product to see it here</p>
          <Link to="/create" className="btn-primary">Create Product</Link>
        </div>
      ) : (
        <div className="products-grid">
          {myItems.map((product) => (
            <div key={product.id} className="product-card">
              {product.thumbnail && (
                <Link to={`/products/${product.id}`}>
                  <div className="product-img-wrap">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="product-img"
                    />
                  </div>
                </Link>
              )}
              <div className="product-body">
                {product.category && (
                  <span className="product-category">{product.category}</span>
                )}
                <Link to={`/products/${product.id}`} className="product-title-link">
                  <h3 className="product-title">{product.title}</h3>
                </Link>
                <div className="product-footer">
                  <span className="product-price">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <div className="product-actions">
                    <Link to={`/products/${product.id}/edit`}>
                      <button className="btn-edit" title="Edit">✎</button>
                    </Link>
                    <button
                      className="btn-delete"
                      title="Delete"
                      onClick={() => setDeleteTarget(product.id)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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