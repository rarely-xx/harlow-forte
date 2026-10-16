import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";

export const instant = false;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let category: any = null;
  let products: any[] = [];

  try {
    if (prisma && typeof (prisma as any).category?.findUnique === "function") {
      category = await (prisma as any).category.findUnique({
        where: { slug },
        include: { products: true },
      });
      products = category?.products || [];
    }
  } catch (err) {
    console.error("Category fetch error:", err);
  }

  if (!category) {
    return (
      <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-lg p-12 text-center space-y-4 my-12 shadow-sm">
        <h1 className="text-2xl font-extrabold text-gray-900">Category Not Found</h1>
        <p className="text-sm text-gray-500">The department you are looking for does not exist or has been removed.</p>
        <Link href="/" className="inline-block bg-[#0046be] text-white font-bold px-6 py-2.5 rounded shadow">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/" className="text-xs text-[#0046be] font-bold flex items-center space-x-1">
        <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Store</span>
      </Link>

      <div className="bg-gradient-to-r from-[#00338a] to-[#0046be] text-white rounded-xl p-6 shadow-md flex items-center justify-between">
        <div>
          <span className="bg-[#ffe000] text-gray-900 font-extrabold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">
            Department Catalog
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-2">{category.name}</h1>
          <p className="text-xs text-gray-200 mt-1">Explore top-tier hardware and electronics under {category.name}.</p>
        </div>
        <Layers className="w-12 h-12 text-blue-200/50 hidden sm:block" />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-extrabold text-gray-900">Products in {category.name}</h2>
        <span className="text-xs font-bold text-gray-500">{products.length} items available</span>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center space-y-3 shadow-sm">
          <p className="text-gray-500 font-medium">No products available in this department yet.</p>
          <Link href="/" className="inline-block bg-[#0046be] text-white text-xs font-bold px-4 py-2 rounded">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}