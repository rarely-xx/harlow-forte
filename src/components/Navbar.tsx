"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Store, User, X, Trash2, Settings, Heart, Package, LogOut } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type Currency = "USD" | "NGN";

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "qty">) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  exchangeRate: number;
  formatPrice: (usdAmount: number) => string;
};

const EXCHANGE_RATE = 1600;

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export function CartProvider({
  children,
  categories,
  session,
}: {
  children: React.ReactNode;
  categories: { id: number; name: string; slug: string }[];
  session: any;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("hf_cart");
      const savedCurr = localStorage.getItem("hf_currency") as Currency;
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedCurr === "USD" || savedCurr === "NGN") setCurrency(savedCurr);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("hf_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const handleCurrencyChange = (newCurr: Currency) => {
    setCurrency(newCurr);
    try {
      localStorage.setItem("hf_currency", newCurr);
    } catch {}
  };

  const formatPrice = (usdAmount: number) => {
    if (currency === "NGN") {
      const ngn = Math.round(usdAmount * EXCHANGE_RATE);
      return `₦${ngn.toLocaleString("en-NG")}`;
    }
    return `$${usdAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const addToCart = (product: Omit<CartItem, "qty">) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("hf_cart");
    } catch {}
  };

  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPriceUSD = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        currency,
        setCurrency: handleCurrencyChange,
        exchangeRate: EXCHANGE_RATE,
        formatPrice,
      }}
    >
      {/* Top Utility Bar */}
      <div className="bg-[#00338a] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex space-x-6">
            <Link href="/" className="hover:underline">Harlow Forte Outlet</Link>
            <Link href="/" className="hover:underline">Harlow Forte Business</Link>
          </div>

          <div className="flex items-center space-x-5">
            <div className="flex items-center bg-blue-950/90 border border-blue-700 rounded p-0.5">
              <button
                type="button"
                onClick={() => handleCurrencyChange("NGN")}
                className={`px-2 py-0.5 rounded text-[11px] font-extrabold transition cursor-pointer ${
                  currency === "NGN" ? "bg-[#ffe000] text-gray-900" : "text-gray-200 hover:text-white"
                }`}
              >
                🇳🇬 NGN (₦)
              </button>
              <button
                type="button"
                onClick={() => handleCurrencyChange("USD")}
                className={`px-2 py-0.5 rounded text-[11px] font-extrabold transition cursor-pointer ${
                  currency === "USD" ? "bg-[#ffe000] text-gray-900" : "text-gray-200 hover:text-white"
                }`}
              >
                🇺🇸 USD ($)
              </button>
            </div>

            <Link
              href="/admin"
              className="text-[#ffe000] font-bold hover:underline flex items-center space-x-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-[#0046be] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Harlow Forte" className="h-10 md:h-12 w-auto object-contain bg-white rounded p-1" />
          </Link>

          <form action="/" method="GET" className="w-full md:max-w-2xl order-3 md:order-2 relative">
            <input
              name="q"
              type="text"
              placeholder="Search laptops, OLED TVs, unlocked phones..."
              className="w-full py-2.5 pl-4 pr-12 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#ffe000]"
            />
            <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 text-[#0046be]">
              <Search className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center space-x-6 order-2 md:order-3 font-semibold text-sm">
            <div className="hidden lg:flex items-center space-x-2">
              <Store className="w-5 h-5" />
              <div className="leading-tight">
                <span className="block text-xs font-normal text-gray-200">Store Pickup</span>
                <span>Lekki Flagship</span>
              </div>
            </div>

            {/* Wishlist Link */}
            <Link href="/wishlist" className="relative hover:text-[#ffe000] transition" title="Saved Wishlist">
              <Heart className="w-6 h-6" />
            </Link>

            {/* USER AUTH ACCOUNT DROPDOWN */}
            <div className="relative">
              {session?.user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 hover:text-[#ffe000] cursor-pointer"
                >
                  {session.user.image ? (
                    <img src={session.user.image} alt="User" className="w-7 h-7 rounded-full border border-white" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span className="hidden sm:inline font-bold truncate max-w-[100px]">{session.user.name}</span>
                </button>
              ) : (
                <Link
                  href="/signin"
                  className="flex items-center space-x-1.5 hover:text-[#ffe000] bg-white/10 px-3 py-1.5 rounded transition"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && session?.user && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 py-2 z-50 text-xs font-normal">
                  <div className="px-4 py-2 border-b text-gray-500 truncate">
                    Signed in as <br /><strong className="text-gray-900">{session.user.email}</strong>
                  </div>
                  <Link
                    href="/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2.5 hover:bg-gray-100 font-medium"
                  >
                    <Package className="w-4 h-4 text-[#0046be]" />
                    <span>My Order History</span>
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2.5 hover:bg-gray-100 font-medium"
                  >
                    <Heart className="w-4 h-4 text-red-600" />
                    <span>Saved Wishlist</span>
                  </Link>
                  <div className="border-t my-1"></div>
                  
                  {/* Sign Out Form */}
                  <form action={signOutAction}>
                    <button type="submit" className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 font-medium text-left cursor-pointer">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </form>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-2 hover:text-[#ffe000] relative cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2.5 bg-[#ffe000] text-gray-900 font-extrabold text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCount}
                </span>
              </div>
              <span className="hidden sm:inline font-bold">Cart</span>
            </button>
          </div>
        </div>

        <nav className="bg-[#00338a] border-t border-blue-800 text-sm font-medium overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex space-x-6 whitespace-nowrap">
            <Link href="/" className="text-[#ffe000] font-bold hover:underline">Top Deals</Link>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} className="hover:text-[#ffe000] hover:underline transition">
                {cat.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 min-h-screen">{children}</main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl">
            <div className="p-4 bg-[#0046be] text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Your Harlow Forte Cart</h3>
              <button onClick={() => setIsCartOpen(false)} className="cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-3 gap-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain border rounded p-1" />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold line-clamp-2">{item.name}</h4>
                      <div className="text-sm font-extrabold text-[#0046be] mt-1">
                        {formatPrice(item.price)} <span className="text-xs text-gray-500 font-normal">x {item.qty}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-600 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t bg-gray-50 space-y-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Estimated Total:</span>
                <span className="text-[#0046be]">{formatPrice(totalPriceUSD)}</span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/checkout");
                }}
                className="w-full bg-[#ffe000] hover:bg-yellow-400 disabled:bg-gray-300 text-gray-900 font-extrabold py-3 rounded shadow transition cursor-pointer"
              >
                Continue to Checkout &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}