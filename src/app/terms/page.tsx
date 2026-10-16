import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const instant = false;

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 my-8 px-4">
      <Link href="/" className="text-xs text-[#0046be] font-bold flex items-center space-x-1">
        <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Store</span>
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b pb-4">
          <FileText className="w-8 h-8 text-[#0046be]" />
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Terms of Service</h1>
            <p className="text-xs text-gray-500">Last updated: October 2026</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-extrabold text-base text-gray-900 pt-2">1. Acceptance of Terms</h2>
          <p>
            By accessing and shopping at Harlow Forte, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our website or services.
          </p>

          <h2 className="font-extrabold text-base text-gray-900 pt-2">2. Pricing & Currency (NGN / USD)</h2>
          <p>
            Prices for our electronics and gadgets are listed in Nigerian Naira (₦) and US Dollars ($). Harlow Forte reserves the right to adjust prices due to fluctuating exchange rates or manufacturer price updates without prior notice.
          </p>

          <h2 className="font-extrabold text-base text-gray-900 pt-2">3. Online & Delivery</h2>
          <p>
            Nationwide doorstep deliveries are handled via trusted courier partners.
          </p>

          <h2 className="font-extrabold text-base text-gray-900 pt-2">4. Limitation of Liability</h2>
          <p>
            Harlow Forte is not liable for any indirect, incidental, or consequential damages arising from the use or misuse of hardware or electronics purchased through our platform.
          </p>
        </div>
      </div>
    </div>
  );
}