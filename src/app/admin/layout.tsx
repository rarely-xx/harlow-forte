import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Lock, ShieldAlert, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import BulkProductImporter from "@/components/BulkProductImporter";

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isUnlocked = cookieStore.get("hf_admin_auth")?.value === "authenticated";

  // Server Action to verify PIN
  async function verifyPin(formData: FormData) {
    "use server";
    const enteredPin = String(formData.get("pin") || "").trim();
    const secretPin = process.env.ADMIN_PIN || "1960";

    if (enteredPin === secretPin) {
      const store = await cookies();
      store.set("hf_admin_auth", "authenticated", {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 12, // Stays unlocked for 12 hours
      });
      redirect("/admin");
    } else {
      redirect("/admin?error=invalid");
    }
  }

  // Server Action to lock Admin panel
  async function lockAdmin() {
    "use server";
    const store = await cookies();
    store.delete("hf_admin_auth");
    redirect("/");
  }

  // Show PIN Pad if not authenticated
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl p-8 shadow-lg space-y-6 my-16">
        <Link href="/" className="text-xs text-[#0046be] font-bold flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </Link>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-50 text-[#0046be] rounded-full flex items-center justify-center mx-auto border border-blue-100">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Harlow Forte Admin</h1>
          <p className="text-xs text-gray-500">
            Restricted Area. Enter your authorized manager PIN to manage inventory and orders.
          </p>
        </div>

        <form action={verifyPin} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-600 mb-1.5">
              Security PIN / Password
            </label>
            <input
              name="pin"
              type="password"
              required
              autoFocus
              placeholder="••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-lg font-extrabold tracking-widest focus:outline-none focus:border-[#0046be]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0046be] hover:bg-blue-800 text-white font-extrabold py-3 rounded-lg shadow transition cursor-pointer text-sm"
          >
            Unlock Dashboard &rarr;
          </button>
        </form>

        <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-center space-x-2 text-[11px] text-amber-800">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Protected by Harlow Forte Security. Default PIN is <strong>1960</strong> unless set in <code>.env</code>.</span>
        </div>
      </div>
    );
  }

  // Once unlocked, show the top Admin Status bar + Bulk Importer + the actual Admin page
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 text-white px-4 py-2.5 rounded-lg flex justify-between items-center text-xs max-w-7xl mx-auto mt-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-bold">Admin Mode Unlocked</span>
        </div>
        <form action={lockAdmin}>
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-3 py-1 rounded flex items-center space-x-1 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Admin</span>
          </button>
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <BulkProductImporter />
      </div>

      {children}
    </div>
  );
}