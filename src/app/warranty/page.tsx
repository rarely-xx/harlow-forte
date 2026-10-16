import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Search, Package, Calendar, MapPin, CheckCircle2, AlertCircle, FileText } from "lucide-react";

export const instant = false;

export default async function WarrantyLookupPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const resolvedParams = await searchParams;
  const searchQuery = (resolvedParams.query || "").trim();

  let matchedOrder: any = null;
  let searched = false;

  if (searchQuery) {
    searched = true;
    try {
      matchedOrder = await prisma.order.findFirst({
        where: {
          OR: [
            { orderNumber: { contains: searchQuery, mode: "insensitive" } },
            { email: { contains: searchQuery, mode: "insensitive" } },
            { phone: { contains: searchQuery } },
          ],
        },
      });
    } catch (err) {
      console.error("Order lookup error:", err);
    }
  }

  let warrantyExpiryDate: Date | null = null;
  let isWarrantyActive = false;
  let daysRemaining = 0;

  if (matchedOrder) {
    const orderDate = new Date(matchedOrder.createdAt);
    warrantyExpiryDate = new Date(orderDate);
    warrantyExpiryDate.setFullYear(orderDate.getFullYear() + 1);

    const now = new Date();
    isWarrantyActive = now < warrantyExpiryDate;
    const diffTime = warrantyExpiryDate.getTime() - now.getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  let parsedItems: any[] = [];
  if (matchedOrder?.items) {
    try {
      parsedItems = JSON.parse(matchedOrder.items);
    } catch {}
  }

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 space-y-8">
      {/* Back to Home */}
      <Link href="/" className="text-xs text-[#0046be] font-bold flex items-center space-x-1 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Harlow Forte Store</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm text-center space-y-3">
        <div className="w-14 h-14 bg-blue-50 text-[#0046be] rounded-full flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          Track Order & Verify Warranty
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          Enter your Harlow Forte order receipt number (e.g. <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded font-mono">HF-ORD-17734...</code>) or email address to verify your 1-year official warranty status and shipping progress.
        </p>

        {/* Search Input Form */}
        <form method="GET" action="/warranty" className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-lg mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="query"
              type="text"
              defaultValue={searchQuery}
              required
              placeholder="Enter Order Number or Email (e.g. HF-ORD-...)"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0046be]"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#0046be] hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow transition shrink-0 cursor-pointer"
          >
            Verify Now
          </button>
        </form>
      </div>

      {/* SEARCH RESULTS SECTION */}
      {searched && !matchedOrder && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
          <h2 className="text-sm font-extrabold text-amber-900">No Order Found</h2>
          <p className="text-xs text-amber-700 max-w-md mx-auto">
            We couldn't find any order matching <strong className="font-mono">"{searchQuery}"</strong>. Please check your receipt number or contact our Lekki showroom support at <strong className="text-amber-900">09063862966</strong>.
          </p>
        </div>
      )}

      {matchedOrder && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0046be] bg-blue-50 px-2.5 py-1 rounded">
                  Official Receipt Record
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mt-1 font-mono">
                  {matchedOrder.orderNumber}
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1.5 bg-green-100 text-green-800 text-xs font-extrabold px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{matchedOrder.status || "Paid & Processing"}</span>
                </span>
              </div>
            </div>

            {/* WARRANTY STATUS BOX */}
            <div className={`border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isWarrantyActive ? "bg-blue-50/50 border-blue-200" : "bg-gray-50 border-gray-200"
            }`}>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className={`w-5 h-5 ${isWarrantyActive ? "text-[#0046be]" : "text-gray-400"}`} />
                  <span className="text-sm font-extrabold text-gray-900">
                    Harlow Forte 1-Year Official Warranty
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {isWarrantyActive
                    ? `Active Protection Coverage — Expires on ${warrantyExpiryDate?.toLocaleDateString("en-NG", { year: 'numeric', month: 'long', day: 'numeric' })}`
                    : "Warranty period has expired (1-year term concluded)."}
                </p>
              </div>

              <div className="text-right bg-white px-4 py-2.5 rounded-lg border border-gray-200 shrink-0 w-full sm:w-auto">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                  Status / Time Remaining
                </span>
                <span className={`text-xs sm:text-sm font-extrabold ${isWarrantyActive ? "text-green-600" : "text-red-600"}`}>
                  {isWarrantyActive ? `${daysRemaining} Days Remaining` : "Expired"}
                </span>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-bold block flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-[#0046be]" />
                  <span>Purchase Date</span>
                </span>
                <span className="font-extrabold text-gray-900 block">
                  {new Date(matchedOrder.createdAt).toLocaleDateString("en-NG", { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-bold block flex items-center space-x-1">
                  <Package className="w-3.5 h-3.5 text-[#0046be]" />
                  <span>Fulfillment Type</span>
                </span>
                <span className="font-extrabold text-gray-900 uppercase block">
                  {matchedOrder.fulfillment || "Shipping"}
                </span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-bold block flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0046be]" />
                  <span>Delivery / Pickup City</span>
                </span>
                <span className="font-extrabold text-gray-900 block truncate">
                  {matchedOrder.city}, {matchedOrder.state}
                </span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-bold block flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-[#0046be]" />
                  <span>Total Paid</span>
                </span>
                <span className="font-extrabold text-[#0046be] block text-sm">
                  {matchedOrder.currency === "USD" ? `$${matchedOrder.totalAmount.toLocaleString()}` : `₦${matchedOrder.totalAmount.toLocaleString()}`}
                </span>
              </div>
            </div>

            {/* Purchased Items List */}
            {parsedItems.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                  Verified Purchased Gadgets ({parsedItems.length})
                </h3>
                <div className="divide-y border rounded-xl overflow-hidden">
                  {parsedItems.map((item: any, idx: number) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between bg-white text-xs">
                      <div className="flex items-center space-x-3">
                        {item.image && (
                          <div className="w-12 h-12 bg-gray-50 rounded-lg p-1 border shrink-0 flex items-center justify-center">
                            <img src={item.image} alt="" className="max-h-full max-w-full object-contain" />
                          </div>
                        )}
                        <div>
                          <span className="font-extrabold text-gray-900 block">{item.name}</span>
                          <span className="text-[11px] text-gray-500">Qty: {item.quantity || 1}</span>
                        </div>
                      </div>
                      <span className="font-extrabold text-[#0046be]">
                        {matchedOrder.currency === "USD" ? `$${(item.price * (item.quantity || 1)).toLocaleString()}` : `₦${(item.price * (item.quantity || 1)).toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}