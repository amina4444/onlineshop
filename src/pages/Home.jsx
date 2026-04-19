import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/api";

const CATEGORIES = [
  { name: "Smartphones", icon: "📱", query: "smartphones" },
  { name: "Laptops", icon: "💻", query: "laptops" },
  { name: "Fragrances", icon: "🌸", query: "fragrances" },
  { name: "Beauty", icon: "✨", query: "beauty" },
  { name: "Groceries", icon: "🛒", query: "groceries" },
  { name: "Furniture", icon: "🏠", query: "furniture" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchProducts().then((products) => {
      setFeatured(products.slice(0, 4));
    });
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">New Collection 2026</span>
          <h1 className="hero-title">
            Best products <br />
            <span className="hero-accent"> for you</span>
          </h1>
          <p className="hero-subtitle">
            Shop thousands of premium products with fast delivery and easy returns.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn-primary">Shop Now →</Link>
            <Link to="/register" className="btn-outline">Join Free</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>10K+</strong><span>Products</span></div>
            <div className="stat"><strong>50K+</strong><span>Customers</span></div>
            <div className="stat"><strong>4.9★</strong><span>Rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-blob"></div>
          <div className="hero-img-stack">
            {featured[0] && (
              <img src={featured[0].thumbnail} alt="featured" className="hero-img hero-img-main" />
            )}
            {featured[1] && (
              <img src={featured[1].thumbnail} alt="featured2" className="hero-img hero-img-secondary" />
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" className="section-link">View all →</Link>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.query}`}
              className="category-card"
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

  
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/products" className="section-link">See all →</Link>
        </div>
        <div className="featured-grid">
          {featured.map((p) => (
            <Link key={p.id} to={`/products/${p.id}`} className="featured-card">
              <div className="featured-img-wrap">
                <img src={p.thumbnail} alt={p.title} />
              </div>
              <div className="featured-info">
                <p className="featured-category">{p.category}</p>
                <h3 className="featured-title">{p.title}</h3>
                <p className="featured-price">${p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-content">
          <h2>Ready to start shopping?</h2>
          <p>Create a free account and get 10% off your first order.</p>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </section>
    </div>
  );
}