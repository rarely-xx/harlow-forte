import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { Store, ShieldCheck, Truck, Headphones, Award, Cpu, MapPin, Phone, Mail } from "lucide-react";

export const instant = false;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; brand?: string }>;
}) {
  const { q, brand } = await searchParams;

  // Build query filters
  const whereClause: any = {};
  if (q) {
    whereClause.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { brand: { contains: q } },
    ];
  }
  if (brand && brand !== "all") {
    whereClause.brand = { equals: brand };
  }

  // Fetch products and distinct brands safely
  let products: any[] = [];
  let uniqueBrands: string[] = [];

  try {
    if (prisma && typeof (prisma as any).product?.findMany === "function") {
      products = await (prisma as any).product.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
      });
      const allProducts = await (prisma as any).product.findMany({ select: { brand: true } });
      uniqueBrands = Array.from(new Set(allProducts.map((p: any) => p.brand)));
    }
  } catch (err) {
    console.error("Home fetch error:", err);
  }

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#00338a] to-[#0046be] text-white rounded-xl p-8 shadow-md flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-3 max-w-xl">
          <span className="bg-[#ffe000] text-gray-900 font-extrabold text-xs px-3 py-1 rounded uppercase tracking-wider">
            Flagship Tech Deal
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Next-Gen Electronics & Gadgets</h1>
          <p className="text-sm text-gray-200">
            Shop premium laptops, OLED televisions, and unlocked smartphones with express Lekki store pickup or nationwide doorstep delivery.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=600"
          alt="Gadgets"
          className="w-full md:w-80 h-44 object-cover rounded-lg shadow-lg border border-blue-400/30"
        />
      </div>

      {/* Value Proposition Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-gray-200 p-4 rounded-lg text-xs font-bold text-gray-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <Store className="w-6 h-6 text-[#0046be]" />
          <div><span>1-Hour Store Pickup</span><p className="text-[10px] font-normal text-gray-500">Lekki Flagship Center</p></div>
        </div>
        <div className="flex items-center space-x-3">
          <Truck className="w-6 h-6 text-[#0046be]" />
          <div><span>Express Delivery</span><p className="text-[10px] font-normal text-gray-500">Nationwide shipping</p></div>
        </div>
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-6 h-6 text-[#0046be]" />
          <div><span>100% Genuine Tech</span><p className="text-[10px] font-normal text-gray-500">Official manufacturer warranty</p></div>
        </div>
        <div className="flex items-center space-x-3">
          <Headphones className="w-6 h-6 text-[#0046be]" />
          <div><span>24/7 Expert Support</span><p className="text-[10px] font-normal text-gray-500">Call or WhatsApp us</p></div>
        </div>
      </div>

      {/* Interactive Brand Filters */}
      <ProductFilters brands={uniqueBrands} />

      {/* Product Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-gray-900">
            {q ? `Search Results for "${q}"` : brand ? `${brand} Gadgets` : "Featured Electronics"}
          </h2>
          <span className="text-xs font-bold text-gray-500">{products.length} items found</span>
        </div>

        {products.length === 0 ? (
          <div className="bg-white border rounded-lg p-16 text-center space-y-3 shadow-sm">
            <p className="text-gray-500 font-medium">No products match your selected filter.</p>
            <a href="/" className="inline-block bg-[#0046be] text-white text-xs font-bold px-4 py-2 rounded">
              Clear Filters
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      
          </div>
  );
}