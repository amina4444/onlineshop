import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const ADMIN_EMAILS = ["admin@gmail.com", "admin@admin.com"];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const login = (data) => {
    const enrichedUser = {
      ...data,
      role: ADMIN_EMAILS.includes(data.email) ? "admin" : "user",
      favorites: data.favorites || [],
      myItems: data.myItems || [],
    };
    setUser(enrichedUser);
    localStorage.setItem("user", JSON.stringify(enrichedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Favorites хранят только id
  const addToFavorites = (productId) => {
    setUser((prev) => {
      if (prev.favorites.includes(productId)) return prev;
      const updated = {
        ...prev,
        favorites: [...prev.favorites, productId],
      };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromFavorites = (productId) => {
    setUser((prev) => {
      const updated = {
        ...prev,
        favorites: prev.favorites.filter((id) => id !== productId),
      };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (productId) => {
    return user?.favorites?.includes(productId) || false;
  };

  // Синхронизация myItems с внешним state
  const syncMyItems = (items) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, myItems: items };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        syncMyItems,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);