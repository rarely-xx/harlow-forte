"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface BulkProductInput {
  brand: string;
  model?: string;
  sku?: string;
  name: string;
  price: number | string;
  oldPrice?: number | string;
  badge?: string;
  image?: string;
  description?: string;
  category?: string;
  categoryId?: number | string;
  specs?: Record<string, string> | string;
  highlights?: string[] | string;
}

export async function bulkImportProducts(items: BulkProductInput[]) {
  if (!Array.isArray(items) || items.length === 0) {
    return { success: false, count: 0, error: "No valid items found in file." };
  }

  const categories = await prisma.category.findMany();
  if (categories.length === 0) {
    return {
      success: false,
      count: 0,
      error: "No categories exist in the database. Seed categories first.",
    };
  }

  let importedCount = 0;

  for (let i = 0; i < items.length; i++) {
    const raw = items[i];
    if (!raw.name || !raw.brand || raw.price === undefined) continue;

    const price = Number(String(raw.price).replace(/[^0-9.]/g, "")) || 0;
    const oldPrice = raw.oldPrice
      ? Number(String(raw.oldPrice).replace(/[^0-9.]/g, ""))
      : Math.round(price * 1.15);

    const model =
      raw.model?.trim() ||
      `${raw.brand.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const sku = (
      raw.sku?.trim() || `HF-${raw.brand.slice(0, 3)}-${model}`
    ).toUpperCase().replace(/\s+/g, "-");

    // Match category by ID, exact name/slug, or keyword fallback
    let matchedCat = categories[0];
    if (raw.categoryId) {
      const byId = categories.find((c) => c.id === Number(raw.categoryId));
      if (byId) matchedCat = byId;
    } else if (raw.category) {
      const target = raw.category.toLowerCase().trim();
      const byName = categories.find(
        (c) =>
          c.name.toLowerCase().includes(target) ||
          c.slug.toLowerCase().includes(target) ||
          target.includes(c.slug.toLowerCase())
      );
      if (byName) matchedCat = byName;
    }

    const defaultImage =
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80";
    const image = raw.image?.trim() || defaultImage;

    let specsJson = JSON.stringify({
      Brand: raw.brand,
      Model: model,
      Condition: "Brand New (Factory Sealed)",
      Warranty: "1 Year Official Harlow Forte Warranty",
    });

    if (raw.specs) {
      specsJson =
        typeof raw.specs === "string" ? raw.specs : JSON.stringify(raw.specs);
    }

    let highlightsJson = JSON.stringify([
      `100% Authentic ${raw.brand} Factory Sealed Hardware`,
      "1-Year Official Warranty + Printable Receipt",
      "1-Hour Pickup in Lekki Phase 1 or Fast Delivery Nationwide",
    ]);

    if (raw.highlights) {
      highlightsJson =
        typeof raw.highlights === "string"
          ? raw.highlights
          : JSON.stringify(raw.highlights);
    }

    await prisma.product.upsert({
      where: { sku },
      update: {
        brand: raw.brand.trim(),
        model,
        name: raw.name.trim(),
        price,
        oldPrice,
        badge: raw.badge?.trim() || "New Arrival",
        image,
        description:
          raw.description?.trim() ||
          `Authentic factory-sealed ${raw.name} by ${raw.brand}. Certified for 220V–240V Nigerian power standards and backed by Harlow Forte's 1-Year Official Warranty.`,
        categoryId: matchedCat.id,
      },
      create: {
        brand: raw.brand.trim(),
        model,
        sku,
        name: raw.name.trim(),
        price,
        oldPrice,
        rating: 4.8,
        reviews: 65,
        badge: raw.badge?.trim() || "New Arrival",
        image,
        gallery: JSON.stringify([image]),
        description:
          raw.description?.trim() ||
          `Authentic factory-sealed ${raw.name} by ${raw.brand}. Certified for 220V–240V Nigerian power standards and backed by Harlow Forte's 1-Year Official Warranty.`,
        highlights: highlightsJson,
        specs: specsJson,
        manuals: JSON.stringify([
          { title: `${raw.brand} Official Warranty & User Guide`, size: "1.4 MB", url: "#" },
        ]),
        categoryId: matchedCat.id,
      },
    });

    importedCount++;
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return { success: true, count: importedCount };
}