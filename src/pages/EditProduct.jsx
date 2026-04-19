import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";

const CATEGORIES = [
  "smartphones", "laptops", "fragrances", "skincare",
  "groceries", "home-decoration", "furniture", "tops",
  "womens-dresses", "womens-shoes", "mens-shirts", "other"
];

export default function EditProduct({ getProduct, onEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    thumbnail: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const local = getProduct(id);
    if (local) {
      setForm({
        title: local.title || "",
        price: local.price || "",
        description: local.description || "",
        category: local.category || "",
        thumbnail: local.thumbnail || "",
      });
      setLoading(false);
      return;
    }
    // Fallback to API
    import("../api/api").then(({ fetchProduct }) => {
      fetchProduct(id)
        .then((data) => {
          setForm({
            title: data.title || "",
            price: data.price || "",
            description: data.description || "",
            category: data.category || "",
            thumbnail: data.thumbnail || "",
          });
        })
        .finally(() => setLoading(false));
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.price) errs.price = "Price is required";
    if (isNaN(form.price) || Number(form.price) <= 0) errs.price = "Enter a valid price";
    if (!form.description.trim()) errs.description = "Description is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    onEdit(id, { ...form, price: parseFloat(form.price) });
    addToast("Product updated! ✓", "success");
    navigate("/products");
    setSaving(false);
  };

  if (loading) return (
    <div className="loading-screen"><div className="spinner-large"></div><p>Loading...</p></div>
  );

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">Edit Product</h1>
          <p className="form-subtitle">Update product information</p>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Product Title *</label>
              <input
                className={`form-input ${errors.title ? "input-error" : ""}`}
                name="title"
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
                value={form.price}
                onChange={handleChange}
              />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className={`form-input form-textarea ${errors.description ? "input-error" : ""}`}
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Thumbnail URL</label>
            <input
              className="form-input"
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
            />
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
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <span className="spinner"></span> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}