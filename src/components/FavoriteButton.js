"use client";

import { FaHeart, FaRegHeart } from "react-icons/fa";

import { useApp } from "@/context/AppContext";

export default function FavoriteButton({ productId, className = "" }) {
  const { favorites, addToFavorites, removeFromFavorites } = useApp();
  const isFavorite = favorites.includes(productId);

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={`flex items-center justify-center rounded-full bg-white/90 shadow backdrop-blur-sm transition hover:scale-110 ${className}`}
    >
      {isFavorite ? (
        <FaHeart className="text-salmon" />
      ) : (
        <FaRegHeart className="text-teal/60" />
      )}
    </button>
  );
}
