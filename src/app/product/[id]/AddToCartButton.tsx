"use client";

import { useCart } from "@/components/Navbar";
import { ShoppingCart } from "lucide-react";

export function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  return (
    <button
      onClick={() =>
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        })
      }
      className="w-full bg-[#ffe000] hover:bg-yellow-400 text-gray-900 font-extrabold py-3.5 rounded text-base flex items-center justify-center space-x-2 shadow-sm transition"
    >
      <ShoppingCart className="w-5 h-5" />
      <span>Add to Cart</span>
    </button>
  );
}