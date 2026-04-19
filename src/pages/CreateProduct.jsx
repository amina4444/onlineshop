import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const CATEGORIES = [
  "smartphones", "laptops", "fragrances", "skincare",
  "groceries", "home-decoration", "furniture", "tops",
  "womens-dresses", "womens-shoes", "mens-shirts", "other"
];

export default function CreateProduct({ onAdd }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    thumbnail: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (form.title.trim().length < 3) errs.title = "Title must be at least 3 characters";
    if (!form.price) errs.price = "Price is required";
    if (isNaN(form.price) || Number(form.price) <= 0) errs.price = "Enter a valid price";
    if (!form.description.trim()) errs.description = "Description is required";
    if (form.description.trim().length < 10) errs.description = "Description too short (min 10 chars)";
    if (!form.category) errs.category = "Please select a category";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const newProduct = {
      id: `custom-${Date.now()}`,
      title: form.title.trim(),
      price: parseFloat(form.price),
      description: form.description.trim(),
      category: form.category,
      thumbnail: form.thumbnail || `https://placehold.co/300x200/800020/white?text=${encodeURIComponent(form.title)}`,
      owner: user?.email,
      createdAt: new Date().toISOString(),
    };

    onAdd(newProduct);
    addToast("Product created successfully! 🎉", "success");
    navigate("/my-items");
    setLoading(false);
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">Create Product</h1>
          <p className="form-subtitle">Add a new product to the store</p>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Product Title *</label>
              <input
                className={`form-input ${errors.title ? "input-error" : ""}`}
                name="title"
                placeholder="e.g. iPhone 15 Pro"
                value={form.title}
                onChange={handleChange}
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Price ($) *</label>
              <input
                className={`form-input ${errors.price ? "input-error" : ""}`}
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
              />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className={`form-input ${errors.category ? "input-error" : ""}`}
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <span className="field-error">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className={`form-input form-textarea ${errors.description ? "input-error" : ""}`}
              name="description"
              placeholder="Describe your product..."
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Thumbnail URL (optional)</label>
            <input
              className="form-input"
              name="thumbnail"
              placeholder="https://example.com/image.jpg"
              value={form.thumbnail}
              onChange={handleChange}
            />
            <span className="form-hint">Leave blank to auto-generate</span>
          </div>

          {form.thumbnail && (
            <div className="img-preview">
              <img src={form.thumbnail} alt="Preview" onError={(e) => e.target.style.display = "none"} />
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="spinner"></span> : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}