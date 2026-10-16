import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const instant = false;

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 my-8 px-4">
      <Link href="/" className="text-xs text-[#0046be] font-bold flex items-center space-x-1">
        <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Store</span>
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b pb-4">
          <Shield className="w-8 h-8 text-[#0046be]" />
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Privacy Policy</h1>
            <p className="text-xs text-gray-500">Last updated: October 2026</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-extrabold text-base text-gray-900 pt-2">1. Information We Collect</h2>
          <p>
            When you shop or sign in at Harlow Forte, we collect basic contact information such as your name, email address, phone number, and delivery address to fulfill your orders and manage your wishlist.
          </p>

          <h2 className="font-extrabold text-base text-gray-900 pt-2">2. How We Use Your Information</h2>
          <p>Your information is used strictly for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Processing orders and shipping.</li>
            <li>Sending order confirmations, tracking numbers, and digital purchase receipts.</li>
            <li>Maintaining your secure customer session, wishlist items, and past purchase history.</li>
          </ul>

          <h2 className="font-extrabold text-base text-gray-900 pt-2">3. Data Security & Cookies</h2>
          <p>
            We use secure cookie-based session tokens (`hf_user`) to keep you logged in safely. We do not sell, trade, or rent your personal identification information to third parties.
          </p>

          <h2 className="font-extrabold text-base text-gray-900 pt-2">4. Contact Us</h2>
          <p>
            If you have questions about your privacy or wish to remove your account data, reach out to us at <strong className="text-[#0046be]">harlow4limited@gmail.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}