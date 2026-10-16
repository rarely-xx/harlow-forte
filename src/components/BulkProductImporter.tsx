"use client";

import { useState } from "react";
import { bulkImportProducts, BulkProductInput } from "@/app/actions/bulkImport";
import { Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// RFC-compliant CSV line parser (handles commas inside quotes)
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(csvText: string): BulkProductInput[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
  const rows: BulkProductInput[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: any = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? "";
    });

    if (row.name && row.brand && row.price) {
      rows.push({
        brand: row.brand,
        model: row.model,
        sku: row.sku,
        name: row.name,
        price: row.price,
        oldPrice: row.oldprice || row.old_price,
        badge: row.badge,
        category: row.category,
        image: row.image,
        description: row.description,
      });
    }
  }
  return rows;
}

export default function BulkProductImporter() {
  const [parsedItems, setParsedItems] = useState<BulkProductInput[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus(null);

    const text = await file.text();
    try {
      if (file.name.endsWith(".json")) {
        const json = JSON.parse(text);
        setParsedItems(Array.isArray(json) ? json : []);
      } else {
        const csvItems = parseCSV(text);
        setParsedItems(csvItems);
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: "Could not parse file. Ensure it is a valid .csv or .json file.",
      });
      setParsedItems([]);
    }
  };

  const handleImport = async () => {
    if (parsedItems.length === 0) return;
    setLoading(true);
    setStatus(null);

    try {
      const res = await bulkImportProducts(parsedItems);
      if (res.success) {
        setStatus({
          type: "success",
          message: `Successfully imported/updated ${res.count} products in Neon PostgreSQL!`,
        });
        setParsedItems([]);
        setFileName("");
      } else {
        setStatus({ type: "error", message: res.error || "Import failed." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Server error while importing products." });
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleCSV = () => {
    const sample = [
      "brand,model,sku,name,price,oldPrice,category,badge,image,description",
      '"Apple","MBP16-M4","HF-APP-MBP16","MacBook Pro 16-inch M4 Max (48GB, 1TB)",3499,3899,"Laptops","Best Seller","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80","Brand new factory sealed MacBook Pro 16 M4 Max."',
      '"Samsung","SM-S928B","HF-SAM-S24U","Samsung Galaxy S24 Ultra 5G (512GB, Titanium Gray)",1299,1449,"Phones","Hot Deal","https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=80","Official unlocked dual SIM + eSIM S24 Ultra."',
      '"Starlink","STL-GEN3","HF-STL-GEN3","Starlink Gen 3 High-Speed Satellite Kit",499,599,"Smart Home","Lekki Stock","https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=900&q=80","High speed satellite internet kit ready for Nigeria."',
    ].join("\n");

    const blob = new Blob([sample], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "harlow-forte-bulk-template.csv";
    a.click();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-blue-50 text-[#0046be] rounded-lg">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-gray-900">
              Bulk CSV / JSON Product Importer
            </h2>
            <p className="text-xs text-gray-500">
              Upload a supplier spreadsheet (`.csv`) or `.json` catalog to add or update dozens of gadgets in one click.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={downloadSampleCSV}
          className="text-xs font-extrabold text-[#0046be] bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <label className="md:col-span-2 border-2 border-dashed border-gray-300 hover:border-[#0046be] rounded-xl p-5 text-center cursor-pointer transition bg-gray-50/50">
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Upload className="w-6 h-6 text-[#0046be] mx-auto mb-1.5" />
          <span className="text-xs font-extrabold text-gray-800 block">
            {fileName ? `Selected: ${fileName}` : "Click to select a .CSV or .JSON file"}
          </span>
          <span className="text-[11px] text-gray-400">
            Required columns: brand, name, price (Optional: model, sku, category, badge, image, description)
          </span>
        </label>

        <div className="flex flex-col space-y-2">
          <div className="bg-gray-50 border rounded-lg p-3 text-center">
            <span className="text-2xl font-extrabold text-[#0046be] block">
              {parsedItems.length}
            </span>
            <span className="text-[11px] text-gray-500 font-bold">
              Products Ready to Import
            </span>
          </div>

          <button
            type="button"
            onClick={handleImport}
            disabled={parsedItems.length === 0 || loading}
            className="w-full bg-[#0046be] hover:bg-blue-800 disabled:bg-gray-300 text-white font-extrabold text-xs py-3 rounded-lg shadow flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Importing to Cloud DB...</span>
              </>
            ) : (
              <span>Import {parsedItems.length > 0 ? `${parsedItems.length} Products` : "Now"} &rarr;</span>
            )}
          </button>
        </div>
      </div>

      {status && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center space-x-2 ${
            status.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span className="font-bold">{status.message}</span>
        </div>
      )}
    </div>
  );
}