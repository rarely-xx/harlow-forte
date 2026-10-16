"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveProductAction(formData: FormData) {
  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const name = String(formData.get("name") || "").trim();
  const brand = String(formData.get("brand") || "").trim();
  const model = String(formData.get("model") || "").trim();
  const sku = String(formData.get("sku") || "").trim();
  const categoryId = Number(formData.get("categoryId"));
  const price = parseFloat(String(formData.get("price") || "0"));
  const oldPrice = parseFloat(String(formData.get("oldPrice") || price));
  const badge = String(formData.get("badge") || "Top Deal").trim();
  const image = String(formData.get("image") || "").trim();
  const description = String(formData.get("description") || "").trim();

  // Convert multiline gallery URLs into JSON array
  const galleryRaw = String(formData.get("gallery") || "");
  const galleryList = galleryRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const gallery = JSON.stringify(galleryList.length > 0 ? galleryList : [image]);

  // Convert multiline highlights into JSON array
  const highlightsRaw = String(formData.get("highlights") || "");
  const highlights = JSON.stringify(
    highlightsRaw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
  );

  // Convert "Key: Value" lines into JSON object for Technical Specifications
  const specsRaw = String(formData.get("specs") || "");
  const specsObj: Record<string, string> = {};
  specsRaw.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const val = line.slice(colonIndex + 1).trim();
      if (key && val) specsObj[key] = val;
    }
  });
  const specs = JSON.stringify(specsObj);

  // Convert "Title | Size | URL" lines into JSON array for Manuals
  const manualsRaw = String(formData.get("manuals") || "");
  const manualsList = manualsRaw
    .split("\n")
    .map((line) => {
      const parts = line.split("|").map((s) => s.trim());
      if (!parts[0]) return null;
      return {
        title: parts[0],
        size: parts[1] || "2.5 MB",
        url: parts[2] || "#",
      };
    })
    .filter(Boolean);
  const manuals = JSON.stringify(manualsList);

  const payload = {
    name,
    brand,
    model,
    sku,
    categoryId,
    price,
    oldPrice,
    badge,
    image,
    gallery,
    description,
    highlights,
    specs,
    manuals,
  };

  if (id) {
    // Update existing product
    await prisma.product.update({
      where: { id },
      data: payload,
    });
  } else {
    // Create new product
    await prisma.product.create({
      data: payload,
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  if (id) revalidatePath(`/product/${id}`);
}

export async function deleteProductAction(id: number) {
  await prisma.product.delete({
    where: { id },
  });
  revalidatePath("/");
  revalidatePath("/admin");
}