"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/Navbar";
import { Heart, ArrowLeft, Trash2, ShoppingCart } from "lucide-react";

export default function WishlistPage() {
  const { addToCart, formatPrice } = useCart();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadWishlist = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("hf_wishlist") || "[]");
        setWishlistItems(saved);
      } catch {
        setWishlistItems([]);
      }
    };
    loadWishlist();
    window.addEventListener("wishlistUpdated", loadWishlist);
    return () => window.removeEventListener("wishlistUpdated", loadWishlist);
  }, []);

  const removeFromWishlist = (id: number) => {
    const updated = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updated);
    localStorage.setItem("hf_wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto my-6 px-4">
      <Link href="/" className="text-xs text-[#0046be] font-bold flex items-center space-x-1">
        <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Store</span>
      </Link>

      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center space-x-2">
          <Heart className="w-7 h-7 text-red-600 fill-red-600" />
          <span>My Saved Wishlist ({wishlistItems.length})</span>
        </h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center space-y-3 shadow-sm">
          <Heart className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-gray-500 font-medium">Your wishlist is currently empty.</p>
          <p className="text-xs text-gray-400">Click the heart icon on any gadget to save it here for later.</p>
          <Link href="/" className="inline-block bg-[#0046be] text-white text-xs font-bold px-5 py-2.5 rounded shadow mt-2">
            Explore Gadgets
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {wishlistItems.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <Link href={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-contain border rounded p-1 bg-gray-50" />
                </Link>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.brand}</span>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-extrabold text-sm text-gray-900 hover:text-[#0046be]">{product.name}</h3>
                  </Link>
                  <div className="text-sm font-extrabold text-[#0046be] mt-1">{formatPrice(product.price)}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })}
                  className="bg-[#ffe000] hover:bg-yellow-400 text-gray-900 text-xs font-extrabold px-4 py-2.5 rounded shadow flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  title="Remove from Wishlist"
                  className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}