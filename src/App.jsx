import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useProducts } from "./hook/useProducts";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import MyItems from "./pages/MyItems";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function App() {
  const {
    allProducts,
    loading,
    error,
    addProduct,
    editProduct,
    deleteProduct,
    getProduct,
  } = useProducts();

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/products"
            element={
              <Products
                allProducts={allProducts}
                loading={loading}
                error={error}
                onDelete={deleteProduct}
              />
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProductDetails
                getProduct={getProduct}
                onDelete={deleteProduct}
              />
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <ProtectedRoute>
                <EditProduct getProduct={getProduct} onEdit={editProduct} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateProduct onAdd={addProduct} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard allProducts={allProducts} />
              </ProtectedRoute>
            }
          />
          <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile allProducts={allProducts} />
    </ProtectedRoute>
  }
/>
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Admin allProducts={allProducts} onDelete={deleteProduct} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites allProducts={allProducts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-items"
            element={
              <ProtectedRoute>
                <MyItems allProducts={allProducts} onDelete={deleteProduct} />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;