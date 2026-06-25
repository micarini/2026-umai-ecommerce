"use client";

import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeUser, setActiveUser] = useState(null);

  // --- Cart ---

  function addToCart(item) {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.productId === item.productId &&
          JSON.stringify(i.customizations) === JSON.stringify(item.customizations)
      );
      if (existingIndex >= 0) {
        return prev.map((i, idx) =>
          idx === existingIndex
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                subtotal: (i.quantity + item.quantity) * i.price,
              }
            : i
        );
      }
      return [...prev, { ...item, subtotal: item.price * item.quantity }];
    });
  }

  function removeFromCart(productId, customizations) {
    setCart((prev) =>
      prev.filter(
        (i) =>
          !(
            i.productId === productId &&
            JSON.stringify(i.customizations) === JSON.stringify(customizations)
          )
      )
    );
  }

  function updateCartQuantity(productId, customizations, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId, customizations);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId &&
        JSON.stringify(i.customizations) === JSON.stringify(customizations)
          ? { ...i, quantity, subtotal: i.price * quantity }
          : i
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  // --- Favorites ---

  function addToFavorites(productId) {
    setFavorites((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
    if (activeUser) {
      fetch(`/api/users/${activeUser._id}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
    }
  }

  function removeFromFavorites(productId) {
    setFavorites((prev) => prev.filter((id) => id !== productId));
    if (activeUser) {
      fetch(`/api/users/${activeUser._id}/favorites/${productId}`, {
        method: "DELETE",
      });
    }
  }

  // --- User ---

  async function login(userData) {
    setActiveUser(userData);

    // Traer favoritos del usuario desde la DB y mergear con los temporales
    try {
      const res = await fetch(`/api/users/${userData._id}/favorites`);
      if (res.ok) {
        const { favorites: dbFavorites } = await res.json();
        const dbIds = dbFavorites.map((f) => (typeof f === "string" ? f : String(f._id)));

        setFavorites((prev) => {
          const merged = [...new Set([...prev, ...dbIds])];

          // Si hay favoritos temporales que no estaban en la DB, sincronizarlos
          if (merged.length > dbIds.length) {
            fetch(`/api/users/${userData._id}/favorites/sync`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productIds: merged }),
            });
          }

          return merged;
        });
      }
    } catch {
      // Si falla la carga de favoritos, el usuario igual queda logueado
    }
  }

  function logout() {
    setActiveUser(null);
    setFavorites([]);
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        cart,
        cartTotal,
        cartCount,
        favorites,
        activeUser,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addToFavorites,
        removeFromFavorites,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
