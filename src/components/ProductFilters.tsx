"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProductFilters({ brands }: { brands: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentBrand = searchParams.get("brand") || "all";

  const handleBrandChange = (brand: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (brand === "all") {
      params.delete("brand");
    } else {
      params.set("brand", brand);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6 flex flex-wrap items-center gap-3">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filter by Brand:</span>
      <button
        onClick={() => handleBrandChange("all")}
        className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer ${
          currentBrand === "all" ? "bg-[#0046be] text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All Brands
      </button>
      {brands.map((brand) => (
        <button
          key={brand}
          onClick={() => handleBrandChange(brand)}
          className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer ${
            currentBrand.toLowerCase() === brand.toLowerCase()
              ? "bg-[#0046be] text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {brand}
        </button>
      ))}
    </div>
  );
}