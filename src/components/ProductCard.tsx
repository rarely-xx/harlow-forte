"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/Navbar";
import { ShoppingCart, Heart, Star } from "lucide-react";

export default function ProductCard({ product }: { product: any }) {
  const { addToCart, formatPrice } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const syncWishlist = () => {
    try {
      const wish = JSON.parse(localStorage.getItem("hf_wishlist") || "[]");
      setIsWishlisted(wish.some((item: any) => item.id === product.id));
    } catch {}
  };

  useEffect(() => {
    syncWishlist();
    window.addEventListener("wishlistUpdated", syncWishlist);
    return () => window.removeEventListener("wishlistUpdated", syncWishlist);
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const saved = JSON.parse(localStorage.getItem("hf_wishlist") || "[]");
      const exists = saved.some((item: any) => item.id === product.id);
      const updated = exists
        ? saved.filter((item: any) => item.id !== product.id)
        : [
            ...saved,
            {
              id: product.id,
              name: product.name,
              brand: product.brand,
              price: product.price,
              oldPrice: product.oldPrice,
              image: product.image,
            },
          ];
      localStorage.setItem("hf_wishlist", JSON.stringify(updated));
      setIsWishlisted(!exists);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch {}
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition group relative">
      <div>
        <div className="relative h-44 flex items-center justify-center mb-3 bg-gray-50/60 rounded-lg p-3">
          {product.badge && (
            <span className="absolute top-2 left-2 bg-[#0046be] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
              {product.badge}
            </span>
          )}

          <button
            onClick={toggleWishlist}
            title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white hover:bg-gray-100 border border-gray-200 shadow-xs transition cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition ${
                isWishlisted ? "text-red-600 fill-red-600" : "text-gray-400 hover:text-red-500"
              }`}
            />
          </button>

          <Link href={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-36 max-w-full object-contain group-hover:scale-105 transition duration-200"
            />
          </Link>
        </div>

        <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase mb-1">
          <span className="text-[#0046be]">{product.brand}</span>
          <span className="flex items-center text-yellow-500">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-0.5" />
            {product.rating || 4.8}
          </span>
        </div>

        <Link
          href={`/product/${product.id}`}
          className="text-xs font-extrabold text-gray-900 hover:text-[#0046be] line-clamp-2 leading-snug"
        >
          {product.name}
        </Link>
      </div>

      <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
        <div>
          <div className="text-base font-extrabold text-[#0046be]">
            {formatPrice(product.price)}
          </div>
          {product.oldPrice > product.price && (
            <div className="text-[11px] text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </div>
          )}
        </div>

        <button
          onClick={() =>
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
            })
          }
          className="w-full bg-[#ffe000] hover:bg-yellow-400 text-gray-900 font-extrabold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}