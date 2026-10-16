import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FileText, Download, Store, Truck } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });

  if (!product) return notFound();

  const highlights: string[] = JSON.parse(product.highlights || "[]");
  const specs: Record<string, string> = JSON.parse(product.specs || "{}");
  const manuals: { title: string; size: string; url: string }[] = JSON.parse(product.manuals || "[]");
  const savings = (product.oldPrice - product.price).toFixed(2);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center justify-between text-xs text-gray-600 border-b pb-3">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-[#0046be] hover:underline">Harlow Forte</Link>
          <span>/</span>
          <Link href={`/category/${product.category.slug}`} className="text-[#0046be] font-bold hover:underline">
            {product.category.name}
          </Link>
          <span>/</span>
          <span>{product.brand}</span>
        </div>
        <Link href={`/category/${product.category.slug}`} className="text-[#0046be] font-bold hover:underline">
          &larr; Back to {product.category.name}
        </Link>
      </nav>

      {/* Main Product Box */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className="border-b pb-4">
          <span className="text-xs font-extrabold uppercase text-[#0046be]">{product.brand}</span>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
          <div className="flex gap-4 text-xs text-gray-600 mt-2">
            <span><strong>Model:</strong> {product.model}</span>
            <span><strong>SKU:</strong> {product.sku}</span>
            <span><strong>Rating:</strong> ⭐ {product.rating} ({product.reviews} reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex justify-center items-center p-4">
            <img src={product.image} alt={product.name} className="max-h-96 object-contain" />
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-5 border-t lg:border-t-0 lg:border-l lg:pl-8 pt-6 lg:pt-0">
            <div className="space-y-4">
              <span className="bg-red-600 text-white text-xs font-extrabold px-2 py-0.5 rounded uppercase">
                Price Match Guarantee
              </span>
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  Save ${savings}
                </span>
              </div>
              <p className="text-xs text-gray-500">Was ${product.oldPrice.toFixed(2)}</p>

              <div className="border border-gray-200 rounded-lg divide-y text-sm">
                <div className="p-3.5 flex items-start space-x-3">
                  <Store className="w-5 h-5 text-[#0046be] mt-0.5" />
                  <div>
                    <p className="font-bold">Pickup Ready in 1 Hour</p>
                    <p className="text-xs text-gray-600">At Harlow Forte Main Flagship Showroom</p>
                  </div>
                </div>
                <div className="p-3.5 flex items-start space-x-3">
                  <Truck className="w-5 h-5 text-[#0046be] mt-0.5" />
                  <div>
                    <p className="font-bold text-green-700">Free Next-Day Shipping</p>
                    <p className="text-xs text-gray-600">Fast doorstep delivery on all qualifying orders.</p>
                  </div>
                </div>
              </div>
            </div>

            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {/* Overview & Highlights */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold border-b pb-3">Overview & Key Features</h2>
        <p className="text-sm text-gray-700">{product.description}</p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700">
          {highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>

      {/* Specifications Table */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold border-b pb-3">Technical Specifications</h2>
        <div className="border border-gray-200 rounded overflow-hidden">
          {Object.entries(specs).map(([key, val], idx) => (
            <div
              key={key}
              className={`grid grid-cols-1 sm:grid-cols-3 py-3 px-4 ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } border-b border-gray-200 text-sm`}
            >
              <div className="font-semibold text-gray-700">{key}</div>
              <div className="sm:col-span-2 text-gray-900">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Manuals & Documentation */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold border-b pb-3">Manuals, Guides & Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {manuals.map((man, i) => (
            <a
              key={i}
              href={man.url}
              className="flex items-center justify-between p-3.5 border border-gray-200 rounded-lg hover:border-[#0046be] transition"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-red-600" />
                <div>
                  <p className="text-sm font-bold text-[#0046be]">{man.title}</p>
                  <p className="text-xs text-gray-500">PDF Document &bull; {man.size}</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-[#0046be]" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}