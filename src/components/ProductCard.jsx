import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ product, onDelete, onToggleFavorite }) {
  const { user, isFavorite } = useAuth();
  const isOwner = product.owner === user?.email;
  const canEdit = user && (isOwner || user.role === "admin");
  const fav = isFavorite(product.id);

  return (
    <div className="product-card">
      {product.thumbnail && (
        <Link to={`/products/${product.id}`}>
          <div className="product-img-wrap">
            <img src={product.thumbnail} alt={product.title} className="product-img" />
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
            {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
            <span className="rating-val">{product.rating}</span>
          </div>
        )}

        <div className="product-footer">
          <span className="product-price">${Number(product.price).toFixed(2)}</span>

          <div className="product-actions">
            {user && (
              <button
                className={`btn-fav ${fav ? "active" : ""}`}
                onClick={() => onToggleFavorite(product.id)}
                title={fav ? "Remove from favorites" : "Add to favorites"}
              >
                {fav ? "❤" : "♡"}
              </button>
            )}

            {canEdit && (
              <>
                <Link to={`/products/${product.id}/edit`}>
                  <button className="btn-edit" title="Edit">✎</button>
                </Link>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(product.id)}
                  title="Delete"
                >
                  🗑
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}