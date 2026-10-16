"use client";

import React, { useState } from "react";
import Link from "next/link";
import { saveProductAction, deleteProductAction } from "./actions";
import { PlusCircle, Edit3, Trash2, ExternalLink, CheckCircle2, RotateCcw } from "lucide-react";

export function AdminClient({
  products,
  categories,
}: {
  products: any[];
  categories: { id: number; name: string; slug: string }[];
}) {
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert stored JSON strings back into easy-to-edit multiline text for the form
  const formatArrayForTextarea = (jsonStr: string) => {
    try {
      const arr = JSON.parse(jsonStr || "[]");
      return Array.isArray(arr) ? arr.join("\n") : "";
    } catch {
      return "";
    }
  };

  const formatSpecsForTextarea = (jsonStr: string) => {
    try {
      const obj = JSON.parse(jsonStr || "{}");
      return Object.entries(obj)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
    } catch {
      return "";
    }
  };

  const formatManualsForTextarea = (jsonStr: string) => {
    try {
      const arr = JSON.parse(jsonStr || "[]");
      return arr.map((m: any) => `${m.title} | ${m.size} | ${m.url}`).join("\n");
    } catch {
      return "";
    }
  };

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg("");

    const formData = new FormData(e.currentTarget);
    try {
      await saveProductAction(formData);
      setStatusMsg(
        editingProduct
          ? `Updated "${formData.get("name")}" successfully!`
          : `Added "${formData.get("name")}" to store!`
      );
      setEditingProduct(null);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      alert("Error saving product (check if SKU is unique): " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    await deleteProductAction(id);
    if (editingProduct?.id === id) setEditingProduct(null);
  }

  return (
    <div className="space-y-8">
      {/* Top Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-[#0046be] text-white p-6 rounded-lg shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-[#ffe000] text-gray-900 text-xs font-extrabold px-2.5 py-1 rounded uppercase">
            Store Management
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-2">
            Harlow Forte Inventory & Product Admin
          </h1>
          <p className="text-sm text-gray-200">
            Add new gadgets, update prices, or edit technical specifications and PDF manuals.
          </p>
        </div>
        <Link
          href="/"
          className="bg-white text-[#0046be] font-bold px-4 py-2.5 rounded text-sm hover:bg-gray-100 transition self-start sm:self-center"
        >
          &larr; View Live Storefront
        </Link>
      </div>

      {statusMsg && (
        <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg flex items-center justify-between text-sm font-semibold">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>{statusMsg}</span>
          </div>
          <button onClick={() => setStatusMsg("")} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main 2-Column Layout: Form on Left (5 cols) | Product Inventory List on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Add / Edit Product Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-gray-200 shadow-sm self-start">
          <div className="flex items-center justify-between border-b pb-3 mb-5">
            <h2 className="text-lg font-extrabold text-gray-900 flex items-center space-x-2">
              {editingProduct ? (
                <>
                  <Edit3 className="w-5 h-5 text-[#0046be]" />
                  <span>Edit Product (ID #{editingProduct.id})</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5 text-[#0046be]" />
                  <span>Add New Product</span>
                </>
              )}
            </h2>
            {editingProduct && (
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-xs font-bold text-red-600 hover:underline flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancel Edit</span>
              </button>
            )}
          </div>

          <form
            key={editingProduct ? editingProduct.id : "new-product-form"}
            onSubmit={handleFormSubmit}
            className="space-y-4 text-sm"
          >
            {editingProduct && <input type="hidden" name="id" value={editingProduct.id} />}

            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Product Title *</label>
              <input
                name="name"
                required
                defaultValue={editingProduct?.name || ""}
                placeholder='e.g. Apple - iPad Pro 13" M4 Chip 256GB - Space Black'
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0046be]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Department Category *</label>
                <select
                  name="categoryId"
                  required
                  defaultValue={editingProduct?.categoryId || categories[0]?.id}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:border-[#0046be]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Brand *</label>
                <input
                  name="brand"
                  required
                  defaultValue={editingProduct?.brand || ""}
                  placeholder="e.g. Apple, Sony, Samsung"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0046be]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Model Number *</label>
                <input
                  name="model"
                  required
                  defaultValue={editingProduct?.model || ""}
                  placeholder="e.g. MVX23LL/A"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0046be]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Unique SKU *</label>
                <input
                  name="sku"
                  required
                  defaultValue={editingProduct?.sku || Math.floor(6000000 + Math.random() * 900000).toString()}
                  placeholder="e.g. 6589102"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0046be]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Sale Price ($) *</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  defaultValue={editingProduct?.price || ""}
                  placeholder="999.99"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0046be]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Old Price ($)</label>
                <input
                  name="oldPrice"
                  type="number"
                  step="0.01"
                  required
                  defaultValue={editingProduct?.oldPrice || ""}
                  placeholder="1199.99"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0046be]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Promo Badge</label>
                <input
                  name="badge"
                  defaultValue={editingProduct?.badge || "Save $200"}
                  placeholder="Save $200"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0046be]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Main Product Image URL *</label>
              <input
                name="image"
                required
                defaultValue={editingProduct?.image || ""}
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0046be]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Gallery Image URLs <span className="text-xs font-normal text-gray-500">(One URL per line)</span>
              </label>
              <textarea
                name="gallery"
                rows={2}
                defaultValue={editingProduct ? formatArrayForTextarea(editingProduct.gallery) : ""}
                placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0046be]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Overview Description *</label>
              <textarea
                name="description"
                rows={3}
                required
                defaultValue={editingProduct?.description || ""}
                placeholder="Write a clear summary of the gadget..."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0046be]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Key Feature Highlights <span className="text-xs font-normal text-gray-500">(One bullet per line)</span>
              </label>
              <textarea
                name="highlights"
                rows={3}
                defaultValue={editingProduct ? formatArrayForTextarea(editingProduct.highlights) : ""}
                placeholder="Ultra-thin aluminum chassis&#10;All-day 18-hour battery life&#10;Wi-Fi 7 & Bluetooth 5.4"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0046be]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Technical Specifications <span className="text-xs font-normal text-gray-500">(Format: Key: Value)</span>
              </label>
              <textarea
                name="specs"
                rows={4}
                defaultValue={editingProduct ? formatSpecsForTextarea(editingProduct.specs) : ""}
                placeholder="Screen Size: 15.3 inches&#10;Processor: Apple M3&#10;Memory (RAM): 16GB&#10;Storage: 512GB SSD"
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#0046be]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Product Manuals <span className="text-xs font-normal text-gray-500">(Format: Title | Size | URL)</span>
              </label>
              <textarea
                name="manuals"
                rows={2}
                defaultValue={editingProduct ? formatManualsForTextarea(editingProduct.manuals) : ""}
                placeholder="Official User Manual (PDF) | 3.4 MB | #&#10;Quick Start Guide (PDF) | 1.2 MB | #"
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#0046be]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#ffe000] hover:bg-yellow-400 text-gray-900 font-extrabold py-3 rounded shadow transition cursor-pointer"
            >
              {isSubmitting
                ? "Saving to Database..."
                : editingProduct
                ? "Save Changes to Product"
                : "Publish Product to Store"}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Existing Products Inventory Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-gray-200 shadow-sm self-start">
          <div className="border-b pb-3 mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-gray-900">
              Current Store Inventory ({products.length} Products)
            </h2>
            <span className="text-xs text-gray-500">Click Edit to load into form</span>
          </div>

          <div className="divide-y divide-gray-200">
            {products.map((prod) => (
              <div
                key={prod.id}
                className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 rounded transition ${
                  editingProduct?.id === prod.id ? "bg-blue-50/70 ring-1 ring-[#0046be]" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-16 h-16 object-contain border border-gray-200 rounded p-1 bg-white shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-extrabold uppercase bg-blue-100 text-[#0046be] px-2 py-0.5 rounded">
                        {prod.category?.name}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">SKU: {prod.sku}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mt-1">{prod.name}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-base font-extrabold text-[#0046be]">
                        ${prod.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ${prod.oldPrice.toFixed(2)}
                      </span>
                      <span className="text-[11px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded">
                        {prod.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <Link
                    href={`/product/${prod.id}`}
                    className="p-2 text-gray-500 hover:text-[#0046be] border border-gray-200 rounded hover:bg-white transition"
                    title="View Product Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-3 py-1.5 bg-[#0046be] text-white text-xs font-bold rounded hover:bg-[#00338a] flex items-center space-x-1 transition cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id, prod.name)}
                    className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded transition cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}