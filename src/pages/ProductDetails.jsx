import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function ProductDetails({ getProduct, onDelete }) {
  const { id } = useParams();
  const { user, addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    const local = getProduct(id);
    if (local) {
      setProduct(local);
      setLoading(false);
      return;
    }
    
    import("../api/api").then(({ fetchProduct }) => {
      fetchProduct(id)
        .then((data) => { setProduct(data); setLoading(false); })
        .catch(() => { setLoading(false); });
    });
  }, [id]);

  if (loading) return (
    <div className="loading-screen"><div className="spinner-large"></div><p>Loading...</p></div>
  );

  if (!product) return (
    <div className="error-screen">
      <span className="error-icon">😕</span>
      <h2>Product not found</h2>
      <Link to="/products" className="btn-primary">Back to Products</Link>
    </div>
  );

  const fav = isFavorite(product.id);
  const isOwner = product.owner === user?.email;
  const canEdit = user && (product.owner === user.email || user.role === "admin");
  const images = product.images?.length ? product.images : [product.thumbnail];

  const handleFav = () => {
    if (!user) { addToast("Login to save favorites", "info"); return; }
    if (fav) { removeFromFavorites(product.id); addToast("Removed from favorites", "info"); }
    else { addToFavorites(product.id); addToast("Added to favorites ❤", "success"); }
  };

  const handleDelete = () => {
    onDelete(product.id);
    addToast("Product deleted", "info");
    navigate("/products");
  };

  return (
    <div className="product-detail">
      <Link to="/products" className="back-link">← Back to Products</Link>

      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="main-img-wrap">
            <img
              src={images[activeImg] || product.thumbnail}
              alt={product.title}
              className="main-img"
              onError={(e) => { e.target.src = product.thumbnail; }}
            />
          </div>
          {images.length > 1 && (
            <div className="thumbnails">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className={`thumb ${i === activeImg ? "active" : ""}`}
                  onClick={() => setActiveImg(i)}
                  onError={(e) => { e.target.src = product.thumbnail; }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          {product.category && (
            <span className="detail-category">{product.category}</span>
          )}
          <h1 className="detail-title">{product.title}</h1>

          {product.rating && (
            <div className="detail-rating">
              {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
              <span>{product.rating} / 5</span>
            </div>
          )}

          {product.brand && (
            <p className="detail-brand">Brand: <strong>{product.brand}</strong></p>
          )}

          <p className="detail-description">{product.description}</p>

          <div className="detail-price-row">
            <span className="detail-price">${Number(product.price).toFixed(2)}</span>
            {product.discountPercentage && (
              <span className="detail-discount">-{Math.round(product.discountPercentage)}%</span>
            )}
          </div>

          {product.stock !== undefined && (
            <p className={`detail-stock ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
              {product.stock > 0 ? `✓ In stock (${product.stock})` : "✕ Out of stock"}
            </p>
          )}

          <div className="detail-actions">
            <button className={`btn-fav-large ${fav ? "active" : ""}`} onClick={handleFav}>
              {fav ? "❤ Saved" : "♡ Save"}
            </button>

            {canEdit && (
              <>
                <Link to={`/products/${product.id}/edit`}>
                  <button className="btn-edit-large">✎ Edit</button>
                </Link>
                <button className="btn-danger" onClick={handleDelete}>🗑 Delete</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}