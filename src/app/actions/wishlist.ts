"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleWishlistAction(productId: number) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Must be signed in");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return;

  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: user.id,
        productId,
      },
    },
  });

  if (existing) {
    await prisma.wishlist.delete({
      where: { id: existing.id },
    });
  } else {
    await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/wishlist");
}