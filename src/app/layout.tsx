import "./globals.css";
import { prisma } from "@/lib/prisma";
import { CartProvider } from "@/components/Navbar";
import { auth } from "@/auth";
import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

export const instant = false;

export const metadata = {
  title: "Harlow Forte | High-End Electronics & Tech",
  description: "Best Buy inspired electronics e-commerce store built with Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: any[] = [];

  try {
    if (prisma && typeof (prisma as any).category?.findMany === "function") {
      categories = await (prisma as any).category.findMany();
    }
  } catch (err) {
    console.error("Layout category fetch error:", err);
  }

  const session = await auth();

  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <CartProvider categories={categories} session={session}>
          {/* Main page content wrapped inside Navbar & Cart Context */}
          <div className="flex-1">
            {children}
          </div>

          {/* FLOATING WHATSAPP SUPPORT BUTTON */}
          <a
            href="https://wa.me/2348102867322?text=Hello%20Harlow%20Forte!%20I%20would%20like%20to%20inquire%20about%20a%20gadget%20on%20your%20store."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-3 rounded-full shadow-xl flex items-center space-x-2 transition transform hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span className="text-xs font-extrabold tracking-wide">Chat on WhatsApp</span>
          </a>

          {/* GLOBAL FOOTER SECTION ON ALL PAGES */}
          <footer className="bg-gray-900 text-white rounded-t-xl p-8 md:p-12 mt-16 shadow-xl border-t border-gray-800">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-[#0046be] text-white p-2 rounded font-extrabold text-sm">HF</div>
                    <span className="text-xl font-extrabold tracking-tight">Harlow Forte</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Nigeria’s premier destination for high-end electronics, elite computing gear, professional audio equipment, and smartphones. Certified authenticity with unbeatable warranty and expert technical support.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#ffe000]">contact us</h3>
                  <ul className="text-xs text-gray-300 space-y-2">
                    <li className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-[#0046be] shrink-0 mt-0.5" />
                      <span>Lekki Phase 1, Lagos, Nigeria</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-[#0046be] shrink-0" />
                      <span>09063862966</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-[#0046be] shrink-0" />
                      <span>harlow4limited@gmail.com</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#ffe000]">Delivery</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <strong>Lagos Delivery: </strong> Same Day Deliveries Within Lagos State:<br />
                    <strong>Interstate Delivery: </strong> Deliveries Outside Lagos State <br />
                    <em>Note: All interstate deliveries are fulfilled by GIG OR DHL.</em>
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
                <p>&copy; 2026 Harlow Forte Electronics Ltd. All rights reserved.</p>
                <div className="flex space-x-6">
                  <Link href="/privacy" className="hover:text-gray-300 transition">Privacy Policy</Link>
                  <Link href="/terms" className="hover:text-gray-300 transition">Terms of Service</Link>
                  <Link href="/warranty" className="hover:text-gray-300 transition">Track Order & Warranty</Link>
                </div>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}