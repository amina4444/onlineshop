import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import ConfirmModal from "../components/ConfirmModal";

const ITEMS_PER_PAGE = 9;

export default function Products({ allProducts, loading, error, onDelete }) {
  const { user, addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);


  const categories = useMemo(() => {
    const cats = [...new Set(allProducts.map((p) => p.category).filter(Boolean))];
    return cats.sort();
  }, [allProducts]);


  const filtered = useMemo(() => {
    let result = [...allProducts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result
        .filter((p) => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
        .sort((a, b) => {
          const aS = a.title?.toLowerCase().startsWith(q);
          const bS = b.title?.toLowerCase().startsWith(q);
          return aS === bS ? 0 : aS ? -1 : 1;
        });
    }

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    if (onlyMine) {
      result = result.filter((p) => p.owner === user?.email);
    }

    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sort === "name") result.sort((a, b) => a.title?.localeCompare(b.title));
    if (sort === "rating") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return result;
  }, [allProducts, search, category, sort, onlyMine, user]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleToggleFavorite = (id) => {
    if (!user) {
      addToast("Please login to save favorites", "info");
      return;
    }
    if (isFavorite(id)) {
      removeFromFavorites(id);
      addToast("Removed from favorites", "info");
    } else {
      addToFavorites(id);
      addToast("Added to favorites ❤", "success");
    }
  };

  const handleDeleteRequest = (id) => setDeleteTarget(id);

  const handleDeleteConfirm = () => {
    onDelete(deleteTarget);
    addToast("Product deleted", "info");
    setDeleteTarget(null);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("");
    setOnlyMine(false);
    setCurrentPage(1);
  };

  const hasFilters = search || category || sort || onlyMine;

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner-large"></div>
      <p>Loading products...</p>
    </div>
  );

  if (error) return (
    <div className="error-screen">
      <span className="error-icon">⚠</span>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="page-title">All Products</h1>
        <span className="results-count">{filtered.length} items</span>
      </div>


      <div className="filters-bar">
        <div className="search-wrap">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className="search-input"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
          />
          {search && (
            <button className="search-clear" onClick={() => { setSearch(""); setCurrentPage(1); }}>×</button>
          )}
        </div>

        <select
          className="filter-select"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={sort}
          onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name">Name A–Z</option>
          <option value="rating">Top Rated</option>
        </select>

        {user && (
          <button
            className={`filter-toggle ${onlyMine ? "active" : ""}`}
            onClick={() => { setOnlyMine(!onlyMine); setCurrentPage(1); }}
          >
            {onlyMine ? "✓ My Items" : "My Items"}
          </button>
        )}

        {hasFilters && (
          <button className="clear-filters" onClick={clearFilters}>
            Clear all
          </button>
        )}
      </div>

      { }
      {paginated.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
          {hasFilters && (
            <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {paginated.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDeleteRequest}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

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