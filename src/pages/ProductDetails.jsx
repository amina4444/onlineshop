import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProduct } from "../api/api";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct(id).then(setProduct);
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h2>{product.title}</h2>
      <img src={product.thumbnail} width="200" />
      <p>{product.description}</p>
      <p>${product.price}</p>
    </div>
  );
}