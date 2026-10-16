"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrderAction(data: {
  customerName: string;
  email: string;
  phone: string;
  fulfillment: string;
  address: string;
  city: string;
  state: string;
  paymentMethod: string;
  paymentRef: string;
  currency: string;
  totalAmount: number;
  items: any[];
}) {
  const orderNumber = "HF-" + Math.floor(10000000 + Math.random() * 90000000);

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      fulfillment: data.fulfillment,
      address: data.address,
      city: data.city,
      state: data.state,
      paymentMethod: data.paymentMethod,
      paymentRef: data.paymentRef,
      currency: data.currency,
      totalAmount: data.totalAmount,
      items: JSON.stringify(data.items),
    },
  });

  revalidatePath("/admin");
  return order;
}