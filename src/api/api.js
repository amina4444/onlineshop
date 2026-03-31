// export const fetchProducts = async () => {
//   const res = await fetch("https://fakestoreapi.com/products");

//   if (!res.ok) throw new Error("Error fetching products");

//   return res.json();
// };

// export const fetchProduct = async (id) => {
//   const res = await fetch(`https://fakestoreapi.com/products/${id}`);

//   if (!res.ok) throw new Error("Error fetching product");

//   return res.json();
// };


export const fetchProducts = async () => {
  const res = await fetch("https://dummyjson.com/products");

  if (!res.ok) throw new Error("Error fetching products");

  const data = await res.json();
  return data.products; // ⚠️ ВАЖНО
};

export const fetchProduct = async (id) => {
  const res = await fetch(`https://dummyjson.com/products/${id}`);

  if (!res.ok) throw new Error("Error fetching product");

  return res.json();
};