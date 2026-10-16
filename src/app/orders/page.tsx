import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";
import OrderReceiptModal from "@/components/OrderReceiptModal";

export const instant = false;

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.email) {
    return (
      <div className="bg-white border p-12 text-center rounded-lg space-y-4 my-8 max-w-xl mx-auto shadow-sm">
        <h2 className="text-xl font-extrabold text-gray-900">Please Sign In to View Your Order History</h2>
        <p className="text-xs text-gray-500">Sign in with the email address you used during checkout.</p>
        <Link href="/signin" className="inline-block bg-[#0046be] text-white px-6 py-2.5 rounded font-bold text-xs shadow">
          Sign In Now
        </Link>
      </div>
    );
  }

  let orders: any[] = [];
  try {
    if (prisma && typeof (prisma as any).order?.findMany === "function") {
      orders = await (prisma as any).order.findMany({
        where: { email: session.user.email },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (err) {
    console.error("Orders fetch error:", err);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto my-6 px-4">
      <Link href="/" className="text-xs text-[#0046be] font-bold flex items-center space-x-1">
        <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Store</span>
      </Link>
      <h1 className="text-2xl font-extrabold text-gray-900 flex items-center space-x-2">
        <Package className="w-7 h-7 text-[#0046be]" />
        <span>My Order History ({orders.length})</span>
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white border p-12 text-center rounded-lg text-gray-500 shadow-sm space-y-3">
          <p>You haven't placed any orders yet. Place an order through the checkout page to see it here!</p>
          <Link href="/" className="inline-block bg-[#0046be] text-white text-xs font-bold px-5 py-2.5 rounded shadow">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between border-b pb-3 gap-2">
                <div>
                  <span className="font-extrabold text-[#0046be] text-base">{order.orderNumber}</span>
                  <p className="text-xs text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="sm:text-right">
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded">
                    {order.status}
                  </span>
                  <p className="text-sm font-extrabold mt-1">
                    {order.currency === "NGN" ? `₦${Number(order.totalAmount).toLocaleString()}` : `$${Number(order.totalAmount).toFixed(2)}`}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Fulfillment:</strong> {order.fulfillment.toUpperCase()} — {order.address}</p>
                  <p><strong>Payment Ref:</strong> {order.paymentRef}</p>
                </div>

                {/* Printable Official Receipt Modal Trigger */}
                <OrderReceiptModal order={order} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}