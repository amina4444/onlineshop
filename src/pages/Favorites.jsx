import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ConfirmModal";
import { useState } from "react";

export default function Favorites({ allProducts }) {
  const { user, removeFromFavorites } = useAuth();
  const { addToast } = useToast();
  const [removeTarget, setRemoveTarget] = useState(null);

  // Get actual fresh product objects by id
  const favoriteProducts = (user?.favorites || [])
    .map((id) => allProducts.find((p) => String(p.id) === String(id)))
    .filter(Boolean);

  const handleRemoveConfirm = () => {
    removeFromFavorites(removeTarget);
    addToast("Removed from favorites", "info");
    setRemoveTarget(null);
  };

  return (
    <div className="favorites-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">❤ Favorites</h1>
          <p className="page-subtitle">Your saved products</p>
        </div>
        <Link to="/products" className="btn-outline">Browse More</Link>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💔</div>
          <h3>No favorites yet</h3>
          <p>Browse products and tap ❤ to save them here</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="products-grid">
          {favoriteProducts.map((product) => (
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
                {product.rating && (
                  <div className="product-rating">
                    {"★".repeat(Math.round(product.rating))}
                    {"☆".repeat(5 - Math.round(product.rating))}
                    <span className="rating-val">{product.rating}</span>
                  </div>
                )}
                <div className="product-footer">
                  <span className="product-price">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <button
                    className="btn-fav active"
                    onClick={() => setRemoveTarget(product.id)}
                    title="Remove from favorites"
                  >
                    ❤
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {removeTarget && (
        <ConfirmModal
          message="Remove this product from favorites?"
          onConfirm={handleRemoveConfirm}
          onCancel={() => setRemoveTarget(null)}
        />
      )}
    </div>
  );
}