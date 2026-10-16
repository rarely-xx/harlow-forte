"use client";

import { useState } from "react";
import { Printer, X, ShieldCheck, CheckCircle2, FileText } from "lucide-react";

export default function OrderReceiptModal({ order }: { order: any }) {
  const [isOpen, setIsOpen] = useState(false);

  // Safely parse order items if stored as JSON string or array
  let parsedItems: any[] = [];
  try {
    if (typeof order.items === "string") {
      parsedItems = JSON.parse(order.items);
    } else if (Array.isArray(order.items)) {
      parsedItems = order.items;
    }
  } catch {
    parsedItems = [];
  }

  const formatAmount = (amount: number) => {
    return order.currency === "NGN"
      ? `₦${Number(amount).toLocaleString()}`
      : `$${Number(amount).toFixed(2)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center space-x-1.5 bg-gray-100 hover:bg-[#0046be] hover:text-white text-gray-800 text-xs font-extrabold px-3.5 py-2 rounded border border-gray-200 transition cursor-pointer"
      >
        <FileText className="w-3.5 h-3.5" />
        <span>Official Receipt & Warranty</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
          <div className="bg-white border border-gray-200 rounded-xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 relative print:shadow-none print:border-none print:max-w-full">
            
            {/* Action Bar (Hidden when printing) */}
            <div className="flex justify-between items-center border-b pb-4 print:hidden">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Official Tax Invoice & Warranty Certificate
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="bg-[#0046be] hover:bg-blue-800 text-white text-xs font-extrabold px-4 py-2 rounded flex items-center space-x-1.5 shadow cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="bg-[#0046be] text-white px-2.5 py-1 rounded font-extrabold text-base">
                    HF
                  </div>
                  <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Harlow Forte
                  </span>
                </div>
                <p className="text-xs text-gray-500">Lekki Phase 1, Lagos, Nigeria</p>
                <p className="text-xs text-gray-500">Tel / WhatsApp: +2349063862966</p>
                <p className="text-xs text-gray-500">Email: harlow4limited@gmail.com</p>
              </div>

              <div className=" sm:text-right space-y-1">
                <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 text-xs font-extrabold px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PAID & VERIFIED</span>
                </span>
                <p className="text-sm font-extrabold text-gray-900 mt-2">
                  Receipt #: <span className="text-[#0046be]">{order.orderNumber}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Date: {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Customer & Fulfillment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-gray-400 uppercase tracking-wider">Billed To:</span>
                <p className="font-extrabold text-gray-900 text-sm">{order.customerName || "Valued Customer"}</p>
                <p className="text-gray-600">{order.email}</p>
                {order.phone && <p className="text-gray-600">{order.phone}</p>}
              </div>
              <div className="space-y-1">
                <span className="font-bold text-gray-400 uppercase tracking-wider">Fulfillment & Delivery:</span>
                <p className="font-extrabold text-[#0046be] uppercase">
                  {order.fulfillment === "pickup" ? "1-Hour Lekki Store Pickup" : "Doorstep Delivery (Lagos / GIG / DHL)"}
                </p>
                <p className="text-gray-600">{order.address}</p>
                <p className="text-gray-500">Payment Ref: <span className="font-mono">{order.paymentRef}</span></p>
              </div>
            </div>

            {/* Purchased Items Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Order Summary</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 border-b border-gray-200">
                      <th className="py-2.5 px-4 font-extrabold">Item Description</th>
                      <th className="py-2.5 px-4 font-extrabold text-center">Qty</th>
                      <th className="py-2.5 px-4 font-extrabold text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {parsedItems.length > 0 ? (
                      parsedItems.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-3 px-4 font-bold text-gray-900">{item.name}</td>
                          <td className="py-3 px-4 text-center text-gray-600">{item.quantity || 1}</td>
                          <td className="py-3 px-4 text-right font-bold text-gray-900">
                            {formatAmount((item.price || 0) * (item.quantity || 1))}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-3 px-4 font-bold text-gray-900">Harlow Forte Electronics Order ({order.orderNumber})</td>
                        <td className="py-3 px-4 text-center text-gray-600">1</td>
                        <td className="py-3 px-4 text-right font-bold text-gray-900">
                          {formatAmount(order.totalAmount)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Calculation */}
            <div className="flex justify-end border-t border-gray-200 pt-4">
              <div className="w-full sm:w-64 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Status:</span>
                  <span className="font-bold text-green-700 uppercase">{order.status}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-gray-900 border-t pt-2">
                  <span>Total Paid:</span>
                  <span className="text-[#0046be]">{formatAmount(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Official Warranty Stamp Footer */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 flex items-start space-x-3 text-xs text-gray-700">
              <ShieldCheck className="w-6 h-6 text-[#0046be] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-extrabold text-gray-900">
                  Official Harlow Forte Warranty & Authenticity Guarantee
                </p>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  This receipt serves as your official proof of purchase and manufacturer warranty certificate. Eligible for 7-day returns/exchanges on factory defects. Interstate shipments are insured via GIG Logistics or DHL.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}