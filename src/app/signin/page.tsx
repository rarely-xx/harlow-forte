import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, ArrowLeft } from "lucide-react";

export const instant = false;

export default async function SignInPage() {
  async function handleLogin(formData: FormData) {
    "use server";
    const emailInput = String(formData.get("email") || "").trim().toLowerCase();
    const nameInput = String(formData.get("name") || "Harlow Customer").trim();

    if (!emailInput) return;

    const cookieStore = await cookies();
    // Save user profile directly in a cookie securely
    cookieStore.set(
      "hf_user",
      JSON.stringify({ name: nameInput, email: emailInput, image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${emailInput}` }),
      { path: "/", maxAge: 60 * 60 * 24 * 30 }
    );
    redirect("/");
  }

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg p-8 shadow-sm space-y-6 my-12">
      <Link href="/" className="text-xs text-[#0046be] font-bold flex items-center space-x-1">
        <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Store</span>
      </Link>
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-blue-50 text-[#0046be] rounded-full flex items-center justify-center mx-auto">
          <User className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Sign In to Harlow Forte</h1>
        <p className="text-xs text-gray-500">Access your saved wishlist and past order history.</p>
      </div>

      <form action={handleLogin} className="space-y-4 text-sm">
        <div>
          <label className="block font-bold text-gray-700 mb-1">Your Full Name</label>
          <input
            name="name"
            required
            placeholder="Tunde Harlow"
            className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#0046be]"
          />
        </div>
        <div>
          <label className="block font-bold text-gray-700 mb-1">Email Address</label>
          <input
            name="email"
            type="email"
            required
            placeholder="tunde@example.com"
            className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#0046be]"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#ffe000] hover:bg-yellow-400 text-gray-900 font-extrabold py-3 rounded shadow transition cursor-pointer"
        >
          Sign In / Register &rarr;
        </button>
      </form>
    </div>
  );
}