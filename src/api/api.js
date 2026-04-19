const BASE_URL = "https://dummyjson.com/products";

export const fetchProducts = async () => {
  const res = await fetch(`${BASE_URL}?limit=30`);
  const data = await res.json();
  return data.products;
};

export const fetchProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`);
  return res.json();
};