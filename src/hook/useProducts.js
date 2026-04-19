import { useState, useEffect } from "react";
import { fetchProducts } from "../api/api";

export function useProducts() {
  const [apiProducts, setApiProducts] = useState([]);
  const [customProducts, setCustomProducts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("customProducts")) || [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts()
      .then(setApiProducts)
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const saveCustom = (items) => {
    setCustomProducts(items);
    localStorage.setItem("customProducts", JSON.stringify(items));
  };

  const addProduct = (product) => {
    const updated = [product, ...customProducts];
    saveCustom(updated);
    return product;
  };

  const editProduct = (id, updates) => {
  
    const inCustom = customProducts.find((p) => String(p.id) === String(id));
    if (inCustom) {
      saveCustom(
        customProducts.map((p) =>
          String(p.id) === String(id) ? { ...p, ...updates } : p
        )
      );
    } else {
   
      const apiProduct = apiProducts.find((p) => String(p.id) === String(id));
      if (apiProduct) {
        const promoted = { ...apiProduct, ...updates, promoted: true };
        saveCustom([promoted, ...customProducts]);
        setApiProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      }
    }
  };

  const deleteProduct = (id) => {
    const inCustom = customProducts.find((p) => String(p.id) === String(id));
    if (inCustom) {
      saveCustom(customProducts.filter((p) => String(p.id) !== String(id)));
    } else {
      setApiProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
    }
  };

  const getProduct = (id) => {
    return (
      customProducts.find((p) => String(p.id) === String(id)) ||
      apiProducts.find((p) => String(p.id) === String(id)) ||
      null
    );
  };

  const allProducts = [...customProducts, ...apiProducts];

  return {
    allProducts,
    apiProducts,
    customProducts,
    loading,
    error,
    addProduct,
    editProduct,
    deleteProduct,
    getProduct,
  };
}