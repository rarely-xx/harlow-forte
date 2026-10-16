import { prisma } from "@/lib/prisma";
import { AdminClient } from "./AdminClient";

// Prevent Next.js blocking-route prerender error
export const instant = false;

export default async function AdminPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return <AdminClient products={products} categories={categories} />;
}